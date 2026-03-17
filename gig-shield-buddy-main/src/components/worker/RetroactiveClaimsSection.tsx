import { useState } from "react";
import { retroactiveClaims, retroactiveTimeline } from "@/data/mockData";
import { Clock, Share2, Gift, CheckCircle, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const statusStyle: Record<string, string> = {
  Paid: "bg-success/10 text-success",
  Processing: "bg-info/10 text-info",
};

const RetroactiveClaimsSection = () => {
  const [showShareCard, setShowShareCard] = useState(false);
  const totalPayout = retroactiveClaims.reduce((s, c) => s + c.amount, 0);

  return (
    <div className="space-y-4">
      {/* Welcome Banner */}
      <div className="stat-card border-l-4 border-success bg-success/5">
        <div className="flex items-start gap-3">
          <Gift className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold">Welcome Bonus Detected! 🎉</p>
            <p className="text-xs text-muted-foreground mt-1">
              We noticed you experienced <strong>3 disruptions</strong> in your zone before joining GigShield. 
              You are eligible for a retroactive payout of <strong>₹{totalPayout}</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="stat-card">
        <h3 className="font-semibold text-sm mb-4 flex items-center gap-2">
          <Clock className="h-4 w-4 text-info" /> Disruption Timeline
        </h3>
        <div className="relative pl-6">
          <div className="absolute left-2 top-1 bottom-1 w-0.5 bg-border" />
          {retroactiveTimeline.map((item, i) => (
            <div key={i} className="relative mb-4 last:mb-0">
              <div className={`absolute -left-4 top-1 w-3 h-3 rounded-full border-2 ${
                item.severity === "none" ? "bg-success border-success" : "bg-card border-primary"
              }`} />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{item.icon} {item.event}</p>
                  <p className="text-xs text-muted-foreground">{item.date}</p>
                </div>
                {item.severity !== "none" && (
                  <Badge variant={item.severity === "High" ? "destructive" : "secondary"} className="text-[10px]">
                    {item.severity}
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Retroactive Claims */}
      <div className="stat-card">
        <h3 className="font-semibold text-sm mb-3">Retroactive Claims</h3>
        <div className="space-y-2">
          {retroactiveClaims.map((c) => (
            <div key={c.id} className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
              <div className="flex items-center gap-3">
                <span className="text-xl">{c.icon}</span>
                <div>
                  <p className="text-sm font-medium">{c.eventType}</p>
                  <p className="text-xs text-muted-foreground">{c.description}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{c.date} • Detected {c.detectedDate}</p>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-bold">₹{c.amount}</p>
                <span className={`text-xs px-2 py-0.5 rounded-full inline-flex items-center gap-1 ${statusStyle[c.status]}`}>
                  {c.status === "Paid" ? <CheckCircle className="h-3 w-3" /> : <Loader2 className="h-3 w-3 animate-spin" />}
                  {c.status}
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3 pt-3 border-t border-border/50 flex items-center justify-between">
          <span className="text-sm font-medium">Total Retroactive Payout</span>
          <span className="text-lg font-bold text-success">₹{totalPayout}</span>
        </div>
      </div>

      {/* Viral Share */}
      <div className="stat-card bg-gradient-primary text-primary-foreground text-center">
        <p className="text-sm opacity-90 mb-1">We noticed you went through disruptions before joining GigShield.</p>
        <p className="text-lg font-bold mb-1">Here's what you deserved.</p>
        <p className="text-3xl font-bold mb-3">₹{totalPayout}</p>
        <Button
          variant="secondary"
          size="sm"
          className="bg-primary-foreground/20 hover:bg-primary-foreground/30 text-primary-foreground border-0"
          onClick={() => setShowShareCard(!showShareCard)}
        >
          <Share2 className="h-4 w-4 mr-2" /> Share with delivery partners
        </Button>
      </div>

      {showShareCard && (
        <div className="stat-card border-2 border-dashed border-primary/30 text-center animate-fade-in">
          <p className="text-xs text-muted-foreground mb-2">SHAREABLE CARD</p>
          <div className="rounded-xl bg-gradient-hero p-5" style={{ color: "hsl(0 0% 95%)" }}>
            <p className="text-xs opacity-70">GigShield • AI-Powered Income Protection</p>
            <p className="text-2xl font-bold mt-2">₹{totalPayout}</p>
            <p className="text-sm opacity-80 mt-1">received for rain disruption</p>
            <p className="text-xs mt-3 opacity-60">Join GigShield and protect your gig income</p>
          </div>
          <p className="text-xs text-muted-foreground mt-2">Tap to share via WhatsApp, SMS, or social media</p>
        </div>
      )}
    </div>
  );
};

export default RetroactiveClaimsSection;