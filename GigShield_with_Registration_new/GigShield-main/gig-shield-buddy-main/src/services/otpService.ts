// ─────────────────────────────────────────────────────────────
// OTP Service — uses Fast2SMS free tier
// Sign up free at: https://www.fast2sms.com
// Free plan gives 100 SMS/day — enough for hackathon demo
// ─────────────────────────────────────────────────────────────

// Generate a random 4-digit OTP
export const generateOTP = (): string => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

// Store OTP in memory (for verification)
let storedOTP: { code: string; phone: string; expiresAt: number } | null = null;

// Send OTP via Fast2SMS
export const sendOTP = async (phone: string): Promise<{ success: boolean; message: string }> => {
  const otp = generateOTP();
  const apiKey = import.meta.env.VITE_FAST2SMS_API_KEY;

  // Store OTP locally for verification (expires in 5 minutes)
  storedOTP = {
    code: otp,
    phone,
    expiresAt: Date.now() + 5 * 60 * 1000,
  };

  // If no API key configured — show OTP in console for demo
  if (!apiKey || apiKey === "your_fast2sms_api_key_here") {
    console.log(`📱 [DEMO MODE] OTP for ${phone}: ${otp}`);
    console.log(`Use this OTP in the registration form`);
    return {
      success: true,
      message: `Demo mode: OTP is ${otp} (check browser console)`,
    };
  }

  try {
    // Fast2SMS DLT route (works without DLT for dev)
    const response = await fetch(
      `https://www.fast2sms.com/dev/bulkV2?authorization=${apiKey}&route=otp&variables_values=${otp}&flash=0&numbers=${phone}`,
      { method: "GET" }
    );

    const data = await response.json();

    if (data.return === true) {
      return { success: true, message: "OTP sent successfully" };
    } else {
      // Fallback to demo mode if API fails
      console.log(`📱 [FALLBACK] OTP for ${phone}: ${otp}`);
      return { success: true, message: `OTP sent (check console if SMS fails): ${otp}` };
    }
  } catch {
    // Network error — use demo mode
    console.log(`📱 [OFFLINE] OTP for ${phone}: ${otp}`);
    return { success: true, message: `OTP: ${otp} (SMS unavailable in demo)` };
  }
};

// Verify OTP
export const verifyOTP = (phone: string, inputOTP: string): boolean => {
  if (!storedOTP) return false;
  if (storedOTP.phone !== phone) return false;
  if (Date.now() > storedOTP.expiresAt) return false;
  return storedOTP.code === inputOTP;
};

// Get stored OTP (for showing in UI during demo)
export const getStoredOTPForDemo = (): string => {
  return storedOTP?.code || "";
};
