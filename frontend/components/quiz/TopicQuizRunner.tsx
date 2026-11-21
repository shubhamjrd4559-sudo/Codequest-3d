'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import type { AxiosError } from 'axios';
import { apiClient } from '@/lib/api/client';
import { Check, LockKeyhole, RotateCcw, Star, Timer, Trophy } from 'lucide-react';

const LEVELS = ['Foundation', 'Core Logic', 'Pattern Builder', 'Grandmaster'] as const;
const OPTION_STYLES = [
  'border-sky-400/35 bg-sky-500/10 hover:bg-sky-500/20',
  'border-violet-400/35 bg-violet-500/10 hover:bg-violet-500/20',
  'border-pink-400/35 bg-pink-500/10 hover:bg-pink-500/20',
  'border-orange-400/35 bg-orange-500/10 hover:bg-orange-500/20',
];

type ApiPage<T> = { results: T[] };
type QuizRecord = { id: number; title: string; timer_seconds: number | null; question_count: number };
type QuizQuestion = { id: number; quiz: number; prompt: string; choices: Array<{ key: string; text: string }>; points: number; order: number };
type QuizStage = { quiz: QuizRecord; question: QuizQuestion };
type Feedback = { question_id: number; is_correct: boolean; correct_answer: string; explanation: string };
type SubmitResponse = { feedback: Feedback[] };

function apiMessage(error: unknown) {
  const status = (error as AxiosError)?.response?.status;
  if (status === 401) return 'Please sign in again to submit your answer.';
  return 'The quiz could not reach the learning server. Check that the backend is running, then retry.';
}

