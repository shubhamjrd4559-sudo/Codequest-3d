"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  BookOpen,
  Gamepad2,
  Code2,
  Trophy,
  Video,
  Settings,
  LogOut,
  UserRound,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

interface SidebarProps {
  className?: string;
  activeItem?: string;
}

export function Sidebar({ className, activeItem }: SidebarProps) {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();

  const navItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: Home,
      id: "dashboard",
    },
    {
      name: "My Learning",
      href: "/topics/arrays",
      icon: BookOpen,
      id: "learning",
    },
    {
      name: "Mini-Games",
      href: "/mini-games",
      icon: Gamepad2,
      id: "games",
    },
    {
      name: "Video Help",
      href: "/videos",
      icon: Video,
      id: "videos",
    },
    {
      name: "DSA Quiz",
      href: "/quizzes",
      icon: Code2,
      id: "quizzes",
    },
    {
      name: "Achievements",
      href: "/dashboard",
      icon: Trophy,
      id: "achievements",
    },
    {
      name: "Settings",
      href: "/dashboard",
      icon: Settings,
      id: "settings",
    },
  ];

  const getIsActive = (item: (typeof navItems)[0]) => {
    if (activeItem) return activeItem === item.id;
    if (item.href === "/dashboard" && pathname === "/dashboard") return true;
    if (item.id === "learning" && pathname.startsWith("/topics")) return true;
    if (item.id === "games" && pathname.startsWith("/mini-games")) return true;
    if (item.id === "videos" && pathname.startsWith("/videos")) return true;
    if (item.id === "quizzes" && pathname.startsWith("/quizzes")) return true;
    return false;
  };

  const level = user?.student_profile?.level ?? 1;
  const xp = user?.student_profile?.total_xp ?? 0;
  const displayXp = `${xp.toLocaleString()} XP`;

  return (
    <aside
      className={cn(
        "flex h-full min-h-0 w-64 flex-col justify-between overflow-y-auto overscroll-contain rounded-[28px]",
        "bg-[#0e112b]/90 backdrop-blur-2xl border border-purple-500/30 p-4 shadow-[0_0_35px_rgba(139,92,246,0.2)]",
        className
      )}
    >
      {/* Top Section: Logo & Nav Links */}
      <div className="space-y-6">
        {/* Brand Logo with Neon Gamepad */}
        <Link href="/" className="flex items-center gap-3 px-2 py-1 group">
          <div className="relative flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-400 via-blue-500 to-purple-600 shadow-[0_0_20px_rgba(6,182,212,0.6)] group-hover:scale-105 transition-transform p-0.5">
            <div className="w-full h-full rounded-[14px] bg-[#0c0e26] flex items-center justify-center">
              <Gamepad2 className="w-6 h-6 text-cyan-300" />
            </div>
          </div>
          <div>
            <span className="font-black text-xl tracking-tight text-white block leading-none">
              CodeQuest
            </span>
            <span className="text-xs font-black tracking-widest text-[#FACC15] block mt-0.5">
              3D
            </span>
          </div>
        </Link>

        {/* Navigation Menu */}
        <nav className="space-y-2 pt-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = getIsActive(item);

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "relative flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-black transition-all duration-200 select-none group",
                  isActive
                    ? "bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 text-white shadow-[0_0_25px_rgba(147,51,234,0.6)] border border-purple-300/40"
                    : "text-slate-300 hover:text-white hover:bg-white/[0.08]"
                )}
              >
                <Icon
                  className={cn(
                    "w-5 h-5 transition-transform duration-200 group-hover:scale-110",
                    isActive ? "text-white" : "text-slate-400 group-hover:text-purple-300"
                  )}
                />
                <span>{item.name}</span>
                {isActive && (
                  <div className="ml-auto w-2 h-2 rounded-full bg-white shadow-[0_0_10px_white]" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section: Level & XP Status Widget + Sign Out */}
      <div className="pt-4 border-t border-white/10 space-y-3">
        {/* Player Level Badge */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-purple-950/50 via-white/[0.04] to-indigo-950/40 border border-purple-400/30 shadow-glass-sm">
          <div className="flex items-center gap-3">
            {/* Glowing Avatar */}
            <div className="relative w-10 h-10 rounded-full p-0.5 bg-gradient-to-tr from-amber-300/80 via-violet-400/80 to-cyan-300/80">
              <div className="w-full h-full rounded-full bg-[#0c0e24] flex items-center justify-center overflow-hidden border border-white/20">
                <UserRound className="h-5 w-5 text-slate-100" aria-hidden="true" />
              </div>
            </div>
            <div>
              <p className="text-xs font-black text-white leading-none">
                Level {level}
              </p>
              <p className="text-[11px] font-bold text-amber-300 mt-0.5">
                {displayXp}
              </p>
            </div>
          </div>
        </div>

        {/* Sign out button */}
        {isAuthenticated && (
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-black text-rose-300 hover:text-white hover:bg-rose-500/20 border border-rose-500/30 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        )}
      </div>
    </aside>
  );
}
