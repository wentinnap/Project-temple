const express = require("express");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const pool = require("../db");

const router = express.Router();

// ตั้งค่า Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.SERVER_URL}/api/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        const first_name = profile.name.givenName || "";
        const last_name = profile.name.familyName || "";

        // ตรวจสอบว่ามีผู้ใช้อยู่ใน DB แล้วหรือยัง
        const [existing] = await pool.execute("SELECT * FROM users WHERE email = ?", [email]);

        let user;
        if (existing.length === 0) {
          // ถ้าไม่มี -> สมัครสมาชิกใหม่อัตโนมัติ
          const role = "user";
          const status = "active";

          const [result] = await pool.execute(
            "INSERT INTO users (email, first_name, last_name, password, role, status) VALUES (?, ?, ?, ?, ?, ?)",
            [email, first_name, last_name, "", role, status]
          );

          user = { id: result.insertId, email, first_name, last_name, role, status };
        } else {
          user = existing[0];
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((obj, done) => {
  done(null, obj);
});

// ✅ route เริ่ม login (บังคับถามบัญชีทุกครั้ง)
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account", // <<-- ตรงนี้ทำให้เด้ง Google ทุกครั้ง
  })
);

// ✅ callback หลังจาก Google ยืนยัน
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    const token = jwt.sign(
      {
        id: req.user.id,
        email: req.user.email,
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        role: req.user.role,
        status: req.user.status,
      },
      process.env.JWT_SECRET || "secret123",
      { expiresIn: "1h" }
    );

    res.redirect(`${process.env.CLIENT_URL}/auth-success?token=${token}`);
  }
);

module.exports = router;
