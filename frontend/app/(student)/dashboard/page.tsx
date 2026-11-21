"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Gamepad2, Play, Trophy, Zap } from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import { dashboardApi } from "@/lib/api/dashboard";
import type { DashboardSummary } from "@/lib/api/types";
import { HeroScene3D } from "@/components/illustrations/HeroScene3D";
import {
  GamepadTrophy3D,
  GraduationBooks3D,
  StreakFlameCalendar3D,
  XPStarGift3D,
} from "@/components/illustrations/StatCardIcons";
import { QuickQuizSection } from "@/components/dashboard/QuickQuizSection";
import { findMiniGameByTitle } from "@/components/games/gameCatalog";

type StatValue = (progress: number, attempts: number, streak: number, xp: number) => string;

const statCards: Array<{
  id: string;
  label: string;
  icon: typeof GraduationBooks3D;
  value: StatValue;
  tone: string;
}> = [
  {
    id: "progress",
    label: "DSA progress",
    icon: GraduationBooks3D,
    value: (progress) => `${progress}%`,
    tone: "text-cyan-200",
  },
  {
    id: "games",
    label: "Recent attempts",
    icon: GamepadTrophy3D,
    value: (_progress, attempts) => `${attempts}`,
    tone: "text-emerald-200",
  },
  {
    id: "streak",
    label: "Current streak",
    icon: StreakFlameCalendar3D,
    value: (_progress, _attempts, streak) => `${streak} ${streak === 1 ? "day" : "days"}`,
    tone: "text-amber-200",
  },
  {
    id: "xp",
    label: "Total XP",
    icon: XPStarGift3D,
    value: (_progress, _attempts, _streak, xp) => `${xp.toLocaleString()} XP`,
    tone: "text-violet-200",
  },
];

