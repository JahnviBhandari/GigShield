import { Zap, Brain, Wallet, Bell } from "lucide-react";

const solutions = [
  { icon: Zap, title: "Automatic Detection", desc: "Real-time monitoring of weather, pollution, and traffic from multiple APIs." },
  { icon: Brain, title: "AI Risk Scoring", desc: "XGBoost model prices risk per worker based on zone, history, and conditions." },
  { icon: Wallet, title: "Instant Payouts", desc: "Parametric triggers auto-approve claims and disburse via UPI in seconds." },
  { icon: Bell, title: "Smart Notifications", desc: "WhatsApp and SMS alerts keep workers informed at every stage." },
];

const SolutionSection = () => (
  <section id="solution" className="py-24">
    <div className="container mx-auto px-4">
      <div className="text-center mb-16">
        <span className="text-sm font-semibold uppercase tracking-wider text-primary">The Solution</span>
        <h2 className="text-3xl sm:text-4xl font-bold mt-3 mb-4">Parametric Insurance That Works Automatically</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          No claim forms, no waiting. GigShield detects disruptions and pays workers instantly using AI-powered parametric triggers.
        </p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
        {solutions.map((s) => (
          <div key={s.title} className="stat-card group">
            <div className="mb-4 rounded-xl bg-gradient-primary p-3 w-fit transition-transform group-hover:scale-110">
              <s.icon className="h-6 w-6 text-primary-foreground" />
            </div>
            <h3 className="font-semibold mb-2">{s.title}</h3>
            <p className="text-sm text-muted-foreground">{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default SolutionSection;
