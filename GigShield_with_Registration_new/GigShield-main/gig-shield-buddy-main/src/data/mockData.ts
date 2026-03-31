export const workerProfile = {
  name: "Rahul Sharma",
  platform: "Zomato",
  vehicleType: "Two-Wheeler",
  zone: "Koramangala, Bangalore",
  coverageTier: "Gold" as const,
  workerId: "WKR-2024-0847",
  joinDate: "2024-01-15",
  weeklyPremium: 149,
  riskScore: 72,
  coverageAmount: 5000,
  policyStatus: "Active" as const,
};

export const weatherForecast = [
  { day: "Mon", risk: "Low", temp: 28, rain: 10, icon: "☀️" },
  { day: "Tue", risk: "Medium", temp: 30, rain: 40, icon: "🌤️" },
  { day: "Wed", risk: "High", temp: 26, rain: 85, icon: "🌧️" },
  { day: "Thu", risk: "Critical", temp: 24, rain: 95, icon: "⛈️" },
  { day: "Fri", risk: "High", temp: 25, rain: 75, icon: "🌧️" },
  { day: "Sat", risk: "Medium", temp: 29, rain: 35, icon: "🌤️" },
  { day: "Sun", risk: "Low", temp: 31, rain: 15, icon: "☀️" },
];

export const activeDisruptions = [
  { type: "Heavy Rain", zone: "Koramangala", severity: "High", since: "2 hrs ago", icon: "🌧️" },
  { type: "Severe Pollution", zone: "Whitefield", severity: "Medium", since: "5 hrs ago", icon: "🌫️" },
  { type: "Traffic Shutdown", zone: "MG Road", severity: "Critical", since: "30 min ago", icon: "🚧" },
];

export const claimsHistory = [
  { id: "CLM-001", eventType: "Heavy Rain", date: "2024-03-15", amount: 350, fraudScore: 0.05, status: "Approved", payoutStatus: "Paid" },
  { id: "CLM-002", eventType: "Extreme Heat", date: "2024-03-10", amount: 200, fraudScore: 0.02, status: "Approved", payoutStatus: "Paid" },
  { id: "CLM-003", eventType: "Flood Alert", date: "2024-03-08", amount: 500, fraudScore: 0.08, status: "Approved", payoutStatus: "Paid" },
  { id: "CLM-004", eventType: "Pollution", date: "2024-03-05", amount: 150, fraudScore: 0.12, status: "Pending", payoutStatus: "Processing" },
  { id: "CLM-005", eventType: "Storm", date: "2024-02-28", amount: 450, fraudScore: 0.03, status: "Approved", payoutStatus: "Paid" },
];

export const walletData = {
  totalPayouts: 12450,
  recentPayouts: [
    { amount: 350, date: "Mar 15", reason: "Heavy Rain - Koramangala" },
    { amount: 200, date: "Mar 10", reason: "Extreme Heat - HSR Layout" },
    { amount: 500, date: "Mar 08", reason: "Flood Alert - Marathahalli" },
  ],
};

export const adminStats = {
  totalWorkers: 12847,
  activePolicies: 9632,
  claimsToday: 347,
  totalPayout: 2847500,
  fraudAlerts: 23,
  avgRiskScore: 68,
};

export const adminWorkers = [
  { id: "WKR-0847", platform: "Zomato", zone: "Koramangala", riskScore: 72, premium: 149, tier: "Gold" },
  { id: "WKR-1203", platform: "Swiggy", zone: "Whitefield", riskScore: 45, premium: 99, tier: "Silver" },
  { id: "WKR-0561", platform: "Amazon Flex", zone: "Indiranagar", riskScore: 88, premium: 199, tier: "Gold" },
  { id: "WKR-2109", platform: "Zepto", zone: "HSR Layout", riskScore: 34, premium: 79, tier: "Bronze" },
  { id: "WKR-1756", platform: "Dunzo", zone: "MG Road", riskScore: 61, premium: 129, tier: "Silver" },
  { id: "WKR-0934", platform: "Zomato", zone: "Electronic City", riskScore: 55, premium: 109, tier: "Silver" },
  { id: "WKR-1482", platform: "Swiggy", zone: "Jayanagar", riskScore: 79, premium: 169, tier: "Gold" },
  { id: "WKR-0673", platform: "Zepto", zone: "Marathahalli", riskScore: 42, premium: 89, tier: "Bronze" },
];

