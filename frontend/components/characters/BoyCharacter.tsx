"use client";

import React from "react";
import { motion } from "framer-motion";

// Boy Character — high-quality SVG placeholder matching reference image style
// Purple hoodie, brown hair, friendly face, pointing pose
export function BoyCharacter({ className = "" }: { className?: string }) {
  return (
    <motion.div
      className={`relative flex items-end justify-center ${className}`}
      animate={{ y: [0, -8, 0] }}
      transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
    >
      {/* Ambient glow halo */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-10 rounded-full bg-purple-500/30 blur-xl" />

      <svg
        viewBox="0 0 220 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_20px_40px_rgba(139,92,246,0.4)]"
        aria-label="Student character"
      >
        {/* === SHADOW === */}
        <ellipse cx="110" cy="295" rx="55" ry="8" fill="rgba(0,0,0,0.3)" />

        {/* === LEGS === */}
        <rect x="77" y="225" width="28" height="55" rx="10" fill="#1E1B4B" />
        <rect x="113" y="225" width="28" height="55" rx="10" fill="#1E1B4B" />
        {/* Shoes */}
        <ellipse cx="91" cy="282" rx="20" ry="9" fill="#111827" />
        <ellipse cx="127" cy="282" rx="20" ry="9" fill="#111827" />

        {/* === BODY / PURPLE HOODIE === */}
        <rect x="62" y="150" width="96" height="85" rx="18" fill="#7C3AED" />
        {/* Hoodie lighter front panel */}
        <rect x="90" y="155" width="40" height="75" rx="8" fill="#6D28D9" />
        {/* Hoodie pocket */}
        <rect x="94" y="195" width="32" height="22" rx="6" fill="#5B21B6" />
        {/* Gamepad logo on chest */}
        <rect x="98" y="168" width="24" height="16" rx="5" fill="#3B82F6" />
        <circle cx="104" cy="176" r="2.5" fill="white" />
        <circle cx="116" cy="176" r="2.5" fill="white" />
        <rect x="109" y="172" width="2" height="8" rx="1" fill="white" />
        <rect x="106" y="175" width="8" height="2" rx="1" fill="white" />

        {/* === RIGHT ARM (pointing right/forward) === */}
        <rect x="148" y="155" width="26" height="58" rx="13" fill="#7C3AED" transform="rotate(-30 148 155)" />
        {/* Right hand */}
        <ellipse cx="181" cy="175" rx="13" ry="11" fill="#FBBF24" />
        {/* Pointing index finger */}
        <rect x="186" y="168" width="20" height="8" rx="4" fill="#FBBF24" transform="rotate(-15 186 168)" />

        {/* === LEFT ARM (relaxed down) === */}
        <rect x="40" y="160" width="26" height="52" rx="13" fill="#7C3AED" transform="rotate(15 40 160)" />
        <ellipse cx="43" cy="212" rx="12" ry="10" fill="#FBBF24" />

        {/* === NECK === */}
        <rect x="96" y="132" width="28" height="24" rx="8" fill="#FBBF24" />

        {/* === HEAD === */}
        <ellipse cx="110" cy="102" rx="45" ry="50" fill="#FDE68A" />

        {/* === HAIR (dark brown, stylized) === */}
        <path
          d="M65 95 C63 50 85 35 110 35 C138 35 158 52 155 90
             C148 78 135 72 122 73 C108 74 90 80 65 95Z"
          fill="#292524"
        />
        {/* Hair bangs */}
        <path d="M70 80 C85 60 100 58 115 62 C100 65 85 72 70 80Z" fill="#3D2E24" />

        {/* === EYES === */}
        <ellipse cx="92" cy="105" rx="7" ry="9" fill="#1C1917" />
        <ellipse cx="128" cy="105" rx="7" ry="9" fill="#1C1917" />
        {/* Eye shine */}
        <circle cx="95" cy="102" r="2.5" fill="white" />
        <circle cx="131" cy="102" r="2.5" fill="white" />
        {/* Eyebrows */}
        <path d="M83 93 Q92 88 101 92" stroke="#292524" strokeWidth="3.5" strokeLinecap="round" fill="none" />
        <path d="M119 92 Q128 87 137 92" stroke="#292524" strokeWidth="3.5" strokeLinecap="round" fill="none" />

        {/* === SMILE === */}
        <path d="M96 123 Q110 136 124 123" stroke="#E11D48" strokeWidth="3.5" strokeLinecap="round" fill="none" />

        {/* === ROSY CHEEKS === */}
        <ellipse cx="80" cy="115" rx="9" ry="6" fill="#FDA4AF" opacity="0.7" />
        <ellipse cx="140" cy="115" rx="9" ry="6" fill="#FDA4AF" opacity="0.7" />

        {/* === EAR === */}
        <ellipse cx="65" cy="108" rx="7" ry="9" fill="#FDE68A" />
        <ellipse cx="155" cy="108" rx="7" ry="9" fill="#FDE68A" />
      </svg>
    </motion.div>
  );
}
