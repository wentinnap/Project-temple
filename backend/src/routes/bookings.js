const express = require("express");
const pool = require("../db");

const router = express.Router();

// 📌 จองใหม่
router.post("/", async (req, res) => {
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

    res.json({ success: true, message: "จองสำเร็จแล้ว", bookingId: result.insertId });
  } catch (error) {
    console.error("Booking error:", error);
    res.status(500).json({ success: false, message: "เกิดข้อผิดพลาด" });
  }
});

// 📌 ดูการจองทั้งหมด
router.get("/", async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM bookings ORDER BY created_at DESC");
  res.json(rows);
});

// 📌 อัปเดตสถานะ
router.put("/:id/status", async (req, res) => {
  const { status } = req.body;
  const { id } = req.params;

  if (!["pending", "confirmed", "cancelled"].includes(status)) {
    return res.status(400).json({ success: false, message: "Invalid status" });
  }

  await pool.query("UPDATE bookings SET status=? WHERE id=?", [status, id]);
  res.json({ success: true, message: "อัพเดทสถานะเรียบร้อย" });
});

// 📌 ลบการจอง
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  await pool.query("DELETE FROM bookings WHERE id=?", [id]);
  res.json({ success: true, message: "ลบข้อมูลเรียบร้อย" });
});

module.exports = router;
