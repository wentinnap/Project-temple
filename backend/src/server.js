require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const multer = require('multer');
const pool = require('./db');

const app = express();
app.use(express.json());
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));

/* ----------------------------------
   Static Files
---------------------------------- */
// ✅ ให้ express ใช้โฟลเดอร์ uploads ได้
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// multer ก็แก้ด้วย
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'uploads/news'));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });


/* ----------------------------------
   Register API (user สมัครเอง)
---------------------------------- */
/* ----------------------------------
   Register API (user สมัครเอง)
---------------------------------- */
app.post('/api/auth/register', async (req, res) => {
  const { email, password, first_name, last_name } = req.body;
  if (!email || !password || !first_name || !last_name) {
    return res.status(400).json({ message: 'กรอกข้อมูลไม่ครบ' });
  }

  try {
    const [existing] = await pool.execute('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length) return res.status(400).json({ message: 'มีอีเมลนี้แล้ว' });

    const saltRounds = Number(process.env.SALT_ROUNDS) || 10;
    const hashed = await bcrypt.hash(password, saltRounds);

    const role = "user";
    const status = "active"; // 👈 ค่า default เวลา register

    const [result] = await pool.execute(
      'INSERT INTO users (email, first_name, last_name, password, role, status) VALUES (?, ?, ?, ?, ?, ?)',
      [email, first_name, last_name, hashed, role, status]
    );

    res.json({ message: 'สมัครสมาชิกสำเร็จ', userId: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในระบบ' });
  }
});


/* ----------------------------------
   Login API
---------------------------------- */
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'กรุณากรอก email และ password' });

  try {
    const [rows] = await pool.execute(
      'SELECT id, first_name, last_name, email, password, role, status FROM users WHERE email = ?',
      [email]
    );
    if (rows.length === 0) return res.status(400).json({ message: 'ไม่พบผู้ใช้' });

    const user = rows[0];

    // 👇 เช็คสถานะ
    if (user.status !== 'active') {
      return res.status(403).json({ message: 'บัญชีนี้ถูกระงับการใช้งาน' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'รหัสผ่านไม่ถูกต้อง' });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'secret123',
      { expiresIn: '1h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: user.role,
        status: user.status, // 👈 ส่งค่าไปให้ frontend ใช้ได้
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในระบบ' });
  }
});



/* ----------------------------------
   Middleware ตรวจ token
---------------------------------- */
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  jwt.verify(token, process.env.JWT_SECRET || 'secret123', (err, user) => {
    if (err) return res.status(403).json({ message: 'Forbidden' });
    req.user = user;
    next();
  });
}


/* ----------------------------------
   Profile API
---------------------------------- */
app.get('/api/profile', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT id, email, role, created_at FROM users WHERE id = ?',
      [req.user.id]
    );
    if (rows.length === 0) return res.status(404).json({ message: 'ไม่พบผู้ใช้' });
    res.json({ user: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาด' });
  }
});

/* ----------------------------------
   News API
---------------------------------- */
// ดึงข่าวสำหรับหน้า Home (public - ไม่ต้อง login)
app.get('/api/public/news', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT id, title, content, image_url, date FROM news ORDER BY date DESC LIMIT 6'
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาด' });
  }
});

// ดึงข่าวทั้งหมด (สำหรับ admin)
app.get('/api/news', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM news ORDER BY date DESC');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาด' });
  }
});

// ดึงข่าวตาม id
app.get('/api/news/:id', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM news WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'ไม่พบข่าว' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาด' });
  }
});

// เพิ่มข่าว
app.post('/api/news', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'monk') {
      return res.status(403).json({ message: 'Only admin or monk can add news' });
    }

    const { title, content, date } = req.body;
    const image_url = req.file ? `/uploads/news/${req.file.filename}` : null;

    if (!title || !content || !date) {
      return res.status(400).json({ message: 'กรอกข้อมูลไม่ครบ' });
    }

    const [result] = await pool.execute(
      'INSERT INTO news (title, content, image_url, date) VALUES (?, ?, ?, ?)',
      [title, content, image_url, date]
    );

    res.json({ id: result.insertId, title, content, image: image_url, date });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาด' });
  }
});

// แก้ไขข่าว
app.put('/api/news/:id', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    const { title, content, date } = req.body;
    
    if (req.file) {
      // มีไฟล์ใหม่ - อัปเดตทั้งรูปและข้อมูล
      const image_url = `/uploads/news/${req.file.filename}`;
      await pool.execute(
        'UPDATE news SET title = ?, content = ?, image_url = ?, date = ? WHERE id = ?',
        [title, content, image_url, date, req.params.id]
      );
      res.json({ id: req.params.id, title, content, image: image_url, date });
    } else {
      // ไม่มีไฟล์ใหม่ - อัปเดตแค่ข้อมูล
      await pool.execute(
        'UPDATE news SET title = ?, content = ?, date = ? WHERE id = ?',
        [title, content, date, req.params.id]
      );
      res.json({ id: req.params.id, title, content, date });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาด' });
  }
});

