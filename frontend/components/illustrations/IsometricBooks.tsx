"use client";

import React from "react";
import { motion } from "framer-motion";

export function IsometricBooks({ className = "" }: { className?: string }) {
  return (
    <motion.div
      animate={{ y: [0, -6, 0] }}
      transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
      className={`relative w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center ${className}`}
    >
      {/* Outer ambient glow */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-500/30 to-purple-500/30 blur-xl" />

      {/* SVG 3D Isometric Book Stack */}
      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_15px_25px_rgba(0,0,0,0.5)]"
      >
        {/* Glowing aura rings */}
        <ellipse
          cx="100"
          cy="150"
          rx="70"
          ry="25"
          fill="none"
          stroke="url(#ring-glow)"
          strokeWidth="3"
          strokeDasharray="6 6"
          opacity="0.8"
        />

        {/* Bottom Book (Gold/Amber) */}
        <g transform="translate(0, 30)">
          {/* Bottom Spine/Cover */}
          <path d="M40 100 L100 130 L160 100 L100 70 Z" fill="#D97706" />
          <path d="M40 100 L100 130 L100 145 L40 115 Z" fill="#B45309" />
          <path d="M100 130 L160 100 L160 115 L100 145 Z" fill="#92400E" />
          {/* Pages */}
          <path d="M42 98 L100 127 L158 98 L100 72 Z" fill="#FEF3C7" />
        </g>

        {/* Middle Book (Magenta/Purple) */}
        <g transform="translate(0, 15)">
          <path d="M45 85 L100 112 L155 85 L100 58 Z" fill="#9333EA" />
          <path d="M45 85 L100 112 L100 124 L45 97 Z" fill="#7E22CE" />
          <path d="M100 112 L155 85 L155 97 L100 124 Z" fill="#6B21A8" />
          {/* Pages */}
          <path d="M47 83 L100 109 L153 83 L100 60 Z" fill="#F3E8FF" />
        </g>

        {/* Top Book (Neon Cyan) */}
        <g transform="translate(0, 0)">
          <path d="M50 70 L100 95 L150 70 L100 45 Z" fill="#06B6D4" />
          <path d="M50 70 L100 95 L100 107 L50 82 Z" fill="#0891B2" />
          <path d="M100 95 L150 70 L150 82 L100 107 Z" fill="#0E7490" />
          {/* Glowing Code Symbol on Top Cover */}
          <path
            d="M85 70 L75 75 L85 80"
            stroke="#FFFFFF"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M115 70 L125 75 L115 80"
            stroke="#FFFFFF"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M103 67 L97 83"
            stroke="#A5F3FC"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </g>

        {/* Definitions */}
        <defs>
          <linearGradient id="ring-glow" x1="30" y1="150" x2="170" y2="150" gradientUnits="userSpaceOnUse">
            <stop stopColor="#F59E0B" />
            <stop offset="0.5" stopColor="#EC4899" />
            <stop offset="1" stopColor="#06B6D4" />
          </linearGradient>
        </defs>
      </svg>
    </motion.div>
  );
}
