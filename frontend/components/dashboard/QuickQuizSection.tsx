"use client";

import React, { useState } from "react";
import { HelpCircle, CheckCircle2, XCircle, Sparkles, ArrowRight, RotateCcw } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { RobotMascot } from "@/components/characters/RobotMascot";

interface Question {
  id: number;
  category: string;
  difficulty: "Easy" | "Medium";
  question: string;
  options: { key: string; text: string; correct: boolean }[];
  explanation: string;
  xpReward: number;
}

const DEFAULT_QUIZ_QUESTIONS: Question[] = [
  {
    id: 1,
    category: "Arrays & Memory",
    difficulty: "Easy",
    question: "What is the time complexity to access an element at a given index in a standard contiguous array?",
    options: [
      { key: "A", text: "O(1) Constant Time", correct: true },
      { key: "B", text: "O(n) Linear Time", correct: false },
      { key: "C", text: "O(log n) Logarithmic Time", correct: false },
      { key: "D", text: "O(n²) Quadratic Time", correct: false },
    ],
    explanation: "Memory addresses in an array are computed directly as Base + (Index × Size), allowing instant O(1) direct random access.",
    xpReward: 50,
  },
  {
    id: 2,
    category: "Searching Algorithms",
    difficulty: "Easy",
    question: "What is the time complexity of Binary Search on a sorted array of size n?",
    options: [
      { key: "A", text: "O(n) Linear", correct: false },
      { key: "B", text: "O(log n) Logarithmic", correct: true },
      { key: "C", text: "O(n log n)", correct: false },
      { key: "D", text: "O(1) Constant", correct: false },
    ],
    explanation: "Binary search eliminates half the remaining elements with each comparison, running in O(log n) time.",
    xpReward: 75,
  },
  {
    id: 3,
    category: "Data Structures",
    difficulty: "Easy",
    question: "Which data structure operates on the Last-In, First-Out (LIFO) principle?",
    options: [
      { key: "A", text: "Queue", correct: false },
      { key: "B", text: "Stack", correct: true },
      { key: "C", text: "Linked List", correct: false },
      { key: "D", text: "Binary Tree", correct: false },
    ],
    explanation: "A Stack pushes elements on top and pops the most recently added element first (LIFO).",
    xpReward: 50,
  },
];

