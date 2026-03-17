import { architectureLayers, techStack } from "@/data/mockData";

const colorMap: Record<string, string> = {
  primary: "bg-primary/10 border-primary/20 text-primary",
  secondary: "bg-secondary/10 border-secondary/20 text-secondary",
  accent: "bg-accent/10 border-accent/20 text-accent",
  warning: "bg-warning/10 border-warning/20 text-warning",
  info: "bg-info/10 border-info/20 text-info",
  success: "bg-success/10 border-success/20 text-success",
};

const badgeColors: Record<string, string> = {
  Frontend: "bg-primary/10 text-primary",
  Backend: "bg-secondary/10 text-secondary",
  "AI/ML": "bg-accent/10 text-accent",
  Infrastructure: "bg-warning/10 text-warning",
  Database: "bg-info/10 text-info",
  Cloud: "bg-success/10 text-success",
  Payments: "bg-destructive/10 text-destructive",
  Communication: "bg-primary/10 text-primary",
  APIs: "bg-secondary/10 text-secondary",
};

const ArchitectureSection = () => (
  <section id="architecture" className="py-24">
    <div className="container mx-auto px-4">
      <div className="text-center mb-16">
        <span className="text-sm font-semibold uppercase tracking-wider text-accent">Architecture</span>
        <h2 className="text-3xl sm:text-4xl font-bold mt-3 mb-4">System Architecture</h2>
      </div>

      <div className="max-w-4xl mx-auto space-y-4 mb-20">
        {architectureLayers.map((layer, i) => (
          <div
            key={layer.name}
            className={`rounded-xl border p-5 ${colorMap[layer.color]} animate-slide-up`}
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            <h3 className="font-semibold mb-3">{layer.name}</h3>
            <div className="flex flex-wrap gap-2">
              {layer.items.map((item) => (
                <span key={item} className="rounded-md border border-current/20 bg-card px-3 py-1 text-xs font-medium text-foreground">
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mb-10">
        <h3 className="text-2xl font-bold">Tech Stack</h3>
      </div>
      <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
        {techStack.map((t) => (
          <span key={t.name} className={`rounded-full px-4 py-2 text-sm font-medium ${badgeColors[t.category]}`}>
            {t.name}
          </span>
        ))}
      </div>
    </div>
  </section>
);

export default ArchitectureSection;
