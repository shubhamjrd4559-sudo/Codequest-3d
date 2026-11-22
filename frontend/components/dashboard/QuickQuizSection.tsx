"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, HelpCircle, LoaderCircle, Sparkles, XCircle } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/Badge";
import { RobotMascot } from "@/components/characters/RobotMascot";
import apiClient from "@/lib/api/client";

type AnswerKey = "A" | "B" | "C" | "D";

interface DailyQuestion {
  id: number;
  position: number;
  date: string;
  question_text: string;
  options: Record<AnswerKey, string>;
  is_daily_quiz_completed: boolean;
  selected_answer?: AnswerKey | null;
  correct_answer?: AnswerKey;
  is_correct?: boolean | null;
  xp_awarded?: number;
  total_xp?: number;
  level?: number;
}

interface DailyQuizResult {
  is_correct: boolean;
  correct_answer: AnswerKey;
  xp_awarded: number;
  total_xp: number;
  level: number;
  is_completed: boolean;
}

const answerKeys: AnswerKey[] = ["A", "B", "C", "D"];
const celebrationStorageKey = (date: string) => `codequest:daily-quiz-celebrated:${date}`;
const optionTone: Record<AnswerKey, string> = {
  A: "border-cyan-300/25 hover:border-cyan-200/60 hover:bg-cyan-400/10",
  B: "border-violet-300/25 hover:border-violet-200/60 hover:bg-violet-400/10",
  C: "border-pink-300/25 hover:border-pink-200/60 hover:bg-pink-400/10",
  D: "border-amber-300/25 hover:border-amber-200/60 hover:bg-amber-400/10",
};

