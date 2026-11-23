"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, ArrowRight, Bookmark, Check, ChevronLeft, ChevronRight, CircleHelp, Clock3, LoaderCircle, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

import { learningApi, type LessonPageData } from "@/lib/api/learning";

const SECTION_LABELS: Record<string, string> = {
  introduction: "Introduction", definition: "Definition", detailed_theory: "How it works", terminology: "Important terminology",
  core_concepts: "Core concepts and properties", working_principle: "Working principle", step_by_step: "Step-by-step",
  visual_representation: "Visual representation", real_world_example: "Real-world example", cpp_implementation: "C++ implementation",
  line_by_line_explanation: "Line-by-line explanation", input_output_examples: "Input and output", dry_run: "Dry run",
  time_complexity: "Time complexity", space_complexity: "Space complexity", advantages_disadvantages: "Advantages and disadvantages",
  real_world_applications: "Applications", common_mistakes: "Common mistakes", interview_questions: "Interview questions",
  mcq_quiz: "Quick check", coding_practice: "Practice problems",
};

const SECTION_ORDER = Object.keys(SECTION_LABELS);

function TextBlock({ value }: { value: unknown }) {
  if (typeof value === "string") return <p className="whitespace-pre-line text-sm leading-7 text-slate-300">{value}</p>;
  if (Array.isArray(value) && value.every((item) => typeof item === "string")) return <ul className="space-y-2">{value.map((item, index) => <li key={index} className="flex gap-3 text-sm leading-6 text-slate-300"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-300"/>{item}</li>)}</ul>;
  return null;
}

function DryRun({ steps }: { steps: string[] }) {
  const [active, setActive] = useState(0);
  useEffect(() => setActive(0), [steps]);
  return <div className="space-y-4"><div className="rounded-2xl border border-cyan-300/15 bg-[#080d1d] p-4"><p className="text-[10px] font-black uppercase tracking-widest text-cyan-200">Step {Math.min(active + 1, steps.length)} of {steps.length}</p><p className="mt-2 text-sm leading-6 text-white">{steps[active]}</p><div className="mt-4 flex items-center justify-between"><button type="button" onClick={() => setActive((step) => Math.max(0, step - 1))} disabled={active === 0} className="inline-flex items-center gap-1 rounded-lg border border-white/10 px-3 py-2 text-xs font-bold text-slate-200 disabled:opacity-40"><ChevronLeft className="h-4 w-4"/>Previous</button><div className="flex gap-1">{steps.map((_, index) => <span key={index} className={`h-1.5 w-4 rounded-full ${index <= active ? "bg-cyan-300" : "bg-white/15"}`}/>)}</div><button type="button" onClick={() => setActive((step) => Math.min(steps.length - 1, step + 1))} disabled={active === steps.length - 1} className="inline-flex items-center gap-1 rounded-lg border border-white/10 px-3 py-2 text-xs font-bold text-slate-200 disabled:opacity-40">Next<ChevronRight className="h-4 w-4"/></button></div></div><ol className="grid gap-2 sm:grid-cols-2">{steps.map((step, index) => <li key={index} className={`rounded-xl border px-3 py-2 text-xs leading-5 ${index === active ? "border-cyan-300/30 bg-cyan-300/10 text-cyan-50" : "border-white/[0.07] bg-black/10 text-slate-400"}`}><span className="mr-2 font-black text-cyan-200">{index + 1}.</span>{step}</li>)}</ol></div>;
}

function QuizCard({ question, index }: { question: Record<string, unknown>; index: number }) {
  const [answer, setAnswer] = useState<number | null>(null);
  const options = Array.isArray(question.options) ? question.options as string[] : [];
  const correct = typeof question.correct_answer === "string" ? question.correct_answer : "";
  const explanation = typeof question.explanation === "string" ? question.explanation : "";
  return <div className="rounded-2xl border border-white/10 bg-black/15 p-4"><p className="font-bold leading-6 text-white">{String(question.question ?? `Question ${index + 1}`)}</p><div className="mt-3 grid gap-2 sm:grid-cols-2">{options.map((option, optionIndex) => {
    const letter = String.fromCharCode(65 + optionIndex);
    const isCorrect = letter === correct;
    const stateClass = answer === null ? "border-white/10 bg-white/[0.035] hover:border-violet-300/40" : isCorrect ? "border-emerald-400 bg-emerald-500/15 text-emerald-100" : answer === optionIndex ? "border-rose-400 bg-rose-500/15 text-rose-100" : "border-white/[0.06] bg-white/[0.02] text-slate-500";
    return <button key={optionIndex} type="button" onClick={() => setAnswer(optionIndex)} disabled={answer !== null} className={`rounded-xl border px-3 py-2 text-left text-sm transition disabled:cursor-default ${stateClass}`}><span className="mr-2 font-black text-cyan-200">{letter}.</span>{option}</button>;
  })}</div>{answer !== null && <p className="mt-3 text-xs leading-5 text-slate-300">{explanation}</p>}</div>;
}

function ContentValue({ section, value }: { section: string; value: unknown }) {
  if (section === "cpp_implementation" && typeof value === "string") return <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#080b16]"><div className="flex items-center gap-2 border-b border-white/10 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400"><span className="h-2 w-2 rounded-full bg-rose-400"/><span className="h-2 w-2 rounded-full bg-amber-300"/><span className="h-2 w-2 rounded-full bg-emerald-400"/><span className="ml-2">C++</span></div><pre className="overflow-x-auto p-4 text-xs leading-6 text-cyan-100 sm:text-sm"><code>{value}</code></pre></div>;
  if (section === "dry_run" && Array.isArray(value) && value.every((item) => typeof item === "string")) return <DryRun steps={value as string[]}/>;
  if (section === "input_output_examples" && Array.isArray(value)) return <div className="grid gap-3 sm:grid-cols-2">{value.map((item, index) => { const pair = item as Record<string, unknown>; return <div key={index} className="rounded-xl border border-white/10 bg-[#090e1c] p-4"><p className="text-[10px] font-black uppercase tracking-widest text-violet-200">Example {index + 1}</p><p className="mt-2 text-xs font-bold text-slate-400">Input</p><pre className="mt-1 whitespace-pre-wrap text-sm text-slate-100">{String(pair.input ?? "")}</pre><p className="mt-2 text-xs font-bold text-slate-400">Output</p><pre className="mt-1 whitespace-pre-wrap text-sm text-emerald-200">{String(pair.output ?? "")}</pre></div>; })}</div>;
  if (section === "mcq_quiz" && Array.isArray(value)) return <div className="space-y-3">{value.map((item, index) => <QuizCard key={index} question={item as Record<string, unknown>} index={index}/>)}</div>;
  if (section === "interview_questions" && Array.isArray(value)) return <div className="space-y-3">{value.map((item, index) => { const entry = item as Record<string, unknown>; return <details key={index} className="group rounded-xl border border-white/10 bg-black/10 p-4"><summary className="cursor-pointer list-none font-bold text-white marker:hidden"><span className="mr-2 text-cyan-200">Q{index + 1}.</span>{String(entry.question ?? "")}</summary><p className="mt-3 border-t border-white/10 pt-3 text-sm leading-6 text-slate-300">{String(entry.answer ?? "")}</p></details>; })}</div>;
  if (section === "coding_practice" && value && typeof value === "object") return <div className="grid gap-3 sm:grid-cols-3">{Object.entries(value as Record<string, unknown>).map(([difficulty, problems]) => <div key={difficulty} className="rounded-xl border border-white/10 bg-black/10 p-4"><h4 className="mb-3 text-xs font-black uppercase tracking-widest text-amber-200">{difficulty}</h4><TextBlock value={problems}/></div>)}</div>;
  if (section === "advantages_disadvantages" && value && typeof value === "object") { const data = value as Record<string, unknown>; return <div className="grid gap-4 sm:grid-cols-2"><div><h4 className="mb-2 text-xs font-black uppercase tracking-widest text-emerald-200">Advantages</h4><TextBlock value={data.advantages}/></div><div><h4 className="mb-2 text-xs font-black uppercase tracking-widest text-rose-200">Disadvantages</h4><TextBlock value={data.disadvantages}/></div></div>; }
  return <TextBlock value={value}/>;
}

export default function LessonDetailPage() {
  const params = useParams<{ lessonId: string }>();
  const lessonId = Number(params.lessonId);
  const [lesson, setLesson] = useState<LessonPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [bookmarkBusy, setBookmarkBusy] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);

  useEffect(() => {
    let active = true;
    if (!Number.isInteger(lessonId) || lessonId < 1) { setError("This lesson link is invalid."); setLoading(false); return; }
    learningApi.getLesson(lessonId).then((data) => { if (active) setLesson(data); }).catch((requestError: unknown) => {
      if (!active) return;
      const status = (requestError as { response?: { status?: number } })?.response?.status;
      setError(status === 401 || status === 403 ? "Sign in with a student account to read this lesson." : "This lesson could not load. Please return to the Learning Path and try again.");
    }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [lessonId]);

  const content = useMemo(() => lesson?.lesson_content ?? {}, [lesson]);
  const complete = async () => {
    if (!lesson || saving || lesson.is_completed) return;
    setSaving(true);
    try {
      const result = await learningApi.toggleLesson(lesson.id);
      setLesson((current) => current ? { ...current, is_completed: result.is_completed } : current);
      setXpEarned(result.xp_awarded);
      window.dispatchEvent(new Event("codequest:dashboard-updated"));
    } catch { setError("We could not save your completion. Check your connection and try again."); }
    finally { setSaving(false); }
  };

  const bookmark = async () => {
    if (!lesson || bookmarkBusy) return;
    setBookmarkBusy(true);
    try { const isBookmarked = await learningApi.toggleBookmark(lesson.id); setLesson((current) => current ? { ...current, is_bookmarked: isBookmarked } : current); }
    catch { setError("Bookmark could not be saved. Please try again."); }
    finally { setBookmarkBusy(false); }
  };

  if (loading) return <div className="mx-auto flex min-h-72 max-w-4xl items-center justify-center gap-3 text-slate-300"><LoaderCircle className="h-5 w-5 animate-spin text-cyan-200"/>Loading lesson…</div>;
  if (!lesson) return <main className="mx-auto max-w-3xl rounded-3xl border border-rose-300/20 bg-rose-500/10 p-7 text-center"><p className="font-bold text-rose-100">{error ?? "Lesson unavailable."}</p><Link href="/learning" className="mt-5 inline-flex rounded-xl bg-white px-4 py-2 text-sm font-black text-slate-950">Back to Learning Path</Link></main>;

  return <motion.main initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-5xl space-y-5 pb-8">
    <div className="flex flex-wrap items-center justify-between gap-3"><Link href="/learning" className="inline-flex items-center gap-2 text-sm font-bold text-cyan-100 hover:text-white"><ArrowLeft className="h-4 w-4"/>Learning Path</Link><button type="button" onClick={() => void bookmark()} disabled={bookmarkBusy} aria-pressed={lesson.is_bookmarked} className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-bold text-slate-200 hover:border-violet-300/30"><Bookmark className={`h-4 w-4 ${lesson.is_bookmarked ? "fill-violet-300 text-violet-200" : ""}`}/>{lesson.is_bookmarked ? "Bookmarked" : "Bookmark lesson"}</button></div>
    {error && <div role="alert" className="rounded-xl border border-rose-300/20 bg-rose-500/10 p-3 text-sm text-rose-100">{error}</div>}
    <header className="rounded-[28px] border border-violet-300/20 bg-gradient-to-br from-[#17133a]/90 via-[#11152c]/90 to-[#101026]/90 p-6 shadow-[0_18px_55px_rgba(0,0,0,.2)] backdrop-blur-xl sm:p-8"><p className="text-[10px] font-black uppercase tracking-[.2em] text-cyan-200">{lesson.module.title}{lesson.chapter ? ` · ${lesson.chapter.title}` : ""}</p><div className="mt-3 flex flex-wrap items-end justify-between gap-4"><div><h1 className="max-w-3xl text-2xl font-black tracking-tight text-white sm:text-4xl">{lesson.title}</h1><p className="mt-3 flex items-center gap-2 text-sm text-slate-400"><Clock3 className="h-4 w-4"/>{lesson.estimated_minutes} minute lesson</p></div><span className={`rounded-full border px-3 py-1.5 text-xs font-black ${lesson.is_completed ? "border-emerald-300/30 bg-emerald-300/10 text-emerald-100" : "border-amber-200/20 bg-amber-200/5 text-amber-100"}`}>{lesson.is_completed ? "Completed" : "Not completed"}</span></div></header>
    {SECTION_ORDER.map((key, index) => {
      const value = content[key];
      if (value === undefined || value === null || value === "" || (Array.isArray(value) && !value.length)) return null;
      return <motion.section key={`${lesson.id}-${key}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(index * .025, .3) }} className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#14182b]/90 to-[#101321]/90 p-5 backdrop-blur-xl sm:p-7"><h2 className="mb-4 flex items-center gap-2 text-base font-black text-white sm:text-lg"><span className="grid h-7 w-7 place-items-center rounded-lg bg-violet-300/10 text-[10px] font-black text-violet-200">{String(index + 1).padStart(2, "0")}</span>{SECTION_LABELS[key]}</h2><ContentValue section={key} value={value}/></motion.section>;
    })}
    {!Object.keys(content).length && <div className="space-y-4">{lesson.introduction && <section className="rounded-3xl border border-white/10 bg-[#14182b]/90 p-6"><h2 className="mb-3 font-black text-white">Introduction</h2><p className="text-sm leading-7 text-slate-300">{lesson.introduction}</p></section>}<section className="rounded-3xl border border-white/10 bg-[#14182b]/90 p-6"><h2 className="mb-3 font-black text-white">Lesson notes</h2><p className="whitespace-pre-line text-sm leading-7 text-slate-300">{lesson.explanation}</p></section>{lesson.real_life_example && <section className="rounded-3xl border border-white/10 bg-[#14182b]/90 p-6"><h2 className="mb-3 font-black text-white">Real-life example</h2><p className="text-sm leading-7 text-slate-300">{lesson.real_life_example}</p></section>}{lesson.cpp_code && <section className="rounded-3xl border border-white/10 bg-[#14182b]/90 p-6"><h2 className="mb-3 font-black text-white">C++ example</h2><ContentValue section="cpp_implementation" value={lesson.cpp_code}/></section>}</div>}
    <section className="rounded-3xl border border-emerald-300/20 bg-emerald-400/[0.06] p-5 text-center sm:p-7"><p className="text-sm text-slate-300">Finished reading and reviewing this lesson?</p><button type="button" onClick={() => void complete()} disabled={saving || lesson.is_completed} className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-300 to-cyan-300 px-6 py-3 font-black text-slate-950 transition hover:brightness-110 disabled:cursor-default disabled:opacity-70">{saving ? <LoaderCircle className="h-4 w-4 animate-spin"/> : <Check className="h-4 w-4"/>}{lesson.is_completed ? "Lesson completed" : "Mark lesson as complete"}</button>{xpEarned > 0 && <p className="mt-3 inline-flex items-center gap-1 text-sm font-black text-amber-200"><Sparkles className="h-4 w-4"/>+{xpEarned} XP earned</p>}</section>
    <nav aria-label="Lesson navigation" className="grid gap-3 sm:grid-cols-2">{lesson.previous ? <Link href={`/learning/lessons/${lesson.previous.id}`} className="rounded-2xl border border-white/10 bg-white/[0.035] p-4 text-sm text-slate-200 hover:border-cyan-300/30"><span className="mb-2 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500"><ChevronLeft className="h-3.5 w-3.5"/>Previous lesson</span>{lesson.previous.title}</Link> : <span/>}{lesson.next ? <Link href={`/learning/lessons/${lesson.next.id}`} className="rounded-2xl border border-white/10 bg-white/[0.035] p-4 text-right text-sm text-slate-200 hover:border-cyan-300/30"><span className="mb-2 flex items-center justify-end gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500">Next lesson<ArrowRight className="h-3.5 w-3.5"/></span>{lesson.next.title}</Link> : <Link href="/learning" className="rounded-2xl border border-white/10 bg-white/[0.035] p-4 text-right text-sm text-slate-200 hover:border-cyan-300/30">Back to all modules <ArrowRight className="ml-2 inline h-4 w-4"/></Link>}</nav>
    <p className="flex items-center justify-center gap-2 text-center text-xs text-slate-500"><CircleHelp className="h-3.5 w-3.5"/>Use the dry-run controls to step through each example.</p>
  </motion.main>;
}
