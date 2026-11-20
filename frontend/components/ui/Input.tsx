"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, hint, leftIcon, rightIcon, id, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;

    return (
      <div className="w-full space-y-2">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-semibold uppercase tracking-wider text-slate-300"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="pointer-events-none absolute left-4 flex items-center text-slate-400">
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            type={type}
            ref={ref}
            className={cn(
              "flex h-12 w-full rounded-2xl bg-white/[0.05] px-4 py-2 text-sm text-white placeholder:text-slate-500",
              "border border-white/10 backdrop-blur-xl transition-all duration-200 outline-none",
              "focus:border-purple-500/60 focus:bg-white/[0.08] focus:ring-4 focus:ring-purple-500/20",
              "disabled:cursor-not-allowed disabled:opacity-50",
              leftIcon && "pl-11",
              rightIcon && "pr-11",
              error && "border-rose-500/60 focus:border-rose-500 focus:ring-rose-500/20 text-rose-200",
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-4 flex items-center text-slate-400">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p className="text-xs text-rose-400 flex items-center gap-1 font-medium">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-rose-400" />
            {error}
          </p>
        )}
        {hint && !error && (
          <p className="text-xs text-slate-400">{hint}</p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";
