"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Copy,
  Check,
  Code2,
  Gamepad2,
  HelpCircle,
  Eye,
  Layers,
  Box,
  Loader2,
  Database,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Array3DStage } from "@/components/illustrations/Array3DStage";
import { RobotMascot } from "@/components/characters/RobotMascot";
import { topicsApi } from "@/lib/api/topics";
import { Topic, Lesson } from "@/lib/api/types";

export default function TopicLearningPage({
  params,
}: {
  params: { slug: string };
}) {
  const [leftTab, setLeftTab] = useState<"intro" | "explanation" | "code">("intro");
  const [rightTab, setRightTab] = useState<"visualization" | "minigame" | "quiz">("visualization");
  const [copied, setCopied] = useState(false);
  const [quizAnswer, setQuizAnswer] = useState<string | null>(null);

  const [topic, setTopic] = useState<Topic | null>(null);
  const [loading, setLoading] = useState(true);
  const [isBackendConnected, setIsBackendConnected] = useState(false);

  const fallbackTitle = params.slug
    ? params.slug.charAt(0).toUpperCase() + params.slug.slice(1)
    : "Arrays";

  useEffect(() => {
    let isMounted = true;
    async function fetchTopic() {
      try {
        const data = await topicsApi.getBySlug(params.slug);
        if (isMounted && data) {
          setTopic(data);
          setIsBackendConnected(true);
        }
      } catch {
        // Backend returned 404 (content not yet seeded) or network issue
        console.log(`Topic '${params.slug}' not yet seeded in backend database. Using interactive fallback.`);
        if (isMounted) {
          setIsBackendConnected(false);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchTopic();

    return () => {
      isMounted = false;
    };
  }, [params.slug]);

  const activeLesson: Lesson | undefined = topic?.lessons?.[0];

  const topicTitle = topic?.title || fallbackTitle;
  const topicDescription =
    activeLesson?.introduction ||
    topic?.description ||
    "An array is a collection of elements of the same data type, stored in contiguous memory locations. This allows constant-time O(1) access by index.";

  const topicExplanation =
    activeLesson?.explanation ||
    "Arrays provide indexed access to elements stored sequentially in memory. Because memory addresses are calculated as Base Address + (Index * Element Size), retrieval is instantaneous.";

  const defaultCppCode = `#include <iostream>
using namespace std;

int main() {
    // Fixed-size contiguous array
    int arr[5] = {1, 2, 3, 4, 5};

    // Print array elements in contiguous memory
    for (int i = 0; i < 5; i++) {
        cout << "arr[" << i << "] = " << arr[i] << endl;
    }

    return 0;
}`;

  const cppCode = activeLesson?.code_example || defaultCppCode;

  const handleCopy = () => {
    navigator.clipboard.writeText(cppCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      {/* Top Breadcrumb Bar */}
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-bold text-slate-300 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-purple-400" />
          Back to Topics
        </Link>

        <div className="flex items-center gap-2">
          {loading ? (
            <Badge variant="purple" size="sm">
              <Loader2 className="w-3 h-3 mr-1 animate-spin" /> Loading API...
            </Badge>
          ) : isBackendConnected ? (
            <Badge variant="success" size="sm">
              <Database className="w-3 h-3 mr-1" /> Live API Connected
            </Badge>
          ) : (
            <Badge variant="purple" size="sm">
              <Layers className="w-3 h-3 mr-1" /> {topicTitle} · Chapter 1
            </Badge>
          )}
          <Badge variant="xp" size="sm">
            +{topic?.total_xp || 300} XP
          </Badge>
        </div>
      </div>

      {/* Split Screen Grid (Replicating Gold Standard Image) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* ================= LEFT COLUMN: THEORY & CODE (5 COLS) ================= */}
        <div className="lg:col-span-5 space-y-4">
          {/* Left Column Tabs Header */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[#0e112b]/80 border border-white/10 backdrop-blur-xl">
            <button
              onClick={() => setLeftTab("intro")}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                leftTab === "intro"
                  ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-neon-purple"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Introduction
            </button>
            <button
              onClick={() => setLeftTab("explanation")}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                leftTab === "explanation"
                  ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-neon-purple"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Explanation
            </button>
            <button
              onClick={() => setLeftTab("code")}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                leftTab === "code"
                  ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-neon-purple"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Code Example
            </button>
          </div>

          {/* Left Main Card: Topic Overview */}
          <Card variant="glowPurple" className="p-5 sm:p-6 space-y-4">
            <div className="flex items-start gap-4">
              {/* 3D Isometric Cube Icon */}
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-500 p-0.5 shadow-neon-purple shrink-0">
                <div className="w-full h-full rounded-[14px] bg-[#0c0e26] flex items-center justify-center">
                  <Box className="w-6 h-6 text-purple-300" />
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-extrabold text-white tracking-tight">
                  {topicTitle}
                </h2>
                <p className="text-xs font-bold bg-gradient-to-r from-purple-300 to-cyan-300 bg-clip-text text-transparent">
                  {topic?.category || "Learn, Practice, and Level Up!"}
                </p>
              </div>
            </div>

            {/* 3D Mini Block Array Visual [1][2][3][4][5] */}
            <div className="flex items-center gap-1.5 p-2 rounded-2xl bg-white/[0.03] border border-white/10 overflow-x-auto">
              {[1, 2, 3, 4, 5].map((num) => (
                <div
                  key={num}
                  className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-700 flex flex-col items-center justify-center border border-cyan-400/40 shadow-[0_0_10px_rgba(6,182,212,0.3)] shrink-0"
                >
                  <span className="text-xs font-extrabold text-white">{num}</span>
                  <span className="text-[8px] font-mono text-cyan-200">[{num - 1}]</span>
                </div>
              ))}
            </div>

            {/* Content Switcher based on Tab */}
            {leftTab === "intro" && (
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {topicDescription}
              </p>
            )}

            {leftTab === "explanation" && (
              <div className="space-y-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
                <p>{topicExplanation}</p>
                {activeLesson?.real_life_example && (
                  <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10 mt-2">
                    <p className="text-[11px] font-bold text-amber-300 uppercase">
                      Real-Life Example:
                    </p>
                    <p className="text-xs text-slate-300 mt-1">
                      {activeLesson.real_life_example}
                    </p>
                  </div>
                )}
              </div>
            )}

            {leftTab === "code" && (
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Review the production-grade {activeLesson?.programming_language || "C++"} implementation below. Notice how the array elements reside next to each other in RAM.
              </p>
            )}

            {/* Complexity Badges */}
            <div className="pt-1 flex items-center gap-2 flex-wrap">
              <Badge variant="cyan" size="sm">
                Access: O(1)
              </Badge>
              <Badge variant="purple" size="sm">
                Search: O(n)
              </Badge>
              <Badge variant="warning" size="sm">
                Insertion: O(n)
              </Badge>
            </div>
          </Card>

          {/* Left Sub-Card: Code Example */}
          <Card variant="default" className="p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-purple-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-white">
                  {activeLesson?.programming_language || "C++"} Implementation
                </span>
              </div>
              <button
                onClick={handleCopy}
                aria-label="Copy Code"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-xs font-medium text-slate-300 hover:text-white transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-300">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            {/* Code Block Container */}
            <div className="rounded-2xl bg-[#070914] border border-white/10 p-3.5 font-mono text-xs overflow-x-auto shadow-inner text-slate-200">
              <pre className="leading-relaxed">
                <code>{cppCode}</code>
              </pre>
            </div>
          </Card>
        </div>

        {/* ================= RIGHT COLUMN: INTERACTIVE 3D PLAYGROUND (7 COLS) ================= */}
        <div className="lg:col-span-7 space-y-4">
          {/* Right Column Interactive Tabs Header */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[#0e112b]/80 border border-white/10 backdrop-blur-xl">
            <button
              onClick={() => setRightTab("visualization")}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                rightTab === "visualization"
                  ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-neon-purple"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              Visualization
            </button>
            <button
              onClick={() => setRightTab("minigame")}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                rightTab === "minigame"
                  ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-neon-purple"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Gamepad2 className="w-3.5 h-3.5" />
              Mini-Game
            </button>
            <button
              onClick={() => setRightTab("quiz")}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                rightTab === "quiz"
                  ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-neon-purple"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              Quiz
            </button>
          </div>

          {/* Right Tab Content */}
          <AnimatePresence mode="wait">
            {rightTab === "visualization" && (
              <motion.div
                key="viz"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3 }}
              >
                <Array3DStage />

                {/* Robot Mascot — floating guide companion bottom-left */}
                <div className="relative mt-3">
                  <div className="flex items-end gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-sm">
                    <RobotMascot size="sm" className="shrink-0" />
                    <div className="flex-1 space-y-1.5">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 text-[10px] font-bold uppercase tracking-wider">
                        💡 Pro Tip
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        An array stores elements in a{" "}
                        <span className="font-semibold text-cyan-300">linear order</span>.
                        Each element is accessible in constant time using its index.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {rightTab === "minigame" && (
              <motion.div
                key="game"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3 }}
              >
                <Card variant="glowCyan" className="p-6 sm:p-8 space-y-6 text-center">
                  <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center mx-auto shadow-neon-cyan">
                    <Gamepad2 className="w-8 h-8 text-white" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                      Array Number Block Adventure
                    </h3>
                    <p className="text-sm text-slate-300 max-w-md mx-auto">
                      Run across floating 3D array blocks, collect matching indices, and solve memory boundary obstacles!
                    </p>
                  </div>

                  <div className="flex items-center justify-center gap-4">
                    <Badge variant="purple" size="md">
                      Level 1 of 5
                    </Badge>
                    <Badge variant="xp" size="md">
                      Reward: +150 XP
                    </Badge>
                  </div>

                  <div>
                    <Button variant="cyan" size="lg" className="px-8 font-bold">
                      Launch 3D Game Challenge
                    </Button>
                  </div>
                </Card>
              </motion.div>
            )}

            {rightTab === "quiz" && (
              <motion.div
                key="quiz"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3 }}
              >
                <Card variant="glowAmber" className="p-6 sm:p-8 space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <HelpCircle className="w-5 h-5 text-amber-400" />
                      <h3 className="text-lg font-bold text-white">Quick Check Question</h3>
                    </div>
                    <Badge variant="warning" size="sm">
                      Question 1 of 3
                    </Badge>
                  </div>

                  <p className="text-sm sm:text-base font-semibold text-slate-200">
                    What is the time complexity to access an element at a given index in a standard array?
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { key: "A", text: "O(1) Constant Time", correct: true },
                      { key: "B", text: "O(n) Linear Time", correct: false },
                      { key: "C", text: "O(log n) Logarithmic Time", correct: false },
                      { key: "D", text: "O(n²) Quadratic Time", correct: false },
                    ].map((opt) => (
                      <button
                        key={opt.key}
                        onClick={() => setQuizAnswer(opt.key)}
                        className={`p-3.5 rounded-2xl border text-left text-xs sm:text-sm font-semibold transition-all ${
                          quizAnswer === opt.key
                            ? opt.correct
                              ? "bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-neon-emerald"
                              : "bg-rose-500/20 border-rose-400 text-rose-300"
                            : "bg-white/[0.04] border-white/10 text-slate-300 hover:bg-white/[0.08]"
                        }`}
                      >
                        <span className="font-mono text-purple-400 mr-2">[{opt.key}]</span>
                        {opt.text}
                      </button>
                    ))}
                  </div>

                  {quizAnswer && (
                    <div className="p-3.5 rounded-2xl bg-white/[0.05] border border-white/10 flex items-center justify-between">
                      <span className="text-xs font-medium text-slate-300">
                        {quizAnswer === "A"
                          ? "🎉 Correct! Memory address arithmetic allows instant direct access."
                          : "❌ Incorrect. Arrays have direct index memory addressing: O(1)."}
                      </span>
                      {quizAnswer === "A" && (
                        <Badge variant="xp" size="sm">
                          +50 XP
                        </Badge>
                      )}
                    </div>
                  )}
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
