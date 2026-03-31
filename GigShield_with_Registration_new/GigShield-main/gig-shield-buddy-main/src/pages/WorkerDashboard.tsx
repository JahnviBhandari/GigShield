import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Shield, ArrowLeft, Bell, CloudRain, Thermometer, MapPin, Wallet, User, Trophy, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { workerProfile, weatherForecast, activeDisruptions, claimsHistory, walletData, notifications, platformBadges } from "@/data/mockData";
import GigScoreCard from "@/components/worker/GigScoreCard";
import RetroactiveClaimsSection from "@/components/worker/RetroactiveClaimsSection";
import LiveWeatherCard from "@/components/worker/LiveWeatherCard";

const tierColors = { Bronze: "bg-warning/20 text-warning", Silver: "bg-muted text-muted-foreground", Gold: "bg-warning/10 text-warning" };
const riskColors: Record<string, string> = { Low: "text-success", Medium: "text-warning", High: "text-destructive", Critical: "text-destructive" };
const statusColors: Record<string, string> = { Approved: "bg-success/10 text-success", Pending: "bg-warning/10 text-warning", Paid: "bg-success/10 text-success", Processing: "bg-info/10 text-info" };

const WorkerDashboard = () => {
  const [tab, setTab] = useState<"home" | "claims" | "wallet" | "alerts" | "gigscore" | "retro">("home");
  const [registeredWorker, setRegisteredWorker] = useState<Record<string,string>|null>(null);
  useEffect(() => {
    const saved = localStorage.getItem("gigshield_worker");
    if (saved) { try { setRegisteredWorker(JSON.parse(saved)); } catch {} }
  }, []);
  const platformInfo = platformBadges[workerProfile.platform] || { color: "bg-muted text-muted-foreground", icon: "📦" };

  return (
    <div className="min-h-screen bg-background max-w-md mx-auto relative">
      {/* Header */}
      <div className="bg-gradient-primary p-4 pb-20 rounded-b-3xl">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-primary-foreground">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex items-center gap-2 text-primary-foreground font-bold">
            <Shield className="h-5 w-5" /> GigShield
          </div>
          <Bell className="h-5 w-5 text-primary-foreground" />
        </div>
      </div>

      {/* Profile Card */}
      <div className="px-4 -mt-16 relative z-10">
        <div className="stat-card">
          <div className="flex items-center gap-3 mb-4">
            <div className="rounded-full bg-gradient-primary p-3">
              <User className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <h2 className="font-bold text-lg">{registeredWorker?.phone ? `Worker ${registeredWorker.phone.slice(-4)}` : workerProfile.name}</h2>
              <p className="text-xs text-muted-foreground">{workerProfile.workerId} • {workerProfile.platform}</p>
            </div>
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${tierColors[workerProfile.coverageTier]}`}>
              {workerProfile.coverageTier}
            </span>
          </div>
          {/* Platform Badge */}
          <div className="flex items-center gap-2 mb-3">
            <span className={`rounded-full px-3 py-1 text-xs font-semibold inline-flex items-center gap-1 ${platformInfo.color}`}>
              {platformInfo.icon} {workerProfile.platform}
            </span>
            <span className="text-xs text-muted-foreground">{registeredWorker?.vehicleType || workerProfile.vehicleType} • {registeredWorker?.zone || workerProfile.zone}</span>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="rounded-lg bg-muted/50 p-2">
              <p className="text-xs text-muted-foreground">Premium/wk</p>
              <p className="font-bold text-sm">₹{registeredWorker?.weeklyPremium || workerProfile.weeklyPremium}</p>
            </div>
            <div className="rounded-lg bg-muted/50 p-2">
              <p className="text-xs text-muted-foreground">Risk Score</p>
              <p className="font-bold text-sm text-warning">{workerProfile.riskScore}/100</p>
            </div>
            <div className="rounded-lg bg-muted/50 p-2">
              <p className="text-xs text-muted-foreground">Coverage</p>
              <p className="font-bold text-sm">₹{workerProfile.coverageAmount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 mt-4 pb-24 space-y-4">
        {tab === "home" && (
          <>
            {activeDisruptions.length > 0 && (
              <div className="stat-card border-l-4 border-destructive">
                <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                  <CloudRain className="h-4 w-4 text-destructive" /> Active Disruptions
                </h3>
                <div className="space-y-2">
                  {activeDisruptions.map((d, i) => (
                    <div key={i} className="flex items-center justify-between rounded-lg bg-muted/50 p-2.5">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{d.icon}</span>
                        <div>
                          <p className="text-sm font-medium">{d.type}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3" />{d.zone}</p>
                        </div>
                      </div>
                      <Badge variant={d.severity === "Critical" ? "destructive" : "secondary"} className="text-xs">{d.severity}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <LiveWeatherCard city={registeredWorker?.city || "Bangalore"} />
            <div className="stat-card">
              <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                <Thermometer className="h-4 w-4 text-info" /> 7-Day Risk Forecast
              </h3>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {weatherForecast.map((d) => (
                  <div key={d.day} className="flex-shrink-0 rounded-lg bg-muted/50 p-2.5 text-center min-w-[60px]">
                    <p className="text-xs font-medium">{d.day}</p>
                    <p className="text-xl my-1">{d.icon}</p>
                    <p className="text-xs">{d.temp}°</p>
                    <p className={`text-xs font-semibold ${riskColors[d.risk]}`}>{d.risk}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="stat-card">
              <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-secondary" /> Zone Disruption Map
              </h3>
              <div className="rounded-lg bg-muted/30 h-48 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-20" style={{
                  backgroundImage: 'radial-gradient(circle at 30% 40%, hsl(0 84% 60% / 0.5) 0%, transparent 50%), radial-gradient(circle at 70% 60%, hsl(38 92% 50% / 0.4) 0%, transparent 40%), radial-gradient(circle at 50% 80%, hsl(152 60% 42% / 0.3) 0%, transparent 50%)',
                }} />
                <div className="text-center z-10">
                  <MapPin className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">Bangalore Zone Heatmap</p>
                  <p className="text-xs text-destructive font-medium">3 Active Hotspots</p>
                </div>
              </div>
            </div>
          </>
        )}

        {tab === "claims" && (
          <div className="stat-card">
            <h3 className="font-semibold text-sm mb-3">Claims History</h3>
            <div className="space-y-2">
              {claimsHistory.map((c) => (
                <div key={c.id} className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                  <div>
                    <p className="text-sm font-medium">{c.eventType}</p>
                    <p className="text-xs text-muted-foreground">{c.date} • Fraud: {(c.fraudScore * 100).toFixed(0)}%</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">₹{c.amount}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[c.status]}`}>{c.payoutStatus}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "wallet" && (
          <>
            <div className="stat-card bg-gradient-primary text-primary-foreground">
              <Wallet className="h-5 w-5 mb-2" />
              <p className="text-sm opacity-80">Total Payouts Received</p>
              <p className="text-3xl font-bold">₹{walletData.totalPayouts.toLocaleString()}</p>
            </div>
            <div className="stat-card">
              <h3 className="font-semibold text-sm mb-3">Recent Payouts</h3>
              {walletData.recentPayouts.map((p, i) => (
                <div key={i} className="flex items-center justify-between py-2.5 border-b border-border/50 last:border-0">
                  <div>
                    <p className="text-sm font-medium">₹{p.amount}</p>
                    <p className="text-xs text-muted-foreground">{p.reason}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{p.date}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {tab === "alerts" && (
          <div className="stat-card">
            <h3 className="font-semibold text-sm mb-3 flex items-center gap-2"><Bell className="h-4 w-4" /> Notifications</h3>
            <div className="space-y-3">
              {notifications.map((n, i) => (
                <div key={i} className="rounded-lg bg-muted/50 p-3 border-l-4 border-primary/30">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-primary">{n.channel}</span>
                    <span className="text-xs text-muted-foreground">{n.time}</span>
                  </div>
                  <p className="text-sm">{n.message}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "gigscore" && <GigScoreCard />}
        {tab === "retro" && <RetroactiveClaimsSection />}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border max-w-md mx-auto">
        <div className="flex justify-around py-2">
          {([
            { id: "home" as const, icon: Shield, label: "Home" },
            { id: "gigscore" as const, icon: Trophy, label: "GigScore" },
            { id: "retro" as const, icon: Clock, label: "Retro" },
            { id: "claims" as const, icon: CloudRain, label: "Claims" },
            { id: "wallet" as const, icon: Wallet, label: "Wallet" },
            { id: "alerts" as const, icon: Bell, label: "Alerts" },
          ]).map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)} className={`flex flex-col items-center gap-0.5 px-2 py-1 transition-colors ${tab === t.id ? 'text-primary' : 'text-muted-foreground'}`}>
              <t.icon className="h-5 w-5" />
              <span className="text-[10px]">{t.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WorkerDashboard;