"use client";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowDownToLine, ArrowUpFromLine, Layers3 } from "lucide-react";
import StackTowerScene, { type StackBlock } from "@/games/scenes/StackTowerScene";
import LogicBuilderScene, { logicPath, type LogicCommand, type LogicState } from "@/games/scenes/LogicBuilderScene";
import NumberSortingScene, { type NumberTile } from "@/games/scenes/NumberSortingScene";
import QueueCounterScene, { type QueueCustomer } from "@/games/scenes/QueueCounterScene";
import LinkedListScene, { type ListLink, type ListNode } from "@/games/scenes/LinkedListScene";
import TreeTraversalScene, { type TreeEdge, type TreeNode } from "@/games/scenes/TreeTraversalScene";

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
  "number-sorting": {
    title: "Number Sorting Challenge",
    instructions: "Swap adjacent blocks to order the numbers.",
    objective: "Arrays and sorting logic",
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
  "queue-counter": {
    title: "Queue Ticket Counter",
    instructions: "Help customers move through the line in FIFO order.",
    objective: "Queues and first-in, first-out logic",
  },
  "linked-list-node-connection": {
    title: "Linked List Node Connection",
    instructions: "Explore the scene and get ready to follow the links between nodes.",
    objective: "Pointers, nodes, and connections",
  },
  "linked-list": {
    title: "Linked List Node Connection",
    instructions: "Connect nodes with pointers and follow the head.",
    objective: "Pointers, nodes, and linked list traversal",
  },
  "tree-traversal-challenge": {
    title: "Tree Traversal Challenge",
    instructions: "Explore the scene and get ready to visit nodes in different orders.",
    objective: "Inorder, preorder, and postorder traversal",
  },
  "tree-traversal": {
    title: "Tree Traversal Challenge",
    instructions: "Identify the root and explore tree traversal orders.",
    objective: "Binary trees and traversal algorithms",
  },
  "treasure-search": {
    title: "Treasure Search",
    instructions: "Explore the scene and get ready to search for the hidden treasure.",
    objective: "Linear search and binary search",
  },
};

const blockColors = ["#ef4444", "#3b82f6", "#22c55e", "#fbbf24", "#a78bfa", "#22d3ee", "#fb7185"];
const recallPattern = ["Green", "Blue", "Red"];
const patternColors: Record<string, string> = { Red: "#ef4444", Blue: "#3b82f6", Green: "#22c55e" };
const levelInstructions = [
  "Drag blocks from the side pile onto the target platform. Stack 5 blocks.",
  "Watch the colors, then rebuild them in reverse: Green → Blue → Red.",
  "Move with ← / → or buttons. Catch falling blocks; pop quickly when a bomb appears.",
  "Rescue the robot by popping from the top. Red blocks unlock when exposed.",
];

