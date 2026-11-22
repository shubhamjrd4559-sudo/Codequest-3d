"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  XCircle,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Trophy,
  Award,
  Zap,
  Star,
} from "lucide-react";
import { RobotMascot } from "@/components/characters/RobotMascot";
import { QuizHUD } from "./QuizHUD";
import { ConfettiBurst } from "./ConfettiBurst";

export interface Question {
  id: number;
  question: string;
  robotHint: string;
  options: {
    key: string;
    text: string;
    isCorrect: boolean;
  }[];
  explanation: string;
  xpReward: number;
}

// School-level math and logic questions for Classes 8-12 (No raw code syntax!)
export const TOPIC_LEVEL_QUESTIONS: Record<number, Question[]> = {
  // Level 1: Foundation (Basics & Intuition)
  1: [
    {
      id: 101,
      question:
        "Imagine a row of 5 school lockers numbered starting at 0 (0, 1, 2, 3, 4). Which locker is at index 2?",
      robotHint: "Remember, computer scientists always start counting lockers from 0!",
      options: [
        { key: "A", text: "The 1st locker in line", isCorrect: false },
        { key: "B", text: "The 3rd locker in line", isCorrect: true },
        { key: "C", text: "The 2nd locker in line", isCorrect: false },
        { key: "D", text: "The 4th locker in line", isCorrect: false },
      ],
      explanation:
        "Index 0 is the 1st locker, Index 1 is the 2nd, and Index 2 is the 3rd locker in line!",
      xpReward: 50,
    },
    {
      id: 102,
      question:
        "If an array has 8 toy boxes numbered from index 0 to 7, what is the index of the very LAST box?",
      robotHint: "If total length is N, the last spot is always N minus 1!",
      options: [
        { key: "A", text: "Index 8", isCorrect: false },
        { key: "B", text: "Index 0", isCorrect: false },
        { key: "C", text: "Index 7", isCorrect: true },
        { key: "D", text: "Index 9", isCorrect: false },
      ],
      explanation:
        "Because counting starts at 0, an array of 8 elements ends at index (8 - 1) = 7.",
      xpReward: 50,
    },
    {
      id: 103,
      question:
        "Why can you open any locker in an array instantly in just 1 single step (Constant Time)?",
      robotHint: "Think of an apartment address formula: Base + (Locker Number)!",
      options: [
        { key: "A", text: "You must search every locker one by one", isCorrect: false },
        { key: "B", text: "The robot calculates the exact memory position immediately", isCorrect: true },
        { key: "C", text: "Because lockers are randomly scattered everywhere", isCorrect: false },
        { key: "D", text: "Only lucky guesses work in 1 step", isCorrect: false },
      ],
      explanation:
        "Arrays sit in continuous memory! The computer calculates the exact address instantly: Start + (Index × Size).",
      xpReward: 50,
    },
  ],

  // Level 2: Core Logic (Traversal & Index Magic)
  2: [
    {
      id: 201,
      question:
        "A toy train has 4 boxes: [Apple, Banana, Cherry, Mango]. If you replace the item at index 1 with 'Orange', what is the new train?",
      robotHint: "Index 1 points to the 2nd box. What gets swapped out?",
      options: [
        { key: "A", text: "[Orange, Banana, Cherry, Mango]", isCorrect: false },
        { key: "B", text: "[Apple, Orange, Cherry, Mango]", isCorrect: true },
        { key: "C", text: "[Apple, Banana, Orange, Mango]", isCorrect: false },
        { key: "D", text: "[Apple, Banana, Cherry, Orange]", isCorrect: false },
      ],
      explanation:
        "Index 0 is Apple, Index 1 is Banana. Replacing index 1 replaces Banana with Orange!",
      xpReward: 60,
    },
    {
      id: 202,
      question:
        "You are searching for a gold coin hidden in 10 unsorted mystery boxes. In the WORST case, how many boxes must you check?",
      robotHint: "What if the coin is hiding in the very last box you open?",
      options: [
        { key: "A", text: "Only 1 box", isCorrect: false },
        { key: "B", text: "5 boxes", isCorrect: false },
        { key: "C", text: "All 10 boxes", isCorrect: true },
        { key: "D", text: "100 boxes", isCorrect: false },
      ],
      explanation:
        "In Linear Search on unsorted items, the target could be in the very last box, so you may need to check all 10 boxes (O(N)).",
      xpReward: 60,
    },
    {
      id: 203,
      question:
        "If you want to read all items in an array from the first box to the last box, what is this process called?",
      robotHint: "Like walking across a bridge from start to finish!",
      options: [
        { key: "A", text: "Array Traversal (Visiting each element)", isCorrect: true },
        { key: "B", text: "Array Deletion", isCorrect: false },
        { key: "C", text: "Binary Inversion", isCorrect: false },
        { key: "D", text: "Random Shuffle", isCorrect: false },
      ],
      explanation:
        "Visiting each element one after another in order is called Array Traversal!",
      xpReward: 60,
    },
  ],

  // Level 3: Pattern Builder (Puzzles & Swaps)
  3: [
    {
      id: 301,
      question:
        "You have an array [5, 10, 15, 20]. If you swap the element at index 0 with the element at index 3, what is the result?",
      robotHint: "Swap the first element with the last element!",
      options: [
        { key: "A", text: "[20, 10, 15, 5]", isCorrect: true },
        { key: "B", text: "[5, 20, 15, 10]", isCorrect: false },
        { key: "C", text: "[20, 15, 10, 5]", isCorrect: false },
        { key: "D", text: "[10, 5, 20, 15]", isCorrect: false },
      ],
      explanation:
        "Index 0 (5) and Index 3 (20) exchange places, leaving [20, 10, 15, 5].",
      xpReward: 75,
    },
    {
      id: 302,
      question:
        "Two Pointers Trick: To reverse an array of 6 items, you swap the outer ends and move inward. How many total swaps do you need?",
      robotHint: "Pair 1 with 6, Pair 2 with 5, Pair 3 with 4. Count the pairs!",
      options: [
        { key: "A", text: "6 swaps", isCorrect: false },
        { key: "B", text: "3 swaps", isCorrect: true },
        { key: "C", text: "12 swaps", isCorrect: false },
        { key: "D", text: "1 swap", isCorrect: false },
      ],
      explanation:
        "For an array of size 6, there are 3 pairs (6 ÷ 2). Each swap fixes 2 elements at once, so only 3 swaps are needed!",
      xpReward: 75,
    },
    {
      id: 303,
      question:
        "What is the maximum number of items a fixed array of size 10 can store without creating a new array?",
      robotHint: "Can a lunchbox with 10 slots hold 11 sandwiches?",
      options: [
        { key: "A", text: "Unlimited items", isCorrect: false },
        { key: "B", text: "Exactly 10 items", isCorrect: true },
        { key: "C", text: "9 items", isCorrect: false },
        { key: "D", text: "20 items", isCorrect: false },
      ],
      explanation:
        "Static arrays have a fixed memory capacity. A size 10 array holds at most 10 items.",
      xpReward: 75,
    },
  ],

  // Level 4: Grandmaster (Crown Challenge)
  4: [
    {
      id: 401,
      question:
        "Grandmaster Riddle: 16 students stand in order of their roll numbers (1 to 16). In Binary Search, each guess cuts the line in HALF. What is the MAXIMUM guesses needed?",
      robotHint: "16 -> 8 -> 4 -> 2 -> 1. Count how many times you can cut in half!",
      options: [
        { key: "A", text: "16 guesses", isCorrect: false },
        { key: "B", text: "4 guesses", isCorrect: true },
        { key: "C", text: "8 guesses", isCorrect: false },
        { key: "D", text: "2 guesses", isCorrect: false },
      ],
      explanation:
        "16 cuts to 8 (1), to 4 (2), to 2 (3), to 1 (4). At most 4 guesses! That's log₂(16) = 4 steps!",
      xpReward: 100,
    },
    {
      id: 402,
      question:
        "A game leaderboard array has scores [90, 80, 70, 60]. If a new player scores 85, where should they insert to keep it sorted descending?",
      robotHint: "Between which two scores does 85 belong?",
      options: [
        { key: "A", text: "At index 0 (before 90)", isCorrect: false },
        { key: "B", text: "At index 1 (between 90 and 80)", isCorrect: true },
        { key: "C", text: "At index 3 (between 70 and 60)", isCorrect: false },
        { key: "D", text: "At the very end", isCorrect: false },
      ],
      explanation:
        "Since 90 > 85 > 80, 85 belongs right after index 0, at index 1! Elements after it shift right.",
      xpReward: 100,
    },
    {
      id: 403,
      question:
        "Grandmaster Crown Check: Why are arrays called the bedrock of all computer data structures?",
      robotHint: "Look at Stacks, Queues, Hash Tables, and Heaps — what are they all built inside?",
      options: [
        { key: "A", text: "Because they use the least amount of electricity", isCorrect: false },
        { key: "B", text: "Because almost every other data structure uses an array underneath", isCorrect: true },
        { key: "C", text: "Because they can only store numbers", isCorrect: false },
        { key: "D", text: "Because they delete themselves automatically", isCorrect: false },
      ],
      explanation:
        "Stacks, Queues, Hash Tables, Heaps, and Matrix grids are all built using Arrays as their underlying memory engine!",
      xpReward: 100,
    },
  ],
};

