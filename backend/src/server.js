require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const session = require('express-session');
const passport = require('passport');

// โหลด Router
const authRoutes = require('./routes/auth');
const newsRoutes = require('./routes/news');
const galleryRoutes = require('./routes/gallery');
const bookingsRoutes = require('./routes/bookings');
const adminRoutes = require('./routes/admin');
const googleAuthRoutes = require('./routes/googleAuth'); // 👈 เพิ่ม Google OAuth
const eventsRoutes = require("./routes/events");
const qnaRoutes = require("./routes/qna");


const app = express();
app.use(express.json());

// ✅ สร้างแค่โฟลเดอร์ uploads ถ้ายังไม่มี
const uploadPath = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// ✅ Static Files
app.use('/uploads', express.static(uploadPath));

// ✅ CORS
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));

// ✅ Session + Passport
app.use(session({ secret: "secret", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// ✅ Routes
app.use('/api/auth', authRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/auth', googleAuthRoutes); // 👈 Google OAuth route
app.use("/api/events", eventsRoutes);
app.use("/api/questions", qnaRoutes);

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`✅ Server running on http://localhost:${PORT}`)
);
