"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const cardVariants = cva(
  "relative rounded-3xl backdrop-blur-xl transition-all duration-300 overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "bg-[#0e112b]/65 border border-white/10 shadow-glass-md",
        subtle:
          "bg-white/[0.04] border border-white/10 shadow-glass-sm",
        interactive:
          "bg-[#0e112b]/70 border border-white/10 shadow-glass-md hover:border-purple-500/40 hover:shadow-neon-purple hover:-translate-y-1 cursor-pointer",
        glowPurple:
          "bg-gradient-to-br from-purple-950/40 via-[#0e112b]/70 to-[#0e112b]/90 border border-purple-500/30 shadow-[0_0_30px_rgba(139,92,246,0.18)] hover:border-purple-400/50 hover:shadow-neon-purple",
        glowCyan:
          "bg-gradient-to-br from-cyan-950/40 via-[#0e112b]/70 to-[#0e112b]/90 border border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.18)] hover:border-cyan-400/50 hover:shadow-neon-cyan",
        glowAmber:
          "bg-gradient-to-br from-amber-950/40 via-[#0e112b]/70 to-[#0e112b]/90 border border-amber-500/30 shadow-[0_0_30px_rgba(245,158,11,0.18)] hover:border-amber-400/50 hover:shadow-neon-amber",
        glowEmerald:
          "bg-gradient-to-br from-emerald-950/40 via-[#0e112b]/70 to-[#0e112b]/90 border border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.18)] hover:border-emerald-400/50 hover:shadow-neon-emerald",
        elevated:
          "bg-[#111438]/80 border border-white/15 shadow-glass-lg",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(cardVariants({ variant, className }))}
        {...props}
      >
        {/* Specular highlight border at top */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        {children}
      </div>
    );
  }
);
Card.displayName = "Card";

export function CardHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex flex-col space-y-1.5 p-6", className)}
      {...props}
    />
  );
}

export function CardTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn("text-xl font-bold tracking-tight text-white", className)}
      {...props}
    />
  );
}

export function CardDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("text-sm text-slate-400", className)}
      {...props}
    />
  );
}

export function CardContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-6 pt-0", className)} {...props} />;
}

export function CardFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex items-center p-6 pt-0", className)}
      {...props}
    />
  );
}