export default function StudentDashboardPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchDashboard() {
      if (!isAuthenticated) return;

      try {
        const data = await dashboardApi.getSummary();
        if (isMounted) setSummary(data);
      } catch (error) {
        console.error("Failed to load dashboard summary:", error);
      }
    }

    if (!authLoading) void fetchDashboard();
    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, authLoading]);

  const displayName =
    summary?.student?.display_name ||
    user?.student_profile?.display_name ||
    user?.first_name ||
    user?.email?.split("@")[0] ||
    "Learner";
  const currentXp = summary?.current_xp ?? user?.student_profile?.total_xp ?? 0;
  const currentStreak = summary?.current_streak ?? user?.student_profile?.current_streak ?? 0;
  const completedLessons = summary?.completed_lessons ?? 0;
  const totalLessons = summary?.total_published_lessons ?? 0;
  const progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
  const recentGames = summary?.recent_game_scores ?? [];
  const recentGame = recentGames[0];
  const recentGameDefinition = findMiniGameByTitle(recentGame?.game_name);
  const RecentGameIcon = recentGameDefinition?.Icon ?? Gamepad2;
  const achievements = summary?.achievements?.slice(0, 4) ?? [];
  const level = summary?.level ?? user?.student_profile?.level ?? 1;

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="mx-auto max-w-7xl space-y-5 pb-2"
    >
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-cyan-200">Your learning hub</p>
          <h1 className="mt-2 text-2xl font-black tracking-tight text-white sm:text-3xl">
            Welcome back, <span className="text-amber-200">{displayName}</span>
          </h1>
          <p className="mt-1 text-sm text-slate-400">Choose a quest and keep building your skills.</p>
        </div>
        <div className="flex items-center gap-3 self-start rounded-2xl border border-white/10 bg-white/[0.035] px-3 py-2 sm:self-auto">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-violet-300/10 text-violet-200">
            <Trophy className="h-4 w-4" aria-hidden="true" />
          </span>
          <div>
            <p className="text-xs font-bold text-slate-400">Level {level}</p>
            <p className="text-sm font-black text-amber-200">{currentXp.toLocaleString()} XP</p>
          </div>
        </div>
      </header>

      <section
        className="relative overflow-hidden rounded-[26px] border border-violet-200/15 bg-cover bg-center p-5 shadow-[0_18px_55px_rgba(0,0,0,0.22)] sm:p-6"
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgba(11, 10, 42, .94) 0%, rgba(11, 10, 42, .79) 38%, rgba(11, 10, 42, .2) 100%), url('/images/continue-learning-background.png')",
        }}
      >
        <div className="pointer-events-none absolute -left-12 -top-24 h-64 w-64 rounded-full bg-violet-500/10 blur-3xl" />
        <div className="relative grid items-center gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(250px,0.9fr)]">
          <div className="relative z-10 space-y-4">
            <p className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.16em] text-violet-200">
              <Play className="h-3.5 w-3.5 fill-current" aria-hidden="true" /> Continue learning
            </p>
            <div>
              <p className="mt-1 text-sm font-semibold text-slate-300">Learn · practice · play</p>
            </div>
            <div className="max-w-md space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                <span>Course progress</span>
                <span className="text-cyan-200">{progress}%</span>
              </div>
              <div
                className="h-2 overflow-hidden rounded-full bg-white/10"
                role="progressbar"
                aria-label="Course progress"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={progress}
              >
                <div className="h-full rounded-full bg-gradient-to-r from-cyan-300 to-violet-300 transition-[width] duration-700" style={{ width: `${progress}%` }} />
              </div>
            </div>
            <Link
              href="/topics/arrays"
              className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-amber-200 px-5 py-3 text-sm font-extrabold text-slate-950 transition hover:bg-amber-100 focus-visible:outline-cyan-100"
            >
              Continue lesson <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <div className="flex min-h-[150px] items-center justify-center lg:min-h-[190px]">
            <HeroScene3D compact className="w-full max-w-[280px]" />
          </div>
        </div>
      </section>

      <section aria-label="Learning snapshot" className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          const value = stat.value(progress, recentGames.length, currentStreak, currentXp);
          return (
            <motion.article
              key={stat.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04, duration: 0.28 }}
              whileHover={{ y: -2 }}
              className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.035] p-3 transition-colors hover:border-white/20 hover:bg-white/[0.055] sm:gap-4 sm:p-4"
            >
              <Icon className="h-10 w-10 shrink-0 sm:h-12 sm:w-12" />
              <div className="min-w-0">
                <p className="truncate text-xs font-bold text-slate-400">{stat.label}</p>
                <p className={`mt-1 truncate text-lg font-black text-white sm:text-xl ${stat.tone}`}>{value}</p>
              </div>
            </motion.article>
          );
        })}
      </section>

      <section aria-label="Daily quiz challenge">
        <QuickQuizSection />
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-[24px] border border-white/10 bg-white/[0.035] p-5 sm:p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Trophy className="h-5 w-5 text-amber-200" aria-hidden="true" />
              <h2 className="text-lg font-black text-white">Recent achievements</h2>
            </div>
            <span className="text-xs font-bold text-slate-500">{achievements.length}</span>
          </div>
          {achievements.length ? (
            <ul className="divide-y divide-white/[0.08]">
              {achievements.map((achievement) => (
                <li key={achievement.id} className="flex items-center gap-3 py-3 first:pt-1 last:pb-1">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-amber-300/10 text-amber-200">
                    <Trophy className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-white">{achievement.name}</p>
                    <p className="mt-0.5 truncate text-xs text-slate-400">{achievement.description}</p>
                  </div>
                  {achievement.xp_reward ? <span className="text-xs font-extrabold text-amber-200">+{achievement.xp_reward} XP</span> : null}
                </li>
              ))}
            </ul>
          ) : (
            <div className="rounded-xl bg-slate-950/25 px-4 py-5">
              <p className="text-sm font-bold text-slate-200">Your first achievement is waiting.</p>
              <p className="mt-1 text-xs leading-5 text-slate-400">Try a game preview or answer the daily quiz to get started.</p>
            </div>
          )}
        </div>

        <div className="rounded-[24px] border border-white/10 bg-white/[0.035] p-5 sm:p-6">
          <div className="mb-4 flex items-center gap-2.5">
            <Zap className="h-5 w-5 text-cyan-200" aria-hidden="true" />
            <h2 className="text-lg font-black text-white">Recently played</h2>
          </div>
          {recentGame ? (
            <div className="flex items-center gap-4 rounded-2xl bg-slate-950/25 p-4">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-cyan-300/10 text-cyan-100">
                <RecentGameIcon className="h-6 w-6" aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-extrabold text-white">
                  {recentGameDefinition?.title ?? recentGame.game_name ?? "Game preview"}
                </p>
                {typeof recentGame.score === "number" ? <p className="mt-1 text-xs font-semibold text-slate-400">Last score: {recentGame.score}</p> : null}
              </div>
              <Link
                href={recentGameDefinition ? `/mini-games/${recentGameDefinition.slug}` : "/mini-games"}
                className="inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-xl border border-white/10 px-3 text-xs font-extrabold text-slate-100 transition hover:border-cyan-200/30 hover:text-cyan-100"
              >
                {recentGameDefinition ? "Open" : "Browse"} <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </div>
          ) : (
            <div className="rounded-xl bg-slate-950/25 px-4 py-5">
              <p className="text-sm font-bold text-slate-200">No game previews yet.</p>
              <p className="mt-1 text-xs leading-5 text-slate-400">Choose a world in the arcade and your latest attempt will appear here.</p>
              <Link href="/mini-games" className="mt-4 inline-flex items-center gap-2 text-sm font-extrabold text-cyan-100 hover:text-white">
                Browse the arcade <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          )}
        </div>
      </section>
    </motion.main>
  );
}
