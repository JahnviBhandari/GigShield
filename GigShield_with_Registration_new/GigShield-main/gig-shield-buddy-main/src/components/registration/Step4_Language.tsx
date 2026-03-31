import { useState } from "react";
import { ArrowRight, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRegistration } from "@/context/RegistrationContext";

const languages = [
  { id: "Hindi", flag: "🇮🇳", script: "हिंदी" },
  { id: "Tamil", flag: "🇮🇳", script: "தமிழ்" },
  { id: "Kannada", flag: "🇮🇳", script: "ಕನ್ನಡ" },
  { id: "Telugu", flag: "🇮🇳", script: "తెలుగు" },
  { id: "Bengali", flag: "🇮🇳", script: "বাংলা" },
  { id: "Marathi", flag: "🇮🇳", script: "मराठी" },
];

const hours = [
  { id: "Morning", label: "Morning", time: "6am – 12pm", icon: "🌅" },
  { id: "Afternoon", label: "Afternoon", time: "12pm – 6pm", icon: "☀️" },
  { id: "Evening", label: "Evening", time: "6pm – 11pm", icon: "🌆" },
  { id: "Night", label: "Night", time: "11pm – 6am", icon: "🌙" },
  { id: "AllDay", label: "All Day", time: "Full day", icon: "⏰" },
];

const Step4_Language = () => {
  const { data, updateData, nextStep } = useRegistration();
  const [lang, setLang] = useState(data.language);
  const [workHours, setWorkHours] = useState(data.workingHours);
  const [error, setError] = useState("");

  const handleNext = () => {
    if (!lang) { setError("Please select your preferred language"); return; }
    if (!workHours) { setError("Please select your working hours"); return; }
    updateData({ language: lang, workingHours: workHours });
    nextStep();
  };

  // Sample notification preview
  const notificationPreview: Record<string, string> = {
    Hindi: "नमस्ते! 🌧️ ₹180 आपके UPI में आ गया। Safe रहें! 🙏",
    Tamil: "வணக்கம்! 🌧️ ₹180 உங்கள் UPI-ல் வந்துவிட்டது 🙏",
    Kannada: "ನಮಸ್ಕಾರ! 🌧️ ₹180 ನಿಮ್ಮ UPI ಗೆ ಬಂದಿದೆ 🙏",
    Telugu: "నమస్కారం! 🌧️ ₹180 మీ UPI లో వచ్చింది 🙏",
    Bengali: "নমস্কার! 🌧️ ₹180 আপনার UPI-তে এসেছে 🙏",
    Marathi: "नमस्कार! 🌧️ ₹180 तुमच्या UPI मध्ये आले 🙏",
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-purple-100 mb-4">
          <Globe className="h-7 w-7 text-purple-600" />
        </div>
        <h2 className="text-xl font-bold text-foreground">Your Preferences</h2>
        <p className="text-sm text-muted-foreground mt-1">We'll communicate with you in your language</p>
      </div>

      {/* Language */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Preferred Language</label>
        <div className="grid grid-cols-3 gap-2">
          {languages.map((l) => (
            <button
              key={l.id}
              onClick={() => setLang(l.id)}
              className={`rounded-lg border p-3 text-center transition-all ${
                lang === l.id
                  ? "border-primary bg-primary/10 ring-1 ring-primary"
                  : "border-border bg-background hover:border-primary/40"
              }`}
            >
              <div className="text-lg mb-0.5">{l.flag}</div>
              <div className="text-xs font-bold">{l.id}</div>
              <div className="text-xs text-muted-foreground">{l.script}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Notification preview */}
      {lang && (
        <div className="rounded-lg bg-green-50 border border-green-200 p-3 animate-fade-in">
          <p className="text-xs font-medium text-green-800 mb-1">📱 Your WhatsApp notification will look like:</p>
          <div className="rounded-lg bg-white border border-green-100 p-2.5">
            <p className="text-sm text-foreground">{notificationPreview[lang]}</p>
          </div>
        </div>
      )}

      {/* Working Hours */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Working Hours</label>
        <div className="grid grid-cols-2 gap-2">
          {hours.map((h) => (
            <button
              key={h.id}
              onClick={() => setWorkHours(h.id)}
              className={`rounded-lg border p-3 text-left transition-all ${
                workHours === h.id
                  ? "border-primary bg-primary/10 ring-1 ring-primary"
                  : "border-border bg-background hover:border-primary/40"
              } ${h.id === "AllDay" ? "col-span-2" : ""}`}
            >
              <span className="text-lg mr-2">{h.icon}</span>
              <span className="text-sm font-medium">{h.label}</span>
              <span className="text-xs text-muted-foreground ml-1">({h.time})</span>
            </button>
          ))}
        </div>
      </div>

      {error && <p className="text-xs text-destructive text-center">{error}</p>}

      <Button onClick={handleNext} className="w-full bg-gradient-primary">
        Continue <ArrowRight className="h-4 w-4 ml-2" />
      </Button>
    </div>
  );
};

export default Step4_Language;
