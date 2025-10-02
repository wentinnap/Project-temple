const express = require("express");
const router = express.Router();
const pool = require("../db");

// ดึงกิจกรรมทั้งหมด
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM events ORDER BY start_time ASC");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// เพิ่มกิจกรรม
router.post("/", async (req, res) => {
  const { title, start, end } = req.body;
  try {
    await pool.query("INSERT INTO events (title, start_time, end_time) VALUES (?, ?, ?)", 
      [title, start, end]);
    res.json({ message: "Event added" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ลบกิจกรรม
router.delete("/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM events WHERE id = ?", [req.params.id]);
    res.json({ message: "Event deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/:id", async (req, res) => {
  const { title, start, end } = req.body;
  try {
    await pool.query(
      "UPDATE events SET title=?, start_time=?, end_time=? WHERE id=?",
      [title, start, end, req.params.id]
    );
    res.json({ message: "Event updated" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
