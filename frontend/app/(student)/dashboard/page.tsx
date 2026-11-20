"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Bell,
  Play,
  ArrowRight,
  Trophy,
  Zap,
  Calendar,
  Lock,
  TrendingUp,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { dashboardApi } from "@/lib/api/dashboard";
import { DashboardSummary } from "@/lib/api/types";
import { HeroScene3D } from "@/components/illustrations/HeroScene3D";
import {
  GraduationBooks3D,
  GamepadTrophy3D,
  StreakFlameCalendar3D,
  XPStarGift3D,
  TreasureChest3D,
} from "@/components/illustrations/StatCardIcons";
import { QuickQuizSection } from "@/components/dashboard/QuickQuizSection";

export default function StudentDashboardPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function fetchDashboard() {
      if (!isAuthenticated) {
        return;
      }
      try {
        const data = await dashboardApi.getSummary();
        if (isMounted) {
          setSummary(data);
        }
      } catch (err) {
        console.error("Failed to load dashboard summary:", err);
      }
    }

    if (!authLoading) {
      fetchDashboard();
    }

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, authLoading]);

  // Derived real backend student data
  const displayName =
    summary?.student?.display_name ||
    user?.student_profile?.display_name ||
    user?.first_name ||
    user?.email?.split("@")[0] ||
    "Shubham";

  const userInitial = displayName.charAt(0).toUpperCase();

  // Progress metrics from backend
  const currentXp = summary?.current_xp ?? user?.student_profile?.total_xp ?? 0;
  const currentStreak = summary?.current_streak ?? user?.student_profile?.current_streak ?? 0;
  const gamesPlayed = summary?.recent_game_scores?.length ?? 0;

  // Calculate real DSA progress percentage
  const completedLessons = summary?.completed_lessons ?? 0;
  const totalLessons = summary?.total_published_lessons ?? 0;
  const dsaProgressPercent =
    totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-8">
      {/* ═══════════════════════════════════════════════════════════════
          TOP HEADER: GREETING & CURRENCY PILLS (STARS, GEMS, BELL, AVATAR)
      ═══════════════════════════════════════════════════════════════ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Welcome Text */}
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white flex items-center gap-2">
            Welcome back,{" "}
            <span className="text-[#FACC15] drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]">
              {displayName}!
            </span>{" "}
            <span className="text-3xl sm:text-4xl">👋</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-300 font-medium mt-1">
            Keep learning, keep coding, and reach new heights! 🚀
          </p>
        </div>

        {/* Top Right Controls & Gaming Currency Pills */}
        <div className="flex items-center gap-3">
          {/* Star Currency Pill */}
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-amber-500/20 border border-amber-400/40 shadow-[0_0_15px_rgba(245,158,11,0.25)] backdrop-blur-xl">
            <span className="text-base">⭐</span>
            <span className="text-xs sm:text-sm font-black text-amber-300">
              {300 + currentXp}
            </span>
          </div>

          {/* Diamond / Gem Currency Pill */}
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-purple-500/20 border border-purple-400/40 shadow-[0_0_15px_rgba(168,85,247,0.25)] backdrop-blur-xl">
            <span className="text-base">💎</span>
            <span className="text-xs sm:text-sm font-black text-purple-300">
              90
            </span>
          </div>

          {/* Notification Bell */}
          <button
            aria-label="Notifications"
            className="relative p-2.5 rounded-2xl bg-white/[0.08] hover:bg-white/[0.14] border border-white/15 text-slate-200 transition-colors shadow-glass-sm"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white text-[10px] font-extrabold flex items-center justify-center shadow-neon-pink">
              2
            </span>
          </button>

          {/* Glowing Circular Avatar */}
          <div className="relative w-10 h-10 rounded-full p-0.5 bg-gradient-to-tr from-cyan-400 via-purple-500 to-pink-500 shadow-neon-purple">
            <div className="w-full h-full rounded-full bg-[#0c0e24] flex items-center justify-center overflow-hidden border border-white/20">
              <span className="font-black text-sm text-amber-300">
                {userInitial}
              </span>
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-[#0c0e24] shadow-[0_0_8px_#10B981]" />
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          CONTINUE LEARNING HERO BANNER (BOY, ROBOT, FLOATING ISLAND, CASTLE)
      ═══════════════════════════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative rounded-[32px] overflow-hidden border-2 border-purple-500/30 shadow-[0_0_40px_rgba(139,92,246,0.3)] bg-gradient-to-r from-[#17144e]/95 via-[#231560]/90 to-[#120d3d]/95 p-6 sm:p-8 lg:p-9"
      >
        {/* Ambient Nebula Blobs */}
        <div className="absolute -top-10 -left-10 w-80 h-80 rounded-full bg-purple-600/30 blur-[100px] pointer-events-none" />
        <div className="absolute top-1/2 right-1/4 w-72 h-72 rounded-full bg-cyan-500/20 blur-[110px] pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left Text & CTA Column */}
          <div className="lg:col-span-6 z-10 space-y-4">
            {/* Tag Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1e1b4b]/80 border border-purple-400/40 text-purple-200 text-xs font-black uppercase tracking-wider shadow-neon-purple backdrop-blur-md">
              <Play className="w-3.5 h-3.5 text-[#FACC15] fill-[#FACC15]" />
              Continue Learning
            </div>

            {/* Course Title */}
            <div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                Arrays and{" "}
                <span className="text-[#FACC15] drop-shadow-[0_0_15px_rgba(250,204,21,0.4)]">
                  Searching
                </span>
              </h2>
              <p className="text-base sm:text-lg font-bold text-slate-300 mt-1">
                Learn • Practice • Play
              </p>
            </div>

            {/* Course Progress Bar */}
            <div className="space-y-2 max-w-sm pt-1">
              <div className="flex items-center justify-between text-xs sm:text-sm font-bold">
                <span className="text-slate-300">Course Progress</span>
                <span className="text-[#38BDF8] font-black">{dsaProgressPercent}%</span>
              </div>
              <div className="w-full h-3 rounded-full bg-white/15 overflow-hidden border border-white/10 p-0.5">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-purple-500 shadow-[0_0_15px_rgba(56,189,248,0.8)] transition-all duration-700"
                  style={{ width: `${Math.max(dsaProgressPercent, 3)}%` }}
                />
              </div>
            </div>

            {/* Bright Yellow / Gold CTA Button */}
            <div className="pt-2">
              <Link href="/topics/arrays">
                <button className="inline-flex items-center gap-3 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#FACC15] via-[#FBBF24] to-[#F59E0B] hover:from-[#FDE047] hover:to-[#FACC15] text-[#1E1B4B] font-black text-base shadow-[0_0_25px_rgba(250,204,21,0.5)] hover:scale-105 active:scale-95 transition-all duration-200">
                  Continue <ArrowRight className="w-5 h-5 stroke-[2.5]" />
                </button>
              </Link>
            </div>
          </div>

          {/* Right 3D Visual Illustration (Boy + Robot + Island + Castle) */}
          <div className="lg:col-span-6 relative flex items-center justify-center min-h-[220px] sm:min-h-[260px]">
            <HeroScene3D className="w-full max-w-lg" />
          </div>
        </div>
      </motion.div>

      {/* ═══════════════════════════════════════════════════════════════
          THE 4 VIBRANT STAT CARDS (GLOSSY NEON GRADIENTS)
      ═══════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. BLUE CARD: DSA Progress */}
        <div className="relative rounded-3xl p-5 bg-gradient-to-br from-[#0c3b6d]/90 via-[#0a4d8c]/80 to-[#041f3f]/95 border-2 border-[#38bdf8]/50 shadow-[0_0_25px_rgba(56,189,248,0.25)] flex items-center justify-between overflow-hidden group hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-center gap-3.5">
            <GraduationBooks3D className="w-14 h-14 shrink-0" />
            <div>
              <p className="text-xs font-bold text-sky-200 tracking-wide">
                DSA Progress
              </p>
              <p className="text-3xl font-black text-white tracking-tight mt-0.5">
                {dsaProgressPercent}%
              </p>
            </div>
          </div>
          <div className="w-8 h-8 rounded-xl bg-sky-400/20 border border-sky-400/30 flex items-center justify-center text-sky-300 shadow-neon-cyan">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>

        {/* 2. GREEN CARD: Games Played */}
        <div className="relative rounded-3xl p-5 bg-gradient-to-br from-[#064e3b]/90 via-[#059669]/80 to-[#022c22]/95 border-2 border-[#34d399]/50 shadow-[0_0_25px_rgba(52,211,153,0.25)] flex items-center justify-between overflow-hidden group hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-center gap-3.5">
            <GamepadTrophy3D className="w-14 h-14 shrink-0" />
            <div>
              <p className="text-xs font-bold text-emerald-200 tracking-wide">
                Games Played
              </p>
              <p className="text-3xl font-black text-white tracking-tight mt-0.5">
                {gamesPlayed}
              </p>
            </div>
          </div>
          <div className="text-2xl drop-shadow-[0_2px_8px_rgba(250,204,21,0.5)]">
            🏆
          </div>
        </div>

        {/* 3. ORANGE CARD: Current Streak */}
        <div className="relative rounded-3xl p-5 bg-gradient-to-br from-[#7c2d12]/90 via-[#ea580c]/80 to-[#431407]/95 border-2 border-[#fb923c]/50 shadow-[0_0_25px_rgba(251,146,60,0.25)] flex items-center justify-between overflow-hidden group hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-center gap-3.5">
            <StreakFlameCalendar3D className="w-14 h-14 shrink-0" />
            <div>
              <p className="text-xs font-bold text-amber-200 tracking-wide">
                Current Streak
              </p>
              <p className="text-3xl font-black text-white tracking-tight mt-0.5">
                {currentStreak} {currentStreak === 1 ? "Day" : "Days"}
              </p>
            </div>
          </div>
          <div className="text-2xl drop-shadow-[0_2px_8px_rgba(245,158,11,0.5)]">
            📅
          </div>
        </div>

        {/* 4. PURPLE CARD: Total XP */}
        <div className="relative rounded-3xl p-5 bg-gradient-to-br from-[#581c87]/90 via-[#7c3aed]/80 to-[#2e1065]/95 border-2 border-[#c084fc]/50 shadow-[0_0_25px_rgba(192,132,252,0.25)] flex items-center justify-between overflow-hidden group hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-center gap-3.5">
            <XPStarGift3D className="w-14 h-14 shrink-0" />
            <div>
              <p className="text-xs font-bold text-purple-200 tracking-wide">
                Total XP
              </p>
              <p className="text-3xl font-black text-white tracking-tight mt-0.5">
                {currentXp} XP
              </p>
            </div>
          </div>
          <div className="text-2xl drop-shadow-[0_2px_8px_rgba(236,72,153,0.5)]">
            🎁
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          DAILY QUIZ ARENA (INTERACTIVE DSA CHALLENGE SECTION)
      ═══════════════════════════════════════════════════════════════ */}
      <QuickQuizSection />

      {/* ═══════════════════════════════════════════════════════════════
          BOTTOM ROW: ACHIEVEMENTS (LEFT) & RECENT ACTIVITY / TREASURE (RIGHT)
      ═══════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* LEFT: Your Achievements (7 cols) */}
        <div className="lg:col-span-7 rounded-3xl bg-[#0e112b]/85 backdrop-blur-2xl border-2 border-purple-500/30 shadow-[0_0_30px_rgba(139,92,246,0.2)] p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5">
              <Trophy className="w-5 h-5 text-amber-400" />
              <h3 className="text-lg font-black text-white tracking-tight">
                Your Achievements
              </h3>
            </div>
            <Link
              href="/dashboard"
              className="text-xs font-bold text-purple-300 hover:text-white transition-colors flex items-center gap-1"
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* 5 Distinct Glowing Achievement Medals */}
          <div className="grid grid-cols-5 gap-2 sm:gap-3">
            {[
              { id: "star", icon: "⭐", name: "Problem Solver", color: "from-amber-400 to-yellow-500" },
              { id: "silver", icon: "🌟", name: "Game Victor", color: "from-slate-300 to-sky-200" },
              { id: "crown", icon: "👑", name: "DSA Master", color: "from-yellow-400 to-amber-600" },
              { id: "rocket", icon: "🚀", name: "Speed Runner", color: "from-pink-500 to-rose-600" },
              { id: "shield", icon: "🛡️", name: "Code Knight", color: "from-orange-400 to-amber-500" },
            ].map((ach) => (
              <div key={ach.id} className="text-center group">
                <div className="relative mx-auto w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-white/[0.08] to-white/[0.03] border border-white/15 flex items-center justify-center text-2xl group-hover:scale-105 transition-transform shadow-glass-sm">
                  <span>{ach.icon}</span>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#10132b] border border-white/20 flex items-center justify-center text-[10px] text-slate-400">
                    <Lock className="w-2.5 h-2.5" />
                  </div>
                </div>
                <p className="text-[10px] sm:text-xs font-bold text-slate-300 mt-2 truncate">
                  {ach.name}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: Recent Activity with 3D Treasure Chest (5 cols) */}
        <div className="lg:col-span-5 rounded-3xl bg-[#0e112b]/85 backdrop-blur-2xl border-2 border-purple-500/30 shadow-[0_0_30px_rgba(139,92,246,0.2)] p-6 flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-amber-400 fill-amber-400" />
            <h3 className="text-lg font-black text-white tracking-tight">
              Recent Activity
            </h3>
          </div>

          <div className="flex items-center justify-between gap-4 py-1">
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center gap-2 text-slate-300 font-bold text-xs sm:text-sm">
                <Calendar className="w-4 h-4 text-sky-400" />
                <span>No recent activity yet!</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Start a game or complete a lesson to see your progress here.
              </p>
            </div>

            {/* Glowing 3D Treasure Chest */}
            <div className="w-24 h-24 shrink-0">
              <TreasureChest3D className="w-full h-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
