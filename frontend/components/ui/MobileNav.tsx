"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Gamepad2, Trophy, User } from "lucide-react";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const pathname = usePathname();

  const navItems = [
    { name: "Home", href: "/dashboard", icon: Home },
    { name: "Play", href: "/topics/arrays", icon: Gamepad2 },
    { name: "Leaderboard", href: "/dashboard", icon: Trophy },
    { name: "Profile", href: "/dashboard", icon: User },
  ];

  return (
    <nav className="md:hidden fixed bottom-4 inset-x-4 z-50">
      <div className="h-16 rounded-3xl bg-[#0e112b]/90 backdrop-blur-2xl border border-white/15 px-4 flex items-center justify-around shadow-glass-lg">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            (item.href === "/dashboard" && pathname === "/dashboard" && item.name === "Home") ||
            (item.href.startsWith("/topics") && pathname.startsWith("/topics") && item.name === "Play");

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "relative flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all duration-200",
                isActive ? "text-white" : "text-slate-400 hover:text-slate-200"
              )}
            >
              {isActive && (
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 shadow-neon-purple -z-10" />
              )}
              <Icon className="w-5 h-5 mb-0.5" />
              <span className="text-[10px] font-bold tracking-tight">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
