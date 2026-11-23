"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Flame, Trophy, CheckCircle2, Sparkles, AlertCircle } from "lucide-react";
import { userApi } from "@/lib/api/user";
import { HeatmapDay } from "@/lib/api/types";
import { useAuth } from "@/context/AuthContext";

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

interface HoveredDay {
  date: string;
  count: number;
  x: number;
  y: number;
}

export function ActivityHeatmap() {
  const { user } = useAuth();
  const [data, setData] = useState<HeatmapDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredDay, setHoveredDay] = useState<HoveredDay | null>(null);

  useEffect(() => {
    let mounted = true;
    async function loadHeatmap() {
      try {
        setLoading(true);
        setError(null);
        const res = await userApi.getHeatmap();
        if (mounted) {
          setData(res);
        }
      } catch (err: unknown) {
        if (mounted) {
          console.error("Failed to load activity heatmap:", err);
          setError("Could not load activity data. Please try again.");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }
    loadHeatmap();
    return () => {
      mounted = false;
    };
  }, []);

  // Stats calculation
  const totalActiveDays = useMemo(() => {
    return data.filter((d) => d.count > 0).length;
  }, [data]);

  const currentStreak = user?.student_profile?.current_streak ?? 0;
  const maxStreak = user?.student_profile?.longest_streak ?? currentStreak;

  // Group 365 days into columns of weeks (Sunday to Saturday)
  const { weeks, monthLabels } = useMemo(() => {
    if (!data.length) return { weeks: [], monthLabels: [] };

    const weeksList: Array<Array<HeatmapDay | null>> = [];
    let currentWeek: Array<HeatmapDay | null> = [];

    // First day alignment
    const firstDateObj = new Date(data[0].date + "T00:00:00");
    const firstDayOfWeek = firstDateObj.getDay(); // 0 for Sun

    for (let i = 0; i < firstDayOfWeek; i++) {
      currentWeek.push(null);
    }

    const monthHeaderPositions: Array<{ name: string; weekIndex: number }> = [];
    let lastMonth = -1;

    data.forEach((item) => {
      const dObj = new Date(item.date + "T00:00:00");
      const month = dObj.getMonth();

      if (month !== lastMonth && dObj.getDate() <= 14) {
        monthHeaderPositions.push({
          name: MONTH_NAMES[month],
          weekIndex: weeksList.length,
        });
        lastMonth = month;
      }

      currentWeek.push(item);
      if (currentWeek.length === 7) {
        weeksList.push(currentWeek);
        currentWeek = [];
      }
    });

    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push(null);
      }
      weeksList.push(currentWeek);
    }

    return { weeks: weeksList, monthLabels: monthHeaderPositions };
  }, [data]);

  const formatDateDisplay = (dateStr: string) => {
    try {
      const d = new Date(dateStr + "T00:00:00");
      return d.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6">
      {/* ── 3 Glassmorphic Stats Summary Cards ─────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Active Days */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="relative rounded-2xl p-5 bg-gradient-to-br from-emerald-950/40 via-[#0e1628]/80 to-[#070d1d]/90 border border-emerald-500/30 shadow-[0_0_25px_rgba(16,185,129,0.15)] backdrop-blur-xl overflow-hidden group hover:border-emerald-400/50 transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-emerald-400">
              Total Active Days
            </span>
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 shadow-[0_0_12px_rgba(16,185,129,0.3)]">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              {loading ? "..." : totalActiveDays}
            </span>
            <span className="text-xs font-bold text-slate-400">days this year</span>
          </div>
          <p className="mt-2 text-xs text-slate-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 inline" />
            Quizzes &amp; algorithms solved
          </p>
        </motion.div>

        {/* Current Streak */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.08 }}
          className="relative rounded-2xl p-5 bg-gradient-to-br from-orange-950/40 via-[#181126]/80 to-[#0a0718]/90 border border-orange-500/30 shadow-[0_0_25px_rgba(249,115,22,0.15)] backdrop-blur-xl overflow-hidden group hover:border-orange-400/50 transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-orange-400">
              Current Streak
            </span>
            <div className="p-2.5 rounded-xl bg-orange-500/20 text-orange-300 border border-orange-400/30 shadow-[0_0_12px_rgba(249,115,22,0.3)]">
              <Flame className="w-5 h-5 animate-pulse" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              {currentStreak}
            </span>
            <span className="text-xs font-bold text-orange-300">Days Streak 🔥</span>
          </div>
          <p className="mt-2 text-xs text-slate-400">
            {currentStreak > 0
              ? "Keep it burning tomorrow!"
              : "Complete today's daily quiz to start!"}
          </p>
        </motion.div>

        {/* Max Streak */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.16 }}
          className="relative rounded-2xl p-5 bg-gradient-to-br from-purple-950/40 via-[#13112c]/80 to-[#080718]/90 border border-purple-500/30 shadow-[0_0_25px_rgba(168,85,247,0.15)] backdrop-blur-xl overflow-hidden group hover:border-purple-400/50 transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-purple-300">
              Max Streak
            </span>
            <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-400/30 shadow-[0_0_12px_rgba(168,85,247,0.3)]">
              <Trophy className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              {maxStreak}
            </span>
            <span className="text-xs font-bold text-purple-300">Days Record 🏆</span>
          </div>
          <p className="mt-2 text-xs text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-yellow-400 inline" />
            Personal best consistency record
          </p>
        </motion.div>
      </div>

      {/* ── Contribution Heatmap Container ─────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.2 }}
        className="relative rounded-3xl p-6 sm:p-7 bg-[#0b0e24]/90 border border-purple-500/30 shadow-[0_0_40px_rgba(139,92,246,0.15)] backdrop-blur-2xl overflow-hidden"
      >
        {/* Subtle background glow */}
        <div className="pointer-events-none absolute -top-20 -right-20 w-80 h-80 rounded-full bg-emerald-500/[0.06] blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-purple-500/[0.06] blur-3xl" />

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-white/10">
          <div>
            <h3 className="text-lg sm:text-xl font-black text-white tracking-tight flex items-center gap-2">
              Activity Heatmap
              <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/40">
                Last 365 Days
              </span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 font-medium mt-1">
              Tracks your daily quiz completions and algorithm adventures across the year.
            </p>
          </div>

          {/* Quick legend */}
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
            <span>Less</span>
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-[3px] bg-white/[0.06] border border-white/10" />
              <span className="w-3 h-3 rounded-[3px] bg-emerald-600/60 border border-emerald-500/60" />
              <span className="w-3 h-3 rounded-[3px] bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] border border-emerald-300" />
            </div>
            <span>More</span>
          </div>
        </div>

        {/* Loading / Error States */}
        {loading ? (
          <div className="py-16 text-center space-y-3">
            <div className="inline-block w-8 h-8 border-4 border-emerald-400/30 border-t-emerald-400 rounded-full animate-spin" />
            <p className="text-sm font-bold text-slate-400">Loading your activity graph...</p>
          </div>
        ) : error ? (
          <div className="py-12 text-center space-y-3">
            <AlertCircle className="w-8 h-8 text-rose-400 mx-auto" />
            <p className="text-sm font-bold text-rose-300">{error}</p>
          </div>
        ) : (
          /* Heatmap Matrix with Horizontal Scroll */
          <div className="relative pt-6 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
            <div className="inline-block min-w-full">
              {/* Month Headers */}
              <div className="flex text-[11px] font-bold text-slate-400 pl-8 pb-2 select-none">
                {monthLabels.map((m, idx) => (
                  <span
                    key={`${m.name}-${idx}`}
                    style={{
                      position: "relative",
                      left: `${Math.max(0, m.weekIndex * 15 - idx * 24)}px`,
                      marginRight: "28px",
                    }}
                  >
                    {m.name}
                  </span>
                ))}
              </div>

              {/* Grid: Day-of-week labels + 52 Weeks */}
              <div className="flex items-start gap-1">
                {/* Day of Week Column (Mon, Wed, Fri) */}
                <div className="flex flex-col gap-1 pr-2 pt-0.5 text-[10px] font-bold text-slate-500 select-none">
                  <span className="h-3 leading-3">Sun</span>
                  <span className="h-3 leading-3 opacity-0">Mon</span>
                  <span className="h-3 leading-3">Tue</span>
                  <span className="h-3 leading-3 opacity-0">Wed</span>
                  <span className="h-3 leading-3">Thu</span>
                  <span className="h-3 leading-3 opacity-0">Fri</span>
                  <span className="h-3 leading-3">Sat</span>
                </div>

                {/* Weeks Grid */}
                <div className="flex gap-[3.5px]">
                  {weeks.map((week, wIdx) => (
                    <div key={wIdx} className="flex flex-col gap-[3.5px]">
                      {week.map((day, dIdx) => {
                        if (!day) {
                          return (
                            <div
                              key={`empty-${wIdx}-${dIdx}`}
                              className="w-3 h-3 rounded-[2.5px] opacity-0"
                            />
                          );
                        }

                        const hasActivity = day.count > 0;
                        const isMultiple = day.count > 1;

                        return (
                          <div
                            key={day.date}
                            onMouseEnter={(e) => {
                              const rect = e.currentTarget.getBoundingClientRect();
                              setHoveredDay({
                                date: day.date,
                                count: day.count,
                                x: rect.left + rect.width / 2,
                                y: rect.top,
                              });
                            }}
                            onMouseLeave={() => setHoveredDay(null)}
                            className={`w-3 h-3 rounded-[2.5px] transition-all duration-150 cursor-pointer ${
                              hasActivity
                                ? isMultiple
                                  ? "bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.9)] border border-emerald-200 hover:scale-125"
                                  : "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] border border-emerald-400 hover:scale-125"
                                : "bg-white/[0.06] border border-white/[0.04] hover:bg-white/[0.18]"
                            }`}
                          />
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Fixed Tooltip overlay on hover ─────────────────────────────────── */}
        <AnimatePresence>
          {hoveredDay && (
            <motion.div
              initial={{ opacity: 0, y: 6, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              style={{
                position: "fixed",
                left: `${hoveredDay.x}px`,
                top: `${hoveredDay.y - 12}px`,
                transform: "translate(-50%, -100%)",
                pointerEvents: "none",
                zIndex: 9999,
              }}
              className="px-3.5 py-2 rounded-xl bg-[#070a1e]/95 border border-purple-400/40 shadow-[0_0_20px_rgba(139,92,246,0.5)] backdrop-blur-md whitespace-nowrap text-center"
            >
              <p className="text-xs font-black text-white">
                {hoveredDay.count > 0 ? (
                  <span className="text-emerald-400 flex items-center gap-1.5 justify-center">
                    <CheckCircle2 className="w-3.5 h-3.5 inline" />
                    Daily Quiz Completed!
                  </span>
                ) : (
                  <span className="text-slate-400">No activity</span>
                )}
              </p>
              <p className="text-[11px] font-semibold text-slate-300 mt-0.5">
                {formatDateDisplay(hoveredDay.date)}
              </p>
              {hoveredDay.count > 0 && (
                <p className="text-[10px] font-bold text-yellow-300">
                  {hoveredDay.count} {hoveredDay.count === 1 ? "activity" : "activities"} logged
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
