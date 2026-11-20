"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Calculator,
  Gamepad2,
  Flame,
  Star,
  Trophy,
  ArrowRight,
  TrendingUp,
  Search,
  Bell,
  Play,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { BoyCharacter } from "@/components/characters/BoyCharacter";
import { FloatingIsland } from "@/components/characters/FloatingIsland";
import { AchievementItem } from "@/components/illustrations/AchievementIcon";

// Placeholder stat data — ready for API integration
const stats = [
  {
    id: "dsa",
    label: "DSA Progress",
    value: "—",
    delta: "+0%",
    variant: "glowCyan" as const,
    badgeVariant: "cyan" as const,
    icon: Calculator,
    iconBg: "bg-blue-600/20 border-blue-400/30 text-blue-400 shadow-neon-cyan",
  },
  {
    id: "games",
    label: "Games Played",
    value: "—",
    delta: "+0",
    variant: "glowEmerald" as const,
    badgeVariant: "success" as const,
    icon: Gamepad2,
    iconBg:
      "bg-emerald-600/20 border-emerald-400/30 text-emerald-400 shadow-neon-emerald",
  },
  {
    id: "streak",
    label: "Current Streak",
    value: "—",
    delta: "+0",
    variant: "glowAmber" as const,
    badgeVariant: "warning" as const,
    icon: Flame,
    iconBg:
      "bg-amber-600/20 border-amber-400/30 text-amber-400 shadow-neon-amber",
  },
  {
    id: "xp",
    label: "Total XP",
    value: "—",
    delta: "+0",
    variant: "glowPurple" as const,
    badgeVariant: "purple" as const,
    icon: Star,
    iconBg:
      "bg-purple-600/20 border-purple-400/30 text-purple-400 shadow-neon-purple",
  },
];

