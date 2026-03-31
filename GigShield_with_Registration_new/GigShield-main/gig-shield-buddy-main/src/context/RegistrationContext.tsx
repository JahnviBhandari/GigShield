import { createContext, useContext, useState, ReactNode } from "react";

// 🔥 REUSABLE TYPES (BEST PRACTICE)
export type PlatformType = "Zomato" | "Swiggy" | "";
export type VehicleType =
  | "Two-Wheeler"
  | "Three-Wheeler"
  | "Bicycle"
  | "Four-Wheeler"
  | "";

// 🔥 MAIN DATA TYPE
type RegistrationData = {
  phone: string;
  platform: PlatformType;
  city: string;
  zone?: string;
  vehicleType: VehicleType;
  upi?: string;
  language?: string;
  coverage?: string;

  // 📍 GPS DATA
  latitude?: number;
  longitude?: number;
};

// 🔥 CONTEXT TYPE
type RegistrationContextType = {
  data: RegistrationData;
  updateData: (newData: Partial<RegistrationData>) => void;
  nextStep: () => void;
  prevStep: () => void;
  currentStep: number;
};

// 🔥 DEFAULT VALUES (VERY IMPORTANT)
const defaultData: RegistrationData = {
  phone: "",
  platform: "",
  city: "",
  zone: "",
  vehicleType: "",
  latitude: undefined,
  longitude: undefined,
};

// 🔥 CREATE CONTEXT
const RegistrationContext = createContext<RegistrationContextType | undefined>(
  undefined
);

// 🔥 PROVIDER
export const RegistrationProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [data, setData] = useState<RegistrationData>(defaultData);
  const [currentStep, setCurrentStep] = useState(1);

  // 🔥 UPDATE FUNCTION
  const updateData = (newData: Partial<RegistrationData>) => {
    setData((prev) => ({
      ...prev,
      ...newData,
    }));
  };

  // 🔥 STEP CONTROL
  const nextStep = () => setCurrentStep((prev) => prev + 1);
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  return (
    <RegistrationContext.Provider
      value={{ data, updateData, nextStep, prevStep, currentStep }}
    >
      {children}
    </RegistrationContext.Provider>
  );
};

// 🔥 HOOK
export const useRegistration = () => {
  const context = useContext(RegistrationContext);
  if (!context) {
    throw new Error(
      "useRegistration must be used within RegistrationProvider"
    );
  }
  return context;
};