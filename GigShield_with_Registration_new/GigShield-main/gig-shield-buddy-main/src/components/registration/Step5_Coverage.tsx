import { useState } from "react";
import { Shield, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRegistration } from "@/context/RegistrationContext";

const triggers = [
  { icon: "🌧️", event: "Heavy Rain", threshold: "> 15mm/hr", payout: "₹180" },
  { icon: "🌊", event: "Flood", threshold: "Waterlogging confirmed", payout: "₹360" },
  { icon: "🔥", event: "Extreme Heat", threshold: "> 43°C", payout: "₹144" },
  { icon: "💨", event: "Severe Pollution", threshold: "AQI > 300", payout: "₹216" },
  { icon: "🚫", event: "Curfew", threshold: "> 4 hours", payout: "₹360" },
];

const tiers = [
  { weekly: 12, label: "Basic", risk: "Low Risk", color: "border-green-400 bg-green-50", badge: "bg-green-100 text-green-700", coverage: "₹180 max" },
  { weekly: 24, label: "Standard", risk: "Medium Risk", color: "border-blue-400 bg-blue-50", badge: "bg-blue-100 text-blue-700", coverage: "₹240 max" },
  { weekly: 37, label: "Advanced", risk: "High Risk", color: "border-orange-400 bg-orange-50", badge: "bg-orange-100 text-orange-700", coverage: "₹300 max" },
  { weekly: 49, label: "Premium", risk: "Extreme Risk", color: "border-red-400 bg-red-50", badge: "bg-red-100 text-red-700", coverage: "₹360 max" },
];

const Step5_Coverage = () => {
  const { data, updateData, nextStep } = useRegistration();
  const [selected, setSelected] = useState(data.weeklyPremium);

  const handleActivate = () => {
    updateData({ weeklyPremium: selected });
    nextStep();
  };

  const recommended = data.weeklyPremium;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-4">
          <Shield className="h-7 w-7 text-primary" />
        </div>
        <h2 className="text-xl font-bold text-foreground">Your Coverage Plan</h2>
        <p className="text-sm text-muted-foreground mt-1">
          AI recommended ₹{recommended}/week for {data.city || "your zone"}
        </p>
      </div>

      {/* Tiers */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Select Weekly Plan</label>
        <div className="space-y-2">
          {tiers.map((t) => (
            <button
              key={t.weekly}
              onClick={() => setSelected(t.weekly)}
              className={`w-full rounded-xl border-2 p-3 flex items-center justify-between transition-all ${
                selected === t.weekly ? t.color + " ring-2 ring-offset-1 ring-primary" : "border-border bg-background"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`rounded-full px-2 py-0.5 text-xs font-bold ${t.badge}`}>{t.label}</div>
                <div className="text-left">
                  <p className="text-sm font-bold">₹{t.weekly}/week</p>
                  <p className="text-xs text-muted-foreground">{t.risk} · {t.coverage}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {t.weekly === recommended && (
                  <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">AI Pick</span>
                )}
                {selected === t.weekly && <CheckCircle2 className="h-5 w-5 text-primary" />}
              </div>
            </button>
          ))}
        </div>
        <p className="text-xs text-center text-muted-foreground">Less than one chai per day 🍵</p>
      </div>

      {/* What's covered */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-foreground">What you're covered for:</p>
        <div className="space-y-1.5">
          {triggers.map((t) => (
            <div key={t.event} className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2">
              <div className="flex items-center gap-2">
                <span>{t.icon}</span>
                <div>
                  <p className="text-xs font-medium">{t.event}</p>
                  <p className="text-xs text-muted-foreground">{t.threshold}</p>
                </div>
              </div>
              <span className="text-xs font-bold text-green-600">{t.payout}</span>
            </div>
          ))}
        </div>
      </div>

      {/* KYC note */}
      <div className="rounded-lg bg-muted/40 border border-border p-3">
        <p className="text-xs font-medium text-foreground mb-1">🔒 Progressive KYC</p>
        <p className="text-xs text-muted-foreground">
          Coverage starts immediately. Complete Aadhaar verification later to unlock higher tiers. No documents needed today.
        </p>
      </div>

      <Button onClick={handleActivate} className="w-full bg-gradient-primary">
        Activate Coverage — ₹{selected}/week <ArrowRight className="h-4 w-4 ml-2" />
      </Button>
    </div>
  );
};

export default Step5_Coverage;
