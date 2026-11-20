"use client";

import React from "react";

// 1. 3D Graduation Cap on Books + Trending Graph (DSA Progress)
export function GraduationBooks3D({ className = "" }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <svg viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-[0_4px_12px_rgba(56,189,248,0.5)]">
        {/* Book 1 (Bottom Orange/Red) */}
        <polygon points="12,50 48,58 58,54 22,46" fill="#F97316" />
        <polygon points="12,50 48,58 48,63 12,55" fill="#EA580C" />
        <polygon points="48,58 58,54 58,59 48,63" fill="#C2410C" />
        {/* Book pages */}
        <polygon points="15,53 46,60 46,62 15,55" fill="#FEF08A" />

        {/* Book 2 (Middle Cyan/Blue) */}
        <polygon points="10,43 45,51 55,47 20,39" fill="#06B6D4" />
        <polygon points="10,43 45,51 45,47 10,39" fill="#0284C7" />
        <polygon points="45,51 55,47 55,43 45,47" fill="#0369A1" />
        {/* Book pages */}
        <polygon points="13,42 43,49 43,50 13,43" fill="#FFFFFF" />

        {/* 3D Mortarboard Graduation Cap (Top) */}
        {/* Cap Base Ring */}
        <ellipse cx="32" cy="30" rx="13" ry="5" fill="#1E1B4B" />
        <path d="M19 30 C19 36 45 36 45 30 L45 33 C45 39 19 39 19 33 Z" fill="#312E81" />
        {/* Diamond Top */}
        <polygon points="32,15 54,23 32,31 10,23" fill="#38BDF8" stroke="#0284C7" strokeWidth="1.5" />
        <polygon points="32,18 49,24 32,30 15,24" fill="#0EA5E9" />
        {/* Button on top */}
        <circle cx="32" cy="23" r="2.5" fill="#FACC15" />
        {/* Golden Tassel */}
        <path d="M32 23 Q40 25 44 34 Q45 38 46 41" stroke="#FDE047" strokeWidth="2" strokeLinecap="round" fill="none" />
        <circle cx="46" cy="42" r="2" fill="#EAB308" />
      </svg>
    </div>
  );
}

// 2. 3D Gamepad Controller + Gold Trophy (Games Played)
export function GamepadTrophy3D({ className = "" }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <svg viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-[0_4px_12px_rgba(74,222,128,0.5)]">
        {/* Green 3D Controller Body */}
        <path
          d="M14 26 C14 18 24 16 35 16 C46 16 56 18 56 26 C56 38 52 52 46 52 C42 52 39 44 35 44 C31 44 28 52 24 52 C18 52 14 38 14 26 Z"
          fill="#22C55E"
          stroke="#16A34A"
          strokeWidth="2"
        />
        {/* Grip Highlights */}
        <ellipse cx="22" cy="38" rx="5" ry="9" fill="#4ADE80" opacity="0.6" />
        <ellipse cx="48" cy="38" rx="5" ry="9" fill="#4ADE80" opacity="0.6" />

        {/* D-PAD Left */}
        <rect x="23" y="27" width="5" height="13" rx="2" fill="#14532D" />
        <rect x="19" y="31" width="13" height="5" rx="2" fill="#14532D" />

        {/* Action Buttons Right (Colored diamonds) */}
        <circle cx="43" cy="33" r="2.5" fill="#FACC15" />
        <circle cx="49" cy="33" r="2.5" fill="#EF4444" />
        <circle cx="46" cy="29" r="2.5" fill="#3B82F6" />
        <circle cx="46" cy="37" r="2.5" fill="#A855F7" />

        {/* Center Logo */}
        <rect x="32" y="26" width="6" height="4" rx="2" fill="#14532D" />
      </svg>
    </div>
  );
}

// 3. 3D Flame + Star Calendar (Current Streak)
export function StreakFlameCalendar3D({ className = "" }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <svg viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-[0_4px_14px_rgba(251,146,60,0.6)]">
        {/* Outer Orange/Red Flame */}
        <path
          d="M35 8 C38 18 48 24 50 34 C53 46 44 56 34 56 C22 56 16 46 20 34 C21 31 24 28 25 24 C26 29 29 32 32 30 C34 26 31 16 35 8 Z"
          fill="#EA580C"
        />
        {/* Middle Amber Flame */}
        <path
          d="M35 18 C37 24 44 28 44 36 C45 44 39 50 33 50 C25 50 21 44 24 36 C25 34 27 31 28 29 C29 32 31 34 33 32 C34 29 33 22 35 18 Z"
          fill="#F59E0B"
        />
        {/* Inner Yellow Core */}
        <path
          d="M35 28 C36 32 40 34 40 39 C40 44 37 47 33 47 C29 47 27 44 28 39 C30 40 31 39 32 37 C33 35 34 30 35 28 Z"
          fill="#FEF08A"
        />
      </svg>
    </div>
  );
}

