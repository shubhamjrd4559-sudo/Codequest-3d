import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold tracking-wide transition-colors select-none",
  {
    variants: {
      variant: {
        default:
          "bg-white/10 text-slate-200 border border-white/15 backdrop-blur-md",
        success:
          "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.25)]",
        warning:
          "bg-amber-500/15 text-amber-300 border border-amber-500/30 shadow-[0_0_12px_rgba(245,158,11,0.25)]",
        danger:
          "bg-rose-500/15 text-rose-300 border border-rose-500/30 shadow-[0_0_12px_rgba(244,63,94,0.25)]",
        purple:
          "bg-purple-500/15 text-purple-300 border border-purple-500/30 shadow-[0_0_12px_rgba(139,92,246,0.25)]",
        cyan:
          "bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-[0_0_12px_rgba(6,182,212,0.25)]",
        xp:
          "bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border border-amber-400/30 shadow-[0_0_14px_rgba(245,158,11,0.3)] font-bold",
      },
      size: {
        sm: "px-2 py-0.5 text-[10px]",
        md: "px-3 py-1 text-xs",
        lg: "px-3.5 py-1.5 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props} />
  );
}
