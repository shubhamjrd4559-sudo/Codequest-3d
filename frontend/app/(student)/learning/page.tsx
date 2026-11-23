"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, BookOpen, Check, Clock3, LoaderCircle, LockKeyhole, Search } from "lucide-react";

import { learningApi, type LearningPathChapter, type LearningPathData, type LearningPathLesson, type LearningPathModule, type LessonSearchResult } from "@/lib/api/learning";

function chapterGroups(module: LearningPathModule): LearningPathChapter[] {
  if (module.chapters.length) return module.chapters;
  if (!module.lessons.length) return [];
  const completed = module.lessons.filter((lesson) => lesson.is_completed).length;
  return [{ id: -module.id, title: "Lessons", slug: "lessons", description: "", order: 1, lessons: module.lessons, completed_lessons: completed, total_lessons: module.lessons.length, progress_percent: Math.round((completed / module.lessons.length) * 100) }];
}

function LessonRow({ lesson, number }: { lesson: LearningPathLesson; number: string }) {
  return (
    <li className="flex items-center gap-3 border-b border-white/[0.06] py-3 last:border-0">
      <span role="checkbox" aria-checked={lesson.is_completed} aria-label={lesson.is_completed ? "Lesson completed" : "Lesson not completed yet"}
        className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg border-2 ${lesson.is_completed ? "border-emerald-400 bg-emerald-500 text-white" : "border-slate-500 bg-slate-900/50 text-transparent"}`}>
        {lesson.is_completed ? <Check className="h-4 w-4 stroke-[3]" aria-hidden="true" /> : null}
      </span>
      <Link href={`/learning/lessons/${lesson.id}`} className={`min-w-0 flex-1 text-sm font-bold transition hover:text-cyan-200 sm:text-base ${lesson.is_completed ? "text-slate-400" : "text-slate-100"}`}>
        <span className="mr-2 text-xs font-black text-slate-500">{number}</span>{lesson.title}
      </Link>
      {lesson.has_content ? <span className="hidden items-center gap-1.5 text-xs font-semibold text-slate-500 sm:inline-flex"><Clock3 className="h-3.5 w-3.5" aria-hidden="true" />{lesson.estimated_minutes} min</span> : <span className="text-[10px] font-bold text-amber-200/70">Content in progress</span>}
    </li>
  );
}

export default function LearningPathPage() {
  const [pathData, setPathData] = useState<LearningPathData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [signInRequired, setSignInRequired] = useState(false);
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<LessonSearchResult[]>([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    let active = true;
    learningApi.getPath()
      .then((data) => { if (active) setPathData(data); })
      .catch((requestError: unknown) => {
        if (!active) return;
        const statusCode = (requestError as { response?: { status?: number } })?.response?.status;
        if (statusCode === 401 || statusCode === 403) {
          setSignInRequired(true);
          setError("Sign in with a student account to view your learning path.");
        } else setError("The learning path could not load. Check your connection and try again.");
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    const normalized = query.trim();
    if (normalized.length < 2) { setSearchResults([]); setSearching(false); return; }
    let active = true;
    setSearching(true);
    const timeout = window.setTimeout(() => {
      learningApi.searchLessons(normalized)
        .then((results) => { if (active) setSearchResults(results); })
        .catch(() => { if (active) setSearchResults([]); })
        .finally(() => { if (active) setSearching(false); });
    }, 220);
    return () => { active = false; window.clearTimeout(timeout); };
  }, [query]);

  const progress = pathData?.course_progress ?? 0;
  const isSearching = query.trim().length >= 2;
  const completedByModule = useMemo(() => new Map((pathData?.modules ?? []).map((module) => [module.id, module.lessons.filter((lesson) => lesson.is_completed).length])), [pathData]);

  return (
    <motion.main initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="mx-auto max-w-5xl space-y-6 pb-6">
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm font-bold text-cyan-100 transition hover:text-white"><ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back to dashboard</Link>
      <header className="rounded-[28px] border border-violet-300/20 bg-gradient-to-br from-[#17133a]/90 via-[#11152c]/90 to-[#101026]/90 p-5 shadow-[0_18px_55px_rgba(0,0,0,0.2)] backdrop-blur-xl sm:p-7">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-200">Your study roadmap</p>
        <div className="mt-2 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div><h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">Learning Path</h1><p className="mt-2 text-sm text-slate-300">{pathData ? `${pathData.completed_lessons} of ${pathData.total_lessons} lessons completed` : "Open a lesson, study the idea, then mark it complete."}</p></div>
          <div className="min-w-44 rounded-2xl border border-white/10 bg-black/20 px-4 py-3"><div className="mb-2 flex items-center justify-between gap-4 text-xs font-extrabold"><span className="text-slate-300">Course progress</span><span className="text-cyan-100">{progress}%</span></div><div className="h-2 overflow-hidden rounded-full bg-white/10" role="progressbar" aria-label="Learning path progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}><motion.div className="h-full rounded-full bg-gradient-to-r from-emerald-300 to-cyan-300" animate={{ width: `${progress}%` }} transition={{ duration: 0.45 }} /></div></div>
        </div>
        <label className="mt-5 flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-slate-400 focus-within:border-cyan-300/50"><Search className="h-4 w-4 shrink-0 text-cyan-200" aria-hidden="true"/><span className="sr-only">Search lessons</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search lessons and concepts…" className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-slate-500"/></label>
      </header>

      {error && <div role="alert" className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-rose-300/25 bg-rose-400/10 p-4 text-sm font-semibold text-rose-100"><span>{error}</span>{signInRequired && <Link href="/login" className="rounded-xl border border-amber-200/25 px-4 py-2 font-extrabold text-amber-100 hover:bg-amber-200/10">Sign in</Link>}</div>}
      {loading ? <div className="flex min-h-48 items-center justify-center gap-3 rounded-3xl border border-white/10 bg-white/[0.035] text-sm font-bold text-slate-300"><LoaderCircle className="h-5 w-5 animate-spin text-cyan-200"/> Loading your learning path…</div> : isSearching ? (
        <section aria-label="Lesson search results" className="rounded-3xl border border-white/10 bg-[#111426]/90 p-5">
          <h2 className="mb-3 text-sm font-black uppercase tracking-widest text-violet-200">Search results</h2>
          {searching ? <p className="text-sm text-slate-400">Searching lessons…</p> : searchResults.length ? <ul className="divide-y divide-white/10">{searchResults.map((lesson) => <li key={lesson.id} className="py-3"><Link href={`/learning/lessons/${lesson.id}`} className="font-bold text-white hover:text-cyan-200">{lesson.title}</Link><p className="mt-1 text-xs text-slate-400">{lesson.topic}</p></li>)}</ul> : <p className="text-sm text-slate-400">No lessons found for “{query.trim()}”.</p>}
        </section>
      ) : pathData?.modules.length ? (
        <div className="space-y-5">
          {pathData.modules.map((module, moduleIndex) => {
            const groups = chapterGroups(module);
            const completeCount = completedByModule.get(module.id) ?? 0;
            return <motion.section key={module.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(moduleIndex * 0.025, 0.3), duration: 0.28 }} className="overflow-hidden rounded-[26px] border border-white/10 bg-gradient-to-br from-[#15152d]/90 to-[#101321]/90 shadow-[0_14px_42px_rgba(0,0,0,0.16)] backdrop-blur-xl">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.08] px-5 py-4 sm:px-6"><div className="flex min-w-0 items-center gap-3"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-violet-200/15 bg-violet-300/10 text-violet-100"><BookOpen className="h-5 w-5" aria-hidden="true"/></span><div className="min-w-0"><p className="text-[10px] font-black uppercase tracking-[0.16em] text-violet-200">Module {module.order}</p><h2 className="mt-0.5 text-base font-black text-white sm:text-lg">{module.title}</h2></div></div><span className="rounded-full border border-white/10 bg-black/20 px-3 py-1.5 text-xs font-bold text-slate-300">{completeCount}/{module.lessons.length} complete</span></div>
              {module.description && <p className="px-5 pt-4 text-sm leading-relaxed text-slate-400 sm:px-6">{module.description}</p>}
              <div className="px-5 pt-4 sm:px-6"><div className="h-1.5 overflow-hidden rounded-full bg-white/10" role="progressbar" aria-label={`${module.title} progress`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={module.progress_percent}><div className="h-full rounded-full bg-gradient-to-r from-violet-300 to-cyan-300" style={{ width: `${module.progress_percent}%` }}/></div></div>
              <div className="space-y-4 px-5 pb-5 pt-3 sm:px-6">{groups.map((chapter) => <section key={chapter.id} className="rounded-2xl border border-white/[0.07] bg-black/10 px-4 py-3"><div className="mb-1 flex flex-wrap items-center justify-between gap-2"><div><h3 className="text-xs font-black uppercase tracking-[0.12em] text-cyan-100">{chapter.title}</h3>{chapter.description && <p className="mt-1 text-xs text-slate-500">{chapter.description}</p>}</div><span className="text-[10px] font-bold text-slate-500">{chapter.completed_lessons}/{chapter.total_lessons} complete</span></div><ul>{chapter.lessons.map((lesson, lessonIndex) => <LessonRow key={lesson.id} lesson={lesson} number={`${module.order}.${chapter.order}.${lessonIndex + 1}`}/>)}</ul></section>)}</div>
            </motion.section>;
          })}
        </div>
      ) : !error ? <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-8 text-center text-slate-300">The learning path has no published lessons yet.</div> : null}
      <p className="flex items-center justify-center gap-2 text-center text-xs font-medium text-slate-500"><LockKeyhole className="h-3.5 w-3.5" aria-hidden="true"/>Your checklist and course progress are saved to your student account.</p>
    </motion.main>
  );
}
