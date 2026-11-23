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
  Award,
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
      name: "Leaderboard",
      href: "/leaderboard",
      icon: Trophy,
      id: "leaderboard",
    },
    {
      name: "Achievements",
      href: "/achievements",
      icon: Award,
      id: "achievements",
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
      name: "Profile",
      href: "/profile",
      icon: UserRound,
      id: "profile",
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
    if (item.id === "profile" && pathname.startsWith("/profile")) return true;
    if (item.id === "leaderboard" && pathname.startsWith("/leaderboard")) return true;
    if (item.id === "achievements" && pathname.startsWith("/achievements")) return true;
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
        "flex w-full min-w-0 flex-row items-center justify-between gap-3 rounded-[24px]",
        "bg-[#0e112b]/90 backdrop-blur-2xl border border-purple-500/30 px-3 py-2.5 md:px-4 shadow-[0_0_35px_rgba(139,92,246,0.2)]",
        className
      )}
    >
      {/* Top Section: Logo & Nav Links */}
      <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
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
        <nav aria-label="Main navigation" className="flex min-w-0 items-center gap-1 overflow-x-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = getIsActive(item);

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "relative flex shrink-0 items-center gap-2 rounded-xl px-2.5 py-2.5 text-sm font-black transition-all duration-200 select-none group xl:gap-2.5 xl:px-3",
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
                <span className="hidden 2xl:inline">{item.name}</span>
                {isActive && (
                  <div className="ml-auto w-2 h-2 rounded-full bg-white shadow-[0_0_10px_white]" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section: Level & XP Status Widget + Sign Out */}
      <div className="flex shrink-0 items-center gap-2 border-l border-white/10 pl-3">
        {/* Player Level Badge */}
        <Link
          href="/profile"
          className="rounded-2xl bg-gradient-to-br from-purple-950/50 via-white/[0.04] to-indigo-950/40 border border-purple-400/30 p-2 shadow-glass-sm hover:border-purple-400/60 transition-colors"
          title="View Profile & Activity Heatmap"
        >
          <div className="flex items-center gap-2">
            {/* Glowing Avatar */}
            <div className="relative h-9 w-9 rounded-full p-0.5 bg-gradient-to-tr from-amber-300/80 via-violet-400/80 to-cyan-300/80">
              <div className="w-full h-full rounded-full bg-[#0c0e24] flex items-center justify-center overflow-hidden border border-white/20">
                <UserRound className="h-5 w-5 text-slate-100" aria-hidden="true" />
              </div>
            </div>
            <div className="hidden 2xl:block">
              <p className="text-xs font-black text-white leading-none">
                Level {level}
              </p>
              <p className="text-[11px] font-bold text-amber-300 mt-0.5">
                {displayXp}
              </p>
            </div>
          </div>
        </Link>

        {/* Sign out button */}
        {isAuthenticated && (
          <button
            onClick={logout}
            aria-label="Sign out"
            title="Sign out"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-rose-500/30 text-rose-300 transition-colors hover:bg-rose-500/20 hover:text-white"
          >
            <LogOut className="h-4 w-4" />
          </button>
        )}
      </div>
    </aside>
  );
}
