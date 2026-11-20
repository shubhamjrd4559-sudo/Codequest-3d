"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Gamepad2, Search, Sparkles } from "lucide-react";

import { miniGames, type GameCategory } from "@/components/games/gameCatalog";

type GameFilter = "All games" | GameCategory;

const filters: GameFilter[] = ["All games", "Algorithms", "Data structures"];
const featuredGame = miniGames[0];
const iconSurfaces: Record<string, string> = {
  cyan: "bg-cyan-300/10",
  violet: "bg-violet-300/10",
  amber: "bg-amber-300/10",
  emerald: "bg-emerald-300/10",
  pink: "bg-pink-300/10",
  lime: "bg-lime-300/10",
  sky: "bg-sky-300/10",
};

export default function MiniGamesPage() {
  const [filter, setFilter] = useState<GameFilter>("All games");
  const [query, setQuery] = useState("");

  const visibleGames = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    return miniGames.filter((game) => {
      const matchesCategory = filter === "All games" || game.category === filter;
      const searchableText = `${game.title} ${game.subtitle} ${game.description}`.toLocaleLowerCase();
      return matchesCategory && (!normalizedQuery || searchableText.includes(normalizedQuery));
    });
  }, [filter, query]);

  return (
    <motion.main
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="mx-auto max-w-7xl space-y-8 pb-10"
    >
      <header className="flex flex-col justify-between gap-5 border-b border-white/10 pb-6 sm:flex-row sm:items-end">
        <div>
          <p className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.18em] text-cyan-200">
            <Sparkles className="h-4 w-4" aria-hidden="true" /> CodeQuest Arcade
          </p>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">
            Pick your next world
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
            Explore algorithms and data structures through visual game previews.
          </p>
        </div>
        <div className="flex w-fit items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3">
          <Gamepad2 className="h-5 w-5 text-violet-200" aria-hidden="true" />
          <div>
            <p className="text-lg font-black leading-none text-white">{miniGames.length}</p>
            <p className="mt-1 text-xs font-semibold text-slate-400">worlds to explore</p>
          </div>
        </div>
      </header>

      <section aria-labelledby="featured-game-heading" className="relative overflow-hidden rounded-[28px] border border-cyan-200/15 bg-gradient-to-br from-[#101b3a] via-[#10152e] to-[#0c0d20] p-6 sm:p-8">
        <div className="pointer-events-none absolute -right-10 -top-16 h-64 w-64 rounded-full bg-cyan-400/[0.08] blur-3xl" />
        <div className="relative z-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
          <div className="max-w-2xl">
            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-cyan-200">Featured world</p>
            <h2 id="featured-game-heading" className="mt-3 text-2xl font-black tracking-tight text-white sm:text-3xl">
              {featuredGame.title}
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-300">
              {featuredGame.description} Start with a preview of the CodeQuest game shell.
            </p>
            <Link
              href={`/mini-games/${featuredGame.slug}`}
              className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-xl bg-cyan-300 px-5 py-3 text-sm font-extrabold text-slate-950 transition hover:bg-cyan-200 focus-visible:outline-cyan-100"
            >
              Preview this world <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <div className="flex items-center gap-3 text-sm font-semibold text-slate-300 sm:pr-3">
            <span className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl ${iconSurfaces[featuredGame.accent]} ${featuredGame.iconColor}`}>
              <featuredGame.Icon className="h-7 w-7" strokeWidth={1.7} aria-hidden="true" />
            </span>
            <span>{featuredGame.subtitle}</span>
          </div>
        </div>
      </section>

      <section aria-labelledby="game-catalog-heading" className="space-y-5">
        <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-center">
          <div>
            <h2 id="game-catalog-heading" className="text-xl font-black text-white">Explore games</h2>
            <p className="mt-1 text-sm text-slate-400">{visibleGames.length} {visibleGames.length === 1 ? "world" : "worlds"}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5" role="group" aria-label="Search and filter games">
            <label className="relative block w-full sm:w-56">
              <span className="sr-only">Search games</span>
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search games"
                className="h-10 w-full rounded-xl border border-white/10 bg-white/[0.035] pl-10 pr-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-200/50 focus:ring-2 focus:ring-cyan-200/15"
              />
            </label>
            {filters.map((item) => {
              const isSelected = item === filter;
              return (
                <button
                  key={item}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => setFilter(item)}
                  className={`min-h-10 rounded-full px-4 text-sm font-bold transition focus-visible:outline-cyan-200 ${
                    isSelected
                      ? "bg-violet-300 text-slate-950"
                      : "border border-white/10 bg-white/[0.035] text-slate-300 hover:border-white/20 hover:bg-white/[0.07] hover:text-white"
                  }`}
                >
                  {item}
                </button>
              );
            })}
          </div>
        </div>

        {visibleGames.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {visibleGames.map((game, index) => {
              const Icon = game.Icon;
              return (
                <motion.article
                  key={game.slug}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.28, delay: index * 0.035 }}
                  className="group relative flex min-h-[250px] flex-col overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.035] p-5 transition duration-200 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.055] hover:shadow-[0_18px_45px_rgba(0,0,0,0.22)] sm:p-6"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className={`grid h-12 w-12 place-items-center rounded-2xl ${iconSurfaces[game.accent]} ${game.iconColor}`}>
                      <Icon className="h-6 w-6" strokeWidth={1.8} aria-hidden="true" />
                    </span>
                    <span className="text-xs font-extrabold tracking-[0.16em] text-slate-500">{game.number}</span>
                  </div>
                  <div className="mt-5 flex-1">
                    <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-slate-400">{game.category}</p>
                    <h3 className="mt-2 text-lg font-extrabold leading-snug text-white">{game.title}</h3>
                    <p className="mt-2 text-xs font-semibold text-slate-400">{game.subtitle}</p>
                    <p className="mt-3 text-sm leading-5 text-slate-300">{game.description}</p>
                  </div>
                  <Link
                    href={`/mini-games/${game.slug}`}
                    className="mt-5 inline-flex min-h-10 items-center justify-between border-t border-white/10 pt-4 text-sm font-extrabold text-slate-100 transition-colors group-hover:text-cyan-100 focus-visible:outline-cyan-200"
                  >
                    Open preview <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                  </Link>
                </motion.article>
              );
            })}
          </div>
        ) : (
          <div className="rounded-[24px] border border-dashed border-white/15 px-6 py-12 text-center">
            <p className="text-base font-bold text-white">No games match that search.</p>
            <p className="mt-2 text-sm text-slate-400">Try another title or switch to all games.</p>
            <button
              type="button"
              onClick={() => { setQuery(""); setFilter("All games"); }}
              className="mt-5 rounded-xl border border-white/15 px-4 py-2 text-sm font-bold text-slate-200 transition hover:bg-white/[0.06]"
            >
              Show all games
            </button>
          </div>
        )}
      </section>
    </motion.main>
  );
}
