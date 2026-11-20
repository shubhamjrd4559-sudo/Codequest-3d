"use client";

import React from "react";
import { motion } from "framer-motion";

// Robot Mascot — matches the AI guide robot from reference images
// White/silver body, glowing blue eyes, antenna, friendly companion
export function RobotMascot({ className = "", size = "md" }: { className?: string; size?: "sm" | "md" | "lg" }) {
  const dims = { sm: "w-20 h-24", md: "w-32 h-38", lg: "w-44 h-52" };

  return (
    <motion.div
      className={`relative flex items-end justify-center ${dims[size]} ${className}`}
      animate={{ y: [0, -6, 0] }}
      transition={{ repeat: Infinity, duration: 2.8, ease: "easeInOut", delay: 0.5 }}
    >
      {/* Ground glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-5 rounded-full bg-cyan-400/30 blur-lg" />

      <svg
        viewBox="0 0 180 240"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_15px_30px_rgba(6,182,212,0.5)]"
        aria-label="AI Robot mascot guide"
      >
        {/* === ANTENNA === */}
        <rect x="85" y="5" width="10" height="28" rx="5" fill="#94A3B8" />
        {/* Antenna ball — glowing */}
        <circle cx="90" cy="6" r="8" fill="#06B6D4" />
        <circle cx="90" cy="6" r="4" fill="#A5F3FC" />
        {/* Antenna glow halo */}
        <circle cx="90" cy="6" r="12" fill="#06B6D4" opacity="0.25" />

        {/* === HEAD === */}
        <rect x="38" y="30" width="104" height="80" rx="22" fill="#E2E8F0" />
        {/* Head top highlight */}
        <rect x="45" y="30" width="90" height="20" rx="12" fill="#F1F5F9" opacity="0.8" />

        {/* === VISOR / FACE SCREEN === */}
        <rect x="48" y="42" width="84" height="55" rx="14" fill="#0C1445" />
        <rect x="50" y="44" width="80" height="51" rx="12" fill="#0F172A" />

        {/* === EYES (Glowing Blue Circles) === */}
        {/* Left eye */}
        <circle cx="72" cy="68" r="15" fill="#06B6D4" opacity="0.3" />
        <circle cx="72" cy="68" r="11" fill="#06B6D4" />
        <circle cx="72" cy="68" r="6" fill="#A5F3FC" />
        <circle cx="75" cy="65" r="2.5" fill="white" />

        {/* Right eye */}
        <circle cx="108" cy="68" r="15" fill="#06B6D4" opacity="0.3" />
        <circle cx="108" cy="68" r="11" fill="#06B6D4" />
        <circle cx="108" cy="68" r="6" fill="#A5F3FC" />
        <circle cx="111" cy="65" r="2.5" fill="white" />

        {/* === SMILE (curved line on screen) === */}
        <path d="M74 88 Q90 100 106 88" stroke="#06B6D4" strokeWidth="3.5" strokeLinecap="round" fill="none" />

        {/* === NECK CONNECTOR === */}
        <rect x="78" y="108" width="24" height="16" rx="6" fill="#CBD5E1" />

        {/* === BODY === */}
        <rect x="30" y="122" width="120" height="85" rx="18" fill="#E2E8F0" />
        {/* Body highlight strip */}
        <rect x="38" y="122" width="104" height="20" rx="10" fill="#F1F5F9" opacity="0.9" />

        {/* Chest panel */}
        <rect x="52" y="140" width="76" height="45" rx="12" fill="#CBD5E1" />
        {/* Code symbol on chest */}
        <text x="90" y="166" textAnchor="middle" fill="#6D28D9" fontSize="20" fontWeight="900" fontFamily="monospace">&lt;/&gt;</text>

        {/* Body side bolts */}
        <circle cx="42" cy="155" r="6" fill="#94A3B8" />
        <circle cx="42" cy="175" r="6" fill="#94A3B8" />
        <circle cx="138" cy="155" r="6" fill="#94A3B8" />
        <circle cx="138" cy="175" r="6" fill="#94A3B8" />

        {/* === LEFT ARM (pointing / waving) === */}
        <rect x="2" y="128" width="30" height="60" rx="14" fill="#CBD5E1" transform="rotate(20 2 128)" />
        {/* Left hand with index pointing */}
        <ellipse cx="14" cy="193" rx="13" ry="11" fill="#E2E8F0" />
        <rect x="-2" y="183" width="10" height="18" rx="5" fill="#E2E8F0" transform="rotate(-25 -2 183)" />

        {/* === RIGHT ARM (relaxed/waving) === */}
        <rect x="145" y="130" width="30" height="58" rx="14" fill="#CBD5E1" transform="rotate(-15 145 130)" />
        <ellipse cx="168" cy="188" rx="13" ry="11" fill="#E2E8F0" />

        {/* === LEGS === */}
        <rect x="58" y="205" width="28" height="28" rx="10" fill="#CBD5E1" />
        <rect x="94" y="205" width="28" height="28" rx="10" fill="#CBD5E1" />
        {/* Feet */}
        <rect x="50" y="228" width="40" height="12" rx="6" fill="#94A3B8" />
        <rect x="88" y="228" width="40" height="12" rx="6" fill="#94A3B8" />
      </svg>
    </motion.div>
  );
}