export function QuickQuizSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const currentQ = DEFAULT_QUIZ_QUESTIONS[currentIndex];
  const isAnswered = selectedAnswer !== null;
  const isCorrect = isAnswered && currentQ.options.find((o) => o.key === selectedAnswer)?.correct;

  const handleSelectOption = (key: string) => {
    if (isAnswered) return;
    setSelectedAnswer(key);
    const chosen = currentQ.options.find((o) => o.key === key);
    if (chosen?.correct) {
      setScore((prev) => prev + currentQ.xpReward);
    }
  };

  const handleNext = () => {
    if (currentIndex < DEFAULT_QUIZ_QUESTIONS.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer(null);
    } else {
      setIsCompleted(true);
    }
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setIsCompleted(false);
  };

  return (
    <div className="relative rounded-[32px] bg-gradient-to-br from-[#15113d]/95 via-[#1a154e]/90 to-[#0e102d]/95 backdrop-blur-2xl border-2 border-purple-500/35 p-6 sm:p-7 shadow-[0_0_35px_rgba(139,92,246,0.25)] overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 right-1/4 w-72 h-72 rounded-full bg-purple-600/15 blur-[90px] pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-64 h-64 rounded-full bg-cyan-600/15 blur-[90px] pointer-events-none" />

      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 border-b border-white/10 pb-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 via-orange-500 to-purple-600 p-0.5 shadow-neon-amber">
            <div className="w-full h-full rounded-[14px] bg-[#0c0e26] flex items-center justify-center">
              <HelpCircle className="w-5 h-5 text-amber-300" />
            </div>
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-black text-white tracking-tight flex items-center gap-2">
              Daily Quiz Arena
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#FACC15]/20 text-[#FACC15] border border-[#FACC15]/30 font-bold uppercase tracking-wider">
                Live Challenge
              </span>
            </h3>
            <p className="text-xs text-slate-300 font-medium">
              Test your DSA knowledge and earn instant XP rewards!
            </p>
          </div>
        </div>

        {/* Badges / Tracker */}
        <div className="flex items-center gap-2">
          <Badge variant="cyan" size="sm" className="font-bold">
            {currentQ.category}
          </Badge>
          <Badge variant="purple" size="sm" className="font-black">
            Q. {currentIndex + 1} of {DEFAULT_QUIZ_QUESTIONS.length}
          </Badge>
          <Badge variant="xp" size="sm" className="font-black">
            +{currentQ.xpReward} XP
          </Badge>
        </div>
      </div>

      {isCompleted ? (
        /* Quiz Completion View */
        <div className="py-8 text-center space-y-4 relative z-10">
          <div className="text-5xl">🏆</div>
          <h4 className="text-2xl font-black text-white">
            Daily Quiz Completed!
          </h4>
          <p className="text-sm text-slate-300 max-w-md mx-auto">
            Awesome job! You earned{" "}
            <span className="text-[#FACC15] font-black text-base">+{score} XP</span> from today&apos;s DSA questions.
          </p>
          <div className="pt-2">
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-sm shadow-neon-purple transition-transform hover:scale-105"
            >
              <RotateCcw className="w-4 h-4" /> Practice Again
            </button>
          </div>
        </div>
      ) : (
        /* Active Question View */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10">
          {/* Question & Options (9 cols) */}
          <div className="lg:col-span-9 space-y-4">
            <p className="text-base sm:text-lg font-bold text-white leading-relaxed">
              {currentQ.question}
            </p>

            {/* 4 Interactive Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentQ.options.map((opt) => {
                const isSelected = selectedAnswer === opt.key;
                let optionStyle =
                  "bg-white/[0.04] hover:bg-white/[0.09] border-white/15 text-slate-200 hover:border-purple-400/40";

                if (isAnswered) {
                  if (opt.correct) {
                    optionStyle =
                      "bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.4)]";
                  } else if (isSelected && !opt.correct) {
                    optionStyle =
                      "bg-rose-500/20 border-rose-400 text-rose-300 shadow-neon-pink";
                  } else {
                    optionStyle = "bg-white/[0.02] border-white/10 text-slate-500 opacity-60";
                  }
                }

                return (
                  <button
                    key={opt.key}
                    onClick={() => handleSelectOption(opt.key)}
                    disabled={isAnswered}
                    className={`p-3.5 sm:p-4 rounded-2xl border-2 text-left text-xs sm:text-sm font-bold transition-all duration-200 flex items-center justify-between group ${optionStyle}`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center font-mono text-xs text-purple-300 group-hover:bg-purple-500/30">
                        {opt.key}
                      </span>
                      <span>{opt.text}</span>
                    </div>

                    {isAnswered && opt.correct && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    )}
                    {isAnswered && isSelected && !opt.correct && (
                      <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Feedback & Next Button */}
            {isAnswered && (
              <div className="p-4 rounded-2xl bg-white/[0.05] border border-white/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in duration-300">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    {isCorrect ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-black text-emerald-400">
                        <Sparkles className="w-3.5 h-3.5" /> Correct! +{currentQ.xpReward} XP Earned
                      </span>
                    ) : (
                      <span className="text-xs font-black text-rose-400">
                        Incorrect Answer
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {currentQ.explanation}
                  </p>
                </div>

                <button
                  onClick={handleNext}
                  className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#FACC15] to-[#F59E0B] hover:from-[#FDE047] hover:to-[#FACC15] text-[#1E1B4B] font-black text-xs sm:text-sm shadow-[0_0_15px_rgba(250,204,21,0.4)] shrink-0 transition-transform hover:scale-105 active:scale-95"
                >
                  {currentIndex < DEFAULT_QUIZ_QUESTIONS.length - 1 ? (
                    <>
                      Next Question <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                    </>
                  ) : (
                    <>
                      View Results <Sparkles className="w-4 h-4 stroke-[2.5]" />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Right Mascot Helper (3 cols) */}
          <div className="hidden lg:flex lg:col-span-3 flex-col items-center justify-center text-center p-3 rounded-2xl bg-white/[0.03] border border-white/10">
            <RobotMascot size="sm" className="w-20 h-24 mb-2 drop-shadow-[0_0_15px_rgba(6,182,212,0.5)]" />
            <div className="p-2.5 rounded-xl bg-purple-500/20 border border-purple-400/30 text-[11px] text-purple-200 font-semibold leading-snug">
              💡 <span className="font-bold text-[#FACC15]">Pro Tip:</span> Answer daily quizzes to maintain your learning streak!
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
