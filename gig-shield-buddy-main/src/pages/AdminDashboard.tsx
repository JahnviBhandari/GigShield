import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { Shield, LayoutDashboard, Users, CloudRain, FileText, AlertTriangle, Wallet, BarChart3, Bell, Zap, ArrowRight, Menu, X, ChevronRight, Trophy, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { adminStats, adminWorkers, claimsChartData, premiumPayoutData, disruptionEvents, fraudClaims, payoutTransactions, notifications, pipelineSteps } from "@/data/mockData";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import GigScoreAdminPanel from "@/components/admin/GigScoreAdminPanel";
import RetroactiveAdminPanel from "@/components/admin/RetroactiveAdminPanel";

const menuItems = [
  { id: "overview", icon: LayoutDashboard, label: "Overview" },
  { id: "workers", icon: Users, label: "Workers" },
  { id: "gigscore", icon: Trophy, label: "GigScore" },
  { id: "retroclaims", icon: Clock, label: "Retro Claims" },
  { id: "disruptions", icon: CloudRain, label: "Disruptions" },
  { id: "claims", icon: FileText, label: "Claims" },
  { id: "fraud", icon: AlertTriangle, label: "Fraud Detection" },
  { id: "payouts", icon: Wallet, label: "Payouts" },
  { id: "notifications", icon: Bell, label: "Notifications" },
];

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [demoRunning, setDemoRunning] = useState(false);
  const [demoStep, setDemoStep] = useState(-1);

  const runDemo = useCallback(() => {
    setDemoRunning(true);
    setDemoStep(0);
    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (step >= 6) {
        clearInterval(interval);
        setTimeout(() => { setDemoRunning(false); setDemoStep(-1); }, 2000);
      } else {
        setDemoStep(step);
      }
    }, 1500);
  }, []);

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-gradient-hero border-r border-border/10 transform transition-transform lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-4 flex items-center gap-2 border-b border-border/10">
          <Shield className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg" style={{ color: 'hsl(0 0% 95%)' }}>GigShield</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary ml-auto">Admin</span>
        </div>
        <nav className="p-3 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${activeTab === item.id ? 'bg-primary/20 text-primary' : 'hover:bg-primary/5'}`}
              style={activeTab !== item.id ? { color: 'hsl(220 14% 70%)' } : undefined}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="absolute bottom-4 left-4 right-4">
          <Link to="/">
            <Button variant="outline" size="sm" className="w-full border-border/20 text-muted-foreground hover:text-foreground">
              ← Back to Home
            </Button>
          </Link>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && <div className="fixed inset-0 z-40 bg-foreground/20 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main */}
      <main className="flex-1 lg:ml-64">
        <header className="sticky top-0 z-30 bg-card/80 backdrop-blur-md border-b border-border px-4 h-14 flex items-center justify-between">
          <button className="lg:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-5 w-5" />
          </button>
          <h1 className="font-semibold capitalize">{activeTab}</h1>
          <Button size="sm" onClick={runDemo} disabled={demoRunning} className="bg-gradient-accent text-accent-foreground">
            <Zap className="h-4 w-4 mr-1" /> {demoRunning ? "Running..." : "Simulate Disruption"}
          </Button>
        </header>

        {/* Demo Pipeline */}
        {demoRunning && (
          <div className="bg-card border-b border-border p-4">
            <p className="text-xs font-semibold text-accent mb-3">⚡ LIVE SIMULATION: Heavy Rain Disruption</p>
            <div className="flex flex-wrap items-center gap-2">
              {pipelineSteps.map((step, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className={`pipeline-step rounded-lg px-3 py-2 text-xs font-medium transition-all duration-500 ${i <= demoStep ? 'bg-primary/10 text-primary animate-pulse-glow border border-primary/30' : 'bg-muted text-muted-foreground'} ${i === demoStep ? 'active scale-105' : ''}`}>
                    <span className="mr-1">{step.icon}</span>{step.label}
                  </div>
                  {i < pipelineSteps.length - 1 && <ArrowRight className={`h-3 w-3 flex-shrink-0 ${i < demoStep ? 'text-primary' : 'text-muted-foreground/30'} animate-flow-arrow`} />}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="p-4 lg:p-6 space-y-6">
          {activeTab === "overview" && <OverviewPanel />}
          {activeTab === "workers" && <WorkersPanel />}
          {activeTab === "gigscore" && <GigScoreAdminPanel />}
          {activeTab === "retroclaims" && <RetroactiveAdminPanel />}
          {activeTab === "disruptions" && <DisruptionsPanel />}
          {activeTab === "claims" && <ClaimsPipelinePanel />}
          {activeTab === "fraud" && <FraudPanel />}
          {activeTab === "payouts" && <PayoutsPanel />}
          {activeTab === "notifications" && <NotificationsPanel />}
        </div>
      </main>
    </div>
  );
};

const StatCard = ({ label, value, icon: Icon, color = "primary" }: { label: string; value: string | number; icon: any; color?: string }) => {
  const colorClasses: Record<string, string> = {
    primary: "bg-primary/10 text-primary",
    secondary: "bg-secondary/10 text-secondary",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
    destructive: "bg-destructive/10 text-destructive",
    accent: "bg-accent/10 text-accent",
  };
  return (
    <div className="stat-card">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-muted-foreground">{label}</span>
        <div className={`rounded-lg p-2 ${colorClasses[color]}`}><Icon className="h-4 w-4" /></div>
      </div>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
};

const OverviewPanel = () => (
  <>
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
      <StatCard label="Total Workers" value={adminStats.totalWorkers.toLocaleString()} icon={Users} color="primary" />
      <StatCard label="Active Policies" value={adminStats.activePolicies.toLocaleString()} icon={Shield} color="success" />
      <StatCard label="Claims Today" value={adminStats.claimsToday} icon={FileText} color="warning" />
      <StatCard label="Total Payouts" value={`₹${(adminStats.totalPayout / 100000).toFixed(1)}L`} icon={Wallet} color="secondary" />
      <StatCard label="Fraud Alerts" value={adminStats.fraudAlerts} icon={AlertTriangle} color="destructive" />
    </div>

    <div className="grid lg:grid-cols-2 gap-6">
      <div className="stat-card">
        <h3 className="font-semibold mb-4">Claims Frequency</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={claimsChartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 13% 90%)" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="claims" fill="hsl(210 100% 45%)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="stat-card">
        <h3 className="font-semibold mb-4">Premium vs Payout</h3>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={premiumPayoutData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 13% 90%)" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Area type="monotone" dataKey="premiums" stroke="hsl(172 66% 40%)" fill="hsl(172 66% 40% / 0.1)" />
            <Area type="monotone" dataKey="payouts" stroke="hsl(210 100% 45%)" fill="hsl(210 100% 45% / 0.1)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  </>
);

const WorkersPanel = () => (
  <div className="stat-card overflow-x-auto">
    <h3 className="font-semibold mb-4">Worker Registry</h3>
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-border text-left">
          <th className="pb-3 font-medium text-muted-foreground">Worker ID</th>
          <th className="pb-3 font-medium text-muted-foreground">Platform</th>
          <th className="pb-3 font-medium text-muted-foreground">Zone</th>
          <th className="pb-3 font-medium text-muted-foreground">Risk Score</th>
          <th className="pb-3 font-medium text-muted-foreground">Premium</th>
          <th className="pb-3 font-medium text-muted-foreground">Tier</th>
        </tr>
      </thead>
      <tbody>
        {adminWorkers.map((w) => (
          <tr key={w.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
            <td className="py-3 font-mono text-xs">{w.id}</td>
            <td className="py-3"><Badge variant="secondary">{w.platform}</Badge></td>
            <td className="py-3">{w.zone}</td>
            <td className="py-3">
              <div className="flex items-center gap-2">
                <div className="h-2 w-16 rounded-full bg-muted overflow-hidden">
                  <div className={`h-full rounded-full ${w.riskScore > 70 ? 'bg-destructive' : w.riskScore > 50 ? 'bg-warning' : 'bg-success'}`} style={{ width: `${w.riskScore}%` }} />
                </div>
                <span className="text-xs">{w.riskScore}</span>
              </div>
            </td>
            <td className="py-3">₹{w.premium}</td>
            <td className="py-3"><Badge variant="outline">{w.tier}</Badge></td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const DisruptionsPanel = () => (
  <>
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {disruptionEvents.map((e, i) => (
        <div key={i} className={`stat-card border-l-4 ${e.severity === 'Critical' ? 'border-destructive' : e.severity === 'High' ? 'border-warning' : 'border-info'}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl">{e.icon}</span>
            <Badge variant={e.severity === "Critical" ? "destructive" : "secondary"}>{e.severity}</Badge>
          </div>
          <h3 className="font-semibold">{e.type}</h3>
          <p className="text-xs text-muted-foreground mt-1">{e.zone}</p>
          <div className="mt-3 space-y-1 text-xs text-muted-foreground">
            <p>Threshold: <span className="font-mono text-foreground">{e.threshold}</span></p>
            <p>Source: {e.source}</p>
            <p>Detected: {e.detected}</p>
          </div>
        </div>
      ))}
    </div>
  </>
);

const ClaimsPipelinePanel = () => (
  <>
    <div className="stat-card">
      <h3 className="font-semibold mb-6">Claims Pipeline Flow</h3>
      <div className="flex flex-col lg:flex-row items-center justify-center gap-3">
        {pipelineSteps.map((step, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="rounded-xl bg-primary/5 border border-primary/10 p-4 text-center min-w-[140px] hover:bg-primary/10 transition-colors">
              <div className="text-2xl mb-1">{step.icon}</div>
              <p className="text-xs font-semibold">{step.label}</p>
              <p className="text-xs text-muted-foreground mt-1">{step.description}</p>
            </div>
            {i < pipelineSteps.length - 1 && <ArrowRight className="h-4 w-4 text-primary/40 hidden lg:block animate-flow-arrow flex-shrink-0" />}
          </div>
        ))}
      </div>
    </div>
  </>
);

const FraudPanel = () => (
  <>
    <div className="grid sm:grid-cols-3 gap-4 mb-6">
      <StatCard label="Model Status" value="Active" icon={Shield} color="success" />
      <StatCard label="Flagged Claims" value={fraudClaims.filter(f => f.status === "Flagged").length} icon={AlertTriangle} color="destructive" />
      <StatCard label="Detection Rate" value="99.2%" icon={BarChart3} color="primary" />
    </div>
    <div className="stat-card overflow-x-auto">
      <h3 className="font-semibold mb-4">Suspicious Claims (Isolation Forest)</h3>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-left">
            <th className="pb-3 font-medium text-muted-foreground">Claim ID</th>
            <th className="pb-3 font-medium text-muted-foreground">Worker ID</th>
            <th className="pb-3 font-medium text-muted-foreground">Fraud Score</th>
            <th className="pb-3 font-medium text-muted-foreground">Flag Reason</th>
            <th className="pb-3 font-medium text-muted-foreground">Status</th>
          </tr>
        </thead>
        <tbody>
          {fraudClaims.map((f) => (
            <tr key={f.claimId} className="border-b border-border/50">
              <td className="py-3 font-mono text-xs">{f.claimId}</td>
              <td className="py-3 font-mono text-xs">{f.workerId}</td>
              <td className="py-3">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-16 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full bg-destructive" style={{ width: `${f.fraudScore * 100}%` }} />
                  </div>
                  <span className="text-xs font-mono">{(f.fraudScore * 100).toFixed(0)}%</span>
                </div>
              </td>
              <td className="py-3 text-xs">{f.flagReason}</td>
              <td className="py-3">
                <Badge variant={f.status === "Flagged" ? "destructive" : f.status === "Cleared" ? "secondary" : "outline"} className="text-xs">
                  {f.status}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </>
);

const PayoutsPanel = () => (
  <div className="stat-card overflow-x-auto">
    <h3 className="font-semibold mb-4 flex items-center gap-2">
      Razorpay Payouts <Badge variant="secondary" className="text-xs">Instant UPI</Badge>
    </h3>
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-border text-left">
          <th className="pb-3 font-medium text-muted-foreground">Worker</th>
          <th className="pb-3 font-medium text-muted-foreground">Claim ID</th>
          <th className="pb-3 font-medium text-muted-foreground">Amount</th>
          <th className="pb-3 font-medium text-muted-foreground">Txn ID</th>
          <th className="pb-3 font-medium text-muted-foreground">Method</th>
          <th className="pb-3 font-medium text-muted-foreground">Status</th>
        </tr>
      </thead>
      <tbody>
        {payoutTransactions.map((p) => (
          <tr key={p.txnId} className="border-b border-border/50">
            <td className="py-3">{p.worker}</td>
            <td className="py-3 font-mono text-xs">{p.claimId}</td>
            <td className="py-3 font-bold">₹{p.amount}</td>
            <td className="py-3 font-mono text-xs">{p.txnId}</td>
            <td className="py-3"><Badge variant="outline" className="text-xs">{p.method}</Badge></td>
            <td className="py-3">
              <Badge variant={p.status === "Success" ? "secondary" : p.status === "Failed" ? "destructive" : "outline"} className={`text-xs ${p.status === "Success" ? 'bg-success/10 text-success' : ''}`}>
                {p.status}
              </Badge>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const NotificationsPanel = () => (
  <div className="stat-card">
    <h3 className="font-semibold mb-4 flex items-center gap-2">
      <Bell className="h-4 w-4" /> WhatsApp / SMS Notifications
    </h3>
    <div className="space-y-3">
      {notifications.map((n, i) => (
        <div key={i} className="rounded-lg bg-muted/50 p-4 border-l-4 border-primary/30">
          <div className="flex items-center justify-between mb-1">
            <Badge variant="secondary" className="text-xs">{n.channel}</Badge>
            <span className="text-xs text-muted-foreground">{n.time}</span>
          </div>
          <p className="text-sm mt-2">{n.message}</p>
        </div>
      ))}
    </div>
  </div>
);

export default AdminDashboard;
