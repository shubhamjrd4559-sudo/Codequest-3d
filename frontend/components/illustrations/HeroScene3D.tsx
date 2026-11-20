"use client";

import React from "react";
import { motion } from "framer-motion";

export function HeroScene3D({ className = "", compact = false }: { className?: string; compact?: boolean }) {
  return (
    <motion.div
      className={`relative w-full h-full pointer-events-none select-none ${compact ? "min-h-[140px]" : "min-h-[260px]"} ${className}`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
    >
      <svg
        viewBox="0 0 620 360"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full overflow-visible"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Sky & Clouds Gradients */}
          <radialGradient id="skyRadial" cx="50%" cy="30%" r="60%">
            <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.45" />
            <stop offset="50%" stopColor="#3B82F6" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#0B0E2B" stopOpacity="0" />
          </radialGradient>

          {/* Island Rock Gradient */}
          <linearGradient id="islandRock" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4A3B32" />
            <stop offset="40%" stopColor="#302621" />
            <stop offset="100%" stopColor="#1C1512" />
          </linearGradient>

          {/* Lush Green Grass Gradient */}
          <linearGradient id="lushGrass" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4ADE80" />
            <stop offset="40%" stopColor="#22C55E" />
            <stop offset="100%" stopColor="#15803D" />
          </linearGradient>

          {/* Waterfall Gradient */}
          <linearGradient id="waterfallFlow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#67E8F9" stopOpacity="0.95" />
            <stop offset="50%" stopColor="#38BDF8" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#A5F3FC" stopOpacity="0.2" />
          </linearGradient>

          {/* Lightbulb Glow */}
          <radialGradient id="bulbGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FDE047" />
            <stop offset="40%" stopColor="#FACC15" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#EAB308" stopOpacity="0" />
          </radialGradient>

          {/* Castle Gradient */}
          <linearGradient id="castleWall" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#F472B6" />
            <stop offset="50%" stopColor="#C084FC" />
            <stop offset="100%" stopColor="#818CF8" />
          </linearGradient>
          <linearGradient id="castleRoof" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FB7185" />
            <stop offset="100%" stopColor="#E11D48" />
          </linearGradient>
        </defs>

        {/* Ambient Sky Glow */}
        <circle cx="360" cy="140" r="220" fill="url(#skyRadial)" />

        {/* ═══════════════════════════════════════════════════
            BACKGROUND: FLOATING MINI ISLANDS IN CLOUDS
        ═══════════════════════════════════════════════════ */}
        {/* Distant island left */}
        <g opacity="0.75" transform="translate(40, 40) scale(0.6)">
          <path d="M20 70 C40 40 100 40 120 70 C110 95 80 115 50 110 C30 105 15 90 20 70 Z" fill="#2E241E" />
          <ellipse cx="70" cy="65" rx="50" ry="18" fill="#22C55E" />
          <circle cx="60" cy="50" r="14" fill="#16A34A" />
          <circle cx="85" cy="54" r="12" fill="#15803D" />
        </g>

        {/* Distant island right */}
        <g opacity="0.6" transform="translate(230, 25) scale(0.55)">
          <path d="M20 70 C40 40 100 40 120 70 C110 95 80 115 50 110 C30 105 15 90 20 70 Z" fill="#2E241E" />
          <ellipse cx="70" cy="65" rx="50" ry="18" fill="#22C55E" />
          <circle cx="75" cy="52" r="15" fill="#16A34A" />
        </g>

        {/* ═══════════════════════════════════════════════════
            CASTLE ISLAND (FAR RIGHT)
        ═══════════════════════════════════════════════════ */}
        <g transform="translate(420, 60)">
          {/* Island base */}
          <path
            d="M20 140 C40 120 150 110 180 135 C190 170 160 210 100 220 C50 225 15 190 20 140 Z"
            fill="url(#islandRock)"
          />
          {/* Green Grass Top */}
          <ellipse cx="100" cy="135" rx="80" ry="24" fill="url(#lushGrass)" />

          {/* Castle Walls & Towers */}
          {/* Left Tower */}
          <rect x="45" y="65" width="22" height="60" rx="3" fill="url(#castleWall)" />
          <polygon points="56,35 42,66 70,66" fill="url(#castleRoof)" />
          {/* Center Main Keep */}
          <rect x="75" y="45" width="45" height="80" rx="4" fill="url(#castleWall)" />
          {/* Battlements */}
          <rect x="75" y="38" width="8" height="8" fill="#F472B6" />
          <rect x="87" y="38" width="8" height="8" fill="#F472B6" />
          <rect x="99" y="38" width="8" height="8" fill="#F472B6" />
          <rect x="111" y="38" width="9" height="8" fill="#F472B6" />
          {/* High Central Spire */}
          <polygon points="97,10 82,46 113,46" fill="url(#castleRoof)" />
          <circle cx="97.5" cy="8" r="3" fill="#FDE047" />
          {/* Right Tower */}
          <rect x="127" y="65" width="22" height="60" rx="3" fill="url(#castleWall)" />
          <polygon points="138,35 124,66 152,66" fill="url(#castleRoof)" />

          {/* Glowing Arched Castle Windows & Door */}
          <rect x="88" y="95" width="18" height="26" rx="9" fill="#0C1445" />
          <rect x="91" y="98" width="12" height="22" rx="6" fill="#67E8F9" opacity="0.9" />
          <rect x="52" y="78" width="8" height="12" rx="4" fill="#FDE047" opacity="0.85" />
          <rect x="134" y="78" width="8" height="12" rx="4" fill="#FDE047" opacity="0.85" />

          {/* Waterfall Off Edge */}
          <path
            d="M75 142 Q73 175 68 220 Q65 240 70 248"
            stroke="url(#waterfallFlow)"
            strokeWidth="7"
            strokeLinecap="round"
          />
          <path
            d="M82 144 Q80 180 75 225"
            stroke="url(#waterfallFlow)"
            strokeWidth="4"
            strokeLinecap="round"
            opacity="0.7"
          />
        </g>

        {/* ═══════════════════════════════════════════════════
            MAIN FOREGROUND ISLAND (LUSH ROCK PLATFORM)
        ═══════════════════════════════════════════════════ */}
        <g transform="translate(100, 150)">
          {/* Island Rock Foundation with Strata */}
          <path
            d="M10 120 C40 100 280 95 380 115 C395 150 360 200 240 215 C140 220 30 190 10 120 Z"
            fill="url(#islandRock)"
          />
          {/* Rock detailing & shadows */}
          <path d="M40 135 L60 170 L90 130 L130 185 L180 135 L240 190 L300 130" stroke="#1F1714" strokeWidth="3" opacity="0.6" fill="none" />
          
          {/* Lush Green Grass Cap */}
          <ellipse cx="200" cy="115" rx="185" ry="32" fill="url(#lushGrass)" />
          {/* Grass rim highlights */}
          <ellipse cx="195" cy="108" rx="170" ry="24" fill="#4ADE80" opacity="0.5" />

          {/* Little flowers & grass tufts */}
          <circle cx="70" cy="115" r="3" fill="#FDE047" />
          <circle cx="95" cy="122" r="2.5" fill="#F472B6" />
          <circle cx="310" cy="125" r="3" fill="#67E8F9" />
          <circle cx="335" cy="118" r="2.5" fill="#FDE047" />

          {/* ═══════════════════════════════════════════════════
              3D BOY CHARACTER SITTING CROSS-LEGGED READING BOOK
          ═══════════════════════════════════════════════════ */}
          <g transform="translate(60, -25)">
            {/* Shadow under Boy */}
            <ellipse cx="105" cy="130" rx="48" ry="12" fill="rgba(0,0,0,0.35)" />

            {/* Crossed Legs & Sneakers */}
            {/* Left Sneaker (Red & White) */}
            <ellipse cx="65" cy="125" rx="16" ry="10" fill="#EF4444" />
            <path d="M52 128 C52 133 78 133 78 128 Z" fill="#FFFFFF" />
            <ellipse cx="65" cy="121" rx="9" ry="4" fill="#FFFFFF" />

            {/* Right Sneaker (Red & White) */}
            <ellipse cx="145" cy="125" rx="16" ry="10" fill="#EF4444" />
            <path d="M132 128 C132 133 158 133 158 128 Z" fill="#FFFFFF" />
            <ellipse cx="145" cy="121" rx="9" ry="4" fill="#FFFFFF" />

            {/* Dark Blue Pants */}
            <path d="M68 110 C60 120 80 130 105 125 C130 130 150 120 142 110 C130 105 80 105 68 110 Z" fill="#1E293B" />

            {/* Body / Bright Red Hoodie */}
            <rect x="78" y="45" width="54" height="60" rx="16" fill="#DC2626" />
            <rect x="90" y="50" width="30" height="52" rx="8" fill="#B91C1C" />

            {/* Head & Neck */}
            <rect x="98" y="32" width="14" height="15" rx="4" fill="#FCD34D" />
            {/* Round Friendly Face */}
            <ellipse cx="105" cy="18" rx="26" ry="26" fill="#FDE68A" />

            {/* Lush Brown Anime Hair */}
            <path
              d="M75 14 C73 -12 100 -20 122 -14 C138 -9 140 10 135 24 C130 12 120 5 105 6 C92 7 82 12 75 14 Z"
              fill="#451A03"
            />
            {/* Front bangs */}
            <path d="M82 6 C92 -2 105 -3 118 4 C110 5 100 8 90 10 Z" fill="#78350F" />

            {/* Cute Cartoon Eyes with Highlight */}
            <ellipse cx="96" cy="17" rx="4.5" ry="6" fill="#18181B" />
            <ellipse cx="114" cy="17" rx="4.5" ry="6" fill="#18181B" />
            <circle cx="98" cy="15" r="1.8" fill="#FFFFFF" />
            <circle cx="116" cy="15" r="1.8" fill="#FFFFFF" />

            {/* Happy Smile & Rosy Cheeks */}
            <path d="M100 26 Q105 31 110 26" stroke="#DC2626" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <ellipse cx="88" cy="22" rx="5" ry="3.5" fill="#FCA5A5" opacity="0.75" />
            <ellipse cx="122" cy="22" rx="5" ry="3.5" fill="#FCA5A5" opacity="0.75" />

            {/* Arms holding the open book */}
            <rect x="68" y="55" width="16" height="35" rx="8" fill="#DC2626" transform="rotate(-25 68 55)" />
            <rect x="126" y="55" width="16" height="35" rx="8" fill="#DC2626" transform="rotate(25 126 55)" />

            {/* ════ OPEN CODE BOOK (PURPLE WITH CODE SYMBOL </>) ════ */}
            <g transform="translate(75, 60)">
              {/* Left Page */}
              <polygon points="30,35 2,24 6,5 30,12" fill="#7C3AED" />
              <polygon points="28,33 4,23 8,7 28,14" fill="#F5F3FF" />
              {/* Left page text lines */}
              <line x1="8" y1="13" x2="24" y2="17" stroke="#A78BFA" strokeWidth="2" strokeLinecap="round" />
              <line x1="8" y1="19" x2="22" y2="23" stroke="#A78BFA" strokeWidth="2" strokeLinecap="round" />
              <line x1="8" y1="25" x2="18" y2="27" stroke="#A78BFA" strokeWidth="2" strokeLinecap="round" />

              {/* Right Page */}
              <polygon points="30,35 58,24 54,5 30,12" fill="#7C3AED" />
              <polygon points="32,33 56,23 52,7 32,14" fill="#F5F3FF" />
              {/* Code symbol </> on right page */}
              <text x="44" y="22" textAnchor="middle" fill="#6D28D9" fontSize="13" fontWeight="900" fontFamily="monospace">&lt;/&gt;</text>

              {/* Hands holding the book */}
              <circle cx="4" cy="24" r="5" fill="#FDE68A" />
              <circle cx="56" cy="24" r="5" fill="#FDE68A" />
            </g>
          </g>

          {/* ═══════════════════════════════════════════════════
              AI ROBOT MASCOT SITTING NEXT TO BOY + LIGHTBULB
          ═══════════════════════════════════════════════════ */}
          <g transform="translate(235, -5)">
            {/* Robot ground shadow */}
            <ellipse cx="45" cy="115" rx="36" ry="10" fill="rgba(0,0,0,0.3)" />

            {/* 💡 GLOWING LIGHTBULB FLOATING ABOVE ROBOT */}
            <g transform="translate(30, -50)">
              {/* Ambient radial glow */}
              <circle cx="15" cy="15" r="30" fill="url(#bulbGlow)" />
              {/* Light rays */}
              <line x1="15" y1="-8" x2="15" y2="-2" stroke="#FDE047" strokeWidth="3" strokeLinecap="round" />
              <line x1="-3" y1="3" x2="2" y2="6" stroke="#FDE047" strokeWidth="3" strokeLinecap="round" />
              <line x1="33" y1="3" x2="28" y2="6" stroke="#FDE047" strokeWidth="3" strokeLinecap="round" />
              <line x1="-4" y1="22" x2="1" y2="20" stroke="#FDE047" strokeWidth="3" strokeLinecap="round" />
              <line x1="34" y1="22" x2="29" y2="20" stroke="#FDE047" strokeWidth="3" strokeLinecap="round" />
              {/* Glass Bulb */}
              <circle cx="15" cy="14" r="14" fill="#FEF08A" stroke="#FACC15" strokeWidth="2.5" />
              <path d="M9 22 L21 22 L18 29 L12 29 Z" fill="#94A3B8" />
              <path d="M12 29 L18 29 L16 32 L14 32 Z" fill="#64748B" />
              {/* Filament */}
              <path d="M11 15 Q15 9 19 15" stroke="#EAB308" strokeWidth="2" fill="none" />
            </g>

            {/* Robot Antenna with glowing tip */}
            <rect x="42" y="2" width="6" height="16" rx="3" fill="#94A3B8" />
            <circle cx="45" cy="2" r="6" fill="#06B6D4" />
            <circle cx="45" cy="2" r="3" fill="#E0F2FE" />

            {/* Robot Head (White glossy pod) */}
            <rect x="12" y="15" width="66" height="50" rx="18" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="2" />
            {/* Top Gloss */}
            <rect x="18" y="17" width="54" height="12" rx="6" fill="#FFFFFF" opacity="0.8" />

            {/* Dark Visor Screen */}
            <rect x="20" y="24" width="50" height="32" rx="12" fill="#0A0F29" />

            {/* Glowing Cyan Eyes (Happy Curved Arc or Big Circles) */}
            <ellipse cx="33" cy="38" rx="8" ry="8" fill="#06B6D4" opacity="0.3" />
            <ellipse cx="33" cy="38" rx="6" ry="6" fill="#06B6D4" />
            <circle cx="34" cy="36" r="2.2" fill="#E0F2FE" />

            <ellipse cx="57" cy="38" rx="8" ry="8" fill="#06B6D4" opacity="0.3" />
            <ellipse cx="57" cy="38" rx="6" ry="6" fill="#06B6D4" />
            <circle cx="58" cy="36" r="2.2" fill="#E0F2FE" />

            {/* Robot Smile */}
            <path d="M37 47 Q45 54 53 47" stroke="#06B6D4" strokeWidth="2.5" strokeLinecap="round" fill="none" />

            {/* Robot Neck */}
            <rect x="37" y="64" width="16" height="9" rx="3" fill="#CBD5E1" />

            {/* Robot Body */}
            <rect x="18" y="70" width="54" height="42" rx="14" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="2" />
            {/* Chest Badge with Blue Bolt */}
            <rect x="30" y="77" width="30" height="20" rx="6" fill="#0F172A" />
            <text x="45" y="92" textAnchor="middle" fill="#38BDF8" fontSize="12" fontWeight="900" fontFamily="monospace">&lt;/&gt;</text>

            {/* Left Arm (Waving) */}
            <rect x="2" y="72" width="14" height="26" rx="6" fill="#E2E8F0" transform="rotate(35 2 72)" />
            <ellipse cx="0" cy="98" rx="6" ry="5" fill="#CBD5E1" />

            {/* Right Arm (Thumbs up towards boy) */}
            <rect x="68" y="74" width="14" height="25" rx="6" fill="#E2E8F0" transform="rotate(-20 68 74)" />
            <circle cx="82" cy="94" r="6" fill="#CBD5E1" />
            <rect x="80" y="86" width="4" height="7" rx="2" fill="#CBD5E1" />

            {/* Little Robot Feet */}
            <rect x="28" y="108" width="14" height="10" rx="4" fill="#94A3B8" />
            <rect x="48" y="108" width="14" height="10" rx="4" fill="#94A3B8" />
          </g>
        </g>
      </svg>
    </motion.div>
  );
}
