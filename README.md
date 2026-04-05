# 🛡️ GigShield — Smart Insurance for Gig Workers

GigShield is an AI-powered parametric insurance platform built for delivery partners and gig workers in India. It offers instant claim payouts, real-time weather alerts, live location detection, OTP-based authentication, and an admin dashboard — all in one app.

---

## 🌐 Live Demo

| Service | URL |
|---|---|
| **Frontend** | [gleaming-mermaid-6c138f.netlify.app](https://gleaming-mermaid-6c138f.netlify.app) |
| **Backend API** | Deployed on Render |

---

## 📸 Features

- 📱 **OTP Login** — Phone number based authentication with 6-digit OTP
- 📍 **Live Location Detection** — Auto-detects city, zone, and pincode via GPS
- 🌦️ **Real-time Weather** — Live weather data with rain alerts using OpenWeatherMap
- 🛵 **Gig Worker Profiles** — Register with platform (Swiggy, Zomato, Ola, etc.), vehicle type, and shift details
- 💰 **Parametric Claims** — Instant claim filing based on weather/rain triggers
- 📊 **Dashboard** — Personal insurance dashboard with claim history and risk score
- 🔐 **Admin Panel** — View all users, claims, and analytics
- 🔥 **Firebase Firestore** — Real-time cloud database for users and claims

---

## 🏗️ Tech Stack

### Frontend
| Tech | Usage |
|---|---|
| React 19 | UI framework |
| TypeScript | Type safety |
| Vite | Build tool |
| Tailwind CSS | Styling |
| Framer Motion | Animations |
| Recharts | Charts & analytics |
| React Hot Toast | Notifications |
| Axios | API calls |

### Backend
| Tech | Usage |
|---|---|
| Node.js | Runtime |
| Express.js | API server |
| Firebase Firestore | Database |
| OpenWeatherMap API | Live weather |
| Nominatim (OpenStreetMap) | Reverse geocoding |
| Twilio (optional) | Real SMS OTP |
| express-rate-limit | OTP abuse prevention |

---

## 📁 Project Structure

```
gigshield/
├── backend/
│   ├── server.js          ← Express API server (all routes)
│   ├── package.json
│   ├── .env               ← Environment variables
│   └── .env.example       ← Template for env vars
│
└── frontend/
    ├── src/
    │   ├── App.tsx          ← Main app component
    │   ├── components/
    │   │   └── ui.tsx       ← Reusable UI components
    │   ├── services/
    │   │   └── api.ts       ← All backend API calls
    │   ├── lib/
    │   │   └── firebase.ts  ← Firebase config
    │   └── types.ts         ← TypeScript types
    ├── .env                 ← VITE_API_URL config
    ├── index.html
    └── package.json
```

---

## ⚙️ Local Setup

### Prerequisites
- Node.js v18+
- npm

### 1. Clone the repo
```bash
git clone https://github.com/ashutosh691/backend.git
cd backend
```

### 2. Setup Backend
```bash
cd backend
npm install
cp .env.example .env
# Fill in your credentials in .env
node server.js
```
Server runs at `http://localhost:3001`

### 3. Setup Frontend
```bash
cd frontend
npm install
# Create .env file
echo "VITE_API_URL=http://localhost:3001" > .env
npm run dev
```
App runs at `http://localhost:5173`

---

## 🔐 Environment Variables

### Backend `.env`
```env
PORT=3001
NODE_ENV=development

# Firebase (already configured in server.js)
# No extra env vars needed for Firebase

# OpenWeatherMap
OPENWEATHER_API_KEY=your_key_here

# Admin
ADMIN_PASSWORD=admin123

# JWT
JWT_SECRET=your_secret_here

# Twilio (optional - OTP works without it in dev mode)
TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
TWILIO_PHONE_NUMBER=+1XXXXXXXXXX
```

### Frontend `.env`
```env
VITE_API_URL=http://localhost:3001
```

---

## 🚀 Deployment

### Backend → Render
1. Push backend code to GitHub
2. Go to [render.com](https://render.com) → New Web Service
3. Connect your repo
4. Set **Root Directory** → `backend`
5. **Build Command** → `npm install`
6. **Start Command** → `node server.js`
7. Add all environment variables
8. Deploy ✅

### Frontend → Netlify
1. Update `frontend/.env` with your Render URL:
   ```
   VITE_API_URL=https://your-backend.onrender.com
   ```
2. Build:
   ```bash
   cd frontend && npm run build
   ```
3. Drag & drop `dist/` folder to [netlify.com](https://netlify.com) ✅

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/health` | Health check |
| POST | `/api/otp/send` | Send OTP |
| POST | `/api/otp/verify` | Verify OTP |
| GET | `/api/location/reverse?lat=&lon=` | Reverse geocode coordinates |
| GET | `/api/weather?lat=&lon=` | Get live weather |
| POST | `/api/admin/login` | Admin login |
| POST | `/api/users` | Register new user |
| GET | `/api/users/phone/:phone` | Get user by phone |
| GET | `/api/users` | Get all users |
| PUT | `/api/users/:id` | Update user |
| POST | `/api/claims` | File a claim |
| GET | `/api/claims/user/:userId` | Get user claims |
| GET | `/api/claims` | Get all claims (admin) |

---

## 🧪 Test the API

```bash
# Health check
curl https://your-backend.onrender.com/health

# Send OTP (dev mode returns OTP in response)
curl -X POST https://your-backend.onrender.com/api/otp/send \
  -H "Content-Type: application/json" \
  -d '{"phone": "9999999999"}'

# Get weather
curl "https://your-backend.onrender.com/api/weather?lat=28.6&lon=77.2"
```

---

## 👥 User Roles

| Role | Access |
|---|---|
| **Gig Worker** | Register, login, view dashboard, file claims, check weather |
| **Admin** | View all users, all claims, analytics (`password: admin123`) |

---

## ⚠️ Known Limitations

- OTP is stored **in-memory** — resets on server restart. For production, use Redis or store in Firestore
- Twilio SMS is optional — in dev mode, OTP is returned in the API response as `devOtp`
- Free Render tier **spins down** after 15 minutes of inactivity — first request may be slow

---

## 🤝 Contributing

1. Fork the repo
2. Create a new branch `git checkout -b feature/your-feature`
3. Commit changes `git commit -m 'Add your feature'`
4. Push `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

MIT License — free to use and modify.

---

## 👨‍💻 Built With ❤️ for Gig Workers of India 🇮🇳
