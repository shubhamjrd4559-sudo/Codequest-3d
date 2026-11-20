"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, ArrowRight, Loader2, AlertCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/context/AuthContext";
import { RobotMascot } from "@/components/characters/RobotMascot";
import { AxiosError } from "axios";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setIsLoading(true);
    try {
      await login({ email, password });
      router.push("/dashboard");
    } catch (err: unknown) {
      if (err instanceof AxiosError && err.response?.data) {
        const data = err.response.data as Record<string, unknown>;
        const msg =
          typeof data.detail === "string"
            ? data.detail
            : typeof data.non_field_errors === "string"
            ? data.non_field_errors
            : Array.isArray(data.non_field_errors)
            ? data.non_field_errors.join(", ")
            : "Invalid email or password. Please try again.";
        setError(msg);
      } else {
        setError("Failed to connect to the authentication server.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoFill = () => {
    setEmail("hero@codequest.dev");
    setPassword("QuestPassword123!");
    setError(null);
  };

  return (
    <div className="relative rounded-[32px] bg-[#0e112b]/90 backdrop-blur-2xl border-2 border-purple-500/35 p-6 sm:p-8 shadow-[0_0_40px_rgba(139,92,246,0.3)] space-y-6">
      {/* Top Welcome Mascot */}
      <div className="flex items-center gap-4 border-b border-white/10 pb-5">
        <RobotMascot size="sm" className="w-16 h-20 shrink-0 drop-shadow-[0_0_15px_rgba(6,182,212,0.5)]" />
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-1.5">
            Welcome Back! <span className="text-xl">👋</span>
          </h1>
          <p className="text-xs font-semibold text-slate-300 mt-0.5">
            Log in to continue your DSA gaming quest.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-3.5 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs flex items-start gap-2.5 shadow-neon-pink">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
          <div className="flex-1 font-semibold">{error}</div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email Address"
          type="email"
          placeholder="your.email@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          leftIcon={<Mail className="w-4 h-4 text-cyan-400" />}
          autoComplete="email"
          required
        />

        <Input
          label="Password"
          type="password"
          placeholder="••••••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          leftIcon={<Lock className="w-4 h-4 text-purple-400" />}
          autoComplete="current-password"
          required
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full gap-2 font-black shadow-[0_0_25px_rgba(139,92,246,0.5)] mt-2 py-4 text-base"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Logging in...
            </>
          ) : (
            <>
              Log In to CodeQuest <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </>
          )}
        </Button>
      </form>

      {/* Demo Credentials Quick Fill */}
      <div className="pt-2 text-center">
        <button
          type="button"
          onClick={handleDemoFill}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-400/40 text-xs font-black text-cyan-300 hover:text-cyan-200 transition-all shadow-[0_0_15px_rgba(6,182,212,0.25)]"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Use Demo Account (hero@codequest.dev)
        </button>
      </div>

      {/* Bottom Switch Link */}
      <div className="pt-4 border-t border-white/10 text-center text-xs font-semibold text-slate-400">
        Don&apos;t have an account yet?{" "}
        <Link
          href="/register"
          className="font-black text-[#FACC15] hover:underline transition-colors"
        >
          Create Student Account
        </Link>
      </div>
    </div>
  );
}