// ลบข่าว
app.delete('/api/news/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'monk') {
      return res.status(403).json({ message: 'Only admin or monk can delete news' });
    }

    await pool.execute('DELETE FROM news WHERE id = ?', [req.params.id]);
    res.json({ message: 'ลบข่าวสำเร็จ' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาด' });
  }
});


//ดึงผู้ใช้ทั้งหมด (สำหรับ admin)
app.get('/api/admin/users', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Only admin can view users' });
  }

  try {
    const [rows] = await pool.execute(
      'SELECT id, first_name, last_name, email, role, status, created_at FROM users ORDER BY created_at DESC'
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาด' });
  }
});


//อัปเดตสถานะผู้ใช้ (สำหรับ admin)
app.put('/api/admin/users/:id', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Only admin can update users' });
  }

  const { role, status } = req.body;
  try {
    await pool.execute(
      'UPDATE users SET role = ?, status = ? WHERE id = ?',
      [role, status, req.params.id]
    );
    res.json({ message: 'User updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาด' });
  }
});


//ลบผู้ใช้ (สำหรับ admin)
app.delete('/api/admin/users/:id', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Only admin can delete users' });
  }

  try {
    await pool.execute('DELETE FROM users WHERE id = ?', [req.params.id]);
    res.json({ message: 'User deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาด' });
  }
});


//การจองทั้งหมด


app.post('/api/bookings', async (req, res) => {
  try {
    const {
      ceremony, fullName, phone, email, address,
      emergencyContact, emergencyPhone, date, time,
      participants, specialRequests
    } = req.body;

    const [result] = await pool.query(
      `INSERT INTO bookings 
      (ceremony, full_name, phone, email, address, emergency_contact, emergency_phone, date, time, participants, special_requests) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [ceremony, fullName, phone, email, address, emergencyContact, emergencyPhone, date, time, participants, specialRequests]
    );

    res.json({
      success: true,
      message: 'จองสำเร็จแล้ว',
      bookingId: result.insertId
    });
  } catch (error) {
    console.error('Booking error:', error);
    res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาด' });
  }
});

// ✅ route ดูข้อมูลทั้งหมด (เอาไว้ตรวจสอบ)
app.get('/api/bookings', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM bookings ORDER BY created_at DESC');
  res.json(rows);
});

// ✅ อัพเดทสถานะการจอง
app.put('/api/bookings/:id/status', async (req, res) => {
  const { status } = req.body;
  const { id } = req.params;

  if (!['pending', 'confirmed', 'cancelled'].includes(status)) {
    return res.status(400).json({ success: false, message: 'Invalid status' });
  }

  await pool.query('UPDATE bookings SET status=? WHERE id=?', [status, id]);
  res.json({ success: true, message: 'อัพเดทสถานะเรียบร้อย' });
});

// ✅ ลบการจอง
app.delete('/api/bookings/:id', async (req, res) => {
  const { id } = req.params;
  await pool.query('DELETE FROM bookings WHERE id=?', [id]);
  res.json({ success: true, message: 'ลบข้อมูลเรียบร้อย' });
});





// ===============================
// 📸 Gallery API
// ===============================

// ตั้งค่า multer สำหรับ gallery
const galleryStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'uploads/gallery'));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const galleryUpload = multer({ storage: galleryStorage });

// อัปโหลดรูป (admin เท่านั้น)
app.post('/api/gallery/upload', authenticateToken, galleryUpload.single('image'), async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admin can upload images' });
    }

    const file = req.file;
    const url = `${process.env.SERVER_URL}/uploads/gallery/${file.filename}`;

    await pool.query("INSERT INTO gallery (filename, url) VALUES (?, ?)", [
      file.filename,
      url
    ]);

    res.json({ message: "Upload success", url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Upload failed" });
  }
});

// ดึงรูปทั้งหมด
app.get('/api/gallery', async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM gallery ORDER BY id DESC");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Error fetching gallery" });
  }
});

// ลบรูป
app.delete('/api/gallery/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admin can delete images' });
    }

    const { id } = req.params;
    await pool.query("DELETE FROM gallery WHERE id=?", [id]);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting image" });
  }
});


// ===============================
// News API (แก้ตรง image_url เช่นกัน)
// ===============================
app.post('/api/news', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'monk') {
      return res.status(403).json({ message: 'Only admin or monk can add news' });
    }

    const { title, content, date } = req.body;
    const image_url = req.file ? `${process.env.SERVER_URL}/uploads/news/${req.file.filename}` : null;

    if (!title || !content || !date) {
      return res.status(400).json({ message: 'กรอกข้อมูลไม่ครบ' });
    }

    const [result] = await pool.execute(
      'INSERT INTO news (title, content, image_url, date) VALUES (?, ?, ?, ?)',
      [title, content, image_url, date]
    );

    res.json({ id: result.insertId, title, content, image_url, date });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาด' });
  }
});




/* ----------------------------------
   Start Server
---------------------------------- */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
