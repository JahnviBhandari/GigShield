import { AlertTriangle, CloudRain, Thermometer, Wind } from "lucide-react";

const problems = [
  { icon: CloudRain, title: "Extreme Weather", desc: "Heavy rains and floods halt deliveries, leaving workers with zero income for days." },
  { icon: Thermometer, title: "Heatwaves & Pollution", desc: "Dangerous AQI levels and 45°C+ heat make outdoor work impossible." },
  { icon: Wind, title: "City Shutdowns", desc: "Traffic closures, protests, and cyclones stop all gig operations." },
  { icon: AlertTriangle, title: "No Safety Net", desc: "Unlike formal employees, gig workers have no paid leave or insurance coverage." },
];

const ProblemSection = () => (
  <section id="problem" className="py-24 bg-card">
    <div className="container mx-auto px-4">
      <div className="text-center mb-16">
        <span className="text-sm font-semibold uppercase tracking-wider text-destructive">The Problem</span>
        <h2 className="text-3xl sm:text-4xl font-bold mt-3 mb-4">Gig Workers Have No Income Safety Net</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Over 15 million gig delivery workers in India face income loss from events beyond their control, with no employer-backed insurance or paid leave.
        </p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
        {problems.map((p) => (
          <div key={p.title} className="stat-card text-center group">
            <div className="mx-auto mb-4 rounded-xl bg-destructive/10 p-3 w-fit transition-transform group-hover:scale-110">
              <p.icon className="h-6 w-6 text-destructive" />
            </div>
            <h3 className="font-semibold mb-2">{p.title}</h3>
            <p className="text-sm text-muted-foreground">{p.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default ProblemSection;
