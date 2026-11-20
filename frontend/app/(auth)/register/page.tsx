"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, User as UserIcon, ArrowRight, Loader2, AlertCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/context/AuthContext";
import { RobotMascot } from "@/components/characters/RobotMascot";
import { AxiosError } from "axios";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password || !passwordConfirm) {
      setError("Please fill in all required fields.");
      return;
    }

    if (password !== passwordConfirm) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setIsLoading(true);
    try {
      await register({
        email,
        password,
        password_confirm: passwordConfirm,
        display_name: displayName || undefined,
      });
      router.push("/dashboard");
    } catch (err: unknown) {
      if (err instanceof AxiosError && err.response?.data) {
        const data = err.response.data as Record<string, unknown>;
        let errMsg = "Registration failed. Please check the inputs.";
        if (typeof data.detail === "string") {
          errMsg = data.detail;
        } else if (Array.isArray(data.email)) {
          errMsg = `Email: ${data.email.join(" ")}`;
        } else if (Array.isArray(data.password)) {
          errMsg = `Password: ${data.password.join(" ")}`;
        } else if (Array.isArray(data.non_field_errors)) {
          errMsg = data.non_field_errors.join(" ");
        } else {
          const firstKey = Object.keys(data)[0];
          if (firstKey && Array.isArray(data[firstKey])) {
            errMsg = `${firstKey}: ${(data[firstKey] as string[]).join(" ")}`;
          }
        }
        setError(errMsg);
      } else {
        setError("Failed to connect to the registration service.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 16, scale: 0.985 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.45, ease: "easeOut" }} className="relative rounded-[32px] bg-gradient-to-br from-[#171a3a]/95 via-[#0e112b]/95 to-[#11102c]/95 backdrop-blur-2xl border border-purple-300/30 p-6 sm:p-8 shadow-[0_0_48px_rgba(139,92,246,0.25),inset_0_1px_0_rgba(255,255,255,0.1)] space-y-6">
      {/* Top Mascot Header */}
      <div className="flex items-center gap-4 border-b border-white/10 pb-5">
        <RobotMascot size="sm" className="w-16 h-20 shrink-0 drop-shadow-[0_0_15px_rgba(6,182,212,0.5)]" />
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Join CodeQuest 3D
          </h1>
          <p className="text-xs font-semibold text-slate-300 mt-0.5 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-[#FACC15]" /> Start your DSA gaming adventure
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
          label="Display / Hero Name"
          type="text"
          placeholder="e.g. CodeKnight"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          leftIcon={<UserIcon className="w-4 h-4 text-purple-400" />}
          autoComplete="nickname"
        />

        <Input
          label="Email Address *"
          type="email"
          placeholder="student@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          leftIcon={<Mail className="w-4 h-4 text-cyan-400" />}
          autoComplete="email"
          required
        />

        <Input
          label="Password *"
          type="password"
          placeholder="Min. 8 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          leftIcon={<Lock className="w-4 h-4 text-purple-400" />}
          autoComplete="new-password"
          required
        />

        <Input
          label="Confirm Password *"
          type="password"
          placeholder="Repeat password"
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
          leftIcon={<Lock className="w-4 h-4 text-purple-400" />}
          autoComplete="new-password"
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
              Creating Quest Profile...
            </>
          ) : (
            <>
              Create Account <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </>
          )}
        </Button>
      </form>

      {/* Bottom Switch Link */}
      <div className="pt-4 border-t border-white/10 text-center text-xs font-semibold text-slate-400">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-black text-cyan-300 hover:underline transition-colors"
        >
          Log In Here
        </Link>
      </div>
    </motion.div>
  );
}
