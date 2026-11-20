"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  Eye,
  Gamepad2,
  Trophy,
  Layers,
  Code2,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { NavigationBar } from "@/components/ui/NavigationBar";
import { BoyCharacter } from "@/components/characters/BoyCharacter";
import { RobotMascot } from "@/components/characters/RobotMascot";
import { FloatingIsland } from "@/components/characters/FloatingIsland";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#070814] text-slate-100 flex flex-col relative overflow-hidden">
      {/* Background Ambient Nebulae */}
      <div className="fixed top-[-15%] left-[-10%] w-[55vw] h-[55vw] rounded-full bg-purple-700/15 blur-[140px] pointer-events-none -z-10" />
      <div className="fixed bottom-[-15%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-cyan-600/10 blur-[150px] pointer-events-none -z-10" />
      <div className="fixed top-[45%] right-[25%] w-[40vw] h-[40vw] rounded-full bg-pink-600/10 blur-[150px] pointer-events-none -z-10" />

      {/* Floating Public Navigation Bar */}
      <div className="max-w-7xl w-full mx-auto p-4 sm:p-6 z-20">
        <NavigationBar isPublic={true} />
      </div>

      {/* ================= HERO SECTION ================= */}
      <section className="relative px-4 sm:px-6 pt-10 pb-20 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center min-h-[520px]">

          {/* LEFT COLUMN: Headline + CTAs + Feature pills */}
          <div className="flex flex-col items-start text-left space-y-6 z-10">
            {/* Glow Tag */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/15 border border-purple-400/30 text-purple-300 text-xs sm:text-sm font-bold shadow-neon-purple backdrop-blur-xl"
            >
              <Sparkles className="w-4 h-4 text-amber-300 animate-spin" style={{ animationDuration: "10s" }} />
              The 2026 Evolution of CS Learning
            </motion.div>

            {/* Hero Headline — matches reference "Learn DSA. Play. Progress. Win." */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1]"
            >
              Learn{" "}
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                DSA.
              </span>
              <br />
              Play.{" "}
              <span className="bg-gradient-to-r from-amber-300 to-orange-400 bg-clip-text text-transparent">
                Progress.
              </span>
              {" "}Win.
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed"
            >
              An immersive 3D platform to master Data Structures &amp; Algorithms through
              interactive games and challenges. Level up your coding skills the fun way.
            </motion.p>

            {/* Feature pills */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="flex flex-wrap items-center gap-3"
            >
              <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white/[0.06] border border-white/10 text-xs font-semibold text-slate-200">
                <Layers className="w-4 h-4 text-purple-400" />
                DSA Topics
              </div>
              <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white/[0.06] border border-white/10 text-xs font-semibold text-slate-200">
                <Gamepad2 className="w-4 h-4 text-cyan-400" />
                3D Mini-Games
              </div>
              <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white/[0.06] border border-white/10 text-xs font-semibold text-slate-200">
                <Trophy className="w-4 h-4 text-amber-400" />
                Earn Achievements
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-2"
            >
              <Link href="/dashboard">
                <Button variant="primary" size="lg" className="gap-2 px-8 font-bold shadow-neon-purple text-base">
                  Start Learning <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="/topics/arrays">
                <Button variant="secondary" size="lg" className="gap-2 px-7 text-base">
                  <Eye className="w-5 h-5 text-cyan-400" /> Watch Demo
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* RIGHT COLUMN: Characters + floating island */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative flex items-end justify-center h-[380px] lg:h-[480px] select-none pointer-events-none"
          >
            {/* Floating Island in background */}
            <FloatingIsland className="absolute inset-0 w-full h-full" />

            {/* Ambient glow */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-72 h-20 rounded-full bg-purple-600/25 blur-2xl" />

            {/* Robot mascot — left of boy */}
            <div className="absolute bottom-6 left-[8%] w-28 lg:w-36 z-20">
              <RobotMascot size="md" />
            </div>

            {/* Boy character — center-right, taller */}
            <div className="absolute bottom-0 right-[10%] w-44 lg:w-56 z-20">
              <BoyCharacter />
            </div>
          </motion.div>
        </div>

        {/* "Why Choose CodeQuest 3D?" sub-label */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center mt-20 mb-4"
        >
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">
            Why Choose CodeQuest 3D?
          </h2>
        </motion.div>

      </section>

      {/* ================= FEATURES SECTION (3-COL) ================= */}
      <section id="features" className="px-4 sm:px-6 py-20 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <Badge variant="cyan" size="md">
            Built For Serious Learners &amp; Gamers
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Why Learn DSA with CodeQuest 3D?
          </h2>
          <p className="text-sm sm:text-base text-slate-400">
            A scientifically designed visual-first curriculum combining gamification with interview-level rigor.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <Card variant="glowPurple" className="group p-7 space-y-4 transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(139,92,246,0.2)]">
            <div className="w-14 h-14 rounded-2xl bg-purple-600/20 border border-purple-400/30 flex items-center justify-center text-purple-300 shadow-neon-purple">
              <Layers className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight">
              Interactive 3D Visualizations
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Step inside arrays, trees, and linked lists. Rotate stages, inspect
              memory addresses in real-time, and watch pointers leap across contiguous blocks.
            </p>
          </Card>

          {/* Feature 2 */}
          <Card variant="glowCyan" className="group p-7 space-y-4 transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(6,182,212,0.2)]">
            <div className="w-14 h-14 rounded-2xl bg-cyan-600/20 border border-cyan-400/30 flex items-center justify-center text-cyan-300 shadow-neon-cyan">
              <Gamepad2 className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight">
              Gamified Arcade Mini-Games
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Solve algorithmic bottlenecks through arcade challenges: Number block
              runs, stack tower balancing, and binary search obstacle courses that cement logic.
            </p>
          </Card>

          {/* Feature 3 */}
          <Card variant="glowAmber" className="group p-7 space-y-4 transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(245,158,11,0.2)]">
            <div className="w-14 h-14 rounded-2xl bg-amber-600/20 border border-amber-400/30 flex items-center justify-center text-amber-300 shadow-neon-amber">
              <Trophy className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight">
              Global XP &amp; Streaks
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Earn XP for every problem solved, climb weekly league tables, maintain
              daily streaks, and unlock legendary character cosmetic skins and badges.
            </p>
          </Card>
        </div>
      </section>

      {/* ================= HOW IT WORKS SECTION ================= */}
      <section id="how-it-works" className="px-4 sm:px-6 py-20 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <Badge variant="purple" size="md">
            The Quest Blueprint
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            How You Master Every DSA Topic
          </h2>
          <p className="text-sm sm:text-base text-slate-400">
            A 4-step progressive mastery cycle engineered for deep retention and real-world interview confidence.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            {
              step: "01",
              title: "Learn Theory",
              desc: "Crisp architectural summaries, Big-O complexities, and memory representations.",
              icon: BookOpen,
              color: "text-purple-400",
            },
            {
              step: "02",
              title: "Interact in 3D",
              desc: "Step through algorithms operation-by-operation with live memory visualization.",
              icon: Eye,
              color: "text-cyan-400",
            },
            {
              step: "03",
              title: "Play Mini-Games",
              desc: "Reinforce intuition through fun, gamified challenges that test edge cases.",
              icon: Gamepad2,
              color: "text-amber-400",
            },
            {
              step: "04",
              title: "Code in C++ & Python",
              desc: "Write production implementations with instant compiler checks and XP rewards.",
              icon: Code2,
              color: "text-emerald-400",
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="p-6 rounded-3xl bg-white/[0.04] border border-white/10 backdrop-blur-xl space-y-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] hover:-translate-y-1 hover:bg-white/[0.07] hover:border-purple-400/40 hover:shadow-[0_16px_36px_rgba(124,58,237,0.14)] transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black text-white/20 font-mono">
                    {item.step}
                  </span>
                  <Icon className={`w-6 h-6 ${item.color}`} />
                </div>
                <h4 className="text-lg font-bold text-white">{item.title}</h4>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ================= CALL TO ACTION BANNER ================= */}
      <section className="px-4 sm:px-6 py-20 max-w-7xl mx-auto w-full">
        <div className="rounded-3xl bg-gradient-to-r from-purple-950/60 via-indigo-950/70 to-pink-950/60 border border-purple-500/40 p-8 sm:p-12 text-center space-y-6 shadow-neon-purple relative overflow-hidden backdrop-blur-2xl">
          <div className="absolute -right-10 -bottom-10 w-64 h-64 rounded-full bg-cyan-500/20 blur-3xl pointer-events-none" />
          <div className="absolute -left-10 -top-10 w-64 h-64 rounded-full bg-purple-500/20 blur-3xl pointer-events-none" />

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight max-w-3xl mx-auto">
            Ready to Level Up Your DSA Skills in 3D?
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto">
            Join the quest today. Build algorithmic intuition, master technical interviews, and have a blast while doing it.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/dashboard">
              <Button variant="amber" size="lg" className="px-8 font-bold shadow-neon-amber">
                Start Learning Free <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/topics/arrays">
              <Button variant="secondary" size="lg" className="px-7">
                Explore Topic Catalog
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="mt-auto border-t border-white/10 py-8 px-4 sm:px-6 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 CodeQuest 3D. All rights reserved. Built for 2026 gaming education.</p>
          <div className="flex items-center gap-6 font-medium">
            <Link href="/dashboard" className="hover:text-purple-400 transition-colors">
              Student Dashboard
            </Link>
            <Link href="/topics/arrays" className="hover:text-purple-400 transition-colors">
              Arrays Topic
            </Link>
            <Link href="#" className="hover:text-purple-400 transition-colors">
              Privacy
            </Link>
            <Link href="#" className="hover:text-purple-400 transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
