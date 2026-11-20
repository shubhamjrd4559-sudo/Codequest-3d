"use client";

import React from "react";
import { Star, Crown, Code2, Award } from "lucide-react";
import { cn } from "@/lib/utils";

interface AchievementItemProps {
  id: "solver" | "champion" | "master" | "learner" | string;
  title: string;
  xp: string;
  className?: string;
}

export function AchievementItem({ id, title, xp, className }: AchievementItemProps) {
  const configs: Record<string, {
    gradient: string;
    border: string;
    shadow: string;
    icon: React.ElementType;
    textColor: string;
    bgTint: string;
  }> = {
    solver: {
      gradient: "from-amber-400 via-yellow-500 to-amber-600",
      border: "border-amber-400/40",
      shadow: "shadow-neon-amber",
      icon: Star,
      textColor: "text-amber-300",
      bgTint: "bg-amber-950/20",
    },
    champion: {
      gradient: "from-purple-500 via-indigo-600 to-violet-700",
      border: "border-purple-400/40",
      shadow: "shadow-neon-purple",
      icon: Crown,
      textColor: "text-purple-300",
      bgTint: "bg-purple-950/20",
    },
    master: {
      gradient: "from-emerald-400 via-teal-500 to-cyan-600",
      border: "border-emerald-400/40",
      shadow: "shadow-neon-emerald",
      icon: Code2,
      textColor: "text-emerald-300",
      bgTint: "bg-emerald-950/20",
    },
    learner: {
      gradient: "from-rose-400 via-orange-500 to-amber-600",
      border: "border-orange-400/40",
      shadow: "shadow-[0_0_20px_rgba(249,115,22,0.4)]",
      icon: Award,
      textColor: "text-orange-300",
      bgTint: "bg-orange-950/20",
    },
  };

  const conf = configs[id] || configs.solver;
  const Icon = conf.icon;

  return (
    <div
      className={cn(
        "flex items-center gap-3.5 p-3 sm:p-4 rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-200 group hover:-translate-y-0.5",
        conf.bgTint,
        className
      )}
    >
      {/* Hexagonal glowing medal icon */}
      <div
        className={cn(
          "relative w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr flex items-center justify-center p-0.5 shrink-0 transition-transform group-hover:scale-105",
          conf.gradient,
          conf.shadow
        )}
      >
        <div className="w-full h-full rounded-[14px] bg-[#0c0e26] flex items-center justify-center">
          <Icon className={cn("w-5 h-5 sm:w-6 sm:h-6 text-white")} />
        </div>
      </div>

      {/* Title & XP */}
      <div className="min-w-0">
        <p className="text-xs sm:text-sm font-bold text-white truncate group-hover:text-purple-200 transition-colors">
          {title}
        </p>
        <p className={cn("text-[11px] sm:text-xs font-extrabold tracking-wide", conf.textColor)}>
          {xp}
        </p>
      </div>
    </div>
  );
}
