"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Sparkles, Layers } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

export function Array3DStage({ className = "" }: { className?: string }) {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const steps = [
    "An array stores elements in a contiguous linear memory order.",
    "Each element has a zero-based index: arr[0]=1, arr[1]=2, ... arr[4]=5.",
    "Array elements can be accessed in constant time O(1) via indexing.",
    "Contiguous memory layout ensures rapid CPU cache hit performance.",
  ];

  const blocks = [
    {
      val: 1,
      color: "from-rose-500 to-red-600",
      border: "border-rose-400",
      glow: "shadow-[0_0_20px_rgba(244,63,94,0.6)]",
      topColor: "#FB7185",
      frontColor: "#E11D48",
      sideColor: "#BE123C",
    },
    {
      val: 2,
      color: "from-amber-400 to-yellow-500",
      border: "border-amber-300",
      glow: "shadow-[0_0_20px_rgba(245,158,11,0.6)]",
      topColor: "#FBBF24",
      frontColor: "#D97706",
      sideColor: "#B45309",
    },
    {
      val: 3,
      color: "from-emerald-400 to-green-600",
      border: "border-emerald-300",
      glow: "shadow-[0_0_20px_rgba(16,185,129,0.6)]",
      topColor: "#34D399",
      frontColor: "#059669",
      sideColor: "#047857",
    },
    {
      val: 4,
      color: "from-cyan-400 to-sky-600",
      border: "border-cyan-300",
      glow: "shadow-[0_0_20px_rgba(6,182,212,0.6)]",
      topColor: "#38BDF8",
      frontColor: "#0284C7",
      sideColor: "#0369A1",
    },
    {
      val: 5,
      color: "from-purple-500 to-indigo-600",
      border: "border-purple-300",
      glow: "shadow-[0_0_20px_rgba(139,92,246,0.6)]",
      topColor: "#A78BFA",
      frontColor: "#7C3AED",
      sideColor: "#6D28D9",
    },
  ];

  const handlePrev = () => {
    setActiveStep((prev) => (prev > 0 ? prev - 1 : steps.length - 1));
  };

  const handleNext = () => {
    setActiveStep((prev) => (prev < steps.length - 1 ? prev + 1 : 0));
  };

  return (
    <div
      className={`relative w-full rounded-3xl bg-gradient-to-b from-[#111438]/90 via-[#0e102d]/95 to-[#080918] border border-white/10 p-5 flex flex-col justify-between overflow-hidden shadow-glass-lg ${className}`}
    >
      {/* Background Floating Island Aesthetic */}
      <div className="absolute inset-0 pointer-events-none opacity-25">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-gradient-to-tr from-purple-600/30 via-cyan-500/20 to-transparent blur-3xl" />
        <svg viewBox="0 0 600 400" className="w-full h-full object-cover">
          <ellipse cx="300" cy="270" rx="220" ry="60" fill="#1e1b4b" opacity="0.6" />
        </svg>
      </div>

      {/* Floating Header Banner */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-2xl bg-gradient-to-r from-purple-600/40 via-indigo-600/30 to-purple-600/40 border border-purple-400/40 shadow-neon-purple backdrop-blur-md">
          <Sparkles className="w-4 h-4 text-amber-300 animate-spin" style={{ animationDuration: "8s" }} />
          <span className="text-sm font-extrabold tracking-wider text-white uppercase">
            3D Array Simulation
          </span>
        </div>

        <Badge variant="cyan" size="sm" className="hidden sm:inline-flex">
          <Layers className="w-3 h-3 mr-1" /> O(1) Access
        </Badge>
      </div>

      {/* 3D Array Interactive Stage */}
      <div className="relative z-10 my-6 py-6 flex flex-col items-center justify-center">
        {/* Floating Neon Signboard: "Array" */}
        <motion.div
          animate={{ y: [0, -4, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          className="mb-8 px-6 py-1.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 border border-purple-300/40 shadow-neon-purple text-white font-extrabold text-sm uppercase tracking-widest"
        >
          Array
        </motion.div>

        {/* Isometric 3D Numbered Blocks */}
        <div className="relative flex items-center justify-center gap-2 sm:gap-4 flex-wrap">
          {blocks.map((b, idx) => {
            const isHoveredOrSelected = selectedIndex === idx;

            return (
              <motion.div
                key={idx}
                onClick={() => setSelectedIndex(idx)}
                whileHover={{ y: -12, scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                className="cursor-pointer group flex flex-col items-center"
              >
                {/* Index tag above */}
                <div
                  className={`text-[11px] font-mono font-bold mb-1 px-1.5 py-0.5 rounded-md transition-colors ${
                    isHoveredOrSelected
                      ? "text-cyan-300 bg-cyan-950/60 border border-cyan-500/40 shadow-[0_0_10px_rgba(6,182,212,0.5)]"
                      : "text-slate-400"
                  }`}
                >
                  [{idx}]
                </div>

                {/* 3D Isometric Cube Representation */}
                <div className="relative w-12 h-14 sm:w-16 sm:h-18">
                  <svg
                    viewBox="0 0 100 120"
                    fill="none"
                    className={`w-full h-full transition-transform duration-200 drop-shadow-[0_10px_15px_rgba(0,0,0,0.5)] ${
                      isHoveredOrSelected ? "filter brightness-125" : ""
                    }`}
                  >
                    {/* Top Face */}
                    <path
                      d="M50 15 L90 35 L50 55 L10 35 Z"
                      fill={b.topColor}
                      stroke="#FFFFFF"
                      strokeWidth="2"
                      strokeOpacity="0.4"
                    />

                    {/* Left Front Face */}
                    <path
                      d="M10 35 L50 55 L50 100 L10 80 Z"
                      fill={b.frontColor}
                      stroke="#FFFFFF"
                      strokeWidth="1.5"
                      strokeOpacity="0.2"
                    />

                    {/* Right Front Face */}
                    <path
                      d="M50 55 L90 35 L90 80 L50 100 Z"
                      fill={b.sideColor}
                      stroke="#FFFFFF"
                      strokeWidth="1.5"
                      strokeOpacity="0.2"
                    />

                    {/* Value Number Centered on Top/Front */}
                    <text
                      x="50"
                      y="82"
                      textAnchor="middle"
                      fill="#FFFFFF"
                      fontSize="30"
                      fontWeight="900"
                      className="font-sans select-none"
                    >
                      {b.val}
                    </text>
                  </svg>
                </div>

                {/* Pedestal Shadow */}
                <div className="w-10 h-2 rounded-full bg-black/40 blur-sm mt-1" />
              </motion.div>
            );
          })}
        </div>

        {/* Circular Stone Podium Stage Base */}
        <div className="w-4/5 max-w-md h-7 rounded-full bg-gradient-to-r from-slate-800 via-indigo-950 to-slate-800 border border-purple-500/30 shadow-[0_15px_30px_rgba(0,0,0,0.8),_inset_0_2px_4px_rgba(255,255,255,0.2)] mt-2 flex items-center justify-center">
          <div className="w-11/12 h-3 rounded-full bg-purple-500/10 blur-xs" />
        </div>
      </div>

      {/* Step Navigation Bar (Arrows & Explanation Text) */}
      <div className="relative z-10 flex items-center gap-3 bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl p-2.5">
        <button
          onClick={handlePrev}
          aria-label="Previous step"
          className="w-9 h-9 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 border border-purple-400/40 text-purple-200 flex items-center justify-center transition-colors shadow-neon-purple shrink-0"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <AnimatePresence mode="wait">
          <motion.p
            key={activeStep}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
            className="flex-1 text-center text-xs sm:text-sm font-medium text-slate-200 px-2 line-clamp-2"
          >
            {selectedIndex !== null
              ? `Selected arr[${selectedIndex}] = ${blocks[selectedIndex].val} at memory address 0x7FFF00${selectedIndex * 4}.`
              : steps[activeStep]}
          </motion.p>
        </AnimatePresence>

        <button
          onClick={handleNext}
          aria-label="Next step"
          className="w-9 h-9 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 border border-purple-400/40 text-purple-200 flex items-center justify-center transition-colors shadow-neon-purple shrink-0"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
