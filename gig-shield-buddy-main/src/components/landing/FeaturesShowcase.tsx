import { Link } from "react-router-dom";
import { Trophy, Clock, Star, TrendingUp, Gift, Share2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const gigScorePreview = {
  score: 782,
  category: "Trusted Worker",
  breakdown: [
    { label: "Delivery Reliability", value: 85 },
    { label: "Payment Discipline", value: 92 },
    { label: "Fraud Risk Level", value: 88 },
    { label: "Zone Activity", value: 78 },
  ],
};

const FeaturesShowcase = () => {
  const circumference = 2 * Math.PI * 58;
  const offset = circumference - (gigScorePreview.score / 1000) * circumference;

  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-sm font-semibold uppercase tracking-wider text-accent">Advanced Features</span>
          <h2 className="text-3xl sm:text-4xl font-bold mt-3 mb-4">Beyond Insurance — Worker Empowerment</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            GigScore gamification and Retroactive Claims set GigShield apart from traditional insurance.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* GigScore Card */}
          <div className="stat-card p-8">
            <div className="flex items-center gap-2 mb-6">
              <div className="rounded-lg bg-warning/10 p-2">
                <Trophy className="h-5 w-5 text-warning" />
              </div>
              <div>
                <h3 className="font-bold text-lg">GigScore™</h3>
                <p className="text-xs text-muted-foreground">Gamified Worker Reputation</p>
              </div>
            </div>

            <div className="flex items-center gap-8 mb-6">
              <div className="relative w-32 h-32 flex-shrink-0">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 130 130">
                  <circle cx="65" cy="65" r="58" stroke="hsl(var(--muted))" strokeWidth="8" fill="none" />
                  <circle cx="65" cy="65" r="58" stroke="hsl(var(--primary))" strokeWidth="8" fill="none" strokeLinecap="round"
                    strokeDasharray={circumference} strokeDashoffset={offset} className="transition-all duration-1000" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold">782</span>
                  <span className="text-[10px] text-muted-foreground">/1000</span>
                </div>
              </div>
              <div className="flex-1 space-y-2.5">
                {gigScorePreview.breakdown.map((b) => (
                  <div key={b.label}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-muted-foreground">{b.label}</span>
                      <span className="font-semibold">{b.value}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                      <div className={`h-full rounded-full ${b.value >= 85 ? 'bg-success' : b.value >= 70 ? 'bg-primary' : 'bg-warning'}`}
                        style={{ width: `${b.value}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2 text-center">
              {[
                { range: "800+", label: "Elite", color: "text-success" },
                { range: "650+", label: "Trusted", color: "text-primary" },
                { range: "450+", label: "Standard", color: "text-warning" },
                { range: "<450", label: "Risky", color: "text-destructive" },
              ].map((t) => (
                <div key={t.label} className="rounded-lg bg-muted/50 p-2">
                  <p className={`text-xs font-bold ${t.color}`}>{t.range}</p>
                  <p className="text-[10px] text-muted-foreground">{t.label}</p>
                </div>
              ))}
            </div>

            <Link to="/worker" className="block mt-6">
              <Button size="sm" className="w-full bg-gradient-primary text-primary-foreground">
                View Your GigScore <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {/* Retroactive Claims Card */}
          <div className="stat-card p-8">
            <div className="flex items-center gap-2 mb-6">
              <div className="rounded-lg bg-info/10 p-2">
                <Clock className="h-5 w-5 text-info" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Retroactive Claims</h3>
                <p className="text-xs text-muted-foreground">"Time Travel" Disruption Detection</p>
              </div>
            </div>

            {/* Welcome message */}
            <div className="rounded-xl border border-success/20 bg-success/5 p-4 mb-5">
              <div className="flex items-start gap-2">
                <Gift className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold">Welcome Bonus Detected! 🎉</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    We found <strong>2 heavy rain disruptions</strong> in your zone before you joined. You're eligible for <strong>₹540</strong> in retroactive payouts.
                  </p>
                </div>
              </div>
            </div>

            {/* Mini timeline */}
            <div className="relative pl-6 mb-5">
              <div className="absolute left-2 top-1 bottom-1 w-0.5 bg-border" />
              {[
                { date: "Jan 03", event: "🌫️ Severe Pollution", amount: "₹180" },
                { date: "Jan 08", event: "🌧️ Heavy Rain", amount: "₹360" },
                { date: "Jan 15", event: "🛡️ Joined GigShield", amount: "" },
              ].map((item, i) => (
                <div key={i} className="relative mb-3 last:mb-0">
                  <div className={`absolute -left-4 top-1 w-3 h-3 rounded-full border-2 ${
                    i === 2 ? "bg-success border-success" : "bg-card border-primary"
                  }`} />
                  <div className="flex items-center justify-between">
                    <p className="text-sm">{item.event}</p>
                    {item.amount && <span className="text-sm font-bold text-success">{item.amount}</span>}
                  </div>
                  <p className="text-xs text-muted-foreground">{item.date}</p>
                </div>
              ))}
            </div>

            {/* Viral share preview */}
            <div className="rounded-xl bg-gradient-hero p-4 text-center mb-5" style={{ color: "hsl(0 0% 95%)" }}>
              <p className="text-xs opacity-60">SHAREABLE CARD</p>
              <p className="text-2xl font-bold mt-1">₹540</p>
              <p className="text-sm opacity-80">received for past disruptions</p>
              <div className="flex items-center justify-center gap-1 mt-2 text-xs opacity-60">
                <Share2 className="h-3 w-3" /> Share with delivery partners
              </div>
            </div>

            <Link to="/worker" className="block">
              <Button size="sm" className="w-full bg-gradient-accent text-accent-foreground">
                Explore Retroactive Claims <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesShowcase;