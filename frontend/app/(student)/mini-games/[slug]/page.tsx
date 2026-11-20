"use client";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";

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
    instructions: "Explore the scene and get ready to add and remove blocks from a stack.",
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

  return <GameShell title={game.title} instructions={game.instructions} objective={game.objective} />;
}
