"use client";

import React, { useState, useEffect, useRef } from "react";
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
  Video,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Array3DStage } from "@/components/illustrations/Array3DStage";
import { RobotMascot } from "@/components/characters/RobotMascot";
import { topicsApi } from "@/lib/api/topics";
import { Topic, Lesson } from "@/lib/api/types";

function renderHighlightedCode(source: string) {
  const tokenPattern = /(\/\/.*|#include\s*<[^>]+>|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\b(?:using|namespace|int|return|for|while|if|else|const|let|def|class|print|cout|endl|true|false|null|void|std)\b|\b\d+\b|\b[a-zA-Z_]\w*(?=\s*\())/g;
  const keywords = new Set(["using", "namespace", "int", "return", "for", "while", "if", "else", "const", "let", "def", "class", "print", "cout", "endl", "true", "false", "null", "void", "std"]);
  return source.split(tokenPattern).map((token, index) => {
    if (!token) return null;
    let color = "text-slate-200";
    if (token.startsWith("//")) color = "text-slate-500 italic";
    else if (token.startsWith("#include")) color = "text-cyan-300";
    else if (token.startsWith('"') || token.startsWith("'")) color = "text-emerald-300";
    else if (/^\d+$/.test(token)) color = "text-amber-300";
    else if (keywords.has(token)) color = "text-violet-300";
    else if (/^[a-zA-Z_]\w*$/.test(token)) color = "text-sky-200";
    return <span key={`${index}-${token}`} className={color}>{token}</span>;
  });
}

export default function TopicLearningPage({
  params,
}: {
  params: { slug: string };
}) {
  const [leftTab, setLeftTab] = useState<"intro" | "explanation" | "code">("intro");
  const [rightTab, setRightTab] = useState<"visualization" | "minigame" | "quiz" | "video">("visualization");
  const [copied, setCopied] = useState(false);
  const [quizAnswer, setQuizAnswer] = useState<string | null>(null);
  const [lessonIndex, setLessonIndex] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

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

  const activeLesson: Lesson | undefined = topic?.lessons?.[lessonIndex] || topic?.lessons?.[0];

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
            <div className="relative isolate rounded-[26px] border border-cyan-200/15 bg-gradient-to-b from-slate-900/70 via-indigo-950/55 to-[#080918] px-4 pb-5 pt-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_18px_38px_rgba(0,0,0,0.3)] overflow-hidden">
              <div className="pointer-events-none absolute inset-x-1/4 -top-14 h-28 rounded-full bg-cyan-400/20 blur-3xl" />
              <div className="relative flex items-center justify-center gap-1.5 overflow-x-auto pb-3">
              {[1, 2, 3, 4, 5].map((num) => (
                <div
                  key={num}
                  className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-700 flex flex-col items-center justify-center border border-cyan-300/50 shadow-[0_0_18px_rgba(6,182,212,0.35)] shrink-0"
                >
                  <span className="text-xs font-extrabold text-white">{num}</span>
                  <span className="text-[8px] font-mono text-cyan-200">[{num - 1}]</span>
                </div>
              ))}
              </div>
              <div className="mx-auto h-3 w-4/5 rounded-full border border-cyan-200/20 bg-gradient-to-r from-slate-700 via-indigo-800 to-slate-700 shadow-[0_8px_22px_rgba(0,0,0,0.55)]" />
              <div className="mx-auto mt-1 h-1 w-3/5 rounded-full bg-cyan-300/30 blur-sm" />
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
            <div className="overflow-hidden rounded-2xl border border-slate-700/80 bg-[#080b18] shadow-[0_18px_40px_rgba(0,0,0,0.4)]">
              <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.035] px-4 py-2.5">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-400/90" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-300/90" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/90" />
                  <span className="ml-2 text-[11px] font-semibold text-slate-400">solution.{(activeLesson?.programming_language || "cpp").toLowerCase().includes("python") ? "py" : "cpp"}</span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-violet-300">{activeLesson?.programming_language || "C++"}</span>
              </div>
              <pre className="max-h-[440px] overflow-auto p-4 font-mono text-[11px] leading-6 sm:p-5 sm:text-xs">
                <code>{renderHighlightedCode(cppCode)}</code>
              </pre>
            </div>
          </Card>
        </div>

        {/* ================= RIGHT COLUMN: INTERACTIVE 3D PLAYGROUND (7 COLS) ================= */}
        <div className="lg:col-span-7 space-y-4">
          {/* Right Column Interactive Tabs Header */}
          <div className="grid grid-cols-2 sm:flex items-center gap-1.5 p-1 rounded-2xl bg-[#0e112b]/80 border border-white/10 backdrop-blur-xl">
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
            <button
              onClick={() => setRightTab("video")}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                rightTab === "video"
                  ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-neon-purple"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              Lecture
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

                  <div className="space-y-1.5" aria-label="Quiz progress">
                    <div className="flex justify-between text-[10px] font-bold text-slate-400"><span>Quest progress</span><span>{quizAnswer ? "1 / 3 complete" : "Ready when you are"}</span></div>
                    <div className="h-2 overflow-hidden rounded-full border border-white/10 bg-slate-950/70 p-0.5">
                      <motion.div initial={{ width: "18%" }} animate={{ width: quizAnswer ? "34%" : "18%" }} className="h-full rounded-full bg-gradient-to-r from-amber-300 via-orange-400 to-pink-400 shadow-[0_0_12px_rgba(251,146,60,0.55)]" />
                    </div>
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

            {rightTab === "video" && (
              <motion.div
                key="video"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="space-y-4"
              >
                <Card variant="glowCyan" className="overflow-hidden p-0">
                  <div className="border-b border-white/10 bg-gradient-to-r from-cyan-400/[0.08] via-purple-400/[0.06] to-transparent px-5 py-4 sm:px-6">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-200">Quest lecture</p>
                        <h3 className="mt-1 text-lg font-black text-white">{activeLesson?.title || `${topicTitle} essentials`}</h3>
                      </div>
                      <Badge variant="cyan" size="sm">Lesson {(lessonIndex + 1).toString().padStart(2, "0")}</Badge>
                    </div>
                  </div>

                  <div className="p-4 sm:p-6">
                    <div className="relative aspect-video overflow-hidden rounded-2xl border border-cyan-200/20 bg-[radial-gradient(ellipse_at_50%_35%,rgba(99,102,241,0.3),transparent_55%),linear-gradient(135deg,#111438,#070914)] shadow-[0_16px_42px_rgba(0,0,0,0.35)]">
                      {activeLesson?.video_url ? (
                        <>
                          <video
                            ref={videoRef}
                            src={activeLesson.video_url}
                            controls
                            onPlay={() => setIsVideoPlaying(true)}
                            onPause={() => setIsVideoPlaying(false)}
                            className="h-full w-full object-contain"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              if (videoRef.current?.paused) void videoRef.current.play();
                              else videoRef.current?.pause();
                            }}
                            aria-label={isVideoPlaying ? "Pause lecture" : "Play lecture"}
                            className="absolute left-4 top-4 grid h-11 w-11 place-items-center rounded-2xl border border-white/20 bg-slate-950/70 text-white shadow-lg backdrop-blur-xl transition hover:scale-105 hover:bg-slate-900"
                          >
                            {isVideoPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 fill-current" />}
                          </button>
                        </>
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
                          <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 3.4, ease: "easeInOut" }} className="mb-4 grid h-16 w-16 place-items-center rounded-3xl border border-cyan-200/25 bg-cyan-300/10 text-cyan-100 shadow-[0_0_34px_rgba(34,211,238,0.18)]">
                            <Play className="ml-1 h-7 w-7 fill-current" />
                          </motion.div>
                          <p className="text-base font-black text-white">Your lecture portal is ready</p>
                          <p className="mt-2 max-w-sm text-xs leading-5 text-slate-300">A video will appear here when one is attached to this lesson. Use the lesson notes below to keep learning.</p>
                        </div>
                      )}
                      <div className="pointer-events-none absolute bottom-3 left-3 rounded-full border border-white/10 bg-slate-950/55 px-3 py-1 text-[10px] font-bold text-slate-200 backdrop-blur-md">{activeLesson?.video_url ? "Lesson video" : "Lecture preview"}</div>
                    </div>

                    <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
                      <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
                        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-violet-300">Lesson notes</p>
                        <p className="mt-2 text-xs leading-5 text-slate-300">{activeLesson?.introduction || topicDescription}</p>
                      </div>
                      <div className="flex items-center justify-between gap-2 lg:justify-end">
                        <button type="button" disabled={lessonIndex <= 0} onClick={() => { setLessonIndex((index) => Math.max(0, index - 1)); setIsVideoPlaying(false); }} className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.05] px-3 py-2 text-xs font-bold text-slate-200 transition hover:border-purple-300/30 hover:bg-white/[0.1] disabled:cursor-not-allowed disabled:opacity-40"><ChevronLeft className="h-4 w-4" /> Previous</button>
                        <span className="text-[10px] font-bold text-slate-400">{lessonIndex + 1} / {Math.max(topic?.lessons?.length || 1, 1)}</span>
                        <button type="button" disabled={lessonIndex >= (topic?.lessons?.length || 1) - 1} onClick={() => { setLessonIndex((index) => Math.min((topic?.lessons?.length || 1) - 1, index + 1)); setIsVideoPlaying(false); }} className="inline-flex items-center gap-1.5 rounded-xl border border-cyan-300/25 bg-cyan-400/10 px-3 py-2 text-xs font-bold text-cyan-100 transition hover:bg-cyan-400/20 disabled:cursor-not-allowed disabled:opacity-40">Next <ChevronRight className="h-4 w-4" /></button>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
