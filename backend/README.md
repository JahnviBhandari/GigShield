# GigShield Backend

Node.js + Express server powering real OTP (Twilio), live GPS reverse-geocoding, and live weather + AQI for the GigShield frontend.

---

## Project Structure

```
gigshield-backend/
├── server.js          ← Main Express server (all routes)
├── .env.example       ← Copy to .env and fill credentials
├── package.json
└── README.md
```

---

## Quick Start

### 1. Install dependencies
```bash
cd gigshield-backend
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
```
Open `.env` and fill in your credentials (see below).

### 3. Run the server
```bash
# Production
npm start

# Development (auto-restart on changes, Node 18+)
npm run dev
```

The server starts at `http://localhost:3001`.

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/otp/send` | Send 6-digit OTP via Twilio SMS |
| `POST` | `/api/otp/verify` | Verify the OTP entered by user |
| `GET` | `/api/location/reverse?lat=&lon=` | GPS coords → city/zone/pincode |
| `GET` | `/api/weather?lat=&lon=` | Live weather + AQI |
| `POST` | `/api/admin/login` | Admin password check |
| `GET` | `/health` | Health check |

### POST `/api/otp/send`
```json
{ "phone": "9876543210" }
```
Response (real Twilio):
```json
{ "success": true, "message": "OTP sent successfully to your mobile." }
```
Response (dev — no Twilio keys):
```json
{ "success": true, "message": "OTP sent (dev mode)", "devOtp": "482931" }
```

### POST `/api/otp/verify`
```json
{ "phone": "9876543210", "otp": "482931" }
```
Response:
```json
{ "success": true, "message": "OTP verified successfully." }
```

### GET `/api/location/reverse?lat=12.9716&lon=77.5946`
```json
{
  "success": true,
  "data": {
    "city": "Bangalore",
    "zone": "Koramangala",
    "pincode": "560034"
  }
}
```

### GET `/api/weather?lat=12.9716&lon=77.5946`
```json
{
  "success": true,
  "data": {
    "temp": 28,
    "feelsLike": 31,
    "condition": "Rain",
    "description": "moderate rain",
    "humidity": 82,
    "windSpeed": 14.4,
    "isRaining": true,
    "city": "Bangalore",
    "aqi": 125,
    "visibility": 5,
    "icon": "10d"
  }
}
```

---

## Credentials Setup

### Twilio (Real SMS OTP)

1. Create a free account at https://console.twilio.com
2. Go to **Account > API keys & tokens** to get your `Account SID` and `Auth Token`
3. Get a Twilio phone number (free trial number works for testing)
4. Add to `.env`:
   ```
   TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   TWILIO_AUTH_TOKEN=your_auth_token
   TWILIO_PHONE_NUMBER=+1XXXXXXXXXX
   ```

> **Trial account note:** With a Twilio trial account you can only send SMS to verified numbers. Go to **Verified Caller IDs** in the Twilio console and add your test phone number.

> **India note:** The backend adds `+91` prefix automatically. If deploying outside India, update the `to` field in `server.js` line ~75.

**No Twilio keys?** The server runs in "dev mode" — OTPs are printed to the console and also returned in the API response as `devOtp` so you can test without a Twilio account.

---

### OpenWeatherMap (Live Weather + AQI)

1. Sign up free at https://openweathermap.org/api
2. Go to **My API Keys** and copy your key
3. Add to `.env`:
   ```
   OPENWEATHER_API_KEY=your_key_here
   ```

The free tier includes:
- Current Weather API (`/data/2.5/weather`) — 60 calls/min
- Air Pollution API (`/data/2.5/air_pollution`) — 60 calls/min

---

### GPS / Reverse Geocoding

Uses **Nominatim** (OpenStreetMap) — completely free, no API key needed. The backend acts as a proxy to avoid browser CORS issues and to set the required `User-Agent` header.

---

## CORS

By default the server allows all origins (`*`). For production, restrict it:

```js
// server.js — replace the cors line with:
app.use(cors({ origin: 'https://yourdomain.com' }));
```

---

## Rate Limiting

OTP sending is limited to **10 requests per phone number per 10 minutes** to prevent abuse. Adjust in `server.js`:
```js
const otpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,  // 10 minutes
  max: 10,                    // max attempts
  ...
});
```

---

## OTP Storage

OTPs are stored **in memory** (a `Map`). This is fine for development and small deployments. For production with multiple server instances, replace with **Redis**:

```js
// Replace the otpStore Map with redis-based storage
const redis = require('redis');
const client = redis.createClient({ url: process.env.REDIS_URL });
```

---

## Frontend Setup

The frontend (React + Vite) reads `VITE_API_URL` from `.env`:

```
# devtrails_gigshield/.env
VITE_API_URL=http://localhost:3001
```

For production, set this to your deployed backend URL:
```
VITE_API_URL=https://api.yourdomain.com
```

---

## Deployment

**Backend (Node.js):** Deploy to Railway, Render, Fly.io, or any VPS.

**Frontend (React/Vite):** Deploy to Vercel, Netlify, or Cloudflare Pages.

Make sure to set all environment variables in your deployment platform's dashboard.
