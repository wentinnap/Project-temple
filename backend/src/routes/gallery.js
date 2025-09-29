const express = require("express");
const multer = require("multer");
const path = require("path");
const pool = require("../db");
const authenticateToken = require("../middleware/auth");

const router = express.Router();

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "..", "uploads/gallery"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// 📌 อัปโหลดรูป
router.post("/upload", authenticateToken, upload.single("image"), async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admin can upload images" });
    }

    const file = req.file;
    const url = `${process.env.SERVER_URL}/uploads/gallery/${file.filename}`;

    await pool.query("INSERT INTO gallery (filename, url) VALUES (?, ?)", [file.filename, url]);

    res.json({ message: "Upload success", url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Upload failed" });
  }
});

// 📌 ดึงรูปทั้งหมด
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM gallery ORDER BY id DESC");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Error fetching gallery" });
  }
});

// 📌 ลบรูป
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admin can delete images" });
    }

    const { id } = req.params;
    await pool.query("DELETE FROM gallery WHERE id=?", [id]);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting image" });
  }
});

module.exports = router;
