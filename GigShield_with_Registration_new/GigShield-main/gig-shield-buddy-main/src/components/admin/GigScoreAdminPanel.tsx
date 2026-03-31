import { gigScoreDistribution, workerLeaderboard } from "@/data/mockData";
import { Trophy, TrendingUp, Users, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

const barColors = ["hsl(152 60% 42%)", "hsl(210 100% 45%)", "hsl(38 92% 50%)", "hsl(0 84% 60%)"];

const GigScoreAdminPanel = () => (
  <>
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="stat-card">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">Avg GigScore</span>
          <div className="rounded-lg p-2 bg-primary/10 text-primary"><Trophy className="h-4 w-4" /></div>
        </div>
        <p className="text-2xl font-bold">712</p>
      </div>
      <div className="stat-card">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">Elite Workers</span>
          <div className="rounded-lg p-2 bg-success/10 text-success"><TrendingUp className="h-4 w-4" /></div>
        </div>
        <p className="text-2xl font-bold">1,847</p>
      </div>
      <div className="stat-card">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">Total Scored</span>
          <div className="rounded-lg p-2 bg-info/10 text-info"><Users className="h-4 w-4" /></div>
        </div>
        <p className="text-2xl font-bold">12,847</p>
      </div>
      <div className="stat-card">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">Risky Workers</span>
          <div className="rounded-lg p-2 bg-destructive/10 text-destructive"><AlertTriangle className="h-4 w-4" /></div>
        </div>
        <p className="text-2xl font-bold">1,588</p>
      </div>
    </div>

    <div className="grid lg:grid-cols-2 gap-6">
      {/* Distribution Chart */}
      <div className="stat-card">
        <h3 className="font-semibold mb-4">GigScore Distribution</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={gigScoreDistribution}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 13% 90%)" />
            <XAxis dataKey="label" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip formatter={(value: number) => [value.toLocaleString(), "Workers"]} />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {gigScoreDistribution.map((_, i) => (
                <Cell key={i} fill={barColors[i]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Leaderboard */}
      <div className="stat-card">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Trophy className="h-4 w-4 text-warning" /> Worker Leaderboard
        </h3>
        <div className="space-y-2">
          {workerLeaderboard.map((w) => (
            <div key={w.rank} className={`flex items-center gap-3 rounded-lg p-2.5 ${
              w.rank <= 3 ? 'bg-warning/5 border border-warning/10' : 'bg-muted/50'
            }`}>
              <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                w.rank === 1 ? 'bg-warning/20 text-warning' : w.rank === 2 ? 'bg-muted text-muted-foreground' : w.rank === 3 ? 'bg-warning/10 text-warning' : 'bg-muted/50 text-muted-foreground'
              }`}>
                {w.rank}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{w.name}</p>
                <p className="text-xs text-muted-foreground">{w.platform} • {w.zone}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-bold">{w.score}</p>
                <span className={`text-xs ${w.trend.startsWith('+') ? 'text-success' : 'text-destructive'}`}>{w.trend}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </>
);

export default GigScoreAdminPanel;