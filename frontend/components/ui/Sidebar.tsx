"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  Gamepad2,
  Trophy,
  Award,
  Settings,
  Crown,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  className?: string;
  activeItem?: string;
}

export function Sidebar({ className, activeItem }: SidebarProps) {
  const pathname = usePathname();

  const navItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
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
      href: "/dashboard",
      icon: Gamepad2,
      id: "games",
    },
    {
      name: "Leaderboard",
      href: "/dashboard",
      icon: Trophy,
      id: "leaderboard",
    },
    {
      name: "Achievements",
      href: "/dashboard",
      icon: Award,
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
    if (item.href.startsWith("/topics") && pathname.startsWith("/topics")) return true;
    return false;
  };

  return (
    <aside
      className={cn(
        "flex flex-col justify-between w-64 min-h-[calc(100vh-2.5rem)] rounded-3xl",
        "bg-[#0e112b]/80 backdrop-blur-2xl border border-white/10 p-5 shadow-glass-lg",
        className
      )}
    >
      {/* Top Section: Logo & Nav Links */}
      <div className="space-y-6">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 px-2 py-1 group">
          <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-500 shadow-neon-purple group-hover:scale-105 transition-transform">
            <Gamepad2 className="w-6 h-6 text-white" />
            <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div>
            <span className="font-extrabold text-lg tracking-tight text-white block leading-none">
              CodeQuest
            </span>
            <span className="text-xs font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              3D PLATFORM
            </span>
          </div>
        </Link>

        {/* Navigation Menu */}
        <nav className="space-y-1.5 pt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = getIsActive(item);

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "relative flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 select-none group",
                  isActive
                    ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-neon-purple border border-purple-400/40"
                    : "text-slate-400 hover:text-white hover:bg-white/[0.06]"
                )}
              >
                <Icon
                  className={cn(
                    "w-5 h-5 transition-transform duration-200 group-hover:scale-110",
                    isActive ? "text-white" : "text-slate-400 group-hover:text-purple-400"
                  )}
                />
                <span>{item.name}</span>
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_white]" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section: Level & XP Status Widget */}
      <div className="pt-4 border-t border-white/10 space-y-3">
        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-purple-950/40 via-white/[0.03] to-indigo-950/30 border border-purple-500/20 shadow-glass-sm group hover:border-purple-400/40 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center shadow-neon-amber text-slate-950">
                <Crown className="w-4 h-4 fill-slate-950 text-slate-950" />
              </div>
              <div>
                <p className="text-xs font-bold text-white leading-none">Level 12</p>
                <p className="text-[11px] font-medium text-amber-300">3200 XP</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
          </div>
          {/* Progress bar */}
          <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-400 via-orange-400 to-pink-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]"
              style={{ width: "65%" }}
            />
          </div>
        </div>
      </div>
    </aside>
  );
}
