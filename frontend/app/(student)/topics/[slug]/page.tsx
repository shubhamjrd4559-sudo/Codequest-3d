'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, BookOpen, HelpCircle, Video } from 'lucide-react';
import { topicsApi } from '@/lib/api/topics';
import { Topic } from '@/lib/api/types';

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

const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: 'What is the time complexity to access an element at a given index in a contiguous array?',
    options: [
      { key: 'A', text: 'O(1) — Constant Time', correct: true },
      { key: 'B', text: 'O(n) — Linear Time', correct: false },
      { key: 'C', text: 'O(log n) — Logarithmic Time', correct: false },
      { key: 'D', text: 'O(n²) — Quadratic Time', correct: false },
    ],
    explanation:
      'Array elements are stored contiguously. The address is Base + (index × size), computed in a single step — O(1) direct access.',
  },
  {
    id: 2,
    question: 'What happens when you access an array out of its declared bounds in C++?',
    options: [
      { key: 'A', text: 'Compiler error always', correct: false },
      { key: 'B', text: 'Undefined behaviour (memory corruption)', correct: true },
      { key: 'C', text: 'Returns 0 by default', correct: false },
      { key: 'D', text: 'Throws a runtime exception', correct: false },
    ],
    explanation:
      'C++ does not perform bounds checking. Accessing out-of-bounds memory leads to undefined behaviour, which may corrupt data silently.',
  },
  {
    id: 3,
    question: 'Which of the following operations on an unsorted array has O(n) worst-case complexity?',
    options: [
      { key: 'A', text: 'Read at index i', correct: false },
      { key: 'B', text: 'Write at index i', correct: false },
      { key: 'C', text: 'Search for a value', correct: true },
      { key: 'D', text: 'Get the size', correct: false },
    ],
    explanation:
      'Linear search scans every element one by one, so in the worst case it checks all n elements — O(n) time.',
  },
];

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

// ─── Quiz Tab ─────────────────────────────────────────────────────────────────

function QuizTab() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const q = QUIZ_QUESTIONS[currentIndex];
  const isAnswered = selected !== null;

  const handleSelect = (key: string) => {
    if (isAnswered) return;
    setSelected(key);
    const opt = q.options.find((o) => o.key === key);
    if (opt?.correct) setScore((s) => s + 1);
  };

  const handleNext = () => {
    if (currentIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentIndex((i) => i + 1);
      setSelected(null);
    } else {
      setDone(true);
    }
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setSelected(null);
    setScore(0);
    setDone(false);
  };

  if (done) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-4 py-10"
      >
        <div className="text-6xl">🏆</div>
        <h3 className="text-2xl font-black text-white">Quiz Complete!</h3>
        <p className="text-slate-300">
          You scored{' '}
          <span className="text-cyan-400 font-black">
            {score}/{QUIZ_QUESTIONS.length}
          </span>{' '}
          correct answers.
        </p>
        <button
          onClick={handleReset}
          className="mt-2 inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-black text-sm shadow-lg hover:scale-105 transition-transform"
        >
          Try Again
        </button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Progress bar */}
      <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${((currentIndex + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>
      <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
        <span>Question {currentIndex + 1} of {QUIZ_QUESTIONS.length}</span>
        <span>Score: {score}</span>
      </div>

      {/* Question */}
      <p className="text-base sm:text-lg font-bold text-white leading-relaxed">{q.question}</p>

      {/* Options */}
      <div className="space-y-3">
        {q.options.map((opt) => {
          const isSelected = selected === opt.key;
          let cls =
            'bg-white/[0.05] border border-white/10 backdrop-blur-xl rounded-xl p-4 text-left font-semibold cursor-pointer transition-all w-full text-sm text-slate-200';
          if (isAnswered) {
            if (opt.correct) {
              cls += ' border-emerald-400 bg-emerald-500/15 shadow-[0_0_20px_rgba(16,185,129,0.4)] text-emerald-200';
            } else if (isSelected) {
              cls += ' border-red-400 bg-red-500/15 shadow-[0_0_20px_rgba(239,68,68,0.4)] text-red-200';
            } else {
              cls += ' opacity-50';
            }
          }

          return (
            <motion.button
              key={opt.key}
              whileHover={!isAnswered ? { scale: 1.02 } : {}}
              whileTap={!isAnswered ? { scale: 0.98 } : {}}
              onClick={() => handleSelect(opt.key)}
              disabled={isAnswered}
              className={cls}
            >
              <span className="inline-flex items-center gap-3">
                <span className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center font-mono text-xs text-purple-300 shrink-0">
                  {opt.key}
                </span>
                {opt.text}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Explanation */}
      <AnimatePresence>
        {isAnswered && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="rounded-xl border border-white/15 bg-white/[0.05] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div>
              <p
                className={`text-xs font-black mb-1 ${
                  q.options.find((o) => o.key === selected)?.correct ? 'text-emerald-400' : 'text-red-400'
                }`}
              >
                {q.options.find((o) => o.key === selected)?.correct ? '✅ Correct!' : '❌ Incorrect'}
              </p>
              <p className="text-xs text-slate-300 leading-relaxed">{q.explanation}</p>
            </div>
            <button
              onClick={handleNext}
              className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-purple-500 text-white font-black text-xs shadow-lg hover:scale-105 transition-transform"
            >
              {currentIndex < QUIZ_QUESTIONS.length - 1 ? 'Next →' : 'Finish'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
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
      className="mx-auto max-w-5xl space-y-7 px-4 pb-12"
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
      <div className="flex gap-1 p-1 rounded-2xl bg-white/[0.04] border border-white/10 w-fit">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
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
          {activeTab === 'Quiz' && <QuizTab />}
          {activeTab === 'Video' && <VideoTab topic={topic} />}
        </motion.div>
      </AnimatePresence>
    </motion.section>
  );
}