// 4. 3D Gold Star + Glowing Gift Box (Total XP)
export function XPStarGift3D({ className = "" }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <svg viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-[0_4px_14px_rgba(192,132,252,0.6)]">
        {/* 3D Radiant Golden Star */}
        <polygon
          points="35,10 42,25 58,27 46,39 49,55 35,47 21,55 24,39 12,27 28,25"
          fill="#FACC15"
          stroke="#EAB308"
          strokeWidth="1.5"
        />
        {/* Star Facet Highlights */}
        <polygon points="35,10 35,47 42,25" fill="#FEF08A" opacity="0.8" />
        <polygon points="35,47 46,39 58,27" fill="#CA8A04" opacity="0.7" />
        <polygon points="35,47 49,55 46,39" fill="#A16207" opacity="0.8" />
        <polygon points="35,10 35,47 28,25" fill="#FEF08A" opacity="0.9" />
        <polygon points="35,47 24,39 12,27" fill="#EAB308" opacity="0.6" />

        {/* Sparkling Center Diamond */}
        <circle cx="35" cy="33" r="3.5" fill="#FFFFFF" />
      </svg>
    </div>
  );
}

// 5. 3D Open Golden Treasure Chest with Coins & Gems (Recent Activity)
export function TreasureChest3D({ className = "" }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <svg viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-[0_8px_20px_rgba(234,179,8,0.5)]">
        {/* Golden Light Ray Halo */}
        <circle cx="60" cy="50" r="38" fill="#FACC15" opacity="0.2" />

        {/* Chest Lower Box */}
        <path d="M22 52 L98 52 L90 85 L30 85 Z" fill="#92400E" stroke="#78350F" strokeWidth="2.5" />
        {/* Gold Metal Trim Bands */}
        <rect x="24" y="52" width="10" height="32" fill="#FACC15" />
        <rect x="86" y="52" width="10" height="32" fill="#FACC15" />
        {/* Keyhole Padlock Plate */}
        <rect x="52" y="52" width="16" height="18" rx="4" fill="#FACC15" stroke="#CA8A04" strokeWidth="1.5" />
        <circle cx="60" cy="59" r="2.5" fill="#451A03" />
        <polygon points="59,59 61,59 62,65 58,65" fill="#451A03" />

        {/* Glowing Gold Coins Inside Overflowing */}
        <ellipse cx="60" cy="48" rx="34" ry="12" fill="#FACC15" />
        {/* Individual Coins */}
        {[
          { cx: 42, cy: 46, rx: 7, ry: 4 },
          { cx: 56, cy: 43, rx: 8, ry: 4.5 },
          { cx: 72, cy: 45, rx: 7, ry: 4 },
          { cx: 48, cy: 49, rx: 7, ry: 3.5 },
          { cx: 64, cy: 48, rx: 8, ry: 4 },
          { cx: 78, cy: 50, rx: 6, ry: 3 },
          { cx: 32, cy: 50, rx: 6, ry: 3 },
        ].map((c, i) => (
          <ellipse key={i} cx={c.cx} cy={c.cy} rx={c.rx} ry={c.ry} fill="#FEF08A" stroke="#CA8A04" strokeWidth="1" />
        ))}

        {/* Blue & Pink Gems nestled in coins */}
        <polygon points="50,42 54,38 52,44" fill="#38BDF8" />
        <polygon points="68,43 72,40 70,46" fill="#F472B6" />
        <polygon points="60,40 64,36 62,43" fill="#4ADE80" />

        {/* Chest Open Arched Lid (Tilted back) */}
        <path
          d="M18 48 C18 28 102 28 102 48 L96 52 C96 34 24 34 24 52 Z"
          fill="#B45309"
          stroke="#78350F"
          strokeWidth="2"
        />
        {/* Lid Gold Rim */}
        <path d="M18 48 L102 48 L98 52 L22 52 Z" fill="#FACC15" />
      </svg>
    </div>
  );
}
