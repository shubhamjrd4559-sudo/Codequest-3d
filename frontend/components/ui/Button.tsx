"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-2xl font-semibold transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-purple-400 disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer active:scale-[0.97] hover:scale-[1.02]",
  {
    variants: {
      variant: {
        primary:
          "bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 text-white shadow-neon-purple hover:shadow-[0_0_30px_rgba(139,92,246,0.65)] hover:from-purple-500 hover:to-indigo-500 border border-purple-400/30",
        amber:
          "bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 text-slate-950 font-bold shadow-neon-amber hover:shadow-[0_0_30px_rgba(245,158,11,0.65)] hover:from-amber-300 hover:to-orange-400 border border-amber-300/40",
        cyan:
          "bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 text-white shadow-neon-cyan hover:shadow-[0_0_30px_rgba(6,182,212,0.65)] border border-cyan-400/30",
        emerald:
          "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-neon-emerald hover:shadow-[0_0_30px_rgba(16,185,129,0.65)] border border-emerald-400/30",
        secondary:
          "bg-white/[0.08] text-white hover:bg-white/[0.14] border border-white/15 backdrop-blur-xl shadow-glass-sm",
        ghost:
          "text-slate-300 hover:text-white hover:bg-purple-600/15 border border-transparent",
        destructive:
          "bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30 shadow-[0_0_20px_rgba(244,63,94,0.3)]",
      },
      size: {
        sm: "h-9 px-3.5 text-xs rounded-xl gap-1.5",
        md: "h-11 px-5 text-sm rounded-2xl gap-2",
        lg: "h-13 px-7 text-base rounded-2xl gap-2.5",
        icon: "h-11 w-11 p-0 rounded-2xl",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
