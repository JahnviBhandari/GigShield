import { useState } from "react";
import { Link } from "react-router-dom";
import { Shield, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 backdrop-blur-md bg-card/80">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl">
          <Shield className="h-7 w-7 text-primary" />
          <span>GigShield</span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <a href="#problem" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Problem</a>
          <a href="#solution" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Solution</a>
          <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">How It Works</a>
          <a href="#architecture" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Architecture</a>
          <Link to="/worker">
            <Button variant="outline" size="sm">Worker Dashboard</Button>
          </Link>
          <Link to="/admin">
            <Button size="sm" className="bg-gradient-accent text-accent-foreground shadow-glow hover:opacity-90">Admin Dashboard</Button>
          </Link>
        </div>

        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-border bg-card p-4 space-y-3 animate-fade-in">
          <a href="#problem" className="block text-sm text-muted-foreground" onClick={() => setOpen(false)}>Problem</a>
          <a href="#solution" className="block text-sm text-muted-foreground" onClick={() => setOpen(false)}>Solution</a>
          <a href="#how-it-works" className="block text-sm text-muted-foreground" onClick={() => setOpen(false)}>How It Works</a>
          <Link to="/worker" className="block" onClick={() => setOpen(false)}>
            <Button variant="outline" size="sm" className="w-full">Worker Dashboard</Button>
          </Link>
          <Link to="/admin" className="block" onClick={() => setOpen(false)}>
            <Button size="sm" className="w-full">Admin Dashboard</Button>
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
