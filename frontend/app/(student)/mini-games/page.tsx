import Link from "next/link";
import { ArrowRight, Gamepad2, Sparkles } from "lucide-react";

const games = [
  {
    slug: "logic-builder",
    number: "01",
    title: "Logic Builder",
    subtitle: "Sequencing & algorithms",
    description: "Arrange clear steps and build the logic behind a working algorithm.",
    emoji: "🧩",
    accent: "from-cyan-400/20 to-blue-500/5 border-cyan-300/20",
  },
  {
    slug: "number-sorting-challenge",
    number: "02",
    title: "Number Sorting Challenge",
    subtitle: "Sorting arrays visually",
    description: "See how values move as an array is organized into the right order.",
    emoji: "🔢",
    accent: "from-violet-400/20 to-fuchsia-500/5 border-violet-300/20",
  },
  {
    slug: "stack-tower",
    number: "03",
    title: "Stack Tower",
    subtitle: "LIFO · push and pop",
    description: "Build a tower one block at a time and explore last-in, first-out.",
    emoji: "🗼",
    accent: "from-amber-400/20 to-orange-500/5 border-amber-300/20",
  },
  {
    slug: "queue-ticket-counter",
    number: "04",
    title: "Queue Ticket Counter",
    subtitle: "FIFO · line management",
    description: "Help tickets move through a line in first-in, first-out order.",
    emoji: "🎟️",
    accent: "from-emerald-400/20 to-teal-500/5 border-emerald-300/20",
  },
  {
    slug: "linked-list-node-connection",
    number: "05",
    title: "Linked List Node Connection",
    subtitle: "Pointers and nodes",
    description: "Follow the links between nodes and explore how a list connects.",
    emoji: "🔗",
    accent: "from-pink-400/20 to-rose-500/5 border-pink-300/20",
  },
  {
    slug: "tree-traversal-challenge",
    number: "06",
    title: "Tree Traversal Challenge",
    subtitle: "Inorder · Preorder · Postorder",
    description: "Explore a tree and compare three ways to visit its nodes.",
    emoji: "🌳",
    accent: "from-lime-400/20 to-green-500/5 border-lime-300/20",
  },
  {
    slug: "treasure-search",
    number: "07",
    title: "Treasure Search",
    subtitle: "Linear & binary search",
    description: "Hunt for treasure while comparing two ways to search a collection.",
    emoji: "💎",
    accent: "from-sky-400/20 to-indigo-500/5 border-sky-300/20",
  },
];

export default function MiniGamesPage() {
  return (
    <main className="mx-auto max-w-7xl space-y-8 pb-10">
      <header className="relative overflow-hidden rounded-[32px] border border-purple-300/20 bg-gradient-to-br from-indigo-950/95 via-[#15143d]/95 to-slate-950 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.28)] sm:p-9">
        <div className="pointer-events-none absolute -right-12 -top-16 h-64 w-64 rounded-full bg-fuchsia-500/20 blur-[90px]" />
        <div className="pointer-events-none absolute -bottom-20 left-1/3 h-56 w-56 rounded-full bg-cyan-400/15 blur-[90px]" />
        <div className="relative flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-200/20 bg-cyan-300/10 px-3 py-1.5 text-xs font-black uppercase tracking-[0.16em] text-cyan-100">
              <Sparkles className="h-3.5 w-3.5" /> Learn by playing
            </div>
            <h1 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-5xl">Mini-Game World</h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
              Step into playful challenges that turn algorithms and data structures into things you can see.
            </p>
          </div>
          <div className="inline-flex w-fit items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 backdrop-blur-xl">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-purple-400/15 text-purple-100"><Gamepad2 className="h-5 w-5" /></span>
            <div><p className="text-xl font-black text-white">07</p><p className="text-xs font-bold text-slate-400">worlds to explore</p></div>
          </div>
        </div>
      </header>

      <section aria-label="Available mini-games" className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {games.map((game) => (
          <Link
            href={`/mini-games/${game.slug}`}
            key={game.slug}
            className={`group relative flex min-h-[250px] flex-col overflow-hidden rounded-[28px] border bg-gradient-to-br ${game.accent} p-5 shadow-[0_18px_55px_rgba(0,0,0,0.2)] backdrop-blur-2xl transition duration-300 hover:-translate-y-1 hover:border-white/30 hover:shadow-[0_22px_65px_rgba(139,92,246,0.18)] sm:p-6`}
          >
            <div className="pointer-events-none absolute inset-0 bg-slate-950/55 transition group-hover:bg-slate-950/40" />
            <div className="relative flex items-start justify-between gap-3">
              <span className="grid h-14 w-14 place-items-center rounded-2xl border border-white/15 bg-white/[0.08] text-3xl shadow-inner backdrop-blur-xl">{game.emoji}</span>
              <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs font-black tracking-widest text-slate-300">{game.number}</span>
            </div>
            <div className="relative mt-5 flex-1">
              <p className="text-[11px] font-black uppercase tracking-[0.16em] text-cyan-100/80">{game.subtitle}</p>
              <h2 className="mt-2 text-xl font-black leading-tight text-white">{game.title}</h2>
              <p className="mt-2 text-sm leading-5 text-slate-300">{game.description}</p>
            </div>
            <div className="relative mt-5 flex items-center justify-between border-t border-white/10 pt-4 text-sm font-extrabold text-white">
              <span>Enter world</span><ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}
