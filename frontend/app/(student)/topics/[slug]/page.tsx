'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, BookOpen, HelpCircle, Video } from 'lucide-react';
import { topicsApi } from '@/lib/api/topics';
import { Topic } from '@/lib/api/types';
import TopicQuizRunner from '@/components/quiz/TopicQuizRunner';

// ─── Static fallback data ────────────────────────────────────────────────────

const FALLBACK_CODE = `#include <iostream>
using namespace std;

int main() {
    // Declare and initialise an array
    int arr[5] = {10, 20, 30, 40, 50};
    int n = 5;

    // Traverse the array
    for (int i = 0; i < n; i++) {
        cout << "arr[" << i << "] = " << arr[i] << endl;
    }

    // Access element by index — O(1)
    const int idx = 2;
    cout << "Element at index " << idx
         << " → " << arr[idx] << endl;

    return 0;
}`;

const LECTURE_NOTES = [
  {
    emoji: '🧠',
    title: 'Memory Layout',
    description: 'Arrays occupy contiguous memory blocks, enabling O(1) random access via pointer arithmetic.',
  },
  {
    emoji: '⚡',
    title: 'Cache Efficiency',
    description: 'Sequential iteration is cache-friendly — adjacent elements load together into CPU cache lines.',
  },
  {
    emoji: '🔄',
    title: 'Static vs Dynamic',
    description: 'Static arrays have fixed size; dynamic arrays (std::vector) resize automatically with amortised O(1) push.',
  },
];

// ─── Code Tab ─────────────────────────────────────────────────────────────────

function CodeLine({ raw }: { raw: string }) {
  let result = raw
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Order matters: comments first
  result = result.replace(/(\/\/.*)$/gm, '<span class="text-slate-500">$1</span>');
  result = result.replace(/(["'][^"']*["'])/g, '<span class="text-amber-300">$1</span>');
  result = result.replace(
    /\b(const|int|for|return|using|namespace|void|if|else|while|main|include|cout|endl)\b/g,
    '<span class="text-cyan-400">$1</span>'
  );
  result = result.replace(/([{}()[\]])/g, '<span class="text-white">$1</span>');

  return <span dangerouslySetInnerHTML={{ __html: result }} />;
}

