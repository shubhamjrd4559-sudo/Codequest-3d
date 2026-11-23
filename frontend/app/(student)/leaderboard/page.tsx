"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Trophy,
  Crown,
  Medal,
  Star,
  ArrowRight,
  RefreshCw,
} from "lucide-react";
import { leaderboardApi } from "@/lib/api/leaderboard";
import { LeaderboardUser } from "@/lib/api/types";
import { useAuth } from "@/context/AuthContext";

export default function LeaderboardPage() {
  const { user } = useAuth();
  const [leaders, setLeaders] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await leaderboardApi.getTopStudents();
      setLeaders(data);
    } catch (err) {
      console.error("Failed to load leaderboard:", err);
      setError("Could not load leaderboard scores. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const topThree = leaders.slice(0, 3);
  const restLeaders = leaders.slice(3);

  // Helper for medal colors
  const podiumStyles = [
    {
      // 1st Place - Gold
      rank: 1,
      badge: "🥇 Gold Champion",
      border: "border-amber-400/60",
      bg: "bg-gradient-to-b from-amber-500/25 via-[#1a1408]/80 to-[#0e0c1f]/95",
      shadow: "shadow-[0_0_40px_rgba(245,158,11,0.35)]",
      avatarRing: "from-amber-300 via-yellow-400 to-amber-600",
      textGlow: "text-amber-300 drop-shadow-[0_0_12px_rgba(250,204,21,0.7)]",
      crownColor: "text-yellow-400",
      orderClass: "order-1 sm:order-2", // center on desktop
      heightClass: "sm:min-h-[340px]",
    },
    {
      // 2nd Place - Silver
      rank: 2,
      badge: "🥈 Silver Runner-Up",
      border: "border-slate-300/40",
      bg: "bg-gradient-to-b from-slate-400/20 via-[#101428]/80 to-[#0c0e20]/95",
      shadow: "shadow-[0_0_30px_rgba(148,163,184,0.25)]",
      avatarRing: "from-slate-200 via-slate-400 to-indigo-300",
      textGlow: "text-slate-200",
      crownColor: "text-slate-300",
      orderClass: "order-2 sm:order-1", // left on desktop
      heightClass: "sm:min-h-[300px]",
    },
    {
      // 3rd Place - Bronze
      rank: 3,
      badge: "🥉 Bronze Master",
      border: "border-amber-700/50",
      bg: "bg-gradient-to-b from-amber-700/20 via-[#180f1e]/80 to-[#0c0e20]/95",
      shadow: "shadow-[0_0_30px_rgba(180,83,9,0.25)]",
      avatarRing: "from-amber-600 via-orange-400 to-amber-700",
      textGlow: "text-amber-400",
      crownColor: "text-amber-500",
      orderClass: "order-3", // right on desktop
      heightClass: "sm:min-h-[280px]",
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12 select-none">
      {/* ── Page Header ──────────────────────────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="relative rounded-[32px] p-6 sm:p-8 lg:p-9 bg-gradient-to-br from-[#131742]/90 via-[#191d54]/85 to-[#0e112d]/95 border-2 border-purple-500/35 shadow-[0_0_40px_rgba(139,92,246,0.25)] backdrop-blur-2xl overflow-hidden"
      >
        <div className="pointer-events-none absolute -top-16 -right-16 w-80 h-80 rounded-full bg-amber-500/15 blur-[100px]" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 w-80 h-80 rounded-full bg-cyan-500/15 blur-[100px]" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 text-xs font-black uppercase tracking-wider">
              <Trophy className="w-4 h-4 text-amber-400" />
              Global Leaderboard
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight flex items-center gap-2">
              Hall of <span className="text-[#FACC15] drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]">Code Champions</span> 👑
            </h1>
            <p className="text-sm text-slate-300 font-medium max-w-2xl">
              Top 20 student coders ranking up through interactive DSA quizzes and 3D mini-games.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchLeaderboard}
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
              Earn XP Now <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
            </Link>
          </div>
        </div>
      </motion.section>

      {/* ── Content: Loading, Error, or Data ──────────────────────────────────── */}
      {loading ? (
        <div className="py-20 text-center space-y-4">
          <div className="inline-block w-10 h-10 border-4 border-yellow-400/30 border-t-yellow-400 rounded-full animate-spin" />
          <p className="text-sm font-bold text-slate-400">Loading champion rankings...</p>
        </div>
      ) : error ? (
        <div className="rounded-3xl p-10 text-center bg-rose-950/20 border border-rose-500/30 text-rose-300 space-y-3">
          <p className="text-base font-bold">{error}</p>
          <button
            onClick={fetchLeaderboard}
            className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs"
          >
            Retry
          </button>
        </div>
      ) : leaders.length === 0 ? (
        /* Empty State */
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-[32px] p-12 text-center bg-[#0d102e]/90 border border-purple-500/30 shadow-2xl space-y-4"
        >
          <div className="text-6xl animate-bounce">🏆</div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">No Champions Yet!</h2>
          <p className="text-sm text-slate-300 max-w-md mx-auto">
            Be the very first hero to solve a quiz or play a mini-game and claim the #1 spot on the podium!
          </p>
          <div className="pt-2">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-2xl bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-950 font-black text-sm shadow-[0_0_20px_rgba(250,204,21,0.5)] hover:scale-105 transition-transform"
            >
              Start Earning XP <ArrowRight className="w-4 h-4 stroke-[3]" />
            </Link>
          </div>
        </motion.div>
      ) : (
        <div className="space-y-10">
          {/* ── Top 3 Champions Podium ────────────────────────────────────────── */}
          {topThree.length > 0 && (
            <section aria-labelledby="podium-heading">
              <h2 id="podium-heading" className="sr-only">Top 3 Champions</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 items-end">
                {topThree.map((hero, idx) => {
                  const style = podiumStyles[idx];
                  const initial = hero.display_name.charAt(0).toUpperCase();
                  const isCurrent = user?.student_profile?.display_name === hero.display_name;

                  return (
                    <motion.div
                      key={hero.display_name + idx}
                      initial={{ opacity: 0, y: 25 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: idx * 0.1 }}
                      className={`relative rounded-3xl p-6 flex flex-col items-center text-center justify-between border-2 ${style.border} ${style.bg} ${style.shadow} ${style.orderClass} ${style.heightClass} backdrop-blur-xl group hover:-translate-y-1 transition-all duration-300`}
                    >
                      {/* Rank Badge Header */}
                      <div className="w-full flex items-center justify-between pb-3 border-b border-white/10">
                        <span className="text-xs font-black uppercase tracking-wider text-slate-200">
                          {style.badge}
                        </span>
                        {style.rank === 1 && (
                          <Crown className="w-5 h-5 text-yellow-400 fill-yellow-400 animate-bounce" />
                        )}
                        {style.rank === 2 && <Medal className="w-5 h-5 text-slate-300" />}
                        {style.rank === 3 && <Medal className="w-5 h-5 text-amber-600" />}
                      </div>

                      {/* Avatar with Glow Ring */}
                      <div className="relative my-4">
                        <div
                          className={`w-20 h-20 sm:w-22 sm:h-22 rounded-full p-1 bg-gradient-to-tr ${style.avatarRing} shadow-lg`}
                        >
                          <div className="w-full h-full rounded-full bg-[#0a0d24] flex items-center justify-center overflow-hidden border-2 border-white/20">
                            {hero.avatar_url ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={hero.avatar_url}
                                alt={hero.display_name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className={`text-3xl font-black ${style.textGlow}`}>
                                {initial}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Rank Pill attached to bottom of avatar */}
                        <div
                          className={`absolute -bottom-2 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full text-xs font-black shadow-md border ${
                            style.rank === 1
                              ? "bg-amber-400 text-slate-950 border-white"
                              : style.rank === 2
                              ? "bg-slate-300 text-slate-950 border-white"
                              : "bg-amber-700 text-white border-amber-400"
                          }`}
                        >
                          #{style.rank}
                        </div>
                      </div>

                      {/* User Info */}
                      <div className="space-y-1 w-full">
                        <h3 className="text-lg sm:text-xl font-black text-white truncate max-w-[200px] mx-auto">
                          {hero.display_name}
                        </h3>
                        <div className="flex items-center justify-center gap-2">
                          <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-400/40">
                            Level {hero.level}
                          </span>
                          {isCurrent && (
                            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-cyan-400/20 text-cyan-300 border border-cyan-400/40">
                              You
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Total XP Score Pill */}
                      <div className="mt-4 w-full pt-3 border-t border-white/10 flex items-center justify-center gap-1.5 text-base font-black text-amber-300">
                        <Star className="w-4 h-4 fill-amber-300 text-amber-300" />
                        <span>{hero.total_xp.toLocaleString()} XP</span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </section>
          )}

          {/* ── Ranks 4 to 20 Leaderboard List ─────────────────────────────────── */}
          {restLeaders.length > 0 && (
            <section aria-labelledby="all-ranks-heading" className="space-y-4">
              <div className="flex items-center justify-between px-2">
                <h2 id="all-ranks-heading" className="text-xl font-black text-white flex items-center gap-2">
                  <span>Top 20 Leaderboard</span>
                  <span className="text-xs font-bold text-slate-400">({leaders.length} total)</span>
                </h2>
                <span className="text-xs font-bold text-slate-400">XP points updated live</span>
              </div>

              <div className="rounded-3xl p-3 sm:p-5 bg-[#0b0e26]/85 border border-purple-500/30 shadow-[0_0_35px_rgba(139,92,246,0.15)] backdrop-blur-2xl space-y-2">
                {restLeaders.map((hero, idx) => {
                  const rank = idx + 4;
                  const initial = hero.display_name.charAt(0).toUpperCase();
                  const isCurrent = user?.student_profile?.display_name === hero.display_name;

                  return (
                    <motion.div
                      key={hero.display_name + rank}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.25, delay: idx * 0.03 }}
                      className={`flex items-center justify-between gap-3 p-3 sm:p-4 rounded-2xl border transition-all ${
                        isCurrent
                          ? "bg-purple-600/20 border-purple-400/60 shadow-[0_0_15px_rgba(168,85,247,0.3)]"
                          : "bg-white/[0.03] border-white/10 hover:bg-white/[0.06] hover:border-white/20"
                      }`}
                    >
                      {/* Left: Rank + Avatar + Name */}
                      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                        {/* Rank Pill */}
                        <span className="w-8 text-center text-xs sm:text-sm font-black font-mono text-slate-400">
                          #{rank}
                        </span>

                        {/* Avatar */}
                        <div className="relative w-10 h-10 rounded-full p-0.5 bg-gradient-to-tr from-cyan-400 to-purple-500 shrink-0">
                          <div className="w-full h-full rounded-full bg-[#0a0d24] flex items-center justify-center overflow-hidden border border-white/20">
                            {hero.avatar_url ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={hero.avatar_url}
                                alt={hero.display_name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-sm font-black text-amber-300">
                                {initial}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Display Name & Level */}
                        <div className="min-w-0">
                          <p className="text-sm sm:text-base font-black text-white truncate flex items-center gap-2">
                            {hero.display_name}
                            {isCurrent && (
                              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-cyan-400/20 text-cyan-300 border border-cyan-400/40">
                                You
                              </span>
                            )}
                          </p>
                          <p className="text-xs font-bold text-purple-300">
                            Level {hero.level} Challenger
                          </p>
                        </div>
                      </div>

                      {/* Right: XP Score */}
                      <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-500/15 border border-amber-400/30 text-amber-300 font-black text-xs sm:text-sm shrink-0 shadow-glass-sm">
                        <Star className="w-3.5 h-3.5 fill-amber-300" />
                        <span>{hero.total_xp.toLocaleString()} XP</span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
