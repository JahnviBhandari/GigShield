import { useState, useEffect } from "react";
import { Clock, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRegistration } from "@/context/RegistrationContext";
import { useNavigate } from "react-router-dom";

const mockPastDisruptions = [
  { id: "RTC-001", icon: "🌧️", event: "Heavy Rain", zone: "Koramangala", date: "18 days ago", amount: 180 },
  { id: "RTC-002", icon: "💨", event: "Severe Pollution", zone: "Koramangala", date: "24 days ago", amount: 180 },
];

type Stage = "checking" | "found" | "crediting" | "done";

const Step6_TimeTravel = () => {
  const { data } = useRegistration();
  const navigate = useNavigate();
  const [stage, setStage] = useState<Stage>("checking");
  const [visibleCards, setVisibleCards] = useState(0);

  useEffect(() => {
    // Stage 1 — checking
    const t1 = setTimeout(() => setStage("found"), 2500);
    return () => clearTimeout(t1);
  }, []);

  useEffect(() => {
    if (stage === "found") {
      // Reveal cards one by one
      mockPastDisruptions.forEach((_, i) => {
        setTimeout(() => setVisibleCards(i + 1), i * 600 + 300);
      });
      const t2 = setTimeout(() => setStage("crediting"), 3000);
      return () => clearTimeout(t2);
    }
    if (stage === "crediting") {
      const t3 = setTimeout(() => setStage("done"), 2000);
      return () => clearTimeout(t3);
    }
  }, [stage]);

  const totalAmount = mockPastDisruptions.reduce((s, d) => s + d.amount, 0);

  const handleGoToDashboard = () => {
    // Save registration data to localStorage for dashboard use
    localStorage.setItem("gigshield_worker", JSON.stringify(data));
    navigate("/worker");
  };

  return (
    <div className="space-y-5">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-orange-100 mb-4">
          <Clock className="h-7 w-7 text-orange-600" />
        </div>
        <h2 className="text-xl font-bold text-foreground">Time Travel Claims ⏰</h2>
        <p className="text-sm text-muted-foreground mt-1">Checking your zone history before you joined...</p>
      </div>

      {/* Stage: Checking */}
      {stage === "checking" && (
        <div className="space-y-4">
          <div className="rounded-xl bg-muted/50 border border-border p-5 text-center">
            <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-3" />
            <p className="text-sm font-medium text-foreground">Scanning GPS history...</p>
            <p className="text-xs text-muted-foreground mt-1">Cross-referencing with NASA satellite data</p>
          </div>
          <div className="space-y-2">
            {["Fetching GPS zone history (last 30 days)...", "Cross-checking NASA IMERG satellite data...", "Matching disruption events in your zone..."].map((msg, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                <Loader2 className="h-3 w-3 animate-spin flex-shrink-0" />
                {msg}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stage: Found */}
      {(stage === "found" || stage === "crediting" || stage === "done") && (
        <div className="space-y-4">
          <div className="rounded-xl bg-orange-50 border border-orange-200 p-4 text-center">
            <p className="text-2xl mb-1">🎯</p>
            <p className="text-sm font-bold text-orange-800">
              We found {mockPastDisruptions.length} disruptions in your zone before you joined!
            </p>
            <p className="text-xs text-orange-600 mt-1">
              You experienced these unprotected. Here's what you deserved.
            </p>
          </div>

          {/* Disruption cards */}
          <div className="space-y-2">
            {mockPastDisruptions.slice(0, visibleCards).map((d) => (
              <div
                key={d.id}
                className="rounded-lg border border-orange-200 bg-white p-3 flex items-center justify-between animate-fade-in"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{d.icon}</span>
                  <div>
                    <p className="text-sm font-medium">{d.event}</p>
                    <p className="text-xs text-muted-foreground">
                      📍 {d.zone} · {d.date}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-green-600">₹{d.amount}</p>
                  <p className="text-xs text-muted-foreground">Owed to you</p>
                </div>
              </div>
            ))}
          </div>

          {/* Crediting */}
          {(stage === "crediting" || stage === "done") && (
            <div className="rounded-xl bg-green-50 border border-green-300 p-4 text-center animate-fade-in">
              {stage === "crediting" ? (
                <>
                  <Loader2 className="h-8 w-8 animate-spin text-green-600 mx-auto mb-2" />
                  <p className="text-sm font-bold text-green-800">Crediting ₹{totalAmount} to your UPI...</p>
                  <p className="text-xs text-green-600 font-mono mt-1">{data.upiId || "your-upi@bank"}</p>
                </>
              ) : (
                <>
                  <p className="text-4xl mb-2">🎉</p>
                  <p className="text-lg font-bold text-green-800">₹{totalAmount} Credited!</p>
                  <p className="text-sm text-green-600 mt-1">
                    Sent to {data.upiId || "your UPI"}
                  </p>
                  <div className="mt-3 rounded-lg bg-white border border-green-200 p-3">
                    <p className="text-xs text-green-800 italic">
                      "Welcome to GigShield. We noticed you went through {mockPastDisruptions.length} disruptions before joining us. Here's what you deserved. We've got your back — even in the past." 🙏
                    </p>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      )}

      {/* CTA */}
      {stage === "done" && (
        <div className="space-y-3">
          <div className="rounded-lg bg-primary/5 border border-primary/20 p-3 text-center">
            <p className="text-xs text-muted-foreground">Coverage starts now at</p>
            <p className="text-xl font-bold text-primary">₹{data.weeklyPremium}/week</p>
            <p className="text-xs text-muted-foreground">Zone: {data.zone}, {data.city}</p>
          </div>
          <Button onClick={handleGoToDashboard} className="w-full bg-gradient-primary text-base py-6">
            Go to My Dashboard <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default Step6_TimeTravel;
