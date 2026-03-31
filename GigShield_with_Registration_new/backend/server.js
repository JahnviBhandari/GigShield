require("dotenv").config();

const express = require("express");
const cors = require("cors");
const twilio = require("twilio");
const { Pool } = require("pg");
const fetch = require("node-fetch");

const app = express();
app.use(cors());
app.use(express.json());

// 🔑 Twilio
const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH);

// 🔥 PostgreSQL
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "gigshield",
  password: "YOUR_PASSWORD",
  port: 5432,
});

// OTP store
const otpStore = {};

// =======================
// SEND OTP
// =======================
app.post("/send-otp", async (req, res) => {
  const { phone } = req.body;

  const otp = Math.floor(100000 + Math.random() * 900000);
  otpStore[phone] = otp;

  try {
    await client.messages.create({
      body: `Your OTP is ${otp}`,
      from: process.env.TWILIO_PHONE,
      to: `+91${phone}`,
    });

    console.log(`OTP sent to +91${phone}: ${otp}`);

    res.json({ success: true });
  } catch (err) {
    console.error("🔥 TWILIO ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// =======================
// VERIFY OTP + SAVE DATA
// =======================
app.post("/verify-otp", async (req, res) => {
  const { phone, otp, lat, lon } = req.body;

  if (otpStore[phone] != otp) {
    return res.status(400).json({ error: "Invalid OTP" });
  }

  try {
    // 🌦 WEATHER API
    const weatherRes = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.WEATHER_API_KEY}&units=metric`
    );

    const weatherData = await weatherRes.json();

    const temp = weatherData.main?.temp || null;
    const condition = weatherData.weather?.[0]?.main || "Unknown";
    const city = weatherData.name || "Unknown";

    // 💾 SAVE TO DB
    await pool.query(
      `INSERT INTO users (phone, latitude, longitude, city, weather, temperature)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [phone, lat, lon, city, condition, temp]
    );

    delete otpStore[phone];

    res.json({
      success: true,
      data: { city, condition, temp },
    });
  } catch (err) {
    console.error("🔥 VERIFY ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.listen(5000, () => {
  console.log("🚀 Server running on port 5000");
});