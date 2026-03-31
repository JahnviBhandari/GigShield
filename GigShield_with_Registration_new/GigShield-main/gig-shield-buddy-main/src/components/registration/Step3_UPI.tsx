import { useState } from "react";
import { Wallet, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRegistration } from "@/context/RegistrationContext";

const Step3_UPI = () => {
  const { data, updateData, nextStep } = useRegistration();
  const [upi, setUpi] = useState(data.upiId);
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [creditShown, setCreditShown] = useState(false);
  const [error, setError] = useState("");

  const upiSuggestions = [
    `${data.phone}@okaxis`,
    `${data.phone}@paytm`,
    `${data.phone}@ybl`,
  ];

  const handleVerify = () => {
    if (!upi || !upi.includes("@")) {
      setError("Please enter a valid UPI ID (e.g. 9876543210@okaxis)");
      return;
    }
    setError("");
    setVerifying(true);
    setTimeout(() => {
      setVerifying(false);
      setCreditShown(true);
      setTimeout(() => {
        setVerified(true);
        updateData({ upiId: upi });
      }, 1000);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-blue-100 mb-4">
          <Wallet className="h-7 w-7 text-blue-600" />
        </div>
        <h2 className="text-xl font-bold text-foreground">UPI Payment Setup</h2>
        <p className="text-sm text-muted-foreground mt-1">All payouts will be sent to this UPI ID</p>
      </div>

      {/* UPI Input */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Your UPI ID</label>
        <Input
          type="text"
          placeholder="yourname@okaxis"
          value={upi}
          onChange={(e) => setUpi(e.target.value)}
          disabled={verified || verifying}
          className="text-base"
        />
        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>

      {/* Suggestions */}
      {!verified && data.phone && (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground font-medium">Quick select:</p>
          <div className="flex flex-wrap gap-2">
            {upiSuggestions.map((s) => (
              <button
                key={s}
                onClick={() => setUpi(s)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                  upi === s ? "border-primary bg-primary/10 text-primary" : "border-border bg-muted/50 text-muted-foreground"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Verify Button */}
      {!verified && (
        <Button onClick={handleVerify} className="w-full bg-gradient-primary" disabled={verifying}>
          {verifying ? (
            <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Sending ₹1 test credit...</>
          ) : (
            <><Wallet className="h-4 w-4 mr-2" /> Verify UPI ID</>
          )}
        </Button>
      )}

      {/* Test credit animation */}
      {creditShown && !verified && (
        <div className="rounded-lg bg-blue-50 border border-blue-200 p-3 text-center animate-fade-in">
          <p className="text-2xl mb-1">💸</p>
          <p className="text-sm font-bold text-blue-800">₹1 test credit sent!</p>
          <p className="text-xs text-blue-600">Verifying your UPI account...</p>
        </div>
      )}

      {/* Verified */}
      {verified && (
        <div className="space-y-4">
          <div className="rounded-lg bg-green-50 border border-green-200 p-4 flex items-center gap-3">
            <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0" />
            <div>
              <p className="text-sm font-bold text-green-800">UPI Verified ✅</p>
              <p className="text-xs text-green-600 font-mono">{upi}</p>
            </div>
          </div>

          <div className="rounded-lg bg-muted/50 p-3 space-y-1">
            <p className="text-xs font-medium text-foreground">All disruption payouts will be credited here</p>
            <p className="text-xs text-muted-foreground">₹180 · ₹216 · ₹360 — automatically, within 58 seconds</p>
          </div>

          <Button onClick={nextStep} className="w-full bg-gradient-primary">
            Continue <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default Step3_UPI;
