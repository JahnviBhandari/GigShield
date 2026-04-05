/**
 * GigShield Backend Server (Firebase संस्करण)
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const axios = require('axios');

// 🔥 Firebase
const { initializeApp } = require('firebase/app');
const {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  doc,
  updateDoc
} = require('firebase/firestore');

const app = express();
const PORT = process.env.PORT || 3001;

// ─────────────────────────────────────────────
// 🔥 Firebase Init
// ─────────────────────────────────────────────
const firebaseConfig = {
  apiKey: "AIzaSyCuRRouEjqMco32f0VlaDSR3DXAVvB17ws",
  authDomain: "gshield-a35b7.firebaseapp.com",
  projectId: "gshield-a35b7",
  storageBucket: "gshield-a35b7.firebasestorage.app",
  messagingSenderId: "767573431584",
  appId: "1:767573431584:web:1fce89b7a1d414b2d87345",
  measurementId: "G-EW7G20VLK9"
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

// ─────────────────────────────────────────────
// Middleware
// ─────────────────────────────────────────────
app.use(cors({ origin: '*' }));
app.use(express.json());

const otpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 10,
});

// ─────────────────────────────────────────────
// OTP Store (in-memory)
// ─────────────────────────────────────────────
const otpStore = new Map();

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// ✅ UPI VALIDATION FUNCTION
function isValidUpi(upi) {
  const upiRegex = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/;
  return upiRegex.test(upi);
}

// ─────────────────────────────────────────────
// ROUTES
// ─────────────────────────────────────────────

app.get('/health', (req, res) =>
  res.json({ status: 'ok', time: new Date() })
);

// ── OTP SEND ──────────────────────────────
app.post('/api/otp/send', otpLimiter, async (req, res) => {
  const { phone } = req.body;

  if (!phone) return res.status(400).json({ error: 'Phone required' });

  const otp = generateOtp();
  otpStore.set(phone, {
    otp,
    expiresAt: Date.now() + 5 * 60 * 1000
  });

  await addDoc(collection(db, 'otp_log'), {
    phone,
    verified: false,
    createdAt: new Date()
  });

  res.json({ success: true, devOtp: otp });
});

// ── OTP VERIFY ────────────────────────────
app.post('/api/otp/verify', async (req, res) => {
  const { phone, otp } = req.body;

  const record = otpStore.get(phone);

  if (!record || record.otp !== otp) {
    return res.status(400).json({ error: 'Invalid OTP' });
  }

  otpStore.delete(phone);

  const q = query(collection(db, 'otp_log'), where('phone', '==', phone));
  const snapshot = await getDocs(q);

  snapshot.forEach(async (docSnap) => {
    await updateDoc(doc(db, 'otp_log', docSnap.id), {
      verified: true
    });
  });

  res.json({ success: true });
});

// ── LOCATION (FIXED) ──────────────────────────────
app.get('/api/location/reverse', async (req, res) => {
  const { lat, lon } = req.query;

  if (!lat || !lon) {
    return res.status(400).json({
      success: false,
      error: 'lat and lon are required'
    });
  }

  try {
    const response = await axios.get(
      'https://nominatim.openstreetmap.org/reverse',
      {
        params: {
          lat,
          lon,
          format: 'json',
          addressdetails: 1
        },
        headers: {
          'User-Agent': 'GigShield/1.0',
          'Accept-Language': 'en'
        },
        timeout: 8000
      }
    );

    const addr = response.data.address || {};

    const city =
      addr.city ||
      addr.town ||
      addr.village ||
      addr.state_district ||
      addr.state ||
      'Unknown';

    const zone =
      addr.suburb ||
      addr.neighbourhood ||
      addr.district ||
      city;

    const pincode = addr.postcode || '';

    return res.json({
      success: true,
      data: {
        city,
        zone,
        pincode,
        state: addr.state || '',
        country: addr.country || ''
      }
    });

  } catch (err) {
    console.error("Location error:", err.message);

    // ✅ FALLBACK
    try {
      const ipRes = await axios.get('http://ip-api.com/json');

      return res.json({
        success: true,
        fallback: true,
        data: {
          city: ipRes.data.city || 'Unknown',
          zone: ipRes.data.regionName || '',
          pincode: ipRes.data.zip || '',
          state: ipRes.data.regionName || '',
          country: ipRes.data.country || ''
        }
      });

    } catch {
      return res.status(500).json({
        success: false,
        error: 'Location detection failed'
      });
    }
  }
});

// ── WEATHER ───────────────────────────────
app.get('/api/weather', async (req, res) => {
  const { lat, lon } = req.query;

  if (!lat || !lon) {
    return res.status(400).json({
      success: false,
      error: 'lat and lon required'
    });
  }

  const apiKey = process.env.OPENWEATHER_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      success: false,
      error: 'Weather API key missing'
    });
  }

  try {
    const response = await axios.get(
      'https://api.openweathermap.org/data/2.5/weather',
      {
        params: {
          lat,
          lon,
          appid: apiKey,
          units: 'metric'
        },
        timeout: 8000
      }
    );

    const data = response.data;

    return res.json({
      success: true,
      data: {
        temp: data.main.temp,
        condition: data.weather[0].main,
        city: data.name
      }
    });

  } catch (err) {
    console.error("Weather error:", err.response?.data || err.message);

    return res.status(500).json({
      success: false,
      error: 'Weather fetch failed'
    });
  }
});

// ── ADMIN LOGIN ───────────────────────────
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;

  if (password === (process.env.ADMIN_PASSWORD || 'admin123')) {
    res.json({ success: true });
  } else {
    res.status(401).json({ error: 'Wrong password' });
  }
});

// ── USERS ─────────────────────────────────

// Create user (✅ UPI VALIDATION ADDED)
app.post('/api/users', async (req, res) => {
  try {
    if (req.body.upiId && !isValidUpi(req.body.upiId)) {
      return res.status(400).json({ error: 'Invalid UPI ID' });
    }

    const userRef = await addDoc(collection(db, 'users'), {
      ...req.body,
      createdAt: new Date()
    });

    res.json({ id: userRef.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get user by phone
app.get('/api/users/phone/:phone', async (req, res) => {
  const q = query(
    collection(db, 'users'),
    where('phone', '==', req.params.phone)
  );

  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    return res.status(404).json({ error: 'User not found' });
  }

  const user = snapshot.docs[0];

  res.json({
    id: user.id,
    ...user.data()
  });
});

// Get all users
app.get('/api/users', async (req, res) => {
  const snapshot = await getDocs(collection(db, 'users'));

  const users = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));

  res.json(users);
});

// Update user (✅ UPI VALIDATION ADDED)
app.put('/api/users/:id', async (req, res) => {
  try {
    if (req.body.upiId && !isValidUpi(req.body.upiId)) {
      return res.status(400).json({ error: 'Invalid UPI ID' });
    }

    await updateDoc(doc(db, 'users', req.params.id), {
      ...req.body,
      updatedAt: new Date()
    });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── CLAIMS ────────────────────────────────

// Create claim
app.post('/api/claims', async (req, res) => {
  try {
    const claimRef = await addDoc(collection(db, 'claims'), {
      ...req.body,
      createdAt: new Date()
    });

    res.json({ id: claimRef.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get claims by user
app.get('/api/claims/user/:userId', async (req, res) => {
  const q = query(
    collection(db, 'claims'),
    where('userId', '==', req.params.userId)
  );

  const snapshot = await getDocs(q);

  const claims = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));

  res.json(claims);
});

// Get all claims
app.get('/api/claims', async (req, res) => {
  const snapshot = await getDocs(collection(db, 'claims'));

  const claims = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));

  res.json(claims);
});

// ── 404 ───────────────────────────────────
app.use((req, res) =>
  res.status(404).json({ error: 'Route not found' })
);

// ── START ─────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});