function StackTowerGame({ game }: { game: { title: string; instructions: string; objective: string } }) {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [blocks, setBlocks] = useState<StackBlock[]>([]);
  const [score, setScore] = useState(0);
  const [nextId, setNextId] = useState(1);
  const [feedback, setFeedback] = useState("Push a block to start building your stack.");
  const [feedbackType, setFeedbackType] = useState<"info" | "success" | "error">("info");
  const [exiting, setExiting] = useState<{ block: StackBlock; index: number } | null>(null);
  const [levelComplete, setLevelComplete] = useState(false);
  const [levelFailed, setLevelFailed] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(15);
  const [patternIndex, setPatternIndex] = useState(0);
  const [platformX, setPlatformX] = useState(0);
  const [fallingY, setFallingY] = useState(3.2);
  const [fallingX, setFallingX] = useState(0);
  const [bomb, setBomb] = useState(false);

  useEffect(() => {
    if (!exiting) return;
    const timeout = window.setTimeout(() => setExiting(null), 650);
    return () => window.clearTimeout(timeout);
  }, [exiting]);

  useEffect(() => {
    if (currentLevel !== 3 || levelComplete || levelFailed) return;
    const interval = window.setInterval(() => setRemainingSeconds((seconds) => {
      if (seconds <= 1) {
        window.clearInterval(interval);
        setLevelFailed(true);
        setFeedback("Time's Up! Retry the falling-block round.");
        setFeedbackType("error");
        return 0;
      }
      return seconds - 1;
    }), 1000);
    return () => window.clearInterval(interval);
  }, [currentLevel, levelComplete, levelFailed]);

  useEffect(() => {
    if (currentLevel !== 3 || levelComplete || levelFailed) return;
    const tick = window.setTimeout(() => {
      if (fallingY > -0.05) { setFallingY((y) => y - 0.22); return; }
      if (bomb) {
        setLevelFailed(true); setFeedback("Bomb hit! Retry the falling-block round."); setFeedbackType("error"); return;
      }
      if (Math.abs(fallingX - platformX) < 0.95) {
        const next = [...blocks, { id: nextId, value: nextId, color: blockColors[(nextId - 1) % blockColors.length] }];
        setBlocks(next); setNextId((id) => id + 1); setScore((value) => value + 10);
        if (next.length >= 5) completeLevel("Falling Blocks cleared! Great catch streak!");
      } else { setLevelFailed(true); setFeedback("Missed the block! Retry and move the platform under it."); setFeedbackType("error"); return; }
      setFallingY(3.2); setFallingX((Math.floor(Math.random() * 3) - 1) * 1.25); setBomb(Math.random() < 0.25);
    }, 90);
    return () => window.clearTimeout(tick);
  }, [currentLevel, levelComplete, levelFailed, fallingY, bomb, fallingX, platformX, blocks, nextId]);

  useEffect(() => {
    if (currentLevel !== 3) return;
    const move = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") setPlatformX((x) => Math.max(-1.5, x - 0.55));
      if (event.key === "ArrowRight") setPlatformX((x) => Math.min(1.5, x + 0.55));
    };
    window.addEventListener("keydown", move);
    return () => window.removeEventListener("keydown", move);
  }, [currentLevel]);

  const startLevel = (level: number) => {
    setCurrentLevel(level);
    setScore(0);
    setNextId(1);
    setExiting(null);
    setLevelComplete(false);
    setLevelFailed(false);
    setPatternIndex(0);
    setRemainingSeconds(15);
    setPlatformX(0); setFallingY(3.2); setFallingX(0); setBomb(false);
    const prefilled = level === 4 ? [0, 1, 2, 3, 4].map((index) => ({ id: index + 1, value: index + 1, color: index === 1 || index === 3 ? "#ef4444" : blockColors[index] })) : [];
    setBlocks(prefilled);
    setNextId(prefilled.length + 1);
    setFeedback(level === 4 ? "Rescue the robot. Pop blocks from the top; locked red blocks unlock when exposed." : level === 2 ? "Watch the sequence, then recreate it in reverse: Green → Blue → Red." : levelInstructions[level - 1]);
    setFeedbackType("info");
  };

  const completeLevel = (message: string) => {
    setLevelComplete(true);
    setFeedback(message);
    setFeedbackType("success");
  };

  const push = (selectedPatternColor?: string) => {
    if (levelComplete || levelFailed) return;
    const limit = currentLevel === 1 ? 5 : currentLevel === 2 ? 3 : 0;
    if (blocks.length >= limit) {
      setFeedback(currentLevel === 1 ? "Exactly 5 blocks completes this level." : currentLevel === 4 ? "You have reached the 7-block goal." : "Tower full! Pop a block before adding another.");
      setFeedbackType("error");
      return;
    }
    if (currentLevel === 3 || currentLevel === 4) {
      return;
    }
    const patternName = currentLevel === 2 ? selectedPatternColor : undefined;
    const block = { id: nextId, value: nextId, color: patternName ? patternColors[patternName] : blockColors[(nextId - 1) % blockColors.length] };
    if (currentLevel === 2 && patternName) {
      const expected = recallPattern[patternIndex];
      if (patternName !== expected) {
        setBlocks([]);
        setNextId(1);
        setPatternIndex(0);
        setLevelFailed(true);
        setFeedback(`Try Again! Expected ${expected}. The Level 2 stack has been reset.`);
        setFeedbackType("error");
        return;
      }
      setPatternIndex((value) => value + 1);
    }
    setBlocks((current) => [...current, block]);
    setNextId((current) => current + 1);
    setScore((current) => current + 10);
    setFeedback(patternName ? `Pushed ${patternName}. ${patternIndex < 2 ? `Next: ${recallPattern[patternIndex + 1]}.` : "Pattern complete!"}` : `Pushed block ${block.value}. It is now the top of the stack.`);
    setFeedbackType("success");
    setExiting(null);
    if (currentLevel === 1 && blocks.length + 1 === 5) completeLevel("Level 1 complete! You stacked 5 blocks.");
    if (currentLevel === 2 && patternIndex === 2) completeLevel("Reverse Recall complete! You rebuilt the sequence backwards.");
  };

  const pop = () => {
    if (levelComplete || levelFailed) return;
    if (currentLevel === 3 && bomb) { setBomb(false); setFallingY(3.2); setFeedback("Bomb defused! Keep catching blocks."); setFeedbackType("success"); return; }
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
    if (currentLevel === 4 && blocks.length === 1) completeLevel("Rescue complete! You freed the robot!");
  };

  const reset = () => {
    startLevel(currentLevel);
  };

  const retry = () => startLevel(currentLevel);

  const buttonClass = "flex min-h-12 flex-1 items-center justify-center gap-2 rounded-2xl px-4 text-sm font-black transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80";

  return (
    <GameShell
      title={game.title}
      instructions={levelInstructions[currentLevel - 1]}
      objective={game.objective}
      score={score}
      onReset={reset}
      levelLabel={`Level ${currentLevel}/4`}
      timerLabel={currentLevel === 3 ? `${remainingSeconds}s` : "Ready"}
      levelComplete={levelComplete}
      completionTitle={`Level ${currentLevel} Complete!`}
      onNextLevel={currentLevel < 4 ? () => startLevel(currentLevel + 1) : undefined}
      nextLevelLabel="Next Level →"
      scene={<StackTowerScene blocks={blocks} exiting={exiting} mode={currentLevel as 1 | 2 | 3 | 4} onDragPlace={() => push()} platformX={platformX} fallingX={fallingX} fallingY={fallingY} bomb={bomb} rescue={currentLevel === 4} />}
      controls={(
        <div className="rounded-[26px] border border-cyan-200/20 bg-slate-950/70 p-4 shadow-xl backdrop-blur-xl">
          <div className="mb-3 flex items-center justify-between text-xs font-bold text-slate-300">
            <span className="flex items-center gap-2"><Layers3 className="h-4 w-4 text-cyan-200" /> Stack size</span>
            <span className="rounded-full bg-cyan-300/10 px-3 py-1 text-cyan-100">{currentLevel === 4 ? `${blocks.length} / 7` : currentLevel === 1 ? `${blocks.length} / 5` : currentLevel === 2 ? `${patternIndex} / 3 colors` : `${blocks.length} / 3`}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {currentLevel === 2 ? recallPattern.map((color) => <button key={color} type="button" onClick={() => push(color)} disabled={levelComplete || levelFailed} className={`${buttonClass} min-w-[72px] px-2 text-slate-950 disabled:opacity-40`} style={{ backgroundColor: patternColors[color] }}><ArrowDownToLine className="h-4 w-4" />{color}</button>) : currentLevel === 1 ? <span className="text-xs font-bold text-cyan-100">Drag the side block onto the tower · {blocks.length}/5</span> : currentLevel === 3 ? <div className="flex w-full justify-between gap-2"><button type="button" onClick={() => setPlatformX((x) => Math.max(-1.5, x - 0.55))} className={buttonClass}>← Move</button><button type="button" onClick={pop} className={`${buttonClass} border border-rose-300/30 bg-rose-500/10 text-rose-100`}>Pop Bomb</button><button type="button" onClick={() => setPlatformX((x) => Math.min(1.5, x + 0.55))} className={buttonClass}>Move →</button></div> : <button type="button" onClick={() => push()} disabled className={`${buttonClass} bg-slate-800 text-slate-500`}>
              <ArrowDownToLine className="h-4 w-4" /> Push
            </button>}
            <button type="button" onClick={pop} disabled={levelComplete || levelFailed || currentLevel === 1 || currentLevel === 2} className={`${buttonClass} border border-violet-200/25 bg-violet-400/10 text-violet-100 hover:bg-violet-400/20 disabled:opacity-40`}>
              <ArrowUpFromLine className="h-4 w-4" /> Pop
            </button>
          </div>
          {currentLevel === 2 && <p className="mt-3 text-xs font-bold text-amber-100">Flash order: <span className="text-red-300">Red</span> → <span className="text-blue-300">Blue</span> → <span className="text-green-300">Green</span><br/>Recall in reverse.</p>}
          {levelFailed && <button type="button" onClick={retry} className="mt-3 w-full rounded-xl border border-rose-300/40 bg-rose-400/10 py-2 text-xs font-black text-rose-100 transition hover:bg-rose-400/20">Retry Level {currentLevel}</button>}
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

const listModeInstructions = [
  "Balls & Strings: select the next pair of numbered balls and connect them with a glowing string from Head to Tail.",
  "Train & Bogies: the orange engine is the Head. Attach each coach in order by selecting the next bogie in the line.",
  "Metal Chain: break the middle chain link, then place the floating golden link into the gap to reconnect the list.",
  "Glowing Snake: the tail is leading. Reverse each green pointer until the snake's Head leads the path.",
];
const treeNodes: TreeNode[] = [
  { id: 1, value: 8, x: 0, y: 1.55 },
  { id: 2, value: 4, x: -1.75, y: 0.45 }, { id: 3, value: 12, x: 1.75, y: 0.45 },
  { id: 4, value: 2, x: -2.65, y: -0.65 }, { id: 5, value: 6, x: -0.9, y: -0.65 },
  { id: 6, value: 10, x: 0.9, y: -0.65 }, { id: 7, value: 14, x: 2.65, y: -0.65 },
];
const treeEdges: TreeEdge[] = [{ from: 1, to: 2 }, { from: 1, to: 3 }, { from: 2, to: 4 }, { from: 2, to: 5 }, { from: 3, to: 6 }, { from: 3, to: 7 }];
const treeInstructions = [
  "Find the Root: select the top-most node in the binary tree.",
  "Inorder: visit Left subtree → Root → Right subtree.",
  "Preorder: visit Root → Left subtree → Right subtree.",
  "Postorder: visit Left subtree → Right subtree → Root.",
];
const traversalOrders = [[4, 2, 5, 1, 6, 3, 7], [1, 2, 4, 5, 3, 6, 7], [4, 5, 2, 6, 7, 3, 1]];

function TreeTraversalGame({ game }: { game: { title: string; instructions: string; objective: string } }) {
  const [mode, setMode] = useState(1);
  const [selected, setSelected] = useState<number | null>(null);
  const [step, setStep] = useState(0);
  const [visitedNodes, setVisitedNodes] = useState<number[]>([]);
  const [complete, setComplete] = useState(false);
  const [message, setMessage] = useState("Select the top node to identify the root.");
  const order = mode === 1 ? [1] : traversalOrders[mode - 2];

  const startMode = (nextMode: number) => {
    setMode(nextMode); setSelected(null); setStep(0); setVisitedNodes([]); setComplete(false);
    setMessage(nextMode === 1 ? "Select the top node to identify the root." : `Follow the ${nextMode === 2 ? "inorder" : nextMode === 3 ? "preorder" : "postorder"} sequence. Select the next node.`);
  };
  const selectNode = (id: number) => {
    if (complete) return;
    if (id !== order[step]) { setMessage(`Not quite. Select ${treeNodes.find((node) => node.id === order[step])?.value} next.`); return; }
    setSelected(id);
    setVisitedNodes((visited) => [...visited, id]);
    if (step + 1 === order.length) { setComplete(true); setMessage(mode === 1 ? "Correct! Node 8 is the root." : "Traversal complete! You followed the correct order."); }
    else { setStep((value) => value + 1); setMessage(`Correct. Next: value ${treeNodes.find((node) => node.id === order[step + 1])?.value}.`); }
  };

  return <GameShell title={game.title} instructions={treeInstructions[mode - 1]} objective={game.objective} score={step * 10 + (complete ? 50 : 0)} levelLabel={`Mode ${mode}/4`} levelComplete={complete} completionTitle={`Mode ${mode} Complete!`} onNextLevel={mode < 4 ? () => startMode(mode + 1) : undefined} onReset={() => startMode(mode)} scene={<TreeTraversalScene nodes={treeNodes} edges={treeEdges} selectedId={selected} rootId={1} mode={mode} onSelect={selectNode} />}
    controls={<div className="space-y-3 rounded-[26px] border border-cyan-200/20 bg-slate-950/70 p-4 shadow-xl backdrop-blur-xl">
      <div className="flex flex-wrap items-center justify-between gap-2"><p className="text-xs font-black uppercase tracking-wider text-cyan-100">{mode === 1 ? "Find the root" : `${mode === 2 ? "Inorder" : mode === 3 ? "Preorder" : "Postorder"} traversal`}</p><span className="text-xs font-bold text-slate-300">{mode === 1 ? "Choose the top node" : `${step}/${order.length} visited`}</span></div>
      {mode > 1 && <div className="space-y-2 rounded-xl border border-violet-200/15 bg-violet-400/10 p-3"><p className="text-[10px] font-black uppercase tracking-wider text-violet-200">Required sequence</p><div className="flex flex-wrap gap-1.5">{order.map((nodeId, index) => { const node = treeNodes.find((item) => item.id === nodeId)!; const visited = visitedNodes.includes(nodeId); return <span key={nodeId} className={`inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-black ${visited ? "bg-emerald-300/20 text-emerald-100" : index === step ? "bg-amber-300 text-slate-950 ring-2 ring-amber-100/40" : "bg-slate-900/80 text-slate-400"}`}>{visited && <span aria-label="Correct" title="Correct">✓</span>}{node.value}</span>; })}</div><p className="text-xs font-bold text-amber-100">{complete ? "All nodes visited ✓" : `Select next: ${treeNodes.find((node) => node.id === order[step])?.value}`}</p></div>}
      <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">{treeNodes.map((node) => { const visited = visitedNodes.includes(node.id); return <button type="button" key={node.id} onClick={() => selectNode(node.id)} disabled={complete} aria-label={`Select tree node value ${node.value}${visited ? ", correctly visited" : ""}`} className={`relative min-h-10 rounded-xl text-sm font-black transition ${visited ? "bg-emerald-300 text-slate-950" : selected === node.id ? "border border-amber-200 bg-amber-300/20 text-amber-100" : "border border-cyan-200/20 bg-cyan-400/10 text-cyan-100 hover:bg-cyan-400/20"} disabled:opacity-70`}>{node.value}{visited && <span className="ml-1" aria-hidden="true">✓</span>}</button>; })}</div>
      <p aria-live="polite" className="text-xs font-bold text-slate-200">{message}</p>
      <div className="grid grid-cols-4 gap-1">{[1,2,3,4].map((item) => <button key={item} type="button" onClick={() => startMode(item)} className={`rounded-lg px-2 py-2 text-[10px] font-black ${mode === item ? "bg-violet-400/30 text-white" : "bg-white/5 text-slate-400"}`}>Mode {item}</button>)}</div>
    </div>}
  />;
}

const baseNodes: ListNode[] = [1, 2, 3, 4].map((id) => ({ id, value: id * 10 }));
const baseLinks: ListLink[] = [{ from: 1, to: 2 }, { from: 2, to: 3 }, { from: 3, to: 4 }];

function LinkedListGame({ game }: { game: { title: string; instructions: string; objective: string } }) {
  const [mode, setMode] = useState(1);
  const [nodes, setNodes] = useState(baseNodes);
  const [links, setLinks] = useState<ListLink[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [step, setStep] = useState(1);
  const [brokenLink, setBrokenLink] = useState<number | null>(null);
  const [brokenEdge, setBrokenEdge] = useState<ListLink | null>(null);
  const [complete, setComplete] = useState(false);
  const [message, setMessage] = useState("Select Node 1, then Node 2 to connect them.");

  const startMode = (nextMode: number) => {
    setMode(nextMode); setSelected(null); setStep(1); setBrokenLink(null); setBrokenEdge(null); setComplete(false);
    setNodes(nextMode === 3 ? [...baseNodes, { id: 5, value: 25 }] : baseNodes);
    setLinks(nextMode === 1 || nextMode === 2 ? [] : baseLinks);
    setMessage(listModeInstructions[nextMode - 1]);
  };

  const clickNode = (id: number) => {
    if (complete) return;
    if (mode === 2) {
      if (id !== step) { setMessage(`Not next in the list. Follow the pointer to Node ${step}.`); return; }
      if (step === 1) { setMessage("First bogie attached to the engine. Select Coach 2 next."); setStep(2); return; }
      setLinks((current) => [...current, { from: id - 1, to: id }]);
      if (step === 4) { setComplete(true); setMessage("All bogies attached! You traversed the train from engine to tail."); return; }
      setStep((value) => value + 1); setMessage(`Coach ${id} attached. Select the next bogie.`); return;
    }
    if (mode === 3) {
      if (brokenLink === null) { setMessage("Break one metal link first to open a gap for the golden link."); return; }
      if (id !== 5) return;
      const previous = brokenEdge;
      if (!previous) return;
      const updated = [...links]; updated.splice(brokenLink, 1, { from: previous.from, to: 5 }, { from: 5, to: previous.to });
      setLinks(updated); setNodes([baseNodes[0], baseNodes[1], nodes[4], baseNodes[2], baseNodes[3]]);
      setComplete(true); setMessage("Golden link installed! The metal chain is connected again."); return;
    }
    if (mode === 1) {
      if (selected === null) { setSelected(id); setMessage(`String anchored at Ball ${id}. Connect the next ball.`); return; }
      if (id !== selected + 1) { setMessage("Follow the numbered order and connect to the next ball."); return; }
      const next = links.some((link) => link.from === selected && link.to === id) ? links : [...links, { from: selected, to: id }]; setLinks(next); setSelected(null);
      if (next.length === 3) { setComplete(true); setMessage("String path complete! All four balls are connected from Head to Tail."); }
      else setMessage(`Glowing string connected Ball ${selected} → Ball ${id}. Continue the chain.`);
    }
  };

  const clickLink = (index: number) => {
    if (complete) return;
    if (mode === 3) {
      setBrokenLink(index); setBrokenEdge(links[index]); setLinks((items) => items.filter((_, itemIndex) => itemIndex !== index)); setMessage("Chain link broken. Place the golden link into the open gap."); return;
    }
    if (mode === 4) {
      setLinks((items) => items.map((link, itemIndex) => itemIndex === index ? { from: link.to, to: link.from } : link));
      if (links.filter((link, itemIndex) => itemIndex !== index).every((link) => link.from > link.to) && links[index].from < links[index].to) {
        setComplete(true); setMessage("List reversed! Pointers now run from tail to head.");
      } else setMessage("Snake segment reversed. Turn each remaining pointer toward the Head.");
    }
  };

  const controlTheme = ["border-cyan-200/20 bg-slate-950/70", "border-orange-300/25 bg-orange-950/25", "border-slate-300/25 bg-slate-900/85", "border-emerald-300/25 bg-emerald-950/25"][mode - 1];
  return <GameShell title={game.title} instructions={listModeInstructions[mode - 1]} objective={game.objective} score={complete ? 100 : links.length * 10} levelLabel={`Mode ${mode}/4`} levelComplete={complete} completionTitle={`Mode ${mode} Complete!`} onNextLevel={mode < 4 ? () => startMode(mode + 1) : undefined} onReset={() => startMode(mode)} scene={<LinkedListScene nodes={nodes} links={links} selectedId={selected} mode={mode} trainAttached={mode === 2 && step > 1} onNodeClick={clickNode} onLinkClick={clickLink} />}
    controls={<div className={`space-y-3 rounded-[26px] border p-4 shadow-xl backdrop-blur-xl ${controlTheme}`}><p className={`text-xs font-black ${mode === 2 ? "text-orange-100" : mode === 3 ? "text-slate-100" : mode === 4 ? "text-emerald-100" : "text-cyan-100"}`}>{mode === 2 ? "ENGINE → " : mode === 4 ? "TAIL → " : "HEAD → "}{nodes.map((node) => node.value).join(" → ")}{mode === 4 ? " → HEAD" : " → NULL"}</p>
      {mode === 2 && <p className="text-xs text-orange-100">Bogie progress: {Math.max(0, step - 1)}/{nodes.length} attached</p>}
      {mode === 3 && <p className="text-xs text-amber-100">Golden link: {brokenLink === null ? "Break a chain link to open a gap" : "Gap ready · insert the golden link"}</p>}
      {mode === 4 && <p className="text-xs text-emerald-100">Reverse all three pointers so the Head leads the snake.</p>}
      {mode === 1 && <div className="space-y-2"><p className="text-xs font-semibold text-slate-300">{selected === null ? "Choose a ball to anchor the string." : `String anchored at Ball ${selected}. Connect Ball ${selected + 1} next.`}</p><div className="grid grid-cols-3 gap-1">{[1,2,3].map((id) => <button key={id} type="button" onClick={() => setSelected(id)} className={`rounded-lg px-2 py-2 text-[10px] font-bold ${selected === id ? "bg-cyan-300 text-slate-950" : "bg-cyan-400/10 text-cyan-100"}`}>Ball {id}</button>)}</div>{selected !== null && <button type="button" onClick={() => clickNode(selected + 1)} className="w-full rounded-lg bg-gradient-to-r from-cyan-400 to-blue-500 px-3 py-2 text-xs font-black text-slate-950">Connect String · {selected} → {selected + 1}</button>}</div>}
      {mode === 2 && <div className="grid grid-cols-2 gap-1">{[1,2,3,4].map((id) => <button key={id} type="button" onClick={() => clickNode(id)} className="rounded-lg bg-orange-400/10 px-2 py-2 text-[10px] font-bold text-orange-100">Attach Bogie {id}</button>)}</div>}
      {mode === 3 && <div className="grid grid-cols-2 gap-1"><button type="button" onClick={() => clickLink(Math.max(0, Math.floor(links.length / 2)))} disabled={brokenLink !== null} className="rounded-lg bg-rose-400/10 px-2 py-2 text-[10px] font-bold text-rose-100 disabled:opacity-40">Break Link</button><button type="button" onClick={() => clickNode(5)} disabled={brokenLink === null} className="rounded-lg bg-amber-400/10 px-2 py-2 text-[10px] font-bold text-amber-100 disabled:opacity-40">Insert Golden Link</button></div>}
      {mode === 4 && <div className="grid grid-cols-1 gap-1 sm:grid-cols-3">{links.map((link, index) => <button key={index} type="button" onClick={() => clickLink(index)} disabled={link.from > link.to} className="rounded-lg bg-emerald-400/10 px-2 py-2 text-[10px] font-bold text-emerald-100 disabled:opacity-40">Reverse Snake · {link.from} → {link.to}</button>)}</div>}
      <p aria-live="polite" className="text-xs font-bold text-slate-200">{message}</p>
      <div className="grid grid-cols-4 gap-1">{[1,2,3,4].map((item) => <button key={item} type="button" onClick={() => startMode(item)} className={`rounded-lg px-2 py-2 text-[10px] font-black ${mode === item ? "bg-violet-400/30 text-white" : "bg-white/5 text-slate-400"}`}>Mode {item}</button>)}</div>
    </div>}
  />;
}

const queueColors = ["#22d3ee", "#a78bfa", "#fb7185", "#34d399", "#fbbf24", "#60a5fa"];
const queueInstructions = [
  "Lineup: drag customers from the visitor portal into the queue. Add 5 customers.",
  "Serve Next removes the customer at the front. Watch everyone move forward. Clear the line.",
  "Drag the VIP into the highlighted FRONT position. The VIP joins before everyone else.",
  "Rush Hour: serve as many customers as you can in 15 seconds. FIFO means the front leaves first.",
];
function QueueCounterGame({ game }: { game: { title: string; instructions: string; objective: string } }) {
  const [mode, setMode] = useState(1);
  const [customers, setCustomers] = useState<QueueCustomer[]>([]);
  const [nextId, setNextId] = useState(1);
  const [served, setServed] = useState(0);
  const [seconds, setSeconds] = useState(15);
  const [complete, setComplete] = useState(false);
  const [message, setMessage] = useState("Drag a customer into the queue to begin.");
  const [feedbackError, setFeedbackError] = useState(false);

  const startMode = (nextMode: number) => {
    const count = nextMode === 2 ? 4 : nextMode === 3 ? 3 : nextMode === 4 ? 5 : 0;
    setMode(nextMode); setNextId(count + 1); setServed(0); setSeconds(15); setComplete(false); setFeedbackError(false);
    setCustomers(Array.from({ length: count }, (_, index) => ({ id: index + 1, color: queueColors[index % queueColors.length] })));
    setMessage(nextMode === 3 ? "A VIP is waiting. Drop them at the highlighted front spot." : nextMode === 2 ? "Serve the first customer in line." : queueInstructions[nextMode - 1]);
  };

  useEffect(() => {
    if (mode !== 4 || complete) return;
    const timer = window.setInterval(() => setSeconds((value) => {
      if (value <= 1) { window.clearInterval(timer); setComplete(true); setMessage(`Rush Hour over! You served ${served} customers.`); return 0; }
      return value - 1;
    }), 1000);
    return () => window.clearInterval(timer);
  }, [mode, complete, served]);

  const addCustomer = () => {
    if (complete || mode !== 1) return;
    if (customers.length >= 5) return;
    setCustomers((items) => [...items, { id: nextId, color: queueColors[(nextId - 1) % queueColors.length] }]);
    setNextId((id) => id + 1);
    if (customers.length + 1 === 5) { setComplete(true); setMessage("Lineup complete! Five customers joined the queue."); }
  };
  const insertVip = () => {
    if (mode !== 3 || complete) return;
    setCustomers((items) => [{ id: nextId, color: "#fbbf24", vip: true }, ...items]);
    setNextId((id) => id + 1); setComplete(true); setMessage("VIP inserted at the front of the line!");
  };
  const serveNext = () => {
    if (!customers.length || complete) return;
    const customer = customers[0];
    setCustomers((items) => mode === 4 ? [...items.slice(1), { id: nextId, color: queueColors[(nextId - 1) % queueColors.length] }] : items.slice(1));
    if (mode === 4) setNextId((id) => id + 1);
    setServed((value) => value + 1);
    setMessage(`${customer.vip ? "VIP" : "Customer"} served from the front. The queue moved forward.`);
    if (mode === 2 && customers.length === 1) { setComplete(true); setMessage("Mode complete! Every customer was served FIFO."); }
  };
  const modeTitle = mode === 4 ? "Rush Hour Complete!" : `Mode ${mode} Complete!`;

  return <GameShell title={game.title} instructions={queueInstructions[mode - 1]} objective={game.objective} score={served * 10} levelLabel={`Mode ${mode}/4`} timerLabel={mode === 4 ? `${seconds}s` : "Ready"} levelComplete={complete} completionTitle={modeTitle} onNextLevel={mode < 4 ? () => startMode(mode + 1) : undefined} onReset={() => startMode(mode)} scene={<QueueCounterScene customers={customers} mode={mode} onDropAtBack={addCustomer} onDropAtFront={insertVip} />}
    controls={<div className="space-y-3 rounded-[26px] border border-cyan-200/20 bg-slate-950/70 p-4 shadow-xl backdrop-blur-xl">
      <div className="flex items-center justify-between text-xs font-black text-cyan-100"><span>Queue length · {customers.length}</span><span>Served · {served}</span></div>
      {mode === 2 && <button type="button" onClick={serveNext} disabled={!customers.length || complete} className="w-full rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 py-3 text-sm font-black text-slate-950 disabled:opacity-40">Serve Next →</button>}
      {mode === 4 && <button type="button" onClick={serveNext} disabled={!customers.length || complete} className="w-full rounded-xl bg-gradient-to-r from-amber-300 to-orange-400 py-3 text-sm font-black text-slate-950 disabled:opacity-40">Serve Front Customer</button>}
      <p aria-live="polite" className={`text-xs font-bold ${feedbackError ? "text-rose-200" : "text-slate-200"}`}>{message}</p>
      <div className="grid grid-cols-4 gap-1">{[1,2,3,4].map((item) => <button key={item} type="button" onClick={() => startMode(item)} className={`rounded-lg px-2 py-2 text-[10px] font-black ${mode === item ? "bg-violet-400/30 text-white" : "bg-white/5 text-slate-400"}`}>Mode {item}</button>)}</div>
    </div>}
  />;
}

const sortInstructions = [
  "Library Books: click two neighboring books to swap them. Arrange the shelf from shortest to tallest.",
  "Magic Potions: press Next Step to compare the highlighted pair. The potions swap automatically when they are out of order.",
  "Space Rockets: swap adjacent rockets until their fuel levels are ordered from highest to lowest.",
  "Diamond Heist: sort five diamonds by weight, lightest to heaviest, before the 20-second vault alarm.",
];
const makeTiles = (values: number[]): NumberTile[] => values.map((value, id) => ({ id: id + 1, value }));
const ascending = (tiles: NumberTile[]) => tiles.every((tile, index) => index === 0 || tiles[index - 1].value <= tile.value);
const descending = (tiles: NumberTile[]) => tiles.every((tile, index) => index === 0 || tiles[index - 1].value >= tile.value);

function NumberSortingGame({ game }: { game: { title: string; instructions: string; objective: string } }) {
  const [mode, setMode] = useState(1);
  const [tiles, setTiles] = useState<NumberTile[]>(makeTiles([3, 1, 4, 2]));
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [complete, setComplete] = useState(false);
  const [failed, setFailed] = useState(false);
  const [seconds, setSeconds] = useState(20);
  const [bubbleI, setBubbleI] = useState(0);
  const [bubbleJ, setBubbleJ] = useState(0);
  const [message, setMessage] = useState("Choose adjacent blocks to begin sorting.");

  useEffect(() => {
    if (mode !== 4 || complete || failed) return;
    const timer = window.setInterval(() => setSeconds((value) => {
      if (value <= 1) { window.clearInterval(timer); setFailed(true); setMessage("Time's up! Reset this mode and try again."); return 0; }
      return value - 1;
    }), 1000);
    return () => window.clearInterval(timer);
  }, [mode, complete, failed]);

  const startMode = (nextMode: number) => {
    setMode(nextMode); setSelected(null); setComplete(false); setFailed(false); setScore(0); setSeconds(20); setBubbleI(0); setBubbleJ(0);
    const values = nextMode === 1 ? [3, 1, 4, 2] : nextMode === 2 ? [4, 1, 3, 2] : nextMode === 3 ? [32, 85, 18, 64, 47] : [44, 18, 72, 31, 56];
    setTiles(makeTiles(values)); setMessage(nextMode === 2 ? "Bubble Sort ready. Compare the first two blocks." : sortInstructions[nextMode - 1]);
  };

  const selectTile = (id: number) => {
    if (complete || failed || mode === 2) return;
    if (selected === null) { setSelected(id); return; }
    const first = tiles.findIndex((tile) => tile.id === selected);
    const second = tiles.findIndex((tile) => tile.id === id);
    if (Math.abs(first - second) !== 1) { setSelected(id); setMessage("Only adjacent blocks can be swapped."); return; }
    const next = [...tiles]; [next[first], next[second]] = [next[second], next[first]];
    setTiles(next); setSelected(null); setScore((value) => value + 10);
    const sorted = mode === 3 ? descending(next) : ascending(next);
    if (sorted) { setComplete(true); setMessage(mode === 4 ? "Speed Sort complete! You beat the clock." : `Mode ${mode} complete! The numbers are in order.`); }
  };

  const nextBubbleStep = () => {
    if (complete || failed) return;
    const left = bubbleJ;
    const right = left + 1;
    const next = [...tiles];
    if (next[left].value > next[right].value) [next[left], next[right]] = [next[right], next[left]];
    setTiles(next); setScore((value) => value + 5);
    if (ascending(next)) { setComplete(true); setMessage("Bubble Sort complete! The array is sorted."); return; }
    const nextJ = bubbleJ + 1;
    if (nextJ >= next.length - 1 - bubbleI) { setBubbleJ(0); setBubbleI((value) => value + 1); }
    else setBubbleJ(nextJ);
    setMessage(`Comparing ${next[left].value} and ${next[right].value}${next[left].value <= next[right].value ? " — already in order." : " — swapped."}`);
  };

  const modeNames = ["Library Books", "Magic Potions", "Space Rockets", "Diamond Heist"];
  const themeClasses = ["border-amber-300/25 bg-amber-950/25", "border-violet-300/25 bg-violet-950/25", "border-sky-300/25 bg-slate-950/75", "border-cyan-300/25 bg-slate-950/75"][mode - 1];
  const actionCopy = ["Select two adjacent books on the shelf.", "Compare each glowing pair and watch Bubble Sort work.", "Click two neighboring rockets to swap their fuel positions.", "Click two neighboring diamonds to swap their weights."][mode - 1];

  return <GameShell title={game.title} instructions={sortInstructions[mode - 1]} objective={game.objective} score={score} levelLabel={`${modeNames[mode - 1]} · ${mode}/4`} timerLabel={mode === 4 ? `${seconds}s` : "Ready"} levelComplete={complete} completionTitle={mode === 4 ? "Diamond Heist Complete!" : `${modeNames[mode - 1]} Complete!`} onNextLevel={mode < 4 ? () => startMode(mode + 1) : undefined} onReset={() => startMode(mode)} scene={<NumberSortingScene tiles={tiles} mode={mode} selectedId={selected} compareIndices={mode === 2 ? [bubbleJ, bubbleJ + 1] : []} onSelect={selectTile} />}
    controls={<div className={`space-y-3 rounded-[26px] border p-4 shadow-xl backdrop-blur-xl ${themeClasses}`}>
      <div className="flex items-center justify-between gap-2 text-xs font-black uppercase tracking-wider text-cyan-100"><span>{mode === 2 ? `Pass ${bubbleI + 1} · Pair ${bubbleJ + 1}/${tiles.length - 1 - bubbleI}` : mode === 3 ? "Target · Highest fuel first" : mode === 4 ? "Target · Lightest first" : "Target · Shortest to tallest"}</span><span className="text-right">{tiles.map((tile) => tile.value).join(" · ")}{mode === 3 ? "%" : mode === 4 ? " kg" : ""}</span></div>
      {mode === 2 ? <><p className="text-xs text-violet-100">Compare {tiles[bubbleJ]?.value} with {tiles[bubbleJ + 1]?.value}. {tiles[bubbleJ]?.value > tiles[bubbleJ + 1]?.value ? "They will swap." : "They are already in order."}</p><button type="button" onClick={nextBubbleStep} disabled={complete || failed} className="w-full rounded-xl bg-gradient-to-r from-violet-400 to-fuchsia-400 py-3 text-sm font-black text-slate-950 disabled:opacity-40">Next Step · Bubble Pair →</button></> : <p className="text-xs text-slate-300">{actionCopy}</p>}
      {failed && <button type="button" onClick={() => startMode(mode)} className="w-full rounded-xl border border-rose-300/40 bg-rose-400/10 py-2 text-xs font-black text-rose-100">Retry Mode {mode}</button>}
      <div className="grid grid-cols-2 gap-1">{[1, 2, 3, 4].map((item) => <button type="button" key={item} onClick={() => startMode(item)} className={`rounded-lg px-2 py-2 text-[10px] font-black ${mode === item ? "bg-violet-400/30 text-white" : "bg-white/5 text-slate-400"}`}>{modeNames[item - 1]}</button>)}</div>
      <p aria-live="polite" className="text-xs font-bold text-cyan-100">{message}</p>
    </div>}
  />;
}

const initialLogicState: LogicState = { x: 0, z: 0, direction: 0 };
const commandNames: Record<LogicCommand, string> = { forward: "Move Forward", left: "Turn Left", right: "Turn Right" };
const logicGoals = [{ x: 1, z: 0 }, { x: 2, z: 0 }, { x: 2, z: 1 }, { x: 2, z: 2 }];

function LogicBuilderGame({ game }: { game: { title: string; instructions: string; objective: string } }) {
  const [commands, setCommands] = useState<LogicCommand[]>([]);
  const [robot, setRobot] = useState(initialLogicState);
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState("Build a command sequence, then run it.");
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<"info" | "success" | "error">("info");
  const [goalIndex, setGoalIndex] = useState(0);

  const runCode = async () => {
    if (running || commands.length === 0) return;
    setRunning(true);
    setRobot(initialLogicState);
    setResult("info");
    setStatus("Running your program…");
    let current = { ...initialLogicState };
    for (const command of commands) {
      await new Promise((resolve) => window.setTimeout(resolve, 650));
      if (command === "left") current = { ...current, direction: (current.direction + 3) % 4 };
      if (command === "right") current = { ...current, direction: (current.direction + 1) % 4 };
      if (command === "forward") {
        const vectors = [[1, 0], [0, 1], [-1, 0], [0, -1]];
        current = { ...current, x: current.x + vectors[current.direction][0], z: current.z + vectors[current.direction][1] };
        if (!logicPath.has(`${current.x},${current.z}`)) {
          setRobot(current);
          setStatus("Try Again! The robot left the pathway.");
          setResult("error");
          setRunning(false);
          return;
        }
      }
      setRobot({ ...current });
    }
    const activeGoal = logicGoals[goalIndex];
    const reachedGoal = current.x === activeGoal.x && current.z === activeGoal.z;
    setStatus(reachedGoal ? `Goal ${goalIndex + 1} complete! Preparing the next target…` : "Try Again! Your sequence ended before the gem.");
    setResult(reachedGoal ? "success" : "error");
    if (reachedGoal) {
      setScore((value) => value + 100);
      if (goalIndex < logicGoals.length - 1) {
        await new Promise((resolve) => window.setTimeout(resolve, 1200));
        setGoalIndex((value) => value + 1);
        setCommands([]);
        setRobot(initialLogicState);
        setStatus("New goal set! Build a fresh sequence.");
        setResult("info");
      } else {
        setStatus("All goals complete! Reset to play the course again.");
      }
    }
    setRunning(false);
  };

  const reset = () => {
    setCommands([]);
    setRobot(initialLogicState);
    setScore(0);
    setStatus("Build a command sequence, then run it.");
    setResult("info");
    setRunning(false);
    setGoalIndex(0);
  };
  const add = (command: LogicCommand) => setCommands((items) => items.length < 8 ? [...items, command] : items);
  const smallButton = "rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2 text-[11px] font-extrabold text-slate-100 transition hover:border-cyan-200/40 hover:bg-cyan-400/10 disabled:opacity-40";

  return <GameShell title={game.title} instructions={game.instructions} objective={`${game.objective} · Goal ${goalIndex + 1} of ${logicGoals.length}`} score={score} onReset={reset} scene={<LogicBuilderScene state={robot} goal={logicGoals[goalIndex]} />}
    controls={<div className="rounded-[26px] border border-cyan-200/20 bg-slate-950/70 p-4 shadow-xl backdrop-blur-xl">
      <div className="mb-3 flex items-center justify-between"><h2 className="text-xs font-black uppercase tracking-wider text-cyan-100">Program · {commands.length}/8</h2><button type="button" onClick={() => setCommands([])} disabled={!commands.length || running} className="text-[10px] font-bold text-slate-400 hover:text-white">Clear</button></div>
      <div className="grid grid-cols-3 gap-2">
        <button className={smallButton} type="button" onClick={() => add("forward")} disabled={running}>↑ Forward</button>
        <button className={smallButton} type="button" onClick={() => add("left")} disabled={running}>↶ Left</button>
        <button className={smallButton} type="button" onClick={() => add("right")} disabled={running}>↷ Right</button>
      </div>
      <ol aria-label="Command queue" className="mt-3 flex min-h-11 flex-wrap gap-1.5 rounded-xl border border-white/10 bg-black/20 p-2">
        {commands.length ? commands.map((command, index) => <li key={`${index}-${command}`} className="rounded-lg bg-cyan-300/10 px-2 py-1 text-[10px] font-bold text-cyan-100">{index + 1}. {commandNames[command]}</li>) : <li className="self-center text-[10px] text-slate-500">Your commands will appear here</li>}
      </ol>
      <button type="button" onClick={runCode} disabled={running || commands.length === 0} className="mt-3 w-full rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 py-3 text-sm font-black text-slate-950 shadow-[0_0_18px_rgba(52,211,153,0.22)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40">{running ? "Running…" : "▶ Run Code"}</button>
    </div>}
    feedback={<p aria-live="polite" role="status" className={`rounded-2xl border px-4 py-3 text-sm font-bold ${result === "success" ? "border-emerald-300/40 bg-emerald-400/10 text-emerald-100" : result === "error" ? "border-rose-400/40 bg-rose-500/10 text-rose-200" : "border-white/10 bg-white/[0.04] text-slate-300"}`}>{status}</p>}
  />;
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
  if (params.slug === "logic-builder") return <LogicBuilderGame game={{ ...game, instructions: "Add commands to the queue and run your program. Guide the robot along the pathway to the glowing goal." }} />;
  if (params.slug === "number-sorting" || params.slug === "number-sorting-challenge") return <NumberSortingGame game={game} />;
  if (params.slug === "queue-counter" || params.slug === "queue-ticket-counter") return <QueueCounterGame game={game} />;
  if (params.slug === "linked-list" || params.slug === "linked-list-node-connection") return <LinkedListGame game={game} />;
  if (params.slug === "tree-traversal" || params.slug === "tree-traversal-challenge") return <TreeTraversalGame game={game} />;
  return <GameShell title={game.title} instructions={game.instructions} objective={game.objective} />;
}
