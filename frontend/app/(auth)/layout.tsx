"use client";

import React, { ReactNode } from "react";
import Link from "next/link";
import { Gamepad2 } from "lucide-react";
import { FloatingIsland } from "@/components/characters/FloatingIsland";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-[100dvh] bg-[#070814] text-slate-100 flex flex-col justify-center items-center gap-1 px-4 py-6 relative overflow-hidden">
      {/* Background Nebulae & Cosmic Starfield */}
      <div className="fixed -top-20 -left-20 w-[60vw] h-[60vw] rounded-full bg-purple-700/25 blur-[150px] pointer-events-none -z-10" />
      <div className="fixed -bottom-20 -right-20 w-[60vw] h-[60vw] rounded-full bg-cyan-600/20 blur-[160px] pointer-events-none -z-10" />
      <div className="fixed top-1/3 left-1/4 w-[40vw] h-[40vw] rounded-full bg-pink-600/15 blur-[140px] pointer-events-none -z-10" />

      {/* Floating Castle Islands in Background */}
      <div className="fixed top-4 right-[-5%] w-96 h-80 pointer-events-none opacity-40 -z-10 hidden sm:block">
        <FloatingIsland />
      </div>
      <div className="fixed bottom-6 left-[-5%] w-80 h-72 pointer-events-none opacity-30 -z-10 hidden sm:block">
        <FloatingIsland />
      </div>

      {/* Floating Header Logo */}
      <div className="mb-4 z-10 text-center">
        <Link href="/" className="inline-flex items-center gap-3 group">
          <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-cyan-400 via-blue-500 to-purple-600 p-0.5 shadow-[0_0_25px_rgba(6,182,212,0.6)] group-hover:scale-105 transition-transform">
            <div className="w-12 h-12 rounded-[14px] bg-[#0c0e26] flex items-center justify-center">
              <Gamepad2 className="w-7 h-7 text-cyan-300" />
            </div>
          </div>
          <div className="text-left">
            <span className="font-black text-2xl tracking-tight text-white block">
              CodeQuest <span className="text-[#FACC15]">3D</span>
            </span>
            <span className="text-[11px] tracking-widest text-cyan-300 uppercase font-black block">
              3D DSA Gaming Platform
            </span>
          </div>
        </Link>
      </div>

      {/* Form Container */}
      <div className="w-full max-w-md z-10">{children}</div>

      {/* Back to Home Link */}
      <div className="mt-4 text-center text-xs font-bold text-slate-400 z-10">
        <Link href="/" className="hover:text-purple-300 transition-colors">
          ← Back to CodeQuest 3D Home
        </Link>
      </div>
    </div>
  );
}