export function QuickQuizSection() {
  const [question, setQuestion] = useState<DailyQuestion | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<AnswerKey | null>(null);
  const [result, setResult] = useState<DailyQuizResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [signInRequired, setSignInRequired] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    apiClient
      .get<DailyQuestion>("/quizzes/daily/")
      .then(({ data }) => {
        if (active) {
          setQuestion(data);
          if (data.is_daily_quiz_completed && data.selected_answer && data.correct_answer) {
            setSelectedAnswer(data.selected_answer);
            setResult({
              is_correct: Boolean(data.is_correct),
              correct_answer: data.correct_answer,
              xp_awarded: data.xp_awarded ?? 0,
              total_xp: data.total_xp ?? 0,
              level: data.level ?? 1,
              is_completed: true,
            });
            const celebrationKey = celebrationStorageKey(data.date);
            if (data.is_correct && window.sessionStorage.getItem(celebrationKey) !== "shown") {
              window.sessionStorage.setItem(celebrationKey, "shown");
              setShowCelebration(true);
            }
          }
        }
      })
      .catch((loadError: unknown) => {
        if (!active) return;
        const statusCode = (loadError as { response?: { status?: number } })?.response?.status;
        if (statusCode === 401 || statusCode === 403) {
          setSignInRequired(true);
          setError("Sign in to save your answer and earn XP.");
        } else {
          setError("Today's C++ challenge could not load. Please check your connection and try again.");
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const completed = Boolean(question?.is_daily_quiz_completed || result?.is_completed);

  useEffect(() => {
    if (!showCelebration) return;
    const timeout = window.setTimeout(() => setShowCelebration(false), 3000);
    return () => window.clearTimeout(timeout);
  }, [showCelebration]);

  const handleSubmit = async (answer: AnswerKey) => {
    if (!question || selectedAnswer || submitting) return;
    setSelectedAnswer(answer);
    setSubmitting(true);
    setError(null);
    try {
      const { data } = await apiClient.post<DailyQuizResult>("/quizzes/daily/submit/", {
        question_id: question.id,
        answer,
      });
      setResult(data);
      if (data.is_correct) {
        window.sessionStorage.setItem(celebrationStorageKey(question.date), "shown");
        setShowCelebration(true);
      }
      window.dispatchEvent(new Event("codequest:dashboard-updated"));
    } catch (submitError: unknown) {
      const statusCode = (submitError as { response?: { status?: number } })?.response?.status;
      if (statusCode === 409) {
        try {
          const { data } = await apiClient.get<DailyQuestion>("/quizzes/daily/");
          setQuestion(data);
          if (data.selected_answer && data.correct_answer) {
            setSelectedAnswer(data.selected_answer);
            setResult({
              is_correct: Boolean(data.is_correct),
              correct_answer: data.correct_answer,
              xp_awarded: data.xp_awarded ?? 0,
              total_xp: data.total_xp ?? 0,
              level: data.level ?? 1,
              is_completed: true,
            });
          }
        } catch {
          setError("Today's result could not be refreshed. Reload the dashboard to see your review.");
        }
      } else {
        setSelectedAnswer(null);
        if (statusCode === 401 || statusCode === 403) {
          setSignInRequired(true);
          setError("Sign in to save your answer and earn XP.");
        } else {
          setError("Your answer could not be submitted. Please try again.");
        }
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-[28px] border border-violet-400/30 bg-gradient-to-br from-[#15113d]/95 via-[#1a154e]/90 to-[#0e102d]/95 p-5 shadow-[0_0_32px_rgba(139,92,246,0.18)] backdrop-blur-2xl sm:p-6">
      {showCelebration && (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
          {Array.from({ length: 22 }, (_, index) => {
            const colors = ["#34d399", "#22d3ee", "#a78bfa", "#fbbf24", "#fb7185"];
            const left = `${5 + ((index * 37) % 90)}%`;
            const delay = (index % 7) * 0.045;
            return (
              <motion.span
                key={index}
                className="absolute top-0 h-2 w-1.5 rounded-sm shadow-[0_0_10px_currentColor]"
                style={{ left, color: colors[index % colors.length], backgroundColor: colors[index % colors.length] }}
                initial={{ y: -12, opacity: 0, rotate: 0, scale: 0.5 }}
                animate={{ y: 150 + ((index * 19) % 100), opacity: [0, 1, 1, 0], rotate: 220 + index * 31, scale: [0.5, 1, 0.8] }}
                transition={{ duration: 1.1 + (index % 4) * 0.12, delay, ease: "easeOut" }}
              />
            );
          })}
          <motion.span
            className="absolute right-[12%] top-24 text-2xl text-amber-200 drop-shadow-[0_0_12px_rgba(251,191,36,0.95)]"
            initial={{ scale: 0, rotate: -35, opacity: 0 }}
            animate={{ scale: [0, 1.25, 1], rotate: [ -35, 12, 0 ], opacity: [0, 1, 0] }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          >✦</motion.span>
          <motion.span
            className="absolute left-[14%] top-28 text-xl text-cyan-200 drop-shadow-[0_0_12px_rgba(34,211,238,0.95)]"
            initial={{ scale: 0, rotate: 30, opacity: 0 }}
            animate={{ scale: [0, 1.2, 1], rotate: [30, -10, 0], opacity: [0, 1, 0] }}
            transition={{ duration: 1.15, delay: 0.12, ease: "easeOut" }}
          >✧</motion.span>
        </div>
      )}
      <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-purple-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 left-1/4 h-48 w-48 rounded-full bg-cyan-500/10 blur-3xl" />

      <div className="relative z-10 mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-amber-400/15 text-amber-200 ring-1 ring-amber-300/30">
            <HelpCircle className="h-5 w-5" />
          </span>
          <div>
            <h2 className="flex flex-wrap items-center gap-2 text-lg font-black tracking-tight text-white sm:text-xl">
              Daily C++ Challenge
              <span className="rounded-full border border-amber-300/25 bg-amber-300/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-amber-200">+50 XP</span>
            </h2>
            <p className="text-xs font-medium text-slate-300">One question each day · 200-question learning queue</p>
          </div>
        </div>
        {question && <Badge variant="cyan" size="sm" className="font-bold">Question {question.position} / 200</Badge>}
      </div>

      {loading ? (
        <div className="relative z-10 flex min-h-36 items-center justify-center gap-3 text-sm font-semibold text-slate-300">
          <LoaderCircle className="h-5 w-5 animate-spin text-cyan-200" /> Loading today&apos;s challenge…
        </div>
      ) : error && !question ? (
        <div role="alert" className="relative z-10 rounded-2xl border border-rose-300/20 bg-rose-400/10 p-4 text-sm text-rose-100">{error}</div>
      ) : question ? (
        <div className="relative z-10 grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_170px]">
          <div className="space-y-4">
            {completed && (
              <div role="status" className="flex items-start gap-3 rounded-2xl border border-emerald-400/30 bg-emerald-500/10 p-4">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-300" />
                <div>
                  <p className="text-sm font-black text-emerald-100">
                    {result?.is_correct ? "Today’s challenge done! +50 XP earned." : "Today’s challenge done! Review your answer below."}
                  </p>
                  <p className="mt-1 text-xs text-emerald-100/75">Come back tomorrow for the next question.</p>
                </div>
                {result?.is_correct && (
                  <motion.span
                    aria-hidden="true"
                    className="ml-auto shrink-0 text-amber-200 drop-shadow-[0_0_10px_rgba(251,191,36,0.85)]"
                    animate={{ scale: [1, 1.2, 1], rotate: [0, 12, -8, 0], opacity: [0.7, 1, 0.8] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Sparkles className="h-6 w-6" />
                  </motion.span>
                )}
              </div>
            )}
            <div className="h-2 overflow-hidden rounded-full bg-white/10" role="progressbar" aria-label="Daily question queue progress" aria-valuemin={0} aria-valuemax={200} aria-valuenow={question.position}>
              <motion.div className="h-full rounded-full bg-gradient-to-r from-cyan-300 to-violet-400" initial={{ width: 0 }} animate={{ width: `${(question.position / 200) * 100}%` }} transition={{ duration: 0.5 }} />
            </div>
            <p className="text-base font-extrabold leading-relaxed text-white sm:text-lg">{question.question_text}</p>
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {answerKeys.map((key) => {
                const isChosen = selectedAnswer === key;
                const isRight = (result?.correct_answer ?? question.correct_answer) === key;
                const isWrongChoice = Boolean(completed && isChosen && result?.is_correct === false);
                const tone = isRight
                  ? "border-emerald-500 bg-emerald-500/20 text-emerald-100"
                  : isWrongChoice
                    ? "border-rose-500 bg-rose-500/20 text-rose-100"
                    : `bg-white/[0.035] text-slate-100 ${optionTone[key]}`;
                return (
                  <motion.button
                    key={key}
                    type="button"
                    whileHover={!selectedAnswer ? { scale: 1.015 } : undefined}
                    whileTap={!selectedAnswer ? { scale: 0.985 } : undefined}
                    disabled={completed || Boolean(selectedAnswer) || submitting}
                    onClick={() => void handleSubmit(key)}
                    className={`flex min-h-14 items-center gap-3 rounded-2xl border px-4 py-3 text-left text-sm font-bold transition disabled:cursor-default ${tone}`}
                  >
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-white/10 font-mono text-xs font-black">{key}</span>
                    <span className="min-w-0 flex-1">{question.options[key]}</span>
                    {isRight && <CheckCircle2 className="h-5 w-5 shrink-0" />}
                    {result && isChosen && !isRight && <XCircle className="h-5 w-5 shrink-0" />}
                  </motion.button>
                );
              })}
            </div>
            {error && <div role="alert" className="flex flex-wrap items-center gap-2 text-sm font-semibold text-rose-200"><span>{error}</span>{signInRequired && <Link href="/login" className="rounded-lg border border-amber-200/30 px-3 py-1.5 font-extrabold text-amber-100 hover:bg-amber-200/10">Sign in</Link>}</div>}
            {result && !completed && <p role="status" className={`text-sm font-extrabold ${result.is_correct ? "text-emerald-200" : "text-rose-200"}`}>{result.is_correct ? `Correct! You earned ${result.xp_awarded} XP.` : `Not quite. The correct answer is ${result.correct_answer}.`}</p>}
            {submitting && <p className="flex items-center gap-2 text-xs font-semibold text-cyan-100"><LoaderCircle className="h-4 w-4 animate-spin" /> Recording your answer…</p>}
          </div>
          <aside className="hidden flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/[0.035] p-3 text-center lg:flex">
            <RobotMascot size="sm" className="mb-2 h-20 w-20 drop-shadow-[0_0_15px_rgba(6,182,212,0.4)]" />
            <p className="text-[11px] font-semibold leading-snug text-slate-300"><Sparkles className="mr-1 inline h-3 w-3 text-amber-200" />One small step every day builds strong C++ foundations.</p>
          </aside>
        </div>
      ) : null}
    </div>
  );
}
