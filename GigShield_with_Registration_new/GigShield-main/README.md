# 🚀 GigShield
### AI-Powered Parametric Insurance for Gig Workers

GigShield is an AI-powered parametric insurance platform designed to protect gig economy delivery workers from income loss caused by real-world disruptions such as extreme weather, pollution, floods, or city shutdowns.

Unlike traditional insurance, GigShield automatically detects disruptions and triggers **instant payouts** — no claim forms, no delays.

---

# 🧩 Problem Statement

Millions of delivery workers on platforms like:

- Zomato  
- Swiggy  
- Zepto  
- Dunzo  
- Amazon Flex  

depend on daily income.

When disruptions like heavy rain, extreme heat, pollution, or traffic shutdowns occur:

❌ Deliveries stop  
❌ Earnings drop to zero  
❌ No financial safety net exists  

---

# 💡 Our Solution

GigShield provides **parametric income protection**.

### Core Idea:
Instead of filing claims → system automatically detects disruption → payout is triggered.

---

# 👤 Persona-Based Scenario

### Ravi – Delivery Partner

- Platform: Swiggy  
- Location: Bengaluru  
- Daily income: ₹600  

### Scenario:
Heavy rainfall exceeds **15 mm/hr**

### System Response:
- Disruption detected  
- Claim auto-generated  
- Fraud check passed  
- ₹300 payout sent instantly  

📩 Notification:
> "Rain disruption detected. ₹300 credited to your account."

---

# ⚙️ Workflow

1. Worker registers  
2. AI calculates risk score & premium  
3. Worker activates weekly plan  
4. External APIs detect disruption  
5. Claim automatically generated  
6. Fraud detection validates claim  
7. Instant payout via UPI  

---

# 💰 Weekly Premium Model

| Tier | Premium | Coverage |
|-----|--------|---------|
| Bronze | ₹12–₹20 | Basic |
| Silver | ₹20–₹35 | Medium |
| Gold | ₹35–₹49 | High |

### Risk Pool:

Example:
1000 workers × ₹25 = ₹25,000 pool


Payouts are made from this shared pool.

---

# 🌧️ Parametric Triggers

| Event | Condition |
|------|----------|
Heavy Rain | > 15 mm/hr |
Extreme Heat | > 43°C |
Pollution | AQI > 300 |
Flood | Govt alert |
Cyclone | Wind > 60 km/h |
Shutdown | > 4 hrs closure |

---

# 🤖 AI / ML Integration

## 1. Risk Profiler
- Predicts worker risk
- Calculates premium

## 2. Fraud Detection
- Isolation Forest model
- Detects anomalies in claims

## 3. Disruption Classifier
- Validates real-world events

---

# 📱 Platform Choice

We use a **Progressive Web App (PWA)**

### Why?
- Works on low-end Android
- No download needed
- Fast & lightweight

---

# 🛠️ Tech Stack

| Layer | Tech |
|------|-----|
Frontend | Next.js + Tailwind |
Backend | Node.js + Express |
AI | Python + FastAPI |
DB | PostgreSQL |
Cache | Redis |
Streaming | Kafka |
Cloud | AWS |
Payments | Razorpay |
Notifications | Twilio |

---

# 🚨 Adversarial Defense & Anti-Spoofing Strategy

## Problem:
Fraudsters can spoof GPS and fake disruptions.

## Solution:
We use **multi-layer verification beyond GPS**.

---

## 1. Differentiation (Real vs Fake Worker)

We analyze:

- GPS location  
- Motion data (movement patterns)  
- Delivery activity  
- IP / network data  
- Historical behavior  
- Peer validation  

### Trust Score:
trust_score = f(movement, activity, location consistency)


---

## 2. Data Signals Used

### Device Signals:
- Accelerometer
- Movement speed

### Network Signals:
- IP clustering
- VPN detection

### Behavioral Signals:
- Orders completed
- Activity drop

### Geo Intelligence:
- Zone-level worker activity
- Claim clustering

---

## 3. Fraud Detection Model

Model:
- Isolation Forest + anomaly detection

Detects:
- Claim spikes
- Syndicate fraud
- Coordinated attacks

---

## 4. Anti-Spoofing Techniques

- Multi-source location validation  
- Motion verification  
- Delivery platform cross-check  
- Time-series behavior analysis  
- Claim rate limiting  

---

## 5. UX Balance (Fairness)

| Risk Level | Action |
|-----------|-------|
Low | Auto-approve |
Medium | Review |
High | Hold |

Workers are never unfairly rejected.

---

## 6. Fail-Safe

If fraud detected:
- Pause payouts
- Alert admin
- Increase validation

---

# 📈 Development Plan

## Week 1
- Architecture design  
- Repo setup  
- DB schema  
- UI design  

## Week 2
- Worker onboarding  
- Event simulation  
- Dashboard UI  
- AI prototype  

---

# 🔮 Future Enhancements

- GigScore (worker reputation)
- Retroactive claims
- Weather risk forecast
- Heatmaps
- Platform APIs

---

# 📚 References

1. World Bank – Gig Economy Report  
2. ILO – Digital Labour Platforms  
3. Swiss Re – Parametric Insurance  
4. OpenWeatherMap API  
5. OpenAQ / WAQI  
6. Apache Kafka Docs  
7. Scikit-learn Docs  
8. Google Maps API  
9. Razorpay Docs  
10. Twilio Docs  


---

# 📌 Conclusion

GigShield ensures:

✅ Instant payouts  
✅ AI-driven risk pricing  
✅ Fraud-resistant system  
✅ Financial safety for gig workers  

### Final Vision:

**When deliveries stop, income shouldn’t.**
