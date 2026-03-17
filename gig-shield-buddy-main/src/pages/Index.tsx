import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import ProblemSection from "@/components/landing/ProblemSection";
import SolutionSection from "@/components/landing/SolutionSection";
import FeaturesShowcase from "@/components/landing/FeaturesShowcase";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import ArchitectureSection from "@/components/landing/ArchitectureSection";
import { Shield } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <FeaturesShowcase />
      <HowItWorksSection />
      <ArchitectureSection />
      <footer className="bg-gradient-hero py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Shield className="h-5 w-5 text-primary" />
            <span className="font-bold" style={{ color: 'hsl(0 0% 90%)' }}>GigShield</span>
          </div>
          <p className="text-sm" style={{ color: 'hsl(220 14% 50%)' }}>AI-Powered Parametric Insurance for Gig Workers</p>
          <p className="text-xs mt-2" style={{ color: 'hsl(220 14% 40%)' }}>Demo Project • Built for Hackathon Showcase</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
