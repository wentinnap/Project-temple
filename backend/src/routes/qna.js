// routes/qna.js
const express = require("express");
const router = express.Router();
const pool = require("../db");
const authenticateToken = require("../middleware/auth"); // 👈 เพิ่มบรรทัดนี้

// 📌 ดึงคำถามทั้งหมด
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM questions ORDER BY created_at DESC");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 📌 เพิ่มคำถามใหม่
router.post("/", async (req, res) => {
  try {
    const { question } = req.body;
    await pool.query("INSERT INTO questions (question) VALUES (?)", [question]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 📌 ตอบคำถาม
router.put("/:id", authenticateToken, async (req, res) => { // 👈 เพิ่ม middleware
  try {
    const { id } = req.params;
    const { answer } = req.body;
    await pool.query("UPDATE questions SET answer=? WHERE id=?", [answer, id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 📌 ลบคำถาม
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM questions WHERE id = ?", [id]);
    res.json({ message: "ลบคำถามสำเร็จ" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "เกิดข้อผิดพลาด" });
  }
});

module.exports = router;