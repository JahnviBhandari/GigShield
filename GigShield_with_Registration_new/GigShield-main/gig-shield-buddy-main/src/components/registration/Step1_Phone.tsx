import { useState } from "react";
import { MessageCircle, ArrowRight, Loader2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRegistration } from "@/context/RegistrationContext";
import { sendOTP, verifyOTP, getStoredOTPForDemo } from "@/services/otpService";

const Step1_Phone = () => {
  const { data, updateData, nextStep } = useRegistration();
  const [phone, setPhone] = useState(data.phone);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState("");
  const [statusMsg, setStatusMsg] = useState("");
  const [showDemoOtp, setShowDemoOtp] = useState(false);
  const [demoOtp, setDemoOtp] = useState("");

  const handleSendOtp = async () => {
    if (phone.length < 10) { setError("Please enter a valid 10-digit number"); return; }
    setError(""); setLoading(true);
    const result = await sendOTP(phone);
    setLoading(false);
    if (result.success) {
      setOtpSent(true);
      setDemoOtp(getStoredOTPForDemo());
      setStatusMsg(result.message.includes("OTP") ? "Demo mode — click 👁️ to see OTP" : "OTP sent!");
    } else {
      setError("Failed to send OTP. Please try again.");
    }
  };

  const handleOtpChange = (val: string, idx: number) => {
    if (!/^\d?$/.test(val)) return;
    const updated = [...otp];
    updated[idx] = val;
    setOtp(updated);
    if (val && idx < 3) document.getElementById(`otp-${idx + 1}`)?.focus();
    if (val && idx === 3 && updated.every((d) => d)) handleVerifyCode(updated.join(""));
  };

  const handleVerifyCode = (code: string) => {
    setLoading(true); setError("");
    setTimeout(() => {
      const valid = verifyOTP(phone, code);
      setLoading(false);
      if (valid) {
        setVerified(true);
        updateData({ phone });
        setTimeout(() => nextStep(), 900);
      } else {
        setError("Incorrect OTP. Please try again.");
        setOtp(["", "", "", ""]);
        document.getElementById("otp-0")?.focus();
      }
    }, 800);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-green-100 mb-4">
          <MessageCircle className="h-7 w-7 text-green-600" />
        </div>
        <h2 className="text-xl font-bold text-foreground">Enter Your Phone Number</h2>
        <p className="text-sm text-muted-foreground mt-1">We'll send a 4-digit OTP to verify your number</p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Mobile Number</label>
        <div className="flex gap-2">
          <div className="flex items-center px-3 rounded-lg border border-border bg-muted text-sm font-medium text-muted-foreground">🇮🇳 +91</div>
          <Input type="tel" placeholder="9876543210" value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
            className="flex-1 text-base tracking-widest" disabled={otpSent} />
        </div>
        {error && !otpSent && <p className="text-xs text-destructive">{error}</p>}
      </div>

      {!otpSent && (
        <Button onClick={handleSendOtp} className="w-full bg-gradient-primary" disabled={loading || phone.length < 10}>
          {loading ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />Sending...</> : <><MessageCircle className="h-4 w-4 mr-2" />Send OTP</>}
        </Button>
      )}

      {otpSent && !verified && (
        <div className="space-y-4">
          <div className="rounded-lg bg-green-50 border border-green-200 p-3">
            <div className="flex items-start justify-between">
              <div className="flex gap-2">
                <span>📱</span>
                <div>
                  <p className="text-sm font-medium text-green-800">OTP Sent to +91 {phone}</p>
                  {statusMsg && <p className="text-xs text-green-600 mt-0.5">{statusMsg}</p>}
                </div>
              </div>
              {demoOtp && (
                <button onClick={() => setShowDemoOtp(!showDemoOtp)} className="text-green-600 ml-2">
                  {showDemoOtp ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              )}
            </div>
            {showDemoOtp && demoOtp && (
              <div className="mt-2 rounded bg-white border border-green-200 px-3 py-1.5 flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Your OTP:</span>
                <span className="text-lg font-bold tracking-widest text-primary">{demoOtp}</span>
              </div>
            )}
          </div>

          <div>
            <label className="text-sm font-medium">Enter 4-digit OTP</label>
            <div className="flex gap-3 mt-2 justify-center">
              {otp.map((digit, idx) => (
                <input key={idx} id={`otp-${idx}`} type="text" inputMode="numeric" maxLength={1} value={digit}
                  onChange={(e) => handleOtpChange(e.target.value, idx)}
                  onKeyDown={(e) => { if (e.key === "Backspace" && !digit && idx > 0) document.getElementById(`otp-${idx - 1}`)?.focus(); }}
                  className={`w-12 h-12 text-center text-xl font-bold rounded-lg border-2 focus:outline-none bg-background transition-colors ${
                    error ? "border-destructive" : digit ? "border-primary bg-primary/5" : "border-border focus:border-primary"}`}
                />
              ))}
            </div>
            {error && <p className="text-xs text-destructive text-center mt-2">{error}</p>}
            {loading && <div className="flex justify-center gap-2 mt-2"><Loader2 className="h-4 w-4 animate-spin text-primary" /><span className="text-xs text-muted-foreground">Verifying...</span></div>}
          </div>

          <Button onClick={() => handleVerifyCode(otp.join(""))} className="w-full bg-gradient-primary" disabled={otp.some((d) => !d) || loading}>
            {loading ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />Verifying...</> : <><ArrowRight className="h-4 w-4 mr-2" />Verify OTP</>}
          </Button>

          <div className="text-center">
            <span className="text-xs text-muted-foreground">Didn't receive it? </span>
            <button onClick={handleSendOtp} className="text-xs text-primary font-medium underline" disabled={loading}>Resend OTP</button>
          </div>
        </div>
      )}

      {verified && (
        <div className="rounded-lg bg-green-50 border border-green-200 p-4 text-center space-y-1">
          <span className="text-3xl">✅</span>
          <p className="text-sm font-bold text-green-800">Phone Verified!</p>
          <p className="text-xs text-green-600">+91 {phone} · Moving to next step...</p>
        </div>
      )}
    </div>
  );
};

export default Step1_Phone;