interface GamifiedQuizProps {
  levelId: number;
  levelTitle: string;
  onCompleteLevel: (levelId: number, earnedXp: number, stars: number) => void;
  onBackToMap: () => void;
}

export function GamifiedQuiz({
  levelId,
  levelTitle,
  onCompleteLevel,
  onBackToMap,
}: GamifiedQuizProps) {
  const questions = TOPIC_LEVEL_QUESTIONS[levelId] || TOPIC_LEVEL_QUESTIONS[1];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [lives, setLives] = useState(3);
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isWrongShake, setIsWrongShake] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isLevelFinished, setIsLevelFinished] = useState(false);

  const currentQ = questions[currentIndex];
  const isAnswered = selectedKey !== null;
  const isCorrect = isAnswered && currentQ.options.find((o) => o.key === selectedKey)?.isCorrect;

  // Countdown timer
  useEffect(() => {
    if (isAnswered || isLevelFinished || isGameOver) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          // Time out! Lose a life
          handleTimeOut();
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentIndex, isAnswered, isLevelFinished, isGameOver]);

  const handleTimeOut = () => {
    setLives((prev) => {
      const nextLives = Math.max(0, prev - 1);
      if (nextLives === 0) {
        setIsGameOver(true);
      }
      return nextLives;
    });
    setStreak(0);
    setSelectedKey("TIMEOUT");
  };

  const handleSelectOption = (key: string) => {
    if (isAnswered) return;

    setSelectedKey(key);
    const chosen = currentQ.options.find((o) => o.key === key);

    if (chosen?.isCorrect) {
      // Correct!
      setShowConfetti(true);
      setScore((prev) => prev + currentQ.xpReward);
      setStreak((prev) => prev + 1);
      setTimeout(() => setShowConfetti(false), 1800);
    } else {
      // Incorrect!
      setIsWrongShake(true);
      setStreak(0);
      setLives((prev) => {
        const next = Math.max(0, prev - 1);
        if (next === 0) {
          setTimeout(() => setIsGameOver(true), 1200);
        }
        return next;
      });
      setTimeout(() => setIsWrongShake(false), 800);
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedKey(null);
      setTimeRemaining(30);
    } else {
      // Level Completed!
      setIsLevelFinished(true);
      const calculatedStars = lives === 3 ? 3 : lives === 2 ? 2 : 1;
      onCompleteLevel(levelId, score, calculatedStars);
    }
  };

  const handleRetry = () => {
    setCurrentIndex(0);
    setSelectedKey(null);
    setLives(3);
    setTimeRemaining(30);
    setScore(0);
    setStreak(0);
    setIsGameOver(false);
    setIsLevelFinished(false);
  };

  // Option Neon Color Palette (Blue, Purple, Pink, Orange)
  const optionColors = [
    {
      border: "border-cyan-400/50",
      bg: "bg-cyan-500/10 hover:bg-cyan-500/20",
      glow: "hover:shadow-[0_0_20px_rgba(6,182,212,0.4)]",
      badgeBg: "bg-cyan-500/30 text-cyan-200 border-cyan-400/60",
    },
    {
      border: "border-purple-400/50",
      bg: "bg-purple-500/10 hover:bg-purple-500/20",
      glow: "hover:shadow-[0_0_20px_rgba(168,85,247,0.4)]",
      badgeBg: "bg-purple-500/30 text-purple-200 border-purple-400/60",
    },
    {
      border: "border-pink-400/50",
      bg: "bg-pink-500/10 hover:bg-pink-500/20",
      glow: "hover:shadow-[0_0_20px_rgba(236,72,153,0.4)]",
      badgeBg: "bg-pink-500/30 text-pink-200 border-pink-400/60",
    },
    {
      border: "border-amber-400/50",
      bg: "bg-amber-500/10 hover:bg-amber-500/20",
      glow: "hover:shadow-[0_0_20px_rgba(245,158,11,0.4)]",
      badgeBg: "bg-amber-500/30 text-amber-200 border-amber-400/60",
    },
  ];

  return (
    <div className="relative w-full space-y-6">
      {/* Confetti Explosion on Correct Answer */}
      <ConfettiBurst trigger={showConfetti} />

      {/* Top Heads-Up Display (HUD) */}
      <QuizHUD
        currentQuestion={currentIndex + 1}
        totalQuestions={questions.length}
        lives={lives}
        timeRemaining={timeRemaining}
        xpEarned={score}
        streak={streak}
        levelTitle={levelTitle}
      />

      {/* GAME OVER STATE */}
      {isGameOver ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-[32px] p-8 text-center bg-[#151138]/95 border-2 border-rose-500/40 shadow-[0_0_40px_rgba(244,63,94,0.3)] space-y-5"
        >
          <div className="text-6xl animate-bounce">💔</div>
          <h2 className="text-3xl font-black text-white">Out of Lives!</h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-md mx-auto">
            No worries at all! Coding is all about experimenting and trying again.
            Take a deep breath and give it another shot!
          </p>
          <div className="flex items-center justify-center gap-4 pt-3">
            <button
              onClick={handleRetry}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-black text-sm shadow-[0_0_20px_rgba(34,211,238,0.5)] hover:scale-105 transition-transform"
            >
              <RotateCcw className="w-4 h-4" /> Try Again
            </button>
            <button
              onClick={onBackToMap}
              className="px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-black text-sm transition-colors"
            >
              Back to Level Map
            </button>
          </div>
        </motion.div>
      ) : isLevelFinished ? (
        /* VICTORY CELEBRATION STATE */
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-[32px] p-8 text-center bg-gradient-to-br from-[#132338]/95 via-[#182a4d]/90 to-[#0e162e]/95 border-2 border-emerald-400/50 shadow-[0_0_50px_rgba(16,185,129,0.35)] space-y-6"
        >
          <div className="text-7xl">🏆</div>
          <div className="space-y-1">
            <span className="px-3.5 py-1 rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/40 text-xs font-black uppercase tracking-wider">
              Level Mastered!
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              Awesome Job, Hero! 🎉
            </h2>
            <p className="text-slate-300 text-sm max-w-md mx-auto">
              You crushed this DSA challenge and earned your victory stars!
            </p>
          </div>

          {/* Stars & XP Box */}
          <div className="flex items-center justify-center gap-6 py-3">
            <div className="flex flex-col items-center">
              <div className="flex gap-1.5">
                {[1, 2, 3].map((star) => (
                  <Star
                    key={star}
                    className={`w-7 h-7 ${
                      star <= (lives === 3 ? 3 : lives === 2 ? 2 : 1)
                        ? "text-yellow-400 fill-yellow-400 filter drop-shadow-[0_0_10px_rgba(250,204,21,0.8)]"
                        : "text-slate-600 fill-slate-800"
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs font-bold text-slate-400 mt-1">
                {lives === 3 ? "3 Stars (Flawless!)" : `${lives} Stars`}
              </span>
            </div>

            <div className="h-10 w-px bg-white/20" />

            <div className="flex flex-col items-center">
              <span className="text-2xl font-black text-yellow-300 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]">
                +{score} XP
              </span>
              <span className="text-xs font-bold text-slate-400 mt-0.5">
                Total XP Earned
              </span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 pt-2">
            <button
              onClick={onBackToMap}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400 text-slate-950 font-black text-sm shadow-[0_0_25px_rgba(250,204,21,0.6)] hover:scale-105 transition-transform"
            >
              Continue on Road Map <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>
          </div>
        </motion.div>
      ) : (
        /* ACTIVE QUESTION CARD WITH 3D ROBOT MASCOT */
        <motion.div
          animate={isWrongShake ? { x: [-12, 12, -9, 9, -5, 5, 0] } : {}}
          transition={{ duration: 0.5 }}
          className="relative rounded-[32px] p-6 sm:p-8 bg-gradient-to-br from-[#12143d]/95 via-[#181a54]/90 to-[#0e1030]/95 border-2 border-purple-500/35 shadow-[0_0_35px_rgba(139,92,246,0.25)] overflow-hidden"
        >
          {/* Ambient Cosmic Orbs */}
          <div className="absolute top-0 right-1/4 w-80 h-80 rounded-full bg-purple-600/20 blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-10 w-72 h-72 rounded-full bg-cyan-600/20 blur-[100px] pointer-events-none" />

          {/* Grid Layout: Robot Mascot + Question Bubble */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Robot Mascot (Left Column) */}
            <div className="lg:col-span-4 flex flex-col items-center justify-center relative">
              <div className="relative">
                <RobotMascot size="md" className="drop-shadow-[0_0_25px_rgba(6,182,212,0.6)]" />
                {/* Robot Badge */}
                <div className="mt-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-[11px] font-black text-cyan-300 uppercase tracking-widest text-center shadow-glass-sm">
                  AI Quiz Buddy 🤖
                </div>
              </div>
            </div>

            {/* Question Text & Speech Bubble (Right Column) */}
            <div className="lg:col-span-8 space-y-4">
              {/* Robot Speech Bubble */}
              <div className="relative p-5 sm:p-6 rounded-3xl bg-[#0a0d2a]/90 border-2 border-cyan-400/30 shadow-[0_0_25px_rgba(6,182,212,0.2)] backdrop-blur-xl">
                {/* Speech Bubble Pointer */}
                <div className="hidden lg:block absolute -left-3 top-10 w-4 h-4 bg-[#0a0d2a] border-l-2 border-b-2 border-cyan-400/30 transform rotate-45" />

                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-black uppercase tracking-wider text-yellow-300">
                    💡 Robot Riddle
                  </span>
                  <span className="text-xs text-slate-400">• {currentQ.robotHint}</span>
                </div>

                <h3 className="text-lg sm:text-xl md:text-2xl font-black text-white leading-snug">
                  {currentQ.question}
                </h3>
              </div>
            </div>
          </div>

          {/* 4 VIBRANT NEON MCQ OPTIONS (The Mazedar Part) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
            {currentQ.options.map((opt, idx) => {
              const isSelected = selectedKey === opt.key;
              const isThisCorrect = opt.isCorrect;
              const colorTheme = optionColors[idx % optionColors.length];

              // Dynamic styling based on answer state
              let buttonCls = `relative flex items-center justify-between p-4 sm:p-5 rounded-2xl border-2 text-left font-extrabold text-sm sm:text-base transition-all duration-300 backdrop-blur-xl cursor-pointer ${colorTheme.border} ${colorTheme.bg} ${colorTheme.glow}`;

              if (isAnswered) {
                if (isThisCorrect) {
                  // Bright Neon Green on correct
                  buttonCls =
                    "relative flex items-center justify-between p-4 sm:p-5 rounded-2xl border-2 border-emerald-400 bg-emerald-500/25 text-emerald-200 shadow-[0_0_30px_rgba(16,185,129,0.7)] scale-[1.02] transition-all";
                } else if (isSelected && !isThisCorrect) {
                  // Neon Red on chosen incorrect
                  buttonCls =
                    "relative flex items-center justify-between p-4 sm:p-5 rounded-2xl border-2 border-rose-500 bg-rose-500/25 text-rose-200 shadow-[0_0_25px_rgba(244,63,94,0.6)] transition-all";
                } else {
                  buttonCls =
                    "relative flex items-center justify-between p-4 sm:p-5 rounded-2xl border-2 border-white/10 bg-white/[0.02] text-slate-500 opacity-40 cursor-not-allowed";
                }
              }

              return (
                <motion.button
                  key={opt.key}
                  type="button"
                  onClick={() => handleSelectOption(opt.key)}
                  disabled={isAnswered}
                  whileHover={!isAnswered ? { scale: 1.03 } : {}}
                  whileTap={!isAnswered ? { scale: 0.98 } : {}}
                  className={buttonCls}
                >
                  <div className="flex items-center gap-3.5">
                    {/* Option Key Badge (A, B, C, D) */}
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-black font-mono text-sm border-2 ${
                        isAnswered && isThisCorrect
                          ? "bg-emerald-400 text-slate-950 border-white"
                          : isAnswered && isSelected && !isThisCorrect
                          ? "bg-rose-500 text-white border-white"
                          : colorTheme.badgeBg
                      }`}
                    >
                      {opt.key}
                    </div>
                    <span className="text-white font-bold">{opt.text}</span>
                  </div>

                  {/* Icon Indicator */}
                  {isAnswered && isThisCorrect && (
                    <CheckCircle2 className="w-6 h-6 text-emerald-300 shrink-0 filter drop-shadow-[0_0_8px_#10B981]" />
                  )}
                  {isAnswered && isSelected && !isThisCorrect && (
                    <XCircle className="w-6 h-6 text-rose-300 shrink-0 filter drop-shadow-[0_0_8px_#F43F5E]" />
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* EXPLANATION & NEXT QUESTION BAR */}
          <AnimatePresence>
            {isAnswered && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="mt-6 p-5 rounded-2xl bg-[#080b24]/90 border-2 border-white/20 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    {isCorrect ? (
                      <span className="inline-flex items-center gap-1.5 text-sm font-black text-emerald-300">
                        <Sparkles className="w-4 h-4 text-yellow-400" /> Super Genius! +{currentQ.xpReward} XP Earned!
                      </span>
                    ) : (
                      <span className="text-sm font-black text-rose-400">
                        Oops! Let's check the solution together:
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
                    {currentQ.explanation}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleNextQuestion}
                  className="shrink-0 inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400 text-slate-950 font-black text-sm shadow-[0_0_20px_rgba(250,204,21,0.6)] hover:scale-105 active:scale-95 transition-all"
                >
                  {currentIndex < questions.length - 1 ? (
                    <>
                      Next Challenge <ArrowRight className="w-4 h-4 stroke-[3]" />
                    </>
                  ) : (
                    <>
                      Complete Level <Trophy className="w-4 h-4" />
                    </>
                  )}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
