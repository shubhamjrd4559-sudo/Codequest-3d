"use client";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowDownToLine, ArrowUpFromLine, Layers3 } from "lucide-react";
import StackTowerScene, { type StackBlock } from "@/games/scenes/StackTowerScene";

const GameShell = dynamic(() => import("@/components/games/GameShell"), {
  ssr: false,
  loading: () => (
    <div className="grid min-h-[55vh] place-items-center text-sm font-bold text-cyan-100" role="status">
      Loading the game world…
    </div>
  ),
});

const gameInfo: Record<string, { title: string; instructions: string; objective: string }> = {
  "logic-builder": {
    title: "Logic Builder",
    instructions: "Explore the scene and get ready to arrange steps into a clear algorithm.",
    objective: "Sequencing and algorithm thinking",
  },
  "number-sorting-challenge": {
    title: "Number Sorting Challenge",
    instructions: "Explore the scene and get ready to organize number blocks into order.",
    objective: "Sorting arrays visually",
  },
  "stack-tower": {
    title: "Stack Tower",
    instructions: "Click Push to add a block to the top. Click Pop to remove the top block. Notice how the last block in is the first one out!",
    objective: "LIFO: last in, first out",
  },
  "queue-ticket-counter": {
    title: "Queue Ticket Counter",
    instructions: "Explore the scene and get ready to help tickets move through a line.",
    objective: "FIFO: first in, first out",
  },
  "linked-list-node-connection": {
    title: "Linked List Node Connection",
    instructions: "Explore the scene and get ready to follow the links between nodes.",
    objective: "Pointers, nodes, and connections",
  },
  "tree-traversal-challenge": {
    title: "Tree Traversal Challenge",
    instructions: "Explore the scene and get ready to visit nodes in different orders.",
    objective: "Inorder, preorder, and postorder traversal",
  },
  "treasure-search": {
    title: "Treasure Search",
    instructions: "Explore the scene and get ready to search for the hidden treasure.",
    objective: "Linear search and binary search",
  },
};

const blockColors = ["#22d3ee", "#a78bfa", "#fb7185", "#34d399", "#fbbf24", "#60a5fa"];

function StackTowerGame({ game }: { game: { title: string; instructions: string; objective: string } }) {
  const [blocks, setBlocks] = useState<StackBlock[]>([]);
  const [score, setScore] = useState(0);
  const [nextId, setNextId] = useState(1);
  const [feedback, setFeedback] = useState("Push a block to start building your stack.");
  const [feedbackType, setFeedbackType] = useState<"info" | "success" | "error">("info");
  const [exiting, setExiting] = useState<{ block: StackBlock; index: number } | null>(null);

  useEffect(() => {
    if (!exiting) return;
    const timeout = window.setTimeout(() => setExiting(null), 650);
    return () => window.clearTimeout(timeout);
  }, [exiting]);

  const push = () => {
    if (blocks.length >= 6) {
      setFeedback("Tower full! Pop a block before adding another.");
      setFeedbackType("error");
      return;
    }
    const block = { id: nextId, value: nextId, color: blockColors[(nextId - 1) % blockColors.length] };
    setBlocks((current) => [...current, block]);
    setNextId((current) => current + 1);
    setScore((current) => current + 10);
    setFeedback(`Pushed block ${block.value}. It is now the top of the stack.`);
    setFeedbackType("success");
    setExiting(null);
  };

  const pop = () => {
    if (blocks.length === 0) {
      setFeedback("Stack Underflow! There are no blocks to pop.");
      setFeedbackType("error");
      return;
    }
    const top = blocks[blocks.length - 1];
    setExiting({ block: top, index: blocks.length - 1 });
    setBlocks((current) => current.slice(0, -1));
    setScore((current) => current + 15);
    setFeedback(`Popped block ${top.value}. Last in, first out!`);
    setFeedbackType("success");
  };

  const reset = () => {
    setBlocks([]);
    setScore(0);
    setNextId(1);
    setExiting(null);
    setFeedback("Stack reset. Push a block to start building.");
    setFeedbackType("info");
  };

  const buttonClass = "flex min-h-12 flex-1 items-center justify-center gap-2 rounded-2xl px-4 text-sm font-black transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80";

  return (
    <GameShell
      title={game.title}
      instructions={game.instructions}
      objective={game.objective}
      score={score}
      onReset={reset}
      scene={<StackTowerScene blocks={blocks} exiting={exiting} />}
      controls={(
        <div className="rounded-[26px] border border-cyan-200/20 bg-slate-950/70 p-4 shadow-xl backdrop-blur-xl">
          <div className="mb-3 flex items-center justify-between text-xs font-bold text-slate-300">
            <span className="flex items-center gap-2"><Layers3 className="h-4 w-4 text-cyan-200" /> Stack size</span>
            <span className="rounded-full bg-cyan-300/10 px-3 py-1 text-cyan-100">{blocks.length} / 6</span>
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={push} className={`${buttonClass} bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 shadow-[0_0_18px_rgba(34,211,238,0.25)] hover:brightness-110`}>
              <ArrowDownToLine className="h-4 w-4" /> Push
            </button>
            <button type="button" onClick={pop} className={`${buttonClass} border border-violet-200/25 bg-violet-400/10 text-violet-100 hover:bg-violet-400/20`}>
              <ArrowUpFromLine className="h-4 w-4" /> Pop
            </button>
          </div>
        </div>
      )}
      feedback={(
        <div aria-live="polite" role="status" className={`rounded-2xl border px-4 py-3 text-sm font-bold ${feedbackType === "error" ? "border-rose-400/40 bg-rose-500/10 text-rose-200" : feedbackType === "success" ? "border-emerald-300/30 bg-emerald-400/10 text-emerald-100" : "border-white/10 bg-white/[0.04] text-slate-300"}`}>
          {feedback}
        </div>
      )}
    />
  );
}

export default function MiniGamePage() {
  const params = useParams<{ slug: string }>();
  const game = gameInfo[params.slug];

  if (!game) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-8 text-center">
        <h1 className="text-2xl font-black text-white">Game world not found</h1>
        <p className="mt-2 text-sm text-slate-300">Choose one of the available mini-games to continue.</p>
      </div>
    );
  }

  if (params.slug === "stack-tower") return <StackTowerGame game={game} />;
  return <GameShell title={game.title} instructions={game.instructions} objective={game.objective} />;
}
