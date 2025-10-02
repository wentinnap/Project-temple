const express = require("express");
const multer = require("multer");
const path = require("path");
const pool = require("../db");
const authenticateToken = require("../middleware/auth");

const router = express.Router();

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "..", "uploads/news"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// 📌 ดึงข่าวล่าสุด (public)
// 📌 Public route (มี pagination)
router.get("/public", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const offset = (page - 1) * limit;

    const [rows] = await pool.execute(
      "SELECT id, title, content, image_url, date FROM news ORDER BY date DESC LIMIT ? OFFSET ?",
      [limit, offset]
    );

    const [countRows] = await pool.execute("SELECT COUNT(*) as count FROM news");
    const totalNews = countRows[0].count;
    const totalPages = Math.ceil(totalNews / limit);

    res.json({
      news: rows,
      totalPages,
      currentPage: page,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "เกิดข้อผิดพลาด" });
  }
});

// 📌 Admin/monk เท่านั้น
router.get("/all", authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.execute("SELECT * FROM news ORDER BY date DESC");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "เกิดข้อผิดพลาด" });
  }
});


// 📌 ดึงข่าวตาม id
router.get("/:id", async (req, res) => {
  try {
    const [rows] = await pool.execute("SELECT * FROM news WHERE id = ?", [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: "ไม่พบข่าว" });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "เกิดข้อผิดพลาด" });
  }
});

// 📌 เพิ่มข่าว
router.post("/", authenticateToken, upload.single("image"), async (req, res) => {
  try {
    if (req.user.role !== "admin" && req.user.role !== "monk") {
      return res.status(403).json({ message: "Only admin or monk can add news" });
    }

    const { title, content, date } = req.body;
    const image_url = req.file ? `${process.env.SERVER_URL}/uploads/news/${req.file.filename}` : null;

    if (!title || !content || !date) {
      return res.status(400).json({ message: "กรอกข้อมูลไม่ครบ" });
    }

    const [result] = await pool.execute(
      "INSERT INTO news (title, content, image_url, date) VALUES (?, ?, ?, ?)",
      [title, content, image_url, date]
    );

    res.json({ id: result.insertId, title, content, image_url, date });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "เกิดข้อผิดพลาด" });
  }
});

// 📌 แก้ไขข่าว
router.put("/:id", authenticateToken, upload.single("image"), async (req, res) => {
  try {
    const { title, content, date } = req.body;

    if (req.file) {
      const image_url = `${process.env.SERVER_URL}/uploads/news/${req.file.filename}`;
      await pool.execute(
        "UPDATE news SET title = ?, content = ?, image_url = ?, date = ? WHERE id = ?",
        [title, content, image_url, date, req.params.id]
      );
      res.json({ id: req.params.id, title, content, image_url, date });
    } else {
      await pool.execute(
        "UPDATE news SET title = ?, content = ?, date = ? WHERE id = ?",
        [title, content, date, req.params.id]
      );
      res.json({ id: req.params.id, title, content, date });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "เกิดข้อผิดพลาด" });
  }
});

// 📌 ลบข่าว
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== "admin" && req.user.role !== "monk") {
      return res.status(403).json({ message: "Only admin or monk can delete news" });
    }

    await pool.execute("DELETE FROM news WHERE id = ?", [req.params.id]);
    res.json({ message: "ลบข่าวสำเร็จ" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "เกิดข้อผิดพลาด" });
  }
});

module.exports = router;
