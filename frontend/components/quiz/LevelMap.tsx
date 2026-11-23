"use client";

import React from "react";
import { motion } from "framer-motion";
import { Lock, Check, Star, Sparkles, Play, Crown } from "lucide-react";

export type LevelState = "locked" | "unlocked" | "completed";

export interface QuizLevel {
  id: number;
  levelNumber: number;
  title: string;
  subtitle: string;
  state: LevelState;
  stars: number; // 0 to 3
  xpReward: number;
  themeColor: string; // Tailwind color accent
  badge: string;
}

interface LevelMapProps {
  levels: QuizLevel[];
  selectedLevelId: number;
  onSelectLevel: (levelId: number) => void;
  topicTitle?: string;
}

export function LevelMap({
  levels,
  selectedLevelId,
  onSelectLevel,
  topicTitle = "Arrays",
}: LevelMapProps) {
  return (
    <div className="relative rounded-[32px] p-6 sm:p-8 bg-gradient-to-br from-[#12143b]/95 via-[#18194d]/90 to-[#0e102e]/95 border-2 border-purple-500/30 shadow-[0_0_40px_rgba(139,92,246,0.25)] overflow-hidden select-none">
      {/* Background Cosmic Starfield Glows */}
      <div className="absolute -top-16 -left-16 w-64 h-64 rounded-full bg-purple-600/20 blur-[90px] pointer-events-none" />
      <div className="absolute -bottom-16 -right-16 w-72 h-72 rounded-full bg-cyan-500/20 blur-[100px] pointer-events-none" />

      {/* Header Info */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 text-xs font-black uppercase tracking-wider mb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#FACC15]" />
            Quest Island Map
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
            {topicTitle} <span className="text-yellow-400">Challenge Road</span> 🗺️
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 font-medium mt-0.5">
            Complete each level step-by-step to unlock the Grandmaster Crown!
          </p>
        </div>

        {/* Legend Pills */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.05] border border-white/10 text-[11px] font-bold text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#10B981]" />
            Done
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.05] border border-white/10 text-[11px] font-bold text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22D3EE] animate-ping" />
            Current
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.05] border border-white/10 text-[11px] font-bold text-slate-300">
            <Lock className="w-3 h-3 text-slate-400" />
            Locked
          </div>
        </div>
      </div>

      {/* Candy Crush Styled Winding Path & Level Nodes */}
      <div className="relative py-10 px-2 sm:px-6">
        {/* Dotted / Neon SVG Path connecting nodes */}
        <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 hidden md:block pointer-events-none">
          <svg className="w-full h-24" viewBox="0 0 800 100" fill="none" preserveAspectRatio="none">
            <path
              d="M 50,50 Q 250,15 450,50 T 750,50"
              stroke="rgba(168, 85, 247, 0.35)"
              strokeWidth="6"
              strokeDasharray="10 10"
              strokeLinecap="round"
            />
            <path
              d="M 50,50 Q 250,15 450,50 T 750,50"
              stroke="url(#pathGlow)"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <defs>
              <linearGradient id="pathGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#A855F7" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#FACC15" stopOpacity="0.8" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Level Nodes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 relative z-10">
          {levels.map((lvl, index) => {
            const isSelected = selectedLevelId === lvl.id;
            const isLocked = lvl.state === "locked";
            const isCompleted = lvl.state === "completed";
            const isUnlocked = lvl.state === "unlocked";

            return (
              <motion.div
                key={lvl.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="flex flex-col items-center text-center group"
              >
                {/* Level Circle Node */}
                <div className="relative">
                  {/* Pulsing Beacon Ring for Current Unlocked Level */}
                  {isUnlocked && (
                    <div className="absolute -inset-2.5 rounded-full bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 opacity-75 blur-md animate-pulse pointer-events-none" />
                  )}

                  <motion.button
                    type="button"
                    onClick={() => !isLocked && onSelectLevel(lvl.id)}
                    disabled={isLocked}
                    whileHover={!isLocked ? { scale: 1.1, y: -4 } : {}}
                    whileTap={!isLocked ? { scale: 0.95 } : {}}
                    className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-full flex flex-col items-center justify-center transition-all duration-300 shadow-2xl border-4 ${
                      isCompleted
                        ? "bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-400 border-emerald-300/80 shadow-[0_0_30px_rgba(16,185,129,0.5)] cursor-pointer"
                        : isUnlocked
                        ? "bg-gradient-to-tr from-cyan-500 via-indigo-600 to-purple-600 border-cyan-300 shadow-[0_0_35px_rgba(34,211,238,0.7)] cursor-pointer ring-4 ring-purple-400/40"
                        : "bg-slate-900/90 border-slate-700/60 opacity-60 cursor-not-allowed text-slate-500 shadow-none"
                    } ${isSelected ? "ring-4 ring-yellow-400 scale-105" : ""}`}
                  >
                    {/* Inner Icon or Level Number */}
                    {isCompleted ? (
                      <div className="flex flex-col items-center">
                        <Check className="w-8 h-8 sm:w-9 sm:h-9 text-white stroke-[3.5] drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" />
                      </div>
                    ) : isUnlocked ? (
                      <div className="flex flex-col items-center">
                        {lvl.levelNumber === 4 ? (
                          <Crown className="w-7 h-7 sm:w-8 sm:h-8 text-yellow-300 animate-bounce" />
                        ) : (
                          <Play className="w-7 h-7 sm:w-8 sm:h-8 text-white fill-white ml-1 drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                        )}
                        <span className="text-[10px] font-black text-cyan-200 uppercase tracking-wider mt-0.5">
                          Play
                        </span>
                      </div>
                    ) : (
                      <Lock className="w-7 h-7 sm:w-8 sm:h-8 text-slate-500" />
                    )}

                    {/* Level Number Badge Top Corner */}
                    <div
                      className={`absolute -top-2 -right-1 w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shadow-md border-2 ${
                        isCompleted
                          ? "bg-emerald-400 text-slate-950 border-white"
                          : isUnlocked
                          ? "bg-yellow-400 text-slate-950 border-white"
                          : "bg-slate-800 text-slate-400 border-slate-600"
                      }`}
                    >
                      {lvl.levelNumber}
                    </div>
                  </motion.button>
                </div>

                {/* Stars Display (for completed or unlocked) */}
                <div className="flex items-center gap-1 mt-3 h-5">
                  {[1, 2, 3].map((star) => (
                    <Star
                      key={star}
                      className={`w-3.5 h-3.5 ${
                        star <= lvl.stars
                          ? "text-yellow-400 fill-yellow-400 filter drop-shadow-[0_0_6px_rgba(250,204,21,0.8)]"
                          : "text-slate-600 fill-slate-800 opacity-40"
                      }`}
                    />
                  ))}
                </div>

                {/* Level Title & Subtitle */}
                <div className="mt-2 space-y-0.5">
                  <h3
                    className={`text-sm sm:text-base font-black ${
                      isUnlocked
                        ? "text-yellow-300 drop-shadow-[0_0_10px_rgba(250,204,21,0.4)]"
                        : isCompleted
                        ? "text-emerald-300"
                        : "text-slate-400"
                    }`}
                  >
                    {lvl.title}
                  </h3>
                  <p className="text-xs text-slate-300 font-medium">
                    {lvl.subtitle}
                  </p>
                  <div className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-white/[0.06] border border-white/10 text-[10px] font-bold text-amber-300">
                    +{lvl.xpReward} XP
                  </div>
                </div>

                {/* Select / Active Indicator */}
                {isSelected && (
                  <div className="mt-2 text-[10px] font-black text-cyan-300 bg-cyan-400/20 px-2 py-0.5 rounded-full border border-cyan-400/40">
                    Active Quiz
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
