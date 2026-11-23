"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Trophy,
  Award,
  Lock,
  CheckCircle2,
  Sparkles,
  Star,
  Flame,
  Gamepad2,
  Layers,
  Brain,
  ArrowRight,
  RefreshCw,
} from "lucide-react";
import { achievementsApi } from "@/lib/api/achievements";
import { dashboardApi } from "@/lib/api/dashboard";
import { AchievementItemData, DashboardSummary } from "@/lib/api/types";
import { useAuth } from "@/context/AuthContext";

// Icon lookup for achievements
const ICON_MAP: Record<string, React.ElementType> = {
  "sparkles": Sparkles,
  "star": Star,
  "layers": Layers,
  "brain": Brain,
  "gamepad-2": Gamepad2,
  "gamepad": Gamepad2,
  "flame": Flame,
  "trophy": Trophy,
  "award": Award,
};

export default function AchievementsPage() {
  const { isAuthenticated } = useAuth();
  const [achievements, setAchievements] = useState<AchievementItemData[]>([]);
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAchievementsData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [allAchievements, dashSummary] = await Promise.all([
        achievementsApi.getAll(),
        isAuthenticated ? dashboardApi.getSummary().catch(() => null) : null,
      ]);

      setAchievements(allAchievements);
      if (dashSummary) {
        setSummary(dashSummary);
      }
    } catch (err) {
      console.error("Failed to load achievements:", err);
      setError("Could not load achievements. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAchievementsData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  // Merge unlocked status: either from is_unlocked on achievement or from summary.achievements
  const unlockedSlugs = new Set<string>();
  if (summary?.achievements) {
    summary.achievements.forEach((a) => {
      if (typeof a.id === "string") unlockedSlugs.add(a.id);
      if ("slug" in a && typeof (a as { slug?: string }).slug === "string") {
        unlockedSlugs.add((a as { slug: string }).slug);
      }
    });
  }

  const processedList = achievements.map((ach) => {
    const isUnlocked = Boolean(ach.is_unlocked || unlockedSlugs.has(ach.slug));
    return {
      ...ach,
      is_unlocked: isUnlocked,
    };
  });

  const totalCount = processedList.length;
  const unlockedCount = processedList.filter((a) => a.is_unlocked).length;
  const totalXpEarned = processedList
    .filter((a) => a.is_unlocked)
    .reduce((acc, curr) => acc + (curr.xp_reward || 0), 0);
  const progressPercent = totalCount > 0 ? Math.round((unlockedCount / totalCount) * 100) : 0;

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12 select-none">
      {/* ── Page Header ──────────────────────────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="relative rounded-[32px] p-6 sm:p-8 lg:p-9 bg-gradient-to-br from-[#161244]/90 via-[#1f1957]/85 to-[#0e102d]/95 border-2 border-purple-500/35 shadow-[0_0_40px_rgba(139,92,246,0.25)] backdrop-blur-2xl overflow-hidden"
      >
        <div className="pointer-events-none absolute -top-16 -right-16 w-80 h-80 rounded-full bg-yellow-500/15 blur-[100px]" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 w-80 h-80 rounded-full bg-cyan-500/15 blur-[100px]" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-yellow-500/15 border border-yellow-400/30 text-yellow-300 text-xs font-black uppercase tracking-wider">
              <Award className="w-4 h-4 text-yellow-400" />
              Achievements Gallery
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight flex items-center gap-2">
              Badges &amp; <span className="text-[#FACC15] drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]">Medals</span> 🎖️
            </h1>
            <p className="text-sm text-slate-300 font-medium max-w-2xl">
              Unlock special gaming medals by completing daily quizzes, perfecting algorithms, and building streaks.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchAchievementsData}
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/[0.08] hover:bg-white/[0.14] border border-white/15 text-slate-200 text-xs font-black transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-950 text-xs font-black shadow-[0_0_15px_rgba(250,204,21,0.4)] hover:scale-105 active:scale-95 transition-all"
            >
              Play Quizzes <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
            </Link>
          </div>
        </div>

        {/* ── Progress Tracker Bar inside Header ───────────────────────────────── */}
        <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
          <div>
            <p className="text-xs font-bold text-slate-400">Total Progress</p>
            <p className="text-2xl font-black text-white mt-0.5">
              {unlockedCount} / {totalCount} Badges Unlocked
            </p>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400">Achievement XP Earned</p>
            <p className="text-2xl font-black text-yellow-400 mt-0.5 flex items-center gap-1.5">
              <Star className="w-5 h-5 fill-yellow-400 inline" />
              +{totalXpEarned} XP
            </p>
          </div>
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-black text-slate-300">
              <span>Collection Level</span>
              <span className="text-purple-300">{progressPercent}%</span>
            </div>
            <div className="w-full h-3 rounded-full bg-white/10 overflow-hidden p-0.5 border border-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-500 shadow-[0_0_12px_rgba(250,204,21,0.6)] transition-all duration-700"
                style={{ width: `${Math.max(progressPercent, 4)}%` }}
              />
            </div>
          </div>
        </div>
      </motion.section>

      {/* ── Content: Loading, Error, or Achievements Grid ─────────────────────── */}
      {loading ? (
        <div className="py-20 text-center space-y-4">
          <div className="inline-block w-10 h-10 border-4 border-yellow-400/30 border-t-yellow-400 rounded-full animate-spin" />
          <p className="text-sm font-bold text-slate-400">Loading your achievement badges...</p>
        </div>
      ) : error ? (
        <div className="rounded-3xl p-10 text-center bg-rose-950/20 border border-rose-500/30 text-rose-300 space-y-3">
          <p className="text-base font-bold">{error}</p>
          <button
            onClick={fetchAchievementsData}
            className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs"
          >
            Retry
          </button>
        </div>
      ) : (
        /* Achievements Grid */
        <section aria-labelledby="badges-heading">
          <h2 id="badges-heading" className="sr-only">Badges Grid</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {processedList.map((badge, idx) => {
              const isUnlocked = badge.is_unlocked;
              const IconComponent = ICON_MAP[badge.icon.toLowerCase()] || Award;

              return (
                <motion.div
                  key={badge.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  className={`relative rounded-3xl p-6 flex flex-col justify-between border-2 transition-all duration-300 backdrop-blur-xl group ${
                    isUnlocked
                      ? "bg-gradient-to-br from-[#1a1438]/90 via-[#22174a]/85 to-[#100d26]/95 border-amber-400/50 shadow-[0_0_30px_rgba(250,204,21,0.2)] hover:border-amber-300 hover:shadow-[0_0_40px_rgba(250,204,21,0.3)] hover:-translate-y-1"
                      : "bg-[#0b0e22]/70 border-white/10 opacity-70 hover:opacity-85"
                  }`}
                >
                  {/* Top Status Header */}
                  <div className="flex items-center justify-between pb-4 border-b border-white/10">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                        isUnlocked
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-400/40"
                          : "bg-white/[0.05] text-slate-400 border border-white/10"
                      }`}
                    >
                      {isUnlocked ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          Unlocked
                        </>
                      ) : (
                        <>
                          <Lock className="w-3.5 h-3.5 text-slate-500" />
                          Locked
                        </>
                      )}
                    </span>

                    <span className="flex items-center gap-1 text-xs font-black text-amber-300">
                      <Star className="w-3.5 h-3.5 fill-amber-300" />
                      +{badge.xp_reward} XP
                    </span>
                  </div>

                  {/* Center Badge Icon + Title + Description */}
                  <div className="my-5 flex items-start gap-4">
                    {/* Medal Circle Icon */}
                    <div
                      className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl p-0.5 flex items-center justify-center shrink-0 ${
                        isUnlocked
                          ? "bg-gradient-to-tr from-amber-400 via-yellow-500 to-orange-500 shadow-[0_0_20px_rgba(250,204,21,0.5)] group-hover:scale-105 transition-transform"
                          : "bg-slate-800 border border-slate-700 text-slate-500"
                      }`}
                    >
                      <div
                        className={`w-full h-full rounded-[14px] flex items-center justify-center ${
                          isUnlocked ? "bg-[#0c0e26]" : "bg-[#080914]"
                        }`}
                      >
                        <IconComponent
                          className={`w-7 h-7 sm:w-8 sm:h-8 ${
                            isUnlocked ? "text-yellow-400" : "text-slate-600"
                          }`}
                        />
                      </div>
                    </div>

                    {/* Badge Details */}
                    <div className="space-y-1 min-w-0">
                      <h3
                        className={`text-base sm:text-lg font-black tracking-tight ${
                          isUnlocked
                            ? "text-white group-hover:text-amber-200 transition-colors"
                            : "text-slate-400"
                        }`}
                      >
                        {badge.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
                        {badge.description}
                      </p>
                    </div>
                  </div>

                  {/* Bottom Footer Details */}
                  <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-semibold text-slate-400">
                    <span className="font-mono text-[11px] text-slate-500">#{badge.slug}</span>
                    {isUnlocked ? (
                      <span className="text-emerald-400 font-bold">Earned in Quest ✨</span>
                    ) : (
                      <span className="text-slate-500">Complete challenge to claim</span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
