"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { Canvas } from "@react-three/fiber";
import { Html, OrbitControls } from "@react-three/drei";
import { motion } from "framer-motion";
import { ArrowLeft, RotateCcw, Sparkles, Timer, Trophy } from "lucide-react";

import TestScene from "@/games/scenes/TestScene";

export interface GameShellProps {
  title: string;
  instructions: string;
  objective: string;
}

function SceneLoader() {
  return (
    <Html center>
      <div className="whitespace-nowrap rounded-2xl border border-white/15 bg-slate-950/80 px-5 py-3 text-sm font-bold text-cyan-100 shadow-xl backdrop-blur-xl">
        Loading your 3D world…
      </div>
    </Html>
  );
}

export default function GameShell({ title, instructions, objective }: GameShellProps) {
  const [webglSupported, setWebglSupported] = useState<boolean | null>(null);
  const [resetKey, setResetKey] = useState(0);

  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
      setWebglSupported(Boolean(context));
      context?.getExtension("WEBGL_lose_context")?.loseContext();
    } catch {
      setWebglSupported(false);
    }
  }, []);

  return (
    <section className="mx-auto max-w-7xl space-y-5 pb-8">
      <motion.header initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <motion.div whileHover={{ x: -2 }} whileTap={{ scale: 0.94 }}>
          <Link
            href="/mini-games"
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/15 bg-white/[0.06] text-slate-200 transition hover:bg-white/[0.12]"
            aria-label="Back to mini-games"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          </motion.div>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-300">CodeQuest Arcade</p>
            <h1 className="mt-1 text-2xl font-black tracking-tight text-white sm:text-3xl">{title}</h1>
          </div>
        </div>
        <motion.button
          type="button"
          onClick={() => setResetKey((key) => key + 1)}
          whileHover={{ scale: 1.035, y: -1 }}
          whileTap={{ scale: 0.96 }}
          className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-rose-500 to-orange-500 px-5 py-3 text-sm font-extrabold text-white shadow-[0_0_20px_rgba(239,68,68,0.35)] hover:shadow-[0_0_30px_rgba(239,68,68,0.5)] transition-all"
        >
          <RotateCcw className="h-4 w-4" /> Reset scene
        </motion.button>
      </motion.header>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="relative min-h-[360px] overflow-hidden rounded-[28px] border border-cyan-100/15 bg-gradient-to-br from-indigo-950 via-[#10152f] to-slate-950 shadow-[0_24px_80px_rgba(0,0,0,0.35),0_0_34px_rgba(34,211,238,0.08)] sm:min-h-[500px]">
          <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(circle_at_50%_35%,rgba(34,211,238,0.12),transparent_42%)]" />
          <div className="pointer-events-none absolute inset-x-4 top-4 z-20 flex items-start justify-between gap-3 sm:inset-x-5 sm:top-5">
            <div className="rounded-2xl border border-amber-300/40 bg-slate-950/80 px-4 py-3 shadow-[0_0_30px_rgba(245,158,11,0.2)] backdrop-blur-xl">
              <p className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.18em] text-amber-200">
                <Trophy className="h-3 w-3" /> Score
                <span className="ml-1 w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </p>
              <p className="mt-0.5 text-3xl font-black leading-none text-white">0</p>
            </div>
            <div className="rounded-2xl border border-cyan-300/40 bg-slate-950/80 px-4 py-3 text-right shadow-[0_0_30px_rgba(34,211,238,0.2)] backdrop-blur-xl">
              <p className="flex items-center justify-end gap-1.5 text-[9px] font-black uppercase tracking-[0.18em] text-cyan-200">
                <Timer className="h-3 w-3" /> Timer
              </p>
              <motion.p animate={{ opacity: [1, 0.6, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="mt-0.5 text-xl font-black leading-none text-white">Ready</motion.p>
            </div>
          </div>
          {webglSupported === null ? (
            <div className="absolute inset-0 grid place-items-center text-sm font-bold text-cyan-100" role="status">
              Preparing the 3D scene…
            </div>
          ) : webglSupported ? (
            <Canvas
              key={resetKey}
              camera={{ position: [4, 3.2, 5], fov: 45 }}
              dpr={[1, 1.5]}
              gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
              className="!absolute inset-0"
            >
              <color attach="background" args={["#0b1028"]} />
              <ambientLight intensity={0.75} />
              <directionalLight position={[4, 7, 5]} intensity={1.6} castShadow />
              <Suspense fallback={<SceneLoader />}>
                <TestScene />
              </Suspense>
              <OrbitControls
                makeDefault
                enablePan={false}
                enableZoom={false}
                minPolarAngle={0.55}
                maxPolarAngle={1.35}
                minAzimuthAngle={-Math.PI / 3}
                maxAzimuthAngle={Math.PI / 3}
              />
            </Canvas>
          ) : (
            <div className="absolute inset-0 grid place-items-center p-6">
              <div className="max-w-sm rounded-3xl border border-white/15 bg-slate-950/75 p-7 text-center shadow-2xl backdrop-blur-xl">
                <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-cyan-400/15 text-cyan-200">
                  <Sparkles className="h-7 w-7" />
                </div>
                <h2 className="text-lg font-black text-white">2D preview mode</h2>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  This device cannot start the 3D scene. A lightweight game preview will be available here.
                </p>
                <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.05] p-4 text-left">
                  <p className="text-xs font-black uppercase tracking-wider text-cyan-200">Objective</p>
                  <p className="mt-1 text-sm text-slate-200">{objective}</p>
                </div>
              </div>
            </div>
          )}
          <div className="pointer-events-none absolute bottom-4 left-4 z-10 max-w-[calc(100%-2rem)] rounded-full border border-white/15 bg-slate-950/70 px-3 py-1.5 text-[10px] font-bold text-slate-200 backdrop-blur-md sm:text-xs">
            Drag to look around · Zoom and pan are locked
          </div>
        </div>

        <aside className="space-y-4">
          <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.08 }} className="rounded-[26px] border border-violet-200/15 bg-gradient-to-br from-violet-400/[0.08] to-white/[0.035] p-5 shadow-[0_18px_44px_rgba(0,0,0,0.24)] backdrop-blur-2xl">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-violet-300">How to play</p>
            <p className="mt-3 text-sm leading-6 text-slate-200">{instructions}</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.16 }} className="rounded-[26px] border border-amber-300/20 bg-gradient-to-br from-amber-400/10 to-orange-500/[0.04] p-5 shadow-xl backdrop-blur-2xl">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-200">Objective</p>
            <p className="mt-2 text-sm leading-6 text-slate-100">{objective}</p>
            <div className="mt-5 flex items-end justify-between border-t border-white/10 pt-4">
              <span className="text-sm font-bold text-slate-300">Current score</span>
              <span className="text-3xl font-black text-white">0</span>
            </div>
            <p className="mt-1 text-right text-[11px] font-semibold text-slate-400">Test scene · scoring arrives in Phase 7</p>
          </motion.div>
        </aside>
      </div>
    </section>
  );
}
