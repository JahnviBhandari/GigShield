import { adminRetroactiveStats } from "@/data/mockData";
import { Clock, Wallet, MapPin, BarChart3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const RetroactiveAdminPanel = () => {
  const { totalRetroactiveClaims, totalRetroactivePayouts, avgRetroactivePayout, topZones, avgGigScoreByCity } = adminRetroactiveStats;

  return (
    <>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="stat-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Retroactive Claims</span>
            <div className="rounded-lg p-2 bg-info/10 text-info"><Clock className="h-4 w-4" /></div>
          </div>
          <p className="text-2xl font-bold">{totalRetroactiveClaims.toLocaleString()}</p>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Total Retro Payouts</span>
            <div className="rounded-lg p-2 bg-success/10 text-success"><Wallet className="h-4 w-4" /></div>
          </div>
          <p className="text-2xl font-bold">₹{(totalRetroactivePayouts / 1000).toFixed(0)}K</p>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Avg Retro Payout</span>
            <div className="rounded-lg p-2 bg-warning/10 text-warning"><BarChart3 className="h-4 w-4" /></div>
          </div>
          <p className="text-2xl font-bold">₹{avgRetroactivePayout}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Disruption Zones */}
        <div className="stat-card">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <MapPin className="h-4 w-4 text-destructive" /> Top Disruption Zones
          </h3>
          <div className="space-y-3">
            {topZones.map((z, i) => (
              <div key={z.zone} className="flex items-center gap-3">
                <span className="text-xs font-bold text-muted-foreground w-5">#{i + 1}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{z.zone}</span>
                    <span className="text-xs text-muted-foreground">{z.claims} claims • ₹{(z.amount / 1000).toFixed(1)}K</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full bg-destructive/70" style={{ width: `${(z.claims / topZones[0].claims) * 100}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Avg GigScore by City */}
        <div className="stat-card">
          <h3 className="font-semibold mb-4">Avg GigScore by City</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={avgGigScoreByCity}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 13% 90%)" />
              <XAxis dataKey="city" tick={{ fontSize: 12 }} />
              <YAxis domain={[600, 750]} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="avgScore" fill="hsl(210 100% 45%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
};

export default RetroactiveAdminPanel;