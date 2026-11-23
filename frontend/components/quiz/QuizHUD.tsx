"use client";

import React from "react";
import { motion } from "framer-motion";
import { Heart, Hourglass, Star, Flame, Trophy } from "lucide-react";

interface QuizHUDProps {
  currentQuestion: number;
  totalQuestions: number;
  lives: number; // 0 to 3
  maxLives?: number;
  timeRemaining: number; // in seconds
  xpEarned: number;
  streak: number;
  levelTitle: string;
}

export function QuizHUD({
  currentQuestion,
  totalQuestions,
  lives,
  maxLives = 3,
  timeRemaining,
  xpEarned,
  streak,
  levelTitle,
}: QuizHUDProps) {
  const progressPercent = Math.min(
    100,
    Math.round(((currentQuestion) / totalQuestions) * 100)
  );

  return (
    <div className="w-full space-y-3 select-none">
      {/* Top HUD Badges Row */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 px-1">
        {/* Left: Level Title & Question Badge */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-purple-500/20 border border-purple-400/40 shadow-[0_0_15px_rgba(168,85,247,0.25)] backdrop-blur-md">
            <Trophy className="w-4 h-4 text-purple-300" />
            <span className="text-xs sm:text-sm font-black text-purple-200">
              {levelTitle}
            </span>
          </div>

          {streak >= 2 && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-2xl bg-gradient-to-r from-orange-500/25 to-amber-500/25 border border-orange-400/50 shadow-[0_0_15px_rgba(249,115,22,0.35)]"
            >
              <Flame className="w-4 h-4 text-orange-400 animate-pulse fill-orange-400" />
              <span className="text-xs font-black text-amber-300">
                {streak}x Combo!
              </span>
            </motion.div>
          )}
        </div>

        {/* Right Stats: Lives, Timer, XP */}
        <div className="flex items-center gap-2 sm:gap-3 ml-auto">
          {/* Lives (Hearts) */}
          <div className="flex items-center gap-1 px-3 py-1.5 rounded-2xl bg-rose-500/15 border border-rose-400/35 shadow-[0_0_15px_rgba(244,63,94,0.2)] backdrop-blur-md">
            {Array.from({ length: maxLives }).map((_, i) => {
              const isAlive = i < lives;
              return (
                <motion.div
                  key={i}
                  animate={isAlive ? { scale: [1, 1.15, 1] } : { scale: 0.85 }}
                  transition={{
                    repeat: isAlive ? Infinity : 0,
                    repeatDelay: 2.5 + i * 0.4,
                    duration: 0.6,
                  }}
                >
                  <Heart
                    className={`w-4 h-4 sm:w-4.5 sm:h-4.5 transition-colors duration-300 ${
                      isAlive
                        ? "text-rose-400 fill-rose-500 filter drop-shadow-[0_0_6px_rgba(244,63,94,0.6)]"
                        : "text-slate-600 fill-slate-800 opacity-40"
                    }`}
                  />
                </motion.div>
              );
            })}
          </div>

          {/* Timer with Hourglass */}
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl border backdrop-blur-md transition-colors ${
              timeRemaining <= 10
                ? "bg-rose-500/25 border-rose-400/60 shadow-[0_0_15px_rgba(244,63,94,0.4)] text-rose-300 animate-pulse"
                : "bg-cyan-500/15 border-cyan-400/35 shadow-[0_0_15px_rgba(6,182,212,0.2)] text-cyan-200"
            }`}
          >
            <Hourglass
              className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
                timeRemaining <= 10 ? "text-rose-400" : "text-cyan-300"
              }`}
            />
            <span className="text-xs sm:text-sm font-mono font-black">
              {timeRemaining}s
            </span>
          </div>

          {/* XP Star */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-amber-500/15 border border-amber-400/40 shadow-[0_0_15px_rgba(245,158,11,0.25)] backdrop-blur-md">
            <Star className="w-4 h-4 text-amber-300 fill-amber-400 filter drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
            <span className="text-xs sm:text-sm font-black text-amber-300">
              +{xpEarned} XP
            </span>
          </div>
        </div>
      </div>

      {/* Chunky Colorful Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs font-black text-slate-300 px-1">
          <span className="text-cyan-300">
            Question {currentQuestion} of {totalQuestions}
          </span>
          <span className="text-purple-300">{progressPercent}% Completed</span>
        </div>
        <div className="relative w-full h-3.5 sm:h-4 rounded-full bg-[#0a0d26]/80 border-2 border-white/15 p-0.5 overflow-hidden shadow-inner">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.7)]"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
          />
        </div>
      </div>
    </div>
  );
}