export const claimsChartData = [
  { month: "Jan", claims: 245, payouts: 189000 },
  { month: "Feb", claims: 312, payouts: 267000 },
  { month: "Mar", claims: 478, payouts: 412000 },
  { month: "Apr", claims: 389, payouts: 334000 },
  { month: "May", claims: 267, payouts: 223000 },
  { month: "Jun", claims: 534, payouts: 489000 },
];

export const premiumPayoutData = [
  { month: "Jan", premiums: 450000, payouts: 189000 },
  { month: "Feb", premiums: 478000, payouts: 267000 },
  { month: "Mar", premiums: 512000, payouts: 412000 },
  { month: "Apr", premiums: 498000, payouts: 334000 },
  { month: "May", premiums: 523000, payouts: 223000 },
  { month: "Jun", premiums: 567000, payouts: 489000 },
];

export const disruptionEvents = [
  { type: "Heavy Rain", zone: "Koramangala", severity: "High", threshold: ">50mm/hr", detected: "2024-03-15 14:23", source: "OpenWeatherMap", icon: "🌧️" },
  { type: "Flood Alert", zone: "Marathahalli", severity: "Critical", threshold: "Water level >2ft", detected: "2024-03-15 13:45", source: "IoT Sensors", icon: "🌊" },
  { type: "Extreme Heat", zone: "Whitefield", severity: "Medium", threshold: ">42°C", detected: "2024-03-15 11:30", source: "OpenWeatherMap", icon: "🔥" },
  { type: "Severe Pollution", zone: "Electronic City", severity: "High", threshold: "AQI > 300", detected: "2024-03-15 09:15", source: "WAQI / OpenAQ", icon: "🌫️" },
  { type: "Cyclone Warning", zone: "All Zones", severity: "Critical", threshold: "Wind >100km/h", detected: "2024-03-15 08:00", source: "IMD Alert", icon: "🌀" },
  { type: "Traffic Shutdown", zone: "MG Road", severity: "Medium", threshold: "Road closure", detected: "2024-03-15 07:30", source: "Google Maps", icon: "🚧" },
];

export const fraudClaims = [
  { claimId: "CLM-4521", workerId: "WKR-0934", fraudScore: 0.92, flagReason: "Multiple claims same hour", status: "Flagged" },
  { claimId: "CLM-4518", workerId: "WKR-2109", fraudScore: 0.78, flagReason: "Location mismatch", status: "Under Review" },
  { claimId: "CLM-4515", workerId: "WKR-1756", fraudScore: 0.85, flagReason: "Anomalous pattern", status: "Flagged" },
  { claimId: "CLM-4510", workerId: "WKR-0673", fraudScore: 0.67, flagReason: "Duplicate submission", status: "Cleared" },
  { claimId: "CLM-4507", workerId: "WKR-1482", fraudScore: 0.71, flagReason: "Inconsistent data", status: "Under Review" },
];

export const payoutTransactions = [
  { worker: "Rahul Sharma", claimId: "CLM-001", amount: 350, txnId: "TXN-RF8847", status: "Success", method: "UPI" },
  { worker: "Priya Patel", claimId: "CLM-002", amount: 200, txnId: "TXN-RF8848", status: "Success", method: "UPI" },
  { worker: "Amit Kumar", claimId: "CLM-003", amount: 500, txnId: "TXN-RF8849", status: "Processing", method: "UPI" },
  { worker: "Sneha Reddy", claimId: "CLM-004", amount: 150, txnId: "TXN-RF8850", status: "Success", method: "Bank Transfer" },
  { worker: "Vikram Singh", claimId: "CLM-005", amount: 450, txnId: "TXN-RF8851", status: "Failed", method: "UPI" },
];

export const notifications = [
  { type: "payout", message: "Your ₹350 disruption payout has been processed due to heavy rain in Koramangala zone.", time: "2 min ago", channel: "WhatsApp" },
  { type: "alert", message: "⚠️ High disruption risk detected in your zone for tomorrow. Stay prepared!", time: "1 hr ago", channel: "SMS" },
  { type: "payout", message: "Your ₹200 payout for extreme heat event has been credited to your UPI.", time: "5 hrs ago", channel: "WhatsApp" },
  { type: "policy", message: "Your Gold coverage plan has been renewed for the week. Premium: ₹149", time: "1 day ago", channel: "WhatsApp" },
  { type: "alert", message: "🌊 Flood alert issued for Marathahalli zone. Avoid area if possible.", time: "1 day ago", channel: "SMS" },
  { type: "payout", message: "Your ₹500 flood disruption payout is being processed. ETA: 30 minutes.", time: "2 days ago", channel: "WhatsApp" },
];

