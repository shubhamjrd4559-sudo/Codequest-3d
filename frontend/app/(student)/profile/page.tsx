"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Sparkles,
  Flame,
  ArrowRight,
  BookOpen,
  Gamepad2,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { dashboardApi } from "@/lib/api/dashboard";
import { DashboardSummary } from "@/lib/api/types";
import { ActivityHeatmap } from "@/components/profile/ActivityHeatmap";

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);

  useEffect(() => {
    let mounted = true;
    async function fetchSummary() {
      if (!isAuthenticated) return;
      try {
        const data = await dashboardApi.getSummary();
        if (mounted) {
          setSummary(data);
        }
      } catch (err) {
        console.error("Failed to load profile summary:", err);
      }
    }
    if (!authLoading) {
      fetchSummary();
    }
    return () => {
      mounted = false;
    };
  }, [isAuthenticated, authLoading]);

  const displayName =
    summary?.student?.display_name ||
    user?.student_profile?.display_name ||
    user?.first_name ||
    user?.email?.split("@")[0] ||
    "CodeHero";

  const email = user?.email || "hero@codequest.dev";
  const level = summary?.level ?? user?.student_profile?.level ?? 1;
  const xp = summary?.total_xp ?? user?.student_profile?.total_xp ?? 0;
  const streak = summary?.current_streak ?? user?.student_profile?.current_streak ?? 0;
  const completedLessons = summary?.completed_lessons ?? 0;
  const isDailyDone = summary?.is_daily_quiz_completed ?? false;

  const userInitial = displayName.charAt(0).toUpperCase();

  // Level progress (each level is roughly 300 XP in gamification logic)
  const xpInCurrentLevel = xp % 300;
  const levelProgressPercent = Math.min(100, Math.round((xpInCurrentLevel / 300) * 100));

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* ── Premium Profile Header ────────────────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="relative rounded-[32px] p-6 sm:p-8 lg:p-10 bg-gradient-to-br from-[#151240]/90 via-[#1c1854]/85 to-[#0d0f28]/95 border-2 border-purple-500/35 shadow-[0_0_40px_rgba(139,92,246,0.25)] backdrop-blur-2xl overflow-hidden"
      >
        {/* Ambient Nebula Blobs */}
        <div className="pointer-events-none absolute -top-16 -right-16 w-96 h-96 rounded-full bg-purple-600/20 blur-[110px]" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 w-80 h-80 rounded-full bg-cyan-500/20 blur-[100px]" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Left: Avatar + Details */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start md:items-center gap-5 text-center sm:text-left">
            {/* 3D Glowing Avatar Ring */}
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full p-1 bg-gradient-to-tr from-cyan-400 via-purple-500 to-pink-500 shadow-[0_0_30px_rgba(168,85,247,0.6)] shrink-0">
              <div className="w-full h-full rounded-full bg-[#0a0d26] flex items-center justify-center overflow-hidden border-2 border-white/20">
                <span className="text-4xl sm:text-5xl font-black text-[#FACC15] drop-shadow-[0_0_15px_rgba(250,204,21,0.6)]">
                  {userInitial}
                </span>
              </div>
              {/* Online pulse dot */}
              <div
                className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-emerald-400 border-4 border-[#0a0d26] shadow-[0_0_12px_#10B981]"
                title="Online Learner"
              />
            </div>

            {/* User Meta */}
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
                  {displayName}
                </h1>
                <span className="px-3 py-1 rounded-full text-xs font-black bg-purple-500/25 border border-purple-400/40 text-purple-300 uppercase tracking-wider shadow-neon-purple">
                  Level {level} Coder
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 font-mono">{email}</p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-1 text-xs font-bold text-slate-300">
                <span className="flex items-center gap-1.5 text-amber-300">
                  <Sparkles className="w-4 h-4 text-amber-300 fill-amber-300" />
                  {xp.toLocaleString()} Total XP
                </span>
                <span className="text-slate-500">•</span>
                <span className="flex items-center gap-1 text-orange-400">
                  <Flame className="w-4 h-4 text-orange-400 fill-orange-400" />
                  {streak} Days Streak
                </span>
                <span className="text-slate-500">•</span>
                <span className="flex items-center gap-1 text-cyan-300">
                  <BookOpen className="w-4 h-4" />
                  {completedLessons} Lessons Mastered
                </span>
              </div>
            </div>
          </div>

          {/* Right: Level Progress & Quick Daily Quiz Action */}
          <div className="flex flex-col items-center md:items-end gap-3 w-full md:w-auto">
            {/* Level Progress Bar */}
            <div className="w-full sm:w-64 space-y-1.5 bg-[#090b20]/60 border border-white/10 rounded-2xl p-3.5 backdrop-blur-md">
              <div className="flex items-center justify-between text-xs font-black">
                <span className="text-purple-300">Level {level} Progress</span>
                <span className="text-yellow-400">{xpInCurrentLevel}/300 XP</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-white/10 overflow-hidden p-0.5 border border-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-500 shadow-[0_0_12px_rgba(168,85,247,0.8)] transition-all duration-700"
                  style={{ width: `${Math.max(levelProgressPercent, 5)}%` }}
                />
              </div>
            </div>

            {/* Play Daily Quiz Button */}
            <Link
              href="/dashboard"
              className={`inline-flex items-center gap-2.5 px-6 py-3 rounded-2xl font-black text-xs sm:text-sm shadow-lg transition-all ${
                isDailyDone
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 hover:bg-emerald-500/30"
                  : "bg-gradient-to-r from-[#FACC15] via-[#FBBF24] to-[#F59E0B] text-[#1E1B4B] shadow-[0_0_20px_rgba(250,204,21,0.5)] hover:scale-105 active:scale-95"
              }`}
            >
              {isDailyDone ? (
                <>
                  Daily Quiz Completed Today ✨
                </>
              ) : (
                <>
                  Solve Today&apos;s Daily Quiz <ArrowRight className="w-4 h-4 stroke-[3]" />
                </>
              )}
            </Link>
          </div>
        </div>
      </motion.section>

      {/* ── Activity Heatmap & Stats Summary Section ───────────────────────────── */}
      <section aria-labelledby="activity-graph-heading">
        <ActivityHeatmap />
      </section>

      {/* ── Quick Exploration Cards Row ───────────────────────────────────────── */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/topics/arrays"
          className="group rounded-3xl p-6 bg-gradient-to-br from-[#12163b]/80 via-[#181d4a]/70 to-[#0e1233]/90 border border-cyan-400/30 hover:border-cyan-300 shadow-[0_0_30px_rgba(6,182,212,0.15)] hover:shadow-[0_0_40px_rgba(6,182,212,0.25)] transition-all flex items-center justify-between"
        >
          <div className="space-y-1">
            <span className="text-xs font-black uppercase tracking-wider text-cyan-300">
              Interactive Learning
            </span>
            <h3 className="text-lg font-black text-white group-hover:text-cyan-200 transition-colors">
              Continue DSA Roadmap
            </h3>
            <p className="text-xs text-slate-400">
              Explore 26 topics with 4 progressive challenge levels.
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <BookOpen className="w-6 h-6" />
          </div>
        </Link>

        <Link
          href="/mini-games"
          className="group rounded-3xl p-6 bg-gradient-to-br from-[#1d123a]/80 via-[#26184a]/70 to-[#120e2e]/90 border border-purple-400/30 hover:border-purple-300 shadow-[0_0_30px_rgba(168,85,247,0.15)] hover:shadow-[0_0_40px_rgba(168,85,247,0.25)] transition-all flex items-center justify-between"
        >
          <div className="space-y-1">
            <span className="text-xs font-black uppercase tracking-wider text-purple-300">
              Arcade Games
            </span>
            <h3 className="text-lg font-black text-white group-hover:text-purple-200 transition-colors">
              Play 3D Mini-Games
            </h3>
            <p className="text-xs text-slate-400">
              Stack Tower, Queue Counter, Logic Builder &amp; more.
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-300 border border-purple-400/30 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <Gamepad2 className="w-6 h-6" />
          </div>
        </Link>
      </section>
    </div>
  );
}
