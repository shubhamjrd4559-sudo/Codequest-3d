'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight, BookOpen, Play, Search, Video } from 'lucide-react';

const PLAYLIST_URL = 'https://www.youtube.com/watch?v=VTLCoHnyACE&list=PLfqMhTWNBTe137I_EPQd34TsgV6IO55pt';

// Curated 26-topic starter library based on the Apna College DSA playlist.
const VIDEO_TOPICS = [
  'Programming Basics', 'Variables & Data Types', 'Operators & Conditions', 'Loops', 'Functions',
  'Arrays', 'Array Indexing', 'Linear Search', 'Binary Search', 'Bubble Sort', 'Selection Sort', 'Insertion Sort',
  'Stacks', 'Push & Pop', 'Queues', 'Enqueue & Dequeue', 'FIFO & LIFO',
  'Linked Lists', 'Nodes & Pointers', 'Linked List Insertion', 'Linked List Deletion', 'Linked List Traversal',
  'Trees', 'Binary Trees', 'Tree Traversals', 'Recursion',
];

const ACCENTS = [
  'from-cyan-400/25 via-blue-500/15 to-indigo-500/30',
  'from-fuchsia-400/25 via-violet-500/15 to-indigo-500/30',
  'from-amber-300/25 via-orange-500/15 to-rose-500/25',
  'from-emerald-300/20 via-teal-500/15 to-cyan-500/25',
];

export default function VideosPage() {
  const [query, setQuery] = useState('');
  const visibleTopics = useMemo(() => VIDEO_TOPICS.filter((topic) => topic.toLowerCase().includes(query.trim().toLowerCase())), [query]);

  return (
    <main className="mx-auto max-w-7xl space-y-8 px-4 pb-14 pt-3 sm:px-6">
      <motion.header initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="relative overflow-hidden rounded-[32px] border border-cyan-300/15 bg-[#0b1027]/90 p-6 shadow-[0_24px_80px_rgba(2,6,23,.35)] sm:p-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(34,211,238,.16),transparent_45%),radial-gradient(ellipse_at_bottom_left,rgba(168,85,247,.18),transparent_45%)]" />
        <div className="relative max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-200/20 bg-cyan-300/10 px-3 py-1.5 text-xs font-black uppercase tracking-[.18em] text-cyan-100"><Video className="h-4 w-4" /> CodeQuest Video Help</div>
          <h1 className="text-3xl font-black tracking-tight text-white sm:text-5xl">Big ideas, made <span className="bg-gradient-to-r from-cyan-300 to-violet-300 bg-clip-text text-transparent">easy to see.</span></h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">Explore bite-sized DSA concepts with the Apna College playlist. Pick a topic, watch, and come back ready to practice.</p>
          <a href={PLAYLIST_URL} target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-violet-500 px-5 py-3 text-sm font-black text-slate-950 shadow-lg shadow-cyan-500/15 transition hover:brightness-110">Open full playlist <ArrowUpRight className="h-4 w-4" /></a>
        </div>
      </motion.header>

      <section>
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div><p className="text-xs font-black uppercase tracking-[.2em] text-violet-200">Concept library</p><h2 className="mt-1 text-2xl font-black text-white">Find your next “aha!”</h2></div>
          <label className="flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-white/[.045] px-4 py-3 text-slate-300 focus-within:border-cyan-300/50 focus-within:ring-2 focus-within:ring-cyan-300/10 sm:max-w-sm"><Search className="h-4 w-4 shrink-0 text-cyan-200" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search 26 topics…" className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500" aria-label="Search video topics" /></label>
        </div>
        {visibleTopics.length ? <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {visibleTopics.map((topic, index) => <motion.article key={topic} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(index * .025, .3) }} whileHover={{ y: -4 }} className="group overflow-hidden rounded-[24px] border border-white/10 bg-[#11152d]/85 shadow-[0_12px_40px_rgba(0,0,0,.2)] transition-shadow hover:border-cyan-200/30 hover:shadow-[0_14px_50px_rgba(34,211,238,.08)]">
            <div className={`relative flex aspect-video items-center justify-center overflow-hidden bg-gradient-to-br ${ACCENTS[index % ACCENTS.length]}`}>
              <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,.38) 1px, transparent 1px)', backgroundSize: '18px 18px' }} />
              <div className="absolute -left-8 -top-12 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
              <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-white/25 bg-slate-950/35 text-white shadow-xl backdrop-blur-md transition duration-300 group-hover:scale-110"><Play className="ml-1 h-7 w-7 fill-current" /></div>
              <span className="absolute bottom-3 left-3 rounded-lg border border-white/15 bg-slate-950/55 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-white/90 backdrop-blur">Apna College · DSA</span>
              <span className="absolute right-3 top-3 rounded-full bg-slate-950/50 px-2.5 py-1 text-[10px] font-bold text-cyan-100">Concept video</span>
            </div>
            <div className="p-5">
              <div className="flex items-start gap-3"><span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-violet-200/15 bg-violet-400/10 text-violet-100"><BookOpen className="h-4 w-4" /></span><div className="min-w-0 flex-1"><p className="text-[10px] font-black uppercase tracking-[.17em] text-slate-500">DSA Learning Path</p><h3 className="mt-1 text-lg font-black text-white">{topic}</h3></div></div>
              <a href={PLAYLIST_URL} target="_blank" rel="noreferrer" className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-cyan-200/20 bg-gradient-to-r from-cyan-500/15 to-violet-500/15 px-4 py-3 text-sm font-black text-cyan-100 transition hover:border-cyan-200/45 hover:from-cyan-500/25 hover:to-violet-500/25">Watch now <ArrowUpRight className="h-4 w-4" /></a>
            </div>
          </motion.article>)}
        </div> : <div className="rounded-2xl border border-white/10 bg-white/[.04] px-5 py-12 text-center text-slate-300">No topics match “{query}”. Try another search.</div>}
      </section>

      <p className="text-center text-xs leading-5 text-slate-500">Video links open the Apna College playlist on YouTube. <Link href="/topics/arrays" className="font-bold text-cyan-200 hover:text-white">Practice Arrays →</Link></p>
    </main>
  );
}