function CodeTab({ topic }: { topic: Topic | null }) {
  const [copied, setCopied] = useState(false);
  const rawCode = topic?.lessons?.[0]?.code_example ?? FALLBACK_CODE;
  const lang = topic?.lessons?.[0]?.programming_language ?? 'C++';
  const filename = `${topic?.slug ?? 'arrays'}.cpp`;
  const lines = rawCode.split('\n');

  const handleCopy = async () => {
    await navigator.clipboard.writeText(rawCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[#0d1117] rounded-2xl border border-white/10 overflow-hidden">
      {/* Top Bar */}
      <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-white/[0.07] bg-white/[0.02]">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-t-md bg-white/[0.08] border border-white/10 border-b-0 text-xs font-mono text-slate-300">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            {filename}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest bg-cyan-400/15 text-cyan-300 border border-cyan-400/30">
            {lang}
          </span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-xs font-semibold text-slate-300 transition-all"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>

      {/* Code Body */}
      <div className="flex overflow-x-auto">
        {/* Line numbers */}
        <div className="shrink-0 select-none py-5 px-3 text-right border-r border-white/[0.06] bg-white/[0.015]">
          {lines.map((_, i) => (
            <div key={i} className="font-mono text-sm leading-6 text-slate-600">
              {i + 1}
            </div>
          ))}
        </div>
        {/* Code */}
        <pre className="flex-1 py-5 px-5 font-mono text-sm leading-6 text-slate-200 overflow-x-auto">
          <code>
            {lines.map((line, i) => (
              <div key={i}>
                <CodeLine raw={line} />
              </div>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
}

// ─── Video Tab ────────────────────────────────────────────────────────────────

function VideoTab({ topic }: { topic: Topic | null }) {
  const title = topic?.title ?? 'Introduction to Arrays';

  return (
    <div className="space-y-5">
      {/* 16:9 player */}
      <div className="relative bg-black/60 rounded-2xl border border-purple-500/30 overflow-hidden backdrop-blur-xl">
        <div className="aspect-video flex items-center justify-center relative">
          {/* Glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-transparent to-indigo-900/40" />

          {/* Play button */}
          <div className="relative z-10 flex flex-col items-center gap-4">
            <div className="w-20 h-20 rounded-full border-2 border-purple-400/60 flex items-center justify-center bg-purple-500/20 shadow-[0_0_40px_rgba(168,85,247,0.6)] cursor-pointer hover:scale-110 transition-transform">
              <svg viewBox="0 0 24 24" className="w-9 h-9 text-white fill-current ml-1" aria-hidden="true">
                <polygon points="5,3 19,12 5,21" />
              </svg>
            </div>
          </div>

          {/* Title overlay */}
          <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
            <p className="text-sm font-bold text-white">{title}</p>
            <p className="text-xs text-slate-400 mt-0.5">Video lecture</p>
          </div>

          {/* Coming soon badge */}
          <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-purple-500/80 backdrop-blur-md text-xs font-black text-white border border-purple-300/40">
            Coming Soon
          </div>
        </div>
      </div>

      {/* Lecture note cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {LECTURE_NOTES.map((note) => (
          <div
            key={note.title}
            className="bg-white/[0.05] border border-white/10 rounded-xl p-4 space-y-2"
          >
            <div className="text-2xl">{note.emoji}</div>
            <p className="font-black text-sm text-white">{note.title}</p>
            <p className="text-xs text-slate-400 leading-relaxed">{note.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function TopicSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 w-48 rounded-xl bg-white/[0.08]" />
      <div className="h-4 w-72 rounded-lg bg-white/[0.05]" />
      <div className="h-96 rounded-2xl bg-white/[0.04]" />
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

type TabKey = 'Code' | 'Quiz' | 'Video';

const TABS: { key: TabKey; icon: React.ReactNode; label: string }[] = [
  { key: 'Code', icon: <BookOpen className="w-4 h-4" />, label: 'Code' },
  { key: 'Quiz', icon: <HelpCircle className="w-4 h-4" />, label: 'Quiz' },
  { key: 'Video', icon: <Video className="w-4 h-4" />, label: 'Video' },
];

export default function TopicPage() {
  const params = useParams();
  const slug =
    typeof params?.slug === 'string'
      ? params.slug
      : Array.isArray(params?.slug)
      ? params.slug[0]
      : '';

  const [topic, setTopic] = useState<Topic | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>('Code');

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setError(null);
    topicsApi
      .getBySlug(slug)
      .then((data) => {
        setTopic(data);
      })
      .catch((err: unknown) => {
        const status = (err as { response?: { status?: number } })?.response?.status;
        if (status === 404) {
          setError('Topic not found.');
        } else {
          setError('Failed to load topic. Please try again later.');
        }
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <section className="mx-auto max-w-5xl px-4 py-10">
        <TopicSkeleton />
      </section>
    );
  }

  if (error) {
    return (
      <section className="mx-auto max-w-5xl px-4 py-10 text-center space-y-4">
        <div className="text-5xl">😕</div>
        <h2 className="text-2xl font-black text-white">{error}</h2>
        <p className="text-slate-400 text-sm">Go back and pick a different topic.</p>
        <a
          href="/topics"
          className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 rounded-xl bg-white/[0.08] border border-white/15 text-sm font-bold text-slate-200 hover:bg-white/[0.14] transition-colors"
        >
          ← Back to Topics
        </a>
      </section>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="mx-auto max-w-5xl space-y-5 px-2 pb-6 sm:px-3"
    >
      {/* Header */}
      <div className="space-y-2 pt-2">
        <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-cyan-300">
          {topic?.category ?? 'Data Structures'}
        </p>
        <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
          {topic?.title ?? slug}
        </h1>
        {topic?.description && (
          <p className="text-sm leading-6 text-slate-300 max-w-2xl">{topic.description}</p>
        )}
      </div>

      {/* Tabs */}
      <div className="flex max-w-full gap-1 overflow-x-auto p-1 rounded-2xl bg-white/[0.04] border border-white/10 w-fit">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex shrink-0 items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold transition-all sm:px-4 ${
              activeTab === tab.key
                ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.06]'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
        >
          {activeTab === 'Code' && <CodeTab topic={topic} />}
          {activeTab === 'Quiz' && <TopicQuizRunner topicTitle={topic?.title ?? slug} topicSlug={slug} />}
          {activeTab === 'Video' && <VideoTab topic={topic} />}
        </motion.div>
      </AnimatePresence>
    </motion.section>
  );
}
