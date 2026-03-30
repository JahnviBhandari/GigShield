import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, ArrowRight, Zap, CloudRain, Wallet } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-hero pt-16">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-secondary/5 blur-3xl" />
      </div>

      <div className="container relative mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm text-primary-foreground/80 mb-8 animate-fade-in">
            <Zap className="h-4 w-4 text-warning" />
            <span className="text-primary-foreground/70">Parametric Insurance • Instant Payouts • AI-Powered</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight mb-6 animate-slide-up" style={{ color: 'hsl(0 0% 98%)' }}>
            AI-Powered Income
            <br />
            <span className="text-gradient-primary">Protection</span> for
            <br />
            Gig Workers
          </h1>

          <p className="text-lg sm:text-xl max-w-2xl mx-auto mb-10 animate-slide-up" style={{ color: 'hsl(220 14% 70%)', animationDelay: '0.1s' }}>
            GigShield automatically detects weather disruptions, floods, and city shutdowns — then instantly pays gig delivery workers for lost income. No claims filing needed.
          </p>

          {/* Workflow visualization */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-12 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            {[
              { icon: CloudRain, label: "Disruption" },
              { icon: Shield, label: "Detection" },
              { icon: Zap, label: "Verification" },
              { icon: Wallet, label: "Payout" },
            ].map((step, i) => (
              <div key={step.label} className="flex items-center gap-3">
                <div className="flex flex-col items-center gap-1">
                  <div className="rounded-lg bg-primary/10 p-3 border border-primary/20">
                    <step.icon className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-xs" style={{ color: 'hsl(220 14% 60%)' }}>{step.label}</span>
                </div>
                {i < 3 && <ArrowRight className="h-4 w-4 text-primary/40 animate-flow-arrow" />}
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <Link to="/worker">
              <Button size="lg" className="bg-gradient-primary text-primary-foreground px-8 shadow-glow hover:opacity-90 transition-opacity">
                Worker Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/admin">
              <Button size="lg" className="bg-gradient-accent px-8 shadow-glow animate-pulse-glow hover:opacity-90 transition-opacity text-accent-foreground">
                Admin Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-20 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            {[
              { value: "12,847", label: "Workers Protected" },
              { value: "₹28.4L", label: "Payouts Disbursed" },
              { value: "<30s", label: "Avg Payout Time" },
              { value: "99.2%", label: "Fraud Detection Rate" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-gradient-primary">{stat.value}</div>
                <div className="text-xs mt-1" style={{ color: 'hsl(220 14% 55%)' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