export default function StudentDashboardPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
              Welcome back,{" "}
              <span className="bg-gradient-to-r from-amber-300 via-yellow-300 to-orange-400 bg-clip-text text-transparent">
                Champion!
              </span>{" "}
              👋
            </h1>
          </div>
          <p className="text-sm text-slate-300 mt-1">
            Keep learning, keep playing, and reach new heights! 🚀
          </p>
        </div>

        {/* Right Header Controls */}
        <div className="flex items-center gap-3">
          <div className="relative hidden lg:block w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search topics, games..."
              className="w-full h-10 pl-10 pr-4 rounded-2xl bg-white/[0.05] border border-white/10 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-purple-500/50 transition-all"
            />
          </div>

          <button
            aria-label="Notifications"
            className="relative p-2.5 rounded-2xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-slate-300 hover:text-white transition-colors"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
              2
            </span>
          </button>

          <div className="flex items-center gap-2.5 pl-1">
            <div className="relative w-10 h-10 rounded-2xl p-0.5 bg-gradient-to-tr from-cyan-400 via-purple-500 to-pink-500 shadow-neon-purple">
              <div className="w-full h-full rounded-[14px] bg-[#0c0e24] flex items-center justify-center overflow-hidden">
                <span className="font-extrabold text-sm text-amber-300">S</span>
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-[#0c0e24] shadow-[0_0_8px_#10B981]" />
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          HERO BANNER — matches reference image (boy + castle island)
      ═══════════════════════════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative rounded-3xl overflow-hidden border border-white/15 shadow-glass-lg"
        style={{ minHeight: 220 }}
      >
        {/* Sky gradient background */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0d1040] via-[#1a1060] to-[#2a0a6e]" />
        {/* Purple/blue nebula blobs */}
        <div className="absolute top-0 left-0 w-72 h-72 rounded-full bg-purple-700/30 blur-[80px] pointer-events-none" />
        <div className="absolute bottom-0 right-32 w-64 h-64 rounded-full bg-cyan-600/15 blur-[90px] pointer-events-none" />
        <div className="absolute top-4 right-10 w-48 h-48 rounded-full bg-pink-600/15 blur-[70px] pointer-events-none" />

        {/* Floating Island — far right background */}
        <div className="absolute right-0 top-0 h-full w-1/2 lg:w-2/5 pointer-events-none select-none">
          <FloatingIsland className="absolute right-[-5%] top-[-10%] w-full h-[130%]" />
        </div>

        {/* Boy Character — center-right, in front of island */}
        <div className="absolute right-[6%] lg:right-[14%] bottom-0 h-[115%] w-40 lg:w-56 pointer-events-none select-none flex items-end">
          <BoyCharacter className="w-full h-full" />
        </div>

        {/* Content — left side */}
        <div className="relative z-10 p-6 lg:p-8 max-w-lg space-y-4">
          {/* Continue Learning badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-500/25 border border-purple-400/40 text-purple-200 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
            <Play className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
            Continue Learning
          </div>

          {/* Topic title — generic placeholder */}
          <div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Your Next Topic
            </h2>
            <p className="text-sm text-slate-300 mt-1 font-medium">
              Learn · Practice · Play
            </p>
          </div>

          {/* Progress bar */}
          <div className="space-y-1.5 max-w-xs">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-300">Course Progress</span>
              <span className="text-cyan-300">—%</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-emerald-400 shadow-[0_0_12px_rgba(6,182,212,0.6)] transition-all duration-700"
                style={{ width: "0%" }}
              />
            </div>
          </div>

          {/* CTA */}
          <div className="pt-1">
            <Link href="/topics/arrays">
              <Button variant="primary" size="md" className="gap-2 font-bold px-6">
                Continue <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Stars/sparkles decoration */}
        {[
          { x: "15%", y: "12%", size: 6, delay: 0 },
          { x: "35%", y: "5%", size: 4, delay: 0.4 },
          { x: "60%", y: "8%", size: 5, delay: 0.8 },
        ].map((star, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white pointer-events-none"
            style={{
              left: star.x,
              top: star.y,
              width: star.size,
              height: star.size,
              boxShadow: `0 0 ${star.size * 3}px white`,
            }}
            animate={{ opacity: [0.4, 1, 0.4], scale: [0.8, 1.2, 0.8] }}
            transition={{
              repeat: Infinity,
              duration: 2.5,
              delay: star.delay,
              ease: "easeInOut",
            }}
          />
        ))}
      </motion.div>

      {/* ═══════════════════════════════════════════════════════════════
          4 STAT CARDS — ready for API data
      ═══════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.id}
              variant={stat.variant}
              className="p-5 flex flex-col justify-between relative group cursor-default"
            >
              <div className="flex items-center justify-between">
                <div
                  className={`w-12 h-12 rounded-2xl border flex items-center justify-center ${stat.iconBg}`}
                >
                  <Icon
                    className={`w-6 h-6 ${stat.id === "streak" ? "fill-amber-400" : stat.id === "xp" ? "fill-purple-400" : ""}`}
                  />
                </div>
                <Badge variant={stat.badgeVariant} size="sm" className="font-bold">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {stat.delta}
                </Badge>
              </div>
              <div className="mt-4">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  {stat.label}
                </p>
                <p className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
                  {stat.value}
                </p>
              </div>
            </Card>
          );
        })}
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          RECENT ACHIEVEMENTS — generic placeholders
      ═══════════════════════════════════════════════════════════════ */}
      <Card variant="default" className="p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400">
              <Trophy className="w-4 h-4" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Recent Achievements
            </h3>
          </div>
          <Link
            href="/dashboard"
            className="text-xs font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors"
          >
            View All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <AchievementItem id="solver" title="Problem Solver" xp="+100 XP" />
          <AchievementItem id="champion" title="Game Champion" xp="+200 XP" />
          <AchievementItem id="master" title="DSA Master" xp="+500 XP" />
          <AchievementItem id="learner" title="Quick Learner" xp="+100 XP" />
        </div>
      </Card>

      {/* Mobile bottom padding so content clears the bottom nav */}
      <div className="h-6 lg:hidden" />
    </div>
  );
}
