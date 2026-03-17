import { gigScoreData, gigScoreCategories } from "@/data/mockData";
import { Trophy, TrendingUp, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const categoryColor: Record<string, string> = {
  "Elite Worker": "text-success",
  "Trusted Worker": "text-primary",
  "Standard Worker": "text-warning",
  "Risky Worker": "text-destructive",
};

const GigScoreCard = () => {
  const { score, maxScore, category, breakdown, benefits } = gigScoreData;
  const percentage = (score / maxScore) * 100;
  const circumference = 2 * Math.PI * 70;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="space-y-4">
      {/* Circular Score */}
      <div className="stat-card">
        <h3 className="font-semibold text-sm mb-4 flex items-center gap-2">
          <Trophy className="h-4 w-4 text-warning" /> GigScore
        </h3>
        <div className="flex items-center gap-6">
          <div className="relative w-40 h-40 flex-shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
              <circle cx="80" cy="80" r="70" stroke="hsl(var(--muted))" strokeWidth="10" fill="none" />
              <circle
                cx="80" cy="80" r="70"
                stroke="hsl(var(--primary))"
                strokeWidth="10"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold">{score}</span>
              <span className="text-xs text-muted-foreground">/ {maxScore}</span>
            </div>
          </div>
          <div className="flex-1">
            <p className={`font-bold text-lg ${categoryColor[category]}`}>{category}</p>
            <p className="text-xs text-muted-foreground mt-1">Top 40% of all workers</p>
            <div className="mt-3 flex items-center gap-1 text-success text-xs font-medium">
              <TrendingUp className="h-3 w-3" /> +22 pts this month
            </div>
          </div>
        </div>
      </div>

      {/* Score Breakdown */}
      <div className="stat-card">
        <h3 className="font-semibold text-sm mb-3">Score Breakdown</h3>
        <div className="space-y-3">
          {Object.values(breakdown).map((item) => (
            <div key={item.label}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium">{item.label}</span>
                <span className="text-xs font-bold">{item.score}/100</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    item.score >= 85 ? 'bg-success' : item.score >= 70 ? 'bg-primary' : item.score >= 50 ? 'bg-warning' : 'bg-destructive'
                  }`}
                  style={{ width: `${item.score}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Benefits */}
      <div className="stat-card">
        <h3 className="font-semibold text-sm mb-3">Your Benefits</h3>
        <div className="space-y-2">
          {benefits.map((b, i) => (
            <div key={i} className="flex items-center gap-2 text-sm">
              <span className="text-success">✓</span> {b}
            </div>
          ))}
        </div>
        <div className="mt-4 pt-3 border-t border-border/50">
          <h4 className="text-xs font-semibold text-muted-foreground mb-2">ALL TIERS</h4>
          <div className="space-y-2">
            {gigScoreCategories.map((cat) => (
              <div key={cat.label} className={`flex items-center justify-between rounded-lg px-3 py-2 text-xs ${
                cat.label === category ? 'bg-primary/10 border border-primary/20' : 'bg-muted/50'
              }`}>
                <div className="flex items-center gap-2">
                  <span className={`font-semibold text-${cat.color}`}>{cat.range}</span>
                  <span className="font-medium">{cat.label}</span>
                </div>
                {cat.label === category && <Badge className="text-[10px] px-1.5 py-0">You</Badge>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GigScoreCard;