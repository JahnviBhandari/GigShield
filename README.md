# GigShield
### AI-Powered Parametric Insurance for Gig Workers

GigShield is an AI-powered parametric insurance platform designed to protect gig economy delivery workers from income loss caused by external disruptions such as extreme weather, floods, severe pollution, or city shutdowns.

Instead of traditional claim-based insurance, GigShield automatically detects real-world disruption events and instantly triggers payouts for affected workers.

---

# Problem Statement

Millions of gig delivery workers depend on daily earnings from platforms such as:

- Zomato
- Swiggy
- Zepto
- Dunzo
- Amazon Flex

However, when disruptions like heavy rain, extreme heat, pollution, floods, or traffic shutdowns occur, deliveries slow down or stop completely.

These workers lose income for that day and currently have **no financial protection system** designed specifically for gig work.

---

# Our Solution

GigShield provides **parametric income protection insurance** for gig workers.

Key idea:

Instead of workers filing claims, the system automatically detects disruptions using external data sources and triggers payouts.

Workflow:

1. Worker registers on GigShield
2. AI calculates their risk score and premium
3. Worker activates weekly coverage
4. External APIs detect disruptions
5. Claims are automatically generated
6. AI fraud detection validates claims
7. Instant payout is sent via UPI

---

# Persona-Based Scenario

### Ravi – Delivery Partner

- Age: 27
- Platform: Swiggy
- Location: Bengaluru
- Vehicle: Bike

Ravi works full-time delivering food orders.

During a heavy rain event:

Rainfall exceeds the defined threshold of **15 mm/hr**.

GigShield detects the disruption using weather APIs.

System actions:

- Disruption event detected
- Claim generated automatically
- Fraud check completed
- ₹300 payout sent to Ravi instantly

Ravi receives notification:

"Rain disruption detected in your zone. ₹300 payout has been processed."

---

# Weekly Premium Model

Workers subscribe to coverage using a small weekly premium.

| Tier | Weekly Premium | Coverage |
|-----|-----|-----|
| Bronze | ₹12 – ₹20 | Basic protection |
| Silver | ₹20 – ₹35 | Medium coverage |
| Gold | ₹35 – ₹49 | Maximum coverage |

Premiums collected from all workers form a **risk pool** used to fund payouts.

Example:

1000 workers × ₹25 weekly premium = ₹25,000 pooled fund.

Only workers affected by disruptions receive payouts.

---

# Parametric Triggers

Payouts are triggered automatically when external data crosses predefined thresholds.

| Disruption | Data Source | Trigger |
|---|---|---|
Heavy Rain | Weather API | Rainfall > 15 mm/hr |
Extreme Heat | Weather API | Temperature > 43°C |
Severe Pollution | AQI API | AQI > 300 |
Flood Alert | Government alerts | Flood warning issued |
Cyclone | Weather API | Wind > 60 km/h |
City Shutdown | Traffic API | Zone closed > 4 hours |

These triggers eliminate manual claim verification and allow **instant payouts**.

---

# AI / ML Integration

GigShield integrates AI in multiple areas of the workflow.

### 1. Risk Profiling

Machine learning models analyze:

- Worker location
- Historical disruption data
- Earnings patterns
- Delivery platform activity

Output:

- Risk Score
- Weekly Premium
- Coverage Tier

---

### 2. Fraud Detection

Fraud detection model identifies suspicious claim patterns.

Features analyzed:

- Claim frequency
- Location consistency
- Neighbor claim activity
- Delivery platform activity

Output:

- Fraud probability
- Claim approval decision

---

### 3. Disruption Classification

Incoming external data is validated using a classifier to determine whether a real disruption event has occurred.

---

# Platform Choice

GigShield uses a **Progressive Web Application (PWA)**.

Reasons:

- Works on low-end Android devices
- No app store installation required
- Fast loading
- Low data consumption
- Mobile-first design

Admins access the platform through a web dashboard.

---

# Technology Stack

| Layer | Technology |
|---|---|
Frontend | Next.js + Tailwind CSS |
Backend | Node.js + Express |
AI Services | Python + FastAPI |
Database | PostgreSQL |
Cache | Redis |
Event Streaming | Apache Kafka |
Cloud | AWS |
Payments | Razorpay |
Notifications | Twilio |
Maps | Google Maps API |

---

# Development Plan

### Week 1
- Architecture design
- Git repository setup
- Database schema design
- UI wireframes

### Week 2
- Worker onboarding prototype
- Disruption detection simulation
- Admin dashboard UI
- AI risk scoring prototype

---

# Future Enhancements

- GigScore reputation system
- Retroactive claims
- Weather risk forecasting
- Zone disruption heatmaps
- Platform integration APIs

---

# References

1. World Bank – The Global Gig Economy Report  
2. International Labour Organization – Digital Labour Platforms and the Future of Work  
3. Swiss Re Institute – Parametric Insurance Explained  
4. OpenWeatherMap API Documentation  
5. OpenAQ / WAQI Air Quality Data APIs  
6. Apache Kafka Documentation  
7. Scikit-learn Machine Learning Library  
8. Google Maps Platform Documentation  
9. Razorpay Payment Gateway Documentation  
10. Twilio Messaging API Documentation  

---

# Demo Video

2-minute explanation video:

[Add your video link here]

---

# Repository

This repository will be used across all phases of the project.
