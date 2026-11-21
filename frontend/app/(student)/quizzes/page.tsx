'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Brain, Search, Sparkles } from 'lucide-react';
import { QUIZ_LEVELS, QUIZ_TOPICS } from '@/components/quiz/quizTopics';

const GROUPS = ['All topics', ...Array.from(new Set(QUIZ_TOPICS.map((topic) => topic.group)))];
const PALETTES = [
  'from-cyan-400/15 to-blue-500/5 border-cyan-300/15',
  'from-violet-400/15 to-fuchsia-500/5 border-violet-300/15',
  'from-pink-400/15 to-rose-500/5 border-pink-300/15',
  'from-amber-300/15 to-orange-500/5 border-amber-300/15',
];

export default function QuizzesPage() {
  const [query, setQuery] = useState('');
  const [activeGroup, setActiveGroup] = useState('All topics');
  const topics = useMemo(() => QUIZ_TOPICS.filter((topic) => {
    const matchesName = topic.title.toLowerCase().includes(query.trim().toLowerCase());
    const matchesGroup = activeGroup === 'All topics' || topic.group === activeGroup;
    return matchesName && matchesGroup;
  }), [activeGroup, query]);

  return (
    <main className="mx-auto max-w-7xl space-y-5 px-2 pb-6 pt-1 sm:px-3">
      <motion.header initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="relative overflow-hidden rounded-[26px] border border-violet-200/15 bg-[#0c1028] p-5 sm:p-7">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(34,211,238,.16),transparent_45%),radial-gradient(ellipse_at_bottom_left,rgba(168,85,247,.2),transparent_48%)]" />
        <div className="relative flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-cyan-200/20 bg-cyan-300/10 px-3 py-1.5 text-xs font-black uppercase tracking-[.18em] text-cyan-100"><Brain className="h-4 w-4" /> DSA Quiz Arena</span>
            <h1 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-5xl">Pick a topic. <span className="bg-gradient-to-r from-cyan-300 to-violet-300 bg-clip-text text-transparent">Level up.</span></h1>
            <p className="mt-3 text-sm leading-6 text-slate-300 sm:text-base">Choose from 26 topics. Each quiz path has four progressive stages, from your first idea to Grandmaster.</p>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[.04] px-4 py-3 text-sm font-bold text-slate-200"><Sparkles className="h-5 w-5 text-amber-200" /><span><strong className="text-white">4 levels</strong><br /><span className="text-xs text-slate-400">in every topic</span></span></div>
        </div>
      </motion.header>

      <section className="space-y-4" aria-label="Quiz topics">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div><p className="text-xs font-black uppercase tracking-[.2em] text-violet-200">Your quiz map</p><h2 className="mt-1 text-xl font-black text-white sm:text-2xl">{topics.length} topics to explore</h2></div>
        </div>

        <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[.035] p-3 sm:flex-row sm:items-center sm:p-3.5" aria-label="Search and filter quiz topics">
          <label className="flex min-h-10 w-full shrink-0 items-center gap-3 rounded-xl border border-white/10 bg-slate-950/35 px-3.5 text-slate-300 focus-within:border-cyan-300/50 sm:max-w-xs"><Search className="h-4 w-4 text-cyan-200" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search topics..." className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500" aria-label="Search quiz topics" /></label>
          <div className="flex flex-wrap gap-2" aria-label="Filter topics by category">
            {GROUPS.map((group) => <button key={group} onClick={() => setActiveGroup(group)} className={`rounded-full border px-3.5 py-2 text-xs font-extrabold transition ${activeGroup === group ? 'border-cyan-200/30 bg-cyan-300/15 text-cyan-100' : 'border-white/10 bg-white/[.03] text-slate-400 hover:text-white'}`}>{group}</button>)}
          </div>
        </div>

        {topics.length ? <div className="grid items-stretch gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {topics.map((topic, index) => <motion.article key={topic.slug} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(index * .025, .25) }} whileHover={{ y: -3 }} className={`flex h-full flex-col rounded-[22px] border bg-gradient-to-br ${PALETTES[index % PALETTES.length]} p-4 shadow-[0_14px_38px_rgba(0,0,0,.18)] sm:p-5`}>
            <div className="flex items-start justify-between gap-3">
              <div><p className="text-[10px] font-black uppercase tracking-[.18em] text-slate-400">{topic.group}</p><h3 className="mt-2 min-h-12 text-lg font-black leading-snug text-white">{topic.title}</h3></div>
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-white/10 bg-slate-950/35 text-cyan-100"><Brain className="h-5 w-5" /></div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {QUIZ_LEVELS.map((level, levelIndex) => <span key={level.name} className={`rounded-lg border border-white/[.08] bg-slate-950/30 px-2.5 py-1.5 text-[10px] font-extrabold ${level.color}`}><span className="mr-1 opacity-60">0{levelIndex + 1}</span>{level.name}</span>)}
            </div>
            <Link href={`/quizzes/${topic.slug}`} className="mt-auto flex min-h-10 items-center justify-between rounded-xl bg-white px-4 py-2.5 text-sm font-black text-slate-950 transition hover:bg-cyan-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-200">Start quiz path <ArrowRight className="h-4 w-4" /></Link>
          </motion.article>)}
        </div> : <div className="rounded-2xl border border-white/10 bg-white/[.04] p-10 text-center text-sm text-slate-300">No quiz topics match that search. Try another term.</div>}
      </section>
    </main>
  );
}