export const pipelineSteps = [
  { label: "Disruption Detected", icon: "🔍", description: "Weather/event APIs trigger alert" },
  { label: "Claim Pending", icon: "📋", description: "Auto-generated claim for affected workers" },
  { label: "Fraud Check", icon: "🛡️", description: "AI anomaly detection via Isolation Forest" },
  { label: "Claim Approved", icon: "✅", description: "Verified claim moves to payout queue" },
  { label: "Payout Sent", icon: "💰", description: "Instant UPI payout via Razorpay" },
  { label: "Notification Sent", icon: "📱", description: "WhatsApp/SMS confirmation to worker" },
];

export const techStack = [
  { name: "Next.js", category: "Frontend" },
  { name: "TailwindCSS", category: "Frontend" },
  { name: "Node.js", category: "Backend" },
  { name: "Express", category: "Backend" },
  { name: "Python FastAPI", category: "AI/ML" },
  { name: "Scikit-learn", category: "AI/ML" },
  { name: "Apache Kafka", category: "Infrastructure" },
  { name: "PostgreSQL", category: "Database" },
  { name: "Redis", category: "Database" },
  { name: "AWS", category: "Cloud" },
  { name: "Razorpay", category: "Payments" },
  { name: "Twilio", category: "Communication" },
  { name: "Google Maps", category: "APIs" },
];

export const architectureLayers = [
  {
    name: "Client Layer",
    items: ["Worker PWA", "Admin Dashboard", "WhatsApp Bot"],
    color: "primary",
  },
  {
    name: "API Gateway",
    items: ["AWS API Gateway", "JWT Authentication", "Rate Limiting"],
    color: "secondary",
  },
  {
    name: "Microservices",
    items: ["Worker Service", "Risk Service", "Event Detection", "Claims Service", "Payout Service", "Fraud Detection", "Notification Service"],
    color: "accent",
  },
  {
    name: "AI Models",
    items: ["Risk Profiler (XGBoost)", "Fraud Detector (Isolation Forest)", "Disruption Classifier"],
    color: "warning",
  },
  {
    name: "Data Layer",
    items: ["PostgreSQL", "Redis", "Apache Kafka", "AWS S3"],
    color: "info",
  },
  {
    name: "External APIs",
    items: ["OpenWeatherMap", "WAQI / OpenAQ", "Google Maps Traffic", "Delivery Platform APIs"],
    color: "success",
  },
];

// GigScore data
export const gigScoreData = {
  score: 782,
  maxScore: 1000,
  category: "Trusted Worker" as const,
  breakdown: {
    deliveryReliability: { score: 85, label: "Delivery Reliability", description: "Consistent deliveries over 6 months" },
    claimFrequency: { score: 72, label: "Claim Frequency", description: "Reasonable claim pattern" },
    paymentDiscipline: { score: 92, label: "Payment Discipline", description: "Premiums paid on time" },
    fraudRiskLevel: { score: 88, label: "Fraud Risk Level", description: "Low fraud probability" },
    zoneActivity: { score: 78, label: "Zone Activity", description: "Active in assigned zones" },
    platformTenure: { score: 65, label: "Platform Tenure", description: "8 months on platform" },
  },
  benefits: [
    "Normal premium rates",
    "Auto-approval for claims under ₹300",
    "Priority customer support",
  ],
};

export const gigScoreCategories = [
  { range: "800–1000", label: "Elite Worker", color: "success", benefits: ["Lower premium", "Faster payouts", "VIP support"] },
  { range: "650–799", label: "Trusted Worker", color: "primary", benefits: ["Normal premiums", "Auto-approval claims", "Priority support"] },
  { range: "450–649", label: "Standard Worker", color: "warning", benefits: ["Normal premiums", "Fraud checks required", "Standard support"] },
  { range: "Below 450", label: "Risky Worker", color: "destructive", benefits: ["Higher premium", "Manual claim review", "Restricted coverage"] },
];

