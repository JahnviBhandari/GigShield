import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const Card = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-xl", className)}>
    {children}
  </div>
);

export const Button = ({ 
  children, 
  variant = 'primary', 
  className, 
  ...props 
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'ghost' | 'outline' }) => {
  const variants = {
    primary: "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25",
    secondary: "bg-white/10 hover:bg-white/20 text-white border border-white/20",
    ghost: "bg-transparent hover:bg-white/5 text-white/70 hover:text-white",
    outline: "bg-transparent border-2 border-blue-500 text-blue-400 hover:bg-blue-500/10"
  };

  return (
    <button 
      className={cn(
        "px-6 py-3 rounded-xl font-medium transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export const Input = ({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input 
    className={cn(
      "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all",
      className
    )}
    {...props}
  />
);

export const Badge = ({ children, variant = 'info' }: { children: React.ReactNode; variant?: 'success' | 'warning' | 'error' | 'info' }) => {
  const variants = {
    success: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
    warning: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
    error: "bg-rose-500/10 text-rose-400 border border-rose-500/20",
    info: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
  };

  return (
    <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider", variants[variant])}>
      {children}
    </span>
  );
};
