"use client";

import * as React from "react";
import Link from "next/link";
import { Bell, Search, Gamepad2, Sparkles } from "lucide-react";
import { Button } from "./Button";
import { cn } from "@/lib/utils";

interface NavigationBarProps {
  isPublic?: boolean;
  className?: string;
  onSearchChange?: (val: string) => void;
}

export function NavigationBar({ isPublic = false, className }: NavigationBarProps) {
  return (
    <header
      className={cn(
        "w-full h-18 rounded-3xl bg-[#0e112b]/70 backdrop-blur-2xl border border-white/10 px-6 flex items-center justify-between shadow-glass-md",
        className
      )}
    >
      {/* Brand logo (visible on public or mobile) */}
      <div className="flex items-center gap-6">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-500 shadow-neon-purple group-hover:scale-105 transition-transform">
            <Gamepad2 className="w-5 h-5 text-white" />
          </div>
          <div className={cn(isPublic ? "block" : "hidden md:block")}>
            <span className="font-extrabold text-lg text-white">CodeQuest</span>{" "}
            <span className="font-extrabold text-lg bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              3D
            </span>
          </div>
        </Link>

        {isPublic && (
          <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold text-slate-300">
            <Link href="#features" className="hover:text-purple-300 transition-colors">
              Features
            </Link>
            <Link href="#how-it-works" className="hover:text-purple-300 transition-colors">
              How It Works
            </Link>
            <Link href="/dashboard" className="hover:text-purple-300 transition-colors">
              Interactive Dashboard
            </Link>
            <Link href="/topics/arrays" className="hover:text-purple-300 transition-colors">
              DSA Quest
            </Link>
          </nav>
        )}
      </div>

      {/* Middle search bar (for dashboard mode) */}
      {!isPublic && (
        <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search topics, algorithms, 3D mini-games..."
              className="w-full h-11 pl-11 pr-4 rounded-2xl bg-white/[0.05] border border-white/10 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:border-purple-500/50 focus:bg-white/[0.08] transition-all"
            />
          </div>
        </div>
      )}

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {isPublic ? (
          <div className="flex items-center gap-3">
            <Link href="/dashboard">
              <Button variant="secondary" size="sm">
                Explore Demo
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="primary" size="sm">
                <Sparkles className="w-3.5 h-3.5 mr-1" />
                Launch Quest
              </Button>
            </Link>
          </div>
        ) : (
          <>
            {/* Notification Bell */}
            <button
              aria-label="Notifications"
              className="relative p-2.5 rounded-2xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-slate-300 hover:text-white transition-colors"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white text-[10px] font-bold flex items-center justify-center shadow-neon-pink">
                2
              </span>
            </button>

            {/* User Avatar with Glowing Ring */}
            <Link
              href="/dashboard"
              className="flex items-center gap-3 pl-2 group"
            >
              <div className="relative w-10 h-10 rounded-2xl p-0.5 bg-gradient-to-tr from-cyan-400 via-purple-500 to-pink-500 shadow-neon-purple group-hover:scale-105 transition-transform">
                <div className="w-full h-full rounded-[14px] bg-[#0c0e24] flex items-center justify-center overflow-hidden">
                  <span className="font-extrabold text-sm text-transparent bg-clip-text bg-gradient-to-br from-amber-200 to-amber-500">
                    S
                  </span>
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-[#0c0e24] shadow-[0_0_8px_#10B981]" />
              </div>
              <div className="hidden xl:block text-left">
                <p className="text-xs font-bold text-white leading-tight">Shubham</p>
                <p className="text-[10px] font-medium text-purple-300">Level 12 Warrior</p>
              </div>
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