export const gigScoreDistribution = [
  { range: "800-1000", label: "Elite", count: 1847, percentage: 14 },
  { range: "650-799", label: "Trusted", count: 5123, percentage: 40 },
  { range: "450-649", label: "Standard", count: 4289, percentage: 33 },
  { range: "0-449", label: "Risky", count: 1588, percentage: 13 },
];

export const workerLeaderboard = [
  { rank: 1, name: "Priya Patel", platform: "Swiggy", zone: "Indiranagar", score: 962, trend: "+12" },
  { rank: 2, name: "Amit Kumar", platform: "Zomato", zone: "Koramangala", score: 945, trend: "+8" },
  { rank: 3, name: "Sneha Reddy", platform: "Zepto", zone: "HSR Layout", score: 931, trend: "+15" },
  { rank: 4, name: "Vikram Singh", platform: "Dunzo", zone: "Whitefield", score: 918, trend: "+5" },
  { rank: 5, name: "Deepa Nair", platform: "Amazon Flex", zone: "Jayanagar", score: 905, trend: "+10" },
  { rank: 6, name: "Rahul Sharma", platform: "Zomato", zone: "Koramangala", score: 782, trend: "+22" },
  { rank: 7, name: "Kiran Rao", platform: "Swiggy", zone: "MG Road", score: 756, trend: "-3" },
  { rank: 8, name: "Anita Desai", platform: "Zepto", zone: "Electronic City", score: 698, trend: "+7" },
];

// Retroactive Claims data
export const retroactiveClaims = [
  {
    id: "RTC-001",
    eventType: "Heavy Rain",
    zone: "Koramangala",
    date: "2024-01-08",
    detectedDate: "2024-01-15",
    amount: 360,
    status: "Paid" as const,
    icon: "🌧️",
    description: "Heavy rainfall >50mm detected in your delivery zone",
  },
  {
    id: "RTC-002",
    eventType: "Severe Pollution",
    zone: "Koramangala",
    date: "2024-01-03",
    detectedDate: "2024-01-15",
    amount: 180,
    status: "Paid" as const,
    icon: "🌫️",
    description: "AQI exceeded 350 during your active delivery hours",
  },
  {
    id: "RTC-003",
    eventType: "Traffic Shutdown",
    zone: "MG Road",
    date: "2023-12-28",
    detectedDate: "2024-01-15",
    amount: 220,
    status: "Processing" as const,
    icon: "🚧",
    description: "Road closure impacted delivery routes in your zone",
  },
];

export const retroactiveTimeline = [
  { date: "Dec 28", event: "Traffic Shutdown - MG Road", severity: "Medium", icon: "🚧" },
  { date: "Jan 03", event: "Severe Pollution - Koramangala", severity: "High", icon: "🌫️" },
  { date: "Jan 08", event: "Heavy Rain - Koramangala", severity: "High", icon: "🌧️" },
  { date: "Jan 15", event: "Joined GigShield ✨", severity: "none", icon: "🛡️" },
];

export const adminRetroactiveStats = {
  totalRetroactiveClaims: 1247,
  totalRetroactivePayouts: 487500,
  avgRetroactivePayout: 391,
  topZones: [
    { zone: "Koramangala", claims: 234, amount: 89400 },
    { zone: "Whitefield", claims: 198, amount: 76200 },
    { zone: "HSR Layout", claims: 167, amount: 64800 },
    { zone: "MG Road", claims: 145, amount: 55100 },
    { zone: "Electronic City", claims: 123, amount: 47300 },
  ],
  avgGigScoreByCity: [
    { city: "Bangalore", avgScore: 712 },
    { city: "Mumbai", avgScore: 698 },
    { city: "Delhi", avgScore: 675 },
    { city: "Hyderabad", avgScore: 721 },
    { city: "Chennai", avgScore: 690 },
  ],
};

export const platformBadges: Record<string, { color: string; icon: string }> = {
  "Zomato": { color: "bg-destructive/10 text-destructive", icon: "🍕" },
  "Swiggy": { color: "bg-warning/10 text-warning", icon: "🍔" },
  "Zepto": { color: "bg-accent/10 text-accent", icon: "⚡" },
  "Dunzo": { color: "bg-success/10 text-success", icon: "📦" },
  "Amazon Flex": { color: "bg-info/10 text-info", icon: "📦" },
};