export default function TopicQuizRunner({ topicTitle, topicSlug }: { topicTitle: string; topicSlug: string }) {
  const [stages, setStages] = useState<QuizStage[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [level, setLevel] = useState(0);
  const [unlocked, setUnlocked] = useState(0);
  const [completed, setCompleted] = useState<number[]>([]);
  const [lives, setLives] = useState(3);
  const [seconds, setSeconds] = useState(45);
  const [xp, setXp] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const [outOfLives, setOutOfLives] = useState(false);
  const [levelWon, setLevelWon] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setLoadError(null);
    apiClient.get<ApiPage<QuizRecord>>('/quizzes/', { params: { topic: topicSlug } })
      .then(async ({ data }) => {
        const ordered = [...data.results].sort((a, b) => {
          const aLevel = LEVELS.findIndex((name) => a.title.endsWith(name));
          const bLevel = LEVELS.findIndex((name) => b.title.endsWith(name));
          return aLevel - bLevel;
        });
        if (ordered.length !== LEVELS.length || ordered.some((quiz, index) => !quiz.title.endsWith(LEVELS[index]))) {
          throw new Error(`Expected four published quiz stages for ${topicSlug}.`);
        }
        const questionPages = await Promise.all(ordered.map((quiz) =>
          apiClient.get<ApiPage<QuizQuestion>>('/questions/', { params: { quiz: quiz.id } })
        ));
        const loaded = ordered.map((quiz, index) => ({ quiz, question: questionPages[index].data.results[0] })).filter((stage): stage is QuizStage => Boolean(stage.question));
        if (loaded.length !== LEVELS.length) throw new Error('One or more quiz stages has no published question.');
        if (!cancelled) setStages(loaded);
      })
      .catch((error: unknown) => {
        if (!cancelled) setLoadError(error instanceof Error && error.message.startsWith('Expected') ? error.message : apiMessage(error));
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [topicSlug]);

  const stage = stages[level];
  const question = stage?.question;
  const progress = useMemo(() => levelWon ? 100 : selected ? 100 : 0, [levelWon, selected]);

  useEffect(() => {
    if (!question || loading || loadError || feedback || submitting || timedOut || outOfLives || levelWon) return;
    const timer = window.setInterval(() => setSeconds((value) => Math.max(0, value - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [question, loading, loadError, feedback, submitting, timedOut, outOfLives, levelWon, level]);

  useEffect(() => {
    if (seconds !== 0 || !question || feedback || submitting || timedOut || levelWon || outOfLives) return;
    setTimedOut(true);
    setLives((value) => Math.max(0, value - 1));
    if (lives <= 1) setOutOfLives(true);
  }, [seconds, question, feedback, submitting, timedOut, levelWon, outOfLives, lives]);

  const resetAttempt = (nextLevel = level) => {
    setLevel(nextLevel);
    setSelected(null);
    setFeedback(null);
    setTimedOut(false);
    setOutOfLives(false);
    setLevelWon(false);
    setSubmitError(null);
    setSeconds(45);
  };

  const chooseLevel = (nextLevel: number) => {
    if (nextLevel > unlocked || !stages[nextLevel]) return;
    resetAttempt(nextLevel);
  };

  const submitAnswer = async (key: string) => {
    if (!stage || !question || selected !== null || submitting || feedback || outOfLives) return;
    setSelected(key);
    setSubmitError(null);
    setSubmitting(true);
    try {
      const { data } = await apiClient.post<SubmitResponse>('/quiz-attempts/', {
        quiz: stage.quiz.id,
        answers: { [String(question.id)]: key },
        duration_seconds: 45 - seconds,
      });
      const result = data.feedback.find((item) => item.question_id === question.id);
      if (!result) throw new Error('The server did not return feedback for this question.');
      setFeedback(result);
      if (result.is_correct) {
        setXp((value) => value + 25);
        setShowConfetti(true);
        window.setTimeout(() => setShowConfetti(false), 1200);
      } else {
        setLives((value) => Math.max(0, value - 1));
        if (lives <= 1) setOutOfLives(true);
      }
    } catch (error) {
      setSelected(null);
      setSubmitError(error instanceof Error && error.message.startsWith('The server') ? error.message : apiMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  const advance = () => {
    if (feedback?.is_correct) {
      setCompleted((values) => values.includes(level) ? values : [...values, level]);
      setUnlocked((value) => Math.max(value, Math.min(level + 1, LEVELS.length - 1)));
      setLevelWon(true);
    } else if (lives > 0) {
      resetAttempt();
    } else {
      setLives(3);
      resetAttempt();
    }
  };

  const restartPath = () => {
    setUnlocked(0);
    setCompleted([]);
    setXp(0);
    setLives(3);
    resetAttempt(0);
  };

  if (loading) return <div className="grid min-h-64 place-items-center rounded-3xl border border-white/10 bg-white/[.03] text-sm font-bold text-cyan-100"><span className="animate-pulse">Loading {topicTitle} questions…</span></div>;
  if (loadError) return <div className="rounded-3xl border border-rose-300/20 bg-rose-500/[.07] p-6 sm:p-8"><h2 className="text-xl font-black text-white">Quiz path unavailable</h2><p className="mt-2 text-sm leading-6 text-rose-100/80">{loadError}</p><Link href="/quizzes" className="mt-5 inline-flex min-h-11 items-center rounded-xl bg-white px-5 py-3 text-sm font-black text-slate-950">Back to DSA Quiz</Link></div>;

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#0b1026]/85 p-5 shadow-[0_20px_70px_rgba(3,7,25,.35)] sm:p-7">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(34,211,238,.13),transparent_45%),radial-gradient(ellipse_at_bottom_right,rgba(168,85,247,.16),transparent_45%)]" />
        <div className="relative flex flex-wrap items-center justify-between gap-3">
          <div><p className="text-xs font-black uppercase tracking-[.2em] text-cyan-200">{topicTitle} · DSA Challenge</p><h2 className="mt-1 text-xl font-black text-white sm:text-2xl">Four stages. Real coding logic.</h2></div>
          <div className="flex items-center gap-2 rounded-full border border-amber-300/20 bg-amber-400/10 px-4 py-2 text-sm font-black text-amber-200"><Star className="h-4 w-4 fill-current" /> {xp} XP</div>
        </div>
        <div className="relative mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-5">
          {LEVELS.map((name, index) => {
            const isLocked = index > unlocked;
            const isDone = completed.includes(index);
            const isCurrent = level === index;
            const Icon = isLocked ? LockKeyhole : isDone ? Check : Star;
            return <div key={name} className="relative">
              {index < LEVELS.length - 1 && <div className="absolute left-[58%] top-1/2 hidden w-[84%] border-t-2 border-dotted border-violet-300/30 sm:block" />}
              <motion.button disabled={isLocked} onClick={() => chooseLevel(index)} whileHover={!isLocked ? { y: -4, scale: 1.025 } : undefined} whileTap={!isLocked ? { scale: .97 } : undefined} animate={isCurrent && !isDone ? { boxShadow: ['0 0 12px rgba(34,211,238,.15)', '0 0 25px rgba(168,85,247,.35)', '0 0 12px rgba(34,211,238,.15)'] } : {}} transition={{ duration: 2.5, repeat: isCurrent ? Infinity : 0 }} className={`relative z-10 flex min-h-[108px] w-full flex-col items-center justify-center rounded-[22px] border p-3 text-center transition-colors ${isLocked ? 'cursor-not-allowed border-slate-700/70 bg-slate-800/75 text-slate-500' : isDone ? 'border-emerald-300/60 bg-emerald-500/15 text-emerald-200' : isCurrent ? 'border-cyan-300/70 bg-gradient-to-br from-cyan-500/25 to-violet-500/25 text-white' : 'border-violet-300/35 bg-violet-500/10 text-violet-100'}`}>
                <span className={`mb-2 flex h-9 w-9 items-center justify-center rounded-full ${isLocked ? 'bg-slate-700/80' : isDone ? 'bg-emerald-400 text-emerald-950' : 'bg-gradient-to-br from-cyan-300 to-violet-400 text-slate-950'}`}><Icon className="h-4 w-4" /></span><span className="text-xs font-black sm:text-sm">{name}</span><span className="mt-1 text-[10px] font-bold opacity-70">Level {index + 1}</span>
              </motion.button>
            </div>;
          })}
        </div>
      </section>

      <section className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#10132c]/80 p-4 sm:p-7">
        <div className="flex flex-wrap items-center justify-between gap-3"><div className="flex flex-wrap items-center gap-2 text-sm font-black"><span className="rounded-xl border border-rose-300/20 bg-rose-500/10 px-3 py-2 text-rose-200" aria-label={`${lives} lives`}>❤️ {lives}</span><span className="rounded-xl border border-cyan-300/20 bg-cyan-500/10 px-3 py-2 text-cyan-100"><Timer className="mr-1 inline h-4 w-4" /> 00:{String(seconds).padStart(2, '0')}</span><span className="rounded-xl border border-amber-300/20 bg-amber-500/10 px-3 py-2 text-amber-100"><Star className="mr-1 inline h-4 w-4 fill-current" /> {xp} XP</span></div><span className="text-xs font-bold text-slate-400">Stage {level + 1} / {LEVELS.length}</span></div>
        <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/10"><motion.div className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-violet-400 to-pink-400" animate={{ width: `${progress}%` }} transition={{ type: 'spring', stiffness: 110 }} /></div>

        <div className="mt-6 relative min-h-[220px] overflow-hidden rounded-[24px] border border-white/10 bg-white/[.045] p-5 sm:p-7">
          <AnimatePresence mode="wait">
            {levelWon ? <motion.div key="win" initial={{ opacity: 0, scale: .96 }} animate={{ opacity: 1, scale: 1 }} className="flex min-h-[190px] flex-col items-center justify-center text-center"><div className="mb-3 rounded-2xl bg-amber-300/15 p-3 text-amber-200"><Trophy className="h-8 w-8" /></div><p className="text-xs font-black uppercase tracking-[.2em] text-emerald-300">{level === LEVELS.length - 1 ? 'Quiz path complete!' : 'Stage complete!'}</p><h3 className="mt-2 text-2xl font-black text-white">{level === LEVELS.length - 1 ? 'DSA Mastery unlocked!' : `${LEVELS[level]} cleared!`}</h3><p className="mt-2 text-sm text-slate-300">Your answer and explanation are saved to your learning record.</p>{level < LEVELS.length - 1 ? <button onClick={() => chooseLevel(level + 1)} className="mt-5 rounded-xl bg-gradient-to-r from-cyan-400 to-violet-500 px-6 py-3 font-black text-slate-950">Next level →</button> : <button onClick={restartPath} className="mt-5 inline-flex items-center gap-2 rounded-xl border border-cyan-300/30 bg-cyan-400/15 px-5 py-3 font-black text-cyan-100"><RotateCcw className="h-4 w-4" /> Play again</button>}</motion.div>
              : outOfLives && !feedback ? <motion.div key="lives" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex min-h-[190px] flex-col items-center justify-center text-center"><div className="text-4xl">💫</div><h3 className="mt-3 text-2xl font-black text-white">Ready for another try?</h3><p className="mt-2 text-sm text-slate-300">Take a breath and try {LEVELS[level]} again.</p><button onClick={() => { setLives(3); resetAttempt(); }} className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-xl border border-cyan-300/30 bg-cyan-400/15 px-5 py-3 font-black text-cyan-100"><RotateCcw className="h-4 w-4" /> Try again</button></motion.div>
              : question && <motion.div key={`question-${level}`} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}><div className="flex flex-wrap items-center gap-2"><p className="text-xs font-black uppercase tracking-[.18em] text-violet-200">{LEVELS[level]} · C++ DSA</p>{question.points > 1 && <span className="rounded-full border border-amber-300/20 bg-amber-400/10 px-2.5 py-1 text-[10px] font-black text-amber-200">{question.points} XP question</span>}</div><h3 className="mt-3 max-w-4xl text-xl font-black leading-snug text-white sm:text-2xl">{question.prompt}</h3></motion.div>}
          </AnimatePresence>
          {showConfetti && <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">{Array.from({ length: 18 }, (_, i) => <motion.i key={i} initial={{ opacity: 1, x: '50%', y: '45%', rotate: 0, scale: .5 }} animate={{ opacity: 0, x: `${(i % 6) * 18}%`, y: `${20 + Math.floor(i / 6) * 32}%`, rotate: i * 67, scale: 1 }} transition={{ duration: .85 }} className="absolute h-2 w-2 rounded-sm" style={{ background: ['#34d399', '#22d3ee', '#f472b6', '#fbbf24'][i % 4] }} />)}</div>}
        </div>

        {!levelWon && !outOfLives && question && <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {question.choices.map((option, index) => {
            const isSelected = selected === option.key;
            const isCorrect = feedback?.correct_answer === option.key;
            const isWrong = feedback?.is_correct === false && isSelected;
            return <motion.button key={`${question.id}-${option.key}`} disabled={selected !== null || submitting || timedOut} whileHover={selected === null && !timedOut ? { scale: 1.02, y: -2 } : undefined} whileTap={selected === null ? { scale: .98 } : undefined} animate={isWrong ? { x: [0, -8, 8, -6, 6, 0] } : undefined} transition={{ duration: .35 }} onClick={() => void submitAnswer(option.key)} className={`flex min-h-[62px] items-center gap-3 rounded-2xl border px-4 py-3 text-left text-sm font-extrabold text-white shadow-lg transition-colors sm:text-base ${isCorrect ? 'border-emerald-300 bg-emerald-500/25 text-emerald-100' : isWrong ? 'border-rose-300 bg-rose-500/25 text-rose-100' : selected !== null || timedOut ? 'border-white/5 bg-white/[.025] opacity-55' : OPTION_STYLES[index % OPTION_STYLES.length]}`}>
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-black/20 text-sm font-black">{option.key}</span><span className="flex-1">{option.text}</span>{isCorrect && <Check className="h-5 w-5 text-emerald-200" />}{isWrong && <span className="text-xs font-black">✕</span>}
            </motion.button>;
          })}
        </div>}

        {submitError && <div role="alert" className="mt-4 rounded-xl border border-rose-300/20 bg-rose-500/10 p-4 text-sm text-rose-100">{submitError}</div>}
        {submitting && <p role="status" className="mt-4 text-sm font-bold text-cyan-100">Checking your answer…</p>}
        {timedOut && !outOfLives && <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-300/25 bg-amber-400/10 p-4"><p className="font-bold text-amber-100">Time ran out. Review the question and try again.</p><button onClick={() => resetAttempt()} className="rounded-xl bg-white px-4 py-2.5 text-sm font-black text-slate-950">Retry question</button></div>}
        {feedback && !levelWon && <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={`mt-4 rounded-2xl border p-4 ${feedback.is_correct ? 'border-emerald-300/30 bg-emerald-500/10' : 'border-rose-300/25 bg-rose-500/10'}`}>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div className="min-w-0"><p className={`font-black ${feedback.is_correct ? 'text-emerald-200' : 'text-rose-200'}`}>{feedback.is_correct ? '✨ Correct — well reasoned!' : `Not quite. The correct choice is ${feedback.correct_answer}.`}</p>{(() => { const [reasoning, codingUse] = feedback.explanation.split(/\n\nCoding use:\s*/); return <div className="mt-2 space-y-2 text-sm leading-6 text-slate-200"><p>{reasoning}</p>{codingUse && <p className="rounded-xl border border-cyan-200/10 bg-cyan-300/[.06] p-3"><strong className="text-cyan-100">How this is used in C++:</strong> {codingUse}</p>}</div>; })()}</div><button onClick={advance} className="shrink-0 rounded-xl bg-white px-5 py-3 text-sm font-black text-slate-950">{feedback.is_correct ? 'Continue →' : 'Try this level again'}</button></div>
        </motion.div>}
      </section>
    </div>
  );
}
