import { pipelineSteps } from "@/data/mockData";
import { ArrowRight } from "lucide-react";

const HowItWorksSection = () => (
  <section id="how-it-works" className="py-24 bg-card">
    <div className="container mx-auto px-4">
      <div className="text-center mb-16">
        <span className="text-sm font-semibold uppercase tracking-wider text-secondary">How It Works</span>
        <h2 className="text-3xl sm:text-4xl font-bold mt-3 mb-4">From Disruption to Payout in Seconds</h2>
      </div>
      <div className="flex flex-col lg:flex-row items-center justify-center gap-4 max-w-6xl mx-auto">
        {pipelineSteps.map((step, i) => (
          <div key={step.label} className="flex items-center gap-4">
            <div className="stat-card text-center min-w-[160px]">
              <div className="text-3xl mb-2">{step.icon}</div>
              <h3 className="font-semibold text-sm mb-1">{step.label}</h3>
              <p className="text-xs text-muted-foreground">{step.description}</p>
            </div>
            {i < pipelineSteps.length - 1 && (
              <ArrowRight className="h-5 w-5 text-primary/40 hidden lg:block animate-flow-arrow flex-shrink-0" />
            )}
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorksSection;
