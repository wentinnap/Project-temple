const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../db");
const authenticateToken = require("../middleware/auth");

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  const { email, password, first_name, last_name } = req.body;
  if (!email || !password || !first_name || !last_name) {
    return res.status(400).json({ message: "กรอกข้อมูลไม่ครบ" });
  }

  try {
    const [existing] = await pool.execute("SELECT id FROM users WHERE email = ?", [email]);
    if (existing.length) return res.status(400).json({ message: "มีอีเมลนี้แล้ว" });

    const saltRounds = Number(process.env.SALT_ROUNDS) || 10;
    const hashed = await bcrypt.hash(password, saltRounds);

    const role = "user";
    const status = "active";

    const [result] = await pool.execute(
      "INSERT INTO users (email, first_name, last_name, password, role, status) VALUES (?, ?, ?, ?, ?, ?)",
      [email, first_name, last_name, hashed, role, status]
    );

    res.json({ message: "สมัครสมาชิกสำเร็จ", userId: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในระบบ" });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: "กรุณากรอก email และ password" });

  try {
    const [rows] = await pool.execute(
      "SELECT id, first_name, last_name, email, password, role, status FROM users WHERE email = ?",
      [email]
    );
    if (rows.length === 0) return res.status(400).json({ message: "ไม่พบผู้ใช้" });

    const user = rows[0];
    if (user.status !== "active") {
      return res.status(403).json({ message: "บัญชีนี้ถูกระงับการใช้งาน" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "รหัสผ่านไม่ถูกต้อง" });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "secret123",
      { expiresIn: "1h" }
    );

    res.json({ token, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในระบบ" });
  }
});

// Profile
router.get("/profile", authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.execute(
      "SELECT id, email, role, created_at FROM users WHERE id = ?",
      [req.user.id]
    );
    if (rows.length === 0) return res.status(404).json({ message: "ไม่พบผู้ใช้" });
    res.json({ user: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "เกิดข้อผิดพลาด" });
  }
});

module.exports = router;
