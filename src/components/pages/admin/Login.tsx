'use client';

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import {
  Lock,
  ShieldAlert,
  LogIn,
  ArrowLeft,
  Eye,
  EyeOff,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "@/src/contexts/AuthContext";
import axios from "axios";

export default function AdminLogin() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();
  const { user, login, isAdmin, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      if (isAdmin) {
        router.replace("/admin");
      } else {
        setError("অ্যাক্সেস প্রত্যাখ্যান করা হয়েছে। আপনি একজন প্রশাসক নন।");
      }
    }
  }, [user, loading, isAdmin, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await axios.post("/api/auth/login", { username, password });
      if (response.data.success) {
        login(response.data.user);
      }
    } catch (err: any) {
      setError(
        err.response?.data?.error ||
          "সাইন ইন করতে ব্যর্থ হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।"
      );
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#fcfcfc] via-white to-[#f3f6fb] flex items-center justify-center px-4">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 rounded-full border-[3px] border-brand-primary/15 border-t-brand-primary animate-spin" />
          <p className="text-sm font-bold tracking-[0.18em] text-gray-500 uppercase">
            লোড হচ্ছে...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#fcfcfc] via-white to-[#f4f7fb] font-sans">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-10%] top-[-8%] h-[340px] w-[340px] rounded-full bg-brand-primary/10 blur-3xl" />
        <div className="absolute right-[-10%] bottom-[-10%] h-[320px] w-[320px] rounded-full bg-brand-accent/10 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-[220px] w-[220px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-primary/5 blur-3xl" />
      </div>

      {/* Grid */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.04] [background-image:linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] [background-size:42px_42px]" />

      {/* Floating accents */}
      <div className="pointer-events-none absolute left-10 top-28 hidden h-24 w-24 rounded-full border border-brand-primary/10 bg-white/40 blur-sm lg:block" />
      <div className="pointer-events-none absolute bottom-24 right-16 hidden h-20 w-20 rounded-3xl border border-brand-accent/10 bg-white/40 rotate-12 blur-sm lg:block" />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-5 py-14 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-xl"
        >
          {/* top badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.08, duration: 0.45 }}
            className="mb-6 flex justify-center"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-primary/10 bg-white/85 px-4 py-2 text-sm font-semibold text-brand-primary shadow-sm backdrop-blur-md">
              <Sparkles className="h-4 w-4 text-brand-accent" />
              সুরক্ষিত প্রশাসনিক প্রবেশ
            </div>
          </motion.div>

          {/* main card */}
          <div className="relative overflow-hidden rounded-[28px] border border-white/80 bg-white/90 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl">
            {/* soft overlays */}
            <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-brand-primary/5 to-transparent" />
            <div className="absolute right-0 top-0 h-28 w-28 rounded-bl-[40px] bg-brand-accent/5" />
            <div className="absolute bottom-0 left-0 h-24 w-24 rounded-tr-[34px] bg-brand-primary/5" />

            <div className="relative px-5 py-8 sm:px-8 sm:py-10">
              {/* header */}
              <div className="mb-8 text-center">
                <div className="relative mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-[30px] border border-white bg-gradient-to-br from-white via-[#fafafa] to-[#f3f6fb] shadow-[0_18px_45px_rgba(0,0,0,0.10)]">
                  <div className="absolute inset-0 rounded-[30px] bg-brand-primary/8 blur-xl" />
                  <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-primary/10">
                    <ShieldCheck className="h-7 w-7 text-brand-primary" />
                  </div>
                </div>

                <h1 className="text-3xl font-black tracking-tight text-brand-primary sm:text-4xl">
                  অ্যাডমিন লগইন
                </h1>

                <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-gray-600 sm:text-base">
                  আপনার প্রশাসনিক অ্যাকাউন্ট ব্যবহার করে নিরাপদভাবে ড্যাশবোর্ডে প্রবেশ করুন
                </p>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50/90 px-4 py-3 text-sm text-red-700"
                >
                  <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}

              <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-brand-primary">
                    ইউজারনেম
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="আপনার ইউজারনেম লিখুন"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full rounded-2xl border border-gray-200 bg-[#fcfcfd] px-4 py-4 text-[15px] text-gray-800 outline-none transition-all duration-300 placeholder:text-gray-400 focus:border-brand-primary/40 focus:bg-white focus:ring-4 focus:ring-brand-primary/10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-bold text-brand-primary">
                    পাসওয়ার্ড
                  </label>

                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="আপনার পাসওয়ার্ড লিখুন"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-2xl border border-gray-200 bg-[#fcfcfd] px-4 py-4 pr-14 text-[15px] text-gray-800 outline-none transition-all duration-300 placeholder:text-gray-400 focus:border-brand-primary/40 focus:bg-white focus:ring-4 focus:ring-brand-primary/10"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      aria-label={showPassword ? "পাসওয়ার্ড লুকান" : "পাসওয়ার্ড দেখান"}
                      className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-xl border border-transparent text-gray-500 transition-all duration-300 hover:border-gray-200 hover:bg-white hover:text-brand-primary"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* action buttons */}
                <div className="pt-3 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="group inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-brand-primary px-6 py-4 text-sm font-extrabold uppercase tracking-[0.16em] text-white shadow-[0_14px_30px_rgba(0,0,0,0.12)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isLoading ? (
                      <div className="h-5 w-5 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                    ) : (
                      <LogIn className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                    )}
                    {isLoading ? "প্রবেশ করা হচ্ছে..." : "লগইন করুন"}
                  </button>

                  <button
                    type="button"
                    onClick={() => router.push("/")}
                    className="group inline-flex w-full items-center justify-center gap-3 rounded-2xl border border-gray-200 bg-white px-6 py-4 text-sm font-extrabold uppercase tracking-[0.16em] text-brand-primary shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-primary/20 hover:bg-gray-50"
                  >
                    <ArrowLeft className="h-5 w-5 transition-transform duration-300 group-hover:-translate-x-1" />
                    ফিরে যান
                  </button>
                </div>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}