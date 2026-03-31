import { Shield, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { RegistrationProvider, useRegistration } from "@/context/RegistrationContext";
import Step1_Phone from "@/components/registration/Step1_Phone";
import Step2_Platform from "@/components/registration/Step2_Platform";
import Step3_UPI from "@/components/registration/Step3_UPI";
import Step4_Language from "@/components/registration/Step4_Language";
import Step5_Coverage from "@/components/registration/Step5_Coverage";
import Step6_TimeTravel from "@/components/registration/Step6_TimeTravel";

const steps = [
  { num: 1, label: "Phone" },
  { num: 2, label: "Platform" },
  { num: 3, label: "UPI" },
  { num: 4, label: "Language" },
  { num: 5, label: "Coverage" },
  { num: 6, label: "History" },
];

const RegistrationContent = () => {
  const { currentStep, prevStep } = useRegistration();

  return (
    <div className="min-h-screen bg-background max-w-md mx-auto flex flex-col">
      {/* Header */}
      <div className="bg-gradient-primary p-4 flex items-center justify-between">
        {currentStep > 1 && currentStep < 6 ? (
          <button onClick={prevStep} className="text-primary-foreground">
            <ArrowLeft className="h-5 w-5" />
          </button>
        ) : (
          <Link to="/" className="text-primary-foreground">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        )}
        <div className="flex items-center gap-2 text-primary-foreground font-bold">
          <Shield className="h-5 w-5" /> GigShield
        </div>
        <div className="text-xs text-primary-foreground/70 font-medium">
          {currentStep}/6
        </div>
      </div>

      {/* Progress Bar */}
      <div className="px-4 pt-4 pb-2">
        <div className="flex gap-1.5 mb-3">
          {steps.map((s) => (
            <div
              key={s.num}
              className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                s.num <= currentStep ? "bg-primary" : "bg-muted"
              }`}
            />
          ))}
        </div>
        <div className="flex justify-between">
          {steps.map((s) => (
            <div
              key={s.num}
              className={`text-xs transition-colors ${
                s.num === currentStep ? "text-primary font-bold" : s.num < currentStep ? "text-primary/60" : "text-muted-foreground"
              }`}
            >
              {s.label}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="flex-1 px-4 py-4 overflow-y-auto">
        {currentStep === 1 && <Step1_Phone />}
        {currentStep === 2 && <Step2_Platform />}
        {currentStep === 3 && <Step3_UPI />}
        {currentStep === 4 && <Step4_Language />}
        {currentStep === 5 && <Step5_Coverage />}
        {currentStep === 6 && <Step6_TimeTravel />}
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-border text-center">
        <p className="text-xs text-muted-foreground">
          🔒 Your data is secure · Zero forms · Coverage starts instantly
        </p>
      </div>
    </div>
  );
};

const RegisterPage = () => (
  <RegistrationProvider>
    <RegistrationContent />
  </RegistrationProvider>
);

export default RegisterPage;
