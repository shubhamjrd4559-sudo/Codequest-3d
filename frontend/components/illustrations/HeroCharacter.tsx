"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export function HeroCharacter({ className = "" }: { className?: string }) {
  return (
    <div className={`relative w-full h-full min-h-[220px] flex items-center justify-end overflow-hidden ${className}`}>
      {/* Background Floating Island Silhouette & Castle */}
      <div className="absolute right-0 top-0 bottom-0 w-3/4 opacity-40 pointer-events-none">
        <svg viewBox="0 0 400 300" fill="none" className="w-full h-full object-cover">
          {/* Fantasy Castle Island */}
          <g opacity="0.85">
            {/* Castle Spires */}
            <path d="M260 90 L275 30 L290 90 Z" fill="#8B5CF6" />
            <path d="M295 100 L310 45 L325 100 Z" fill="#EC4899" />
            <path d="M225 110 L240 60 L255 110 Z" fill="#3B82F6" />
            <rect x="250" y="90" width="80" height="50" rx="4" fill="#4C1D95" />
            <circle cx="290" cy="110" r="10" fill="#FDE047" />

            {/* Floating Island Rock & Foliage */}
            <path
              d="M180 140 C220 130 360 130 390 145 C410 155 380 210 320 230 C260 250 200 220 180 180 Z"
              fill="#1E293B"
            />
            <path
              d="M180 140 C220 130 360 130 390 145 L380 160 C330 150 220 150 180 155 Z"
              fill="#10B981"
            />
            {/* Waterfall cascading off edge */}
            <path d="M310 160 Q305 200 312 240 Q315 260 310 270" stroke="#38BDF8" strokeWidth="4" opacity="0.7" strokeDasharray="4 2" />
          </g>
        </svg>
      </div>

      {/* 3D Character Illustration (Shubham in Purple Hoodie) */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 flex flex-col items-center mr-2 sm:mr-6"
      >
        {/* Floating XP badge */}
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
          className="absolute -top-3 -left-6 z-20 px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-extrabold text-[11px] shadow-neon-amber flex items-center gap-1"
        >
          <Sparkles className="w-3 h-3 fill-slate-950" />
          Lvl 12 Master
        </motion.div>

        {/* Character Card / Avatar Visual */}
        <div className="relative w-36 h-48 sm:w-44 sm:h-56 flex items-center justify-center">
          <svg viewBox="0 0 200 240" fill="none" className="w-full h-full drop-shadow-[0_15px_30px_rgba(0,0,0,0.6)]">
            {/* Ambient Aura */}
            <circle cx="100" cy="110" r="70" fill="url(#hero-glow)" opacity="0.6" />

            {/* Body: Purple Hoodie */}
            <path
              d="M50 220 C50 170 70 150 100 150 C130 150 150 170 150 220 Z"
              fill="url(#hoodie-grad)"
            />
            {/* Hoodie strings / emblem */}
            <path d="M85 165 L85 195" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M115 165 L115 195" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
            {/* Gamepad logo on chest */}
            <rect x="90" y="180" width="20" height="12" rx="4" fill="#3B82F6" />
            <circle cx="95" cy="186" r="1.5" fill="#FFFFFF" />
            <circle cx="105" cy="186" r="1.5" fill="#FFFFFF" />

            {/* Left Arm Pointing Forward/Right */}
            <path
              d="M135 160 C155 150 175 140 190 135"
              stroke="#8B5CF6"
              strokeWidth="18"
              strokeLinecap="round"
            />
            {/* Hand pointing */}
            <circle cx="190" cy="135" r="9" fill="#FBCFE8" />

            {/* Neck */}
            <rect x="88" y="130" width="24" height="22" rx="6" fill="#FBCFE8" />

            {/* Head / Face */}
            <ellipse cx="100" cy="95" rx="34" ry="38" fill="#FDE2E4" />

            {/* Hair: Stylized Modern Anime/3D Game Style */}
            <path
              d="M62 90 C60 50 85 40 100 40 C125 40 142 55 140 90 C132 80 120 75 110 75 C95 75 80 82 62 90 Z"
              fill="#2A1B0E"
            />
            <path
              d="M75 55 C90 45 110 45 130 52 C120 40 95 38 75 55 Z"
              fill="#422817"
            />

            {/* Eyes: Expressive & Friendly */}
            <ellipse cx="88" cy="95" rx="4.5" ry="6" fill="#1E1B4B" />
            <circle cx="90" cy="93" r="1.5" fill="#FFFFFF" />
            <ellipse cx="112" cy="95" rx="4.5" ry="6" fill="#1E1B4B" />
            <circle cx="114" cy="93" r="1.5" fill="#FFFFFF" />

            {/* Smiling Mouth */}
            <path
              d="M92 112 Q100 122 108 112"
              stroke="#E11D48"
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="#FFFFFF"
            />

            {/* Rosy Cheeks */}
            <circle cx="79" cy="104" r="5" fill="#FDA4AF" opacity="0.6" />
            <circle cx="121" cy="104" r="5" fill="#FDA4AF" opacity="0.6" />

            {/* Gradients */}
            <defs>
              <linearGradient id="hoodie-grad" x1="50" y1="150" x2="150" y2="220" gradientUnits="userSpaceOnUse">
                <stop stopColor="#7C3AED" />
                <stop offset="1" stopColor="#4338CA" />
              </linearGradient>
              <radialGradient id="hero-glow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#06B6D4" stopOpacity="0" />
              </radialGradient>
            </defs>
          </svg>
        </div>
      </motion.div>
    </div>
  );
}
