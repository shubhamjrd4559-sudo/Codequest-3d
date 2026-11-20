"use client";

import React from "react";
import { motion } from "framer-motion";

// Floating Island with Castle — matches the fantasy landscape from reference images
// Used as background decoration on dashboard hero banner
export function FloatingIsland({ className = "" }: { className?: string }) {
  return (
    <motion.div
      className={`relative pointer-events-none ${className}`}
      animate={{ y: [0, -10, 0] }}
      transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
    >
      <svg
        viewBox="0 0 400 320"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
        aria-hidden="true"
      >
        {/* === SKY GRADIENTS & CLOUDS === */}
        <defs>
          <radialGradient id="skyGlow" cx="60%" cy="30%" r="60%">
            <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.1" />
          </radialGradient>
          <linearGradient id="islandGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#16A34A" />
            <stop offset="100%" stopColor="#1E293B" />
          </linearGradient>
          <linearGradient id="waterfall" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.1" />
          </linearGradient>
        </defs>

        {/* Sky glow */}
        <circle cx="250" cy="80" r="150" fill="url(#skyGlow)" />

        {/* === SMALL FLOATING PLATFORMS (background) === */}
        <ellipse cx="310" cy="60" rx="35" ry="12" fill="#15803D" />
        <rect x="280" y="40" width="60" height="20" rx="5" fill="#166534" />
        <ellipse cx="310" cy="40" rx="30" ry="8" fill="#16A34A" />

        <ellipse cx="60" cy="90" rx="28" ry="10" fill="#15803D" />
        <rect x="36" y="72" width="48" height="18" rx="5" fill="#166534" />
        <ellipse cx="60" cy="72" rx="24" ry="7" fill="#16A34A" />

        {/* === MAIN CASTLE ISLAND === */}
        {/* Island rock base */}
        <path
          d="M120 220 C130 180 200 170 270 175 C320 178 370 195 380 220
             C390 245 370 275 320 285 C260 298 170 295 130 280 C100 268 110 240 120 220Z"
          fill="#1E293B"
        />
        {/* Green grass top */}
        <path
          d="M120 220 C140 195 200 185 265 188 C315 191 365 205 378 220
             C355 210 300 205 265 206 C210 207 160 215 120 220Z"
          fill="#16A34A"
        />

        {/* Trees on island */}
        <circle cx="145" cy="195" r="18" fill="#15803D" />
        <rect x="141" y="207" width="8" height="18" rx="3" fill="#92400E" />
        <circle cx="350" cy="200" r="14" fill="#15803D" />
        <rect x="346" y="210" width="8" height="16" rx="3" fill="#92400E" />

        {/* Waterfall off right edge */}
        <path d="M368 218 Q372 250 365 285 Q362 295 368 300" stroke="url(#waterfall)" strokeWidth="6" strokeLinecap="round" />
        <path d="M374 220 Q378 252 371 287" stroke="url(#waterfall)" strokeWidth="4" strokeLinecap="round" opacity="0.6" />

        {/* === CASTLE === */}
        {/* Main tower center */}
        <rect x="215" y="110" width="60" height="90" rx="4" fill="#4C1D95" />
        <rect x="225" y="110" width="40" height="12" fill="#5B21B6" />

        {/* Battlements center */}
        {[220, 232, 244, 256, 268].map((x, i) => (
          <rect key={i} x={x} y="98" width="10" height="14" rx="2" fill="#6D28D9" />
        ))}

        {/* Left side tower */}
        <rect x="175" y="128" width="45" height="72" rx="4" fill="#5B21B6" />
        {[178, 190, 202, 214].map((x, i) => (
          <rect key={i} x={x} y="118" width="10" height="12" rx="2" fill="#7C3AED" />
        ))}

        {/* Right side tower */}
        <rect x="265" y="135" width="45" height="65" rx="4" fill="#5B21B6" />
        {[268, 280, 292, 304].map((x, i) => (
          <rect key={i} x={x} y="124" width="10" height="12" rx="2" fill="#7C3AED" />
        ))}

        {/* Tower spires */}
        <polygon points="245,70 230,112 260,112" fill="#EC4899" />
        <polygon points="197,95 184,130 210,130" fill="#8B5CF6" />
        <polygon points="288,100 274,138 302,138" fill="#06B6D4" />

        {/* Castle gate & glowing door */}
        <rect x="225" y="165" width="30" height="35" rx="12" fill="#312E81" />
        <rect x="228" y="168" width="24" height="30" rx="10" fill="#06B6D4" opacity="0.5" />
        {/* Door glow */}
        <circle cx="240" cy="183" r="10" fill="#38BDF8" opacity="0.4" />

        {/* Castle windows with glowing lights */}
        <rect x="230" y="130" width="20" height="24" rx="6" fill="#FDE047" opacity="0.7" />
        <rect x="183" y="148" width="16" height="18" rx="5" fill="#FDE047" opacity="0.6" />
        <rect x="276" y="152" width="16" height="18" rx="5" fill="#FDE047" opacity="0.6" />

        {/* Castle ambient purple glow */}
        <circle cx="240" cy="150" r="80" fill="#8B5CF6" opacity="0.1" />
      </svg>
    </motion.div>
  );
}
