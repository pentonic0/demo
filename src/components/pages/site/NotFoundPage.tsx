'use client';

import { motion } from "motion/react";
import Link from "next/link";
import {
  Home,
  ArrowLeft,
  Search,
  AlertTriangle,
  Sparkles,
} from "lucide-react";

export default function NotFound() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#fcfcfc] via-white to-[#f5f7fb] font-sans">
      {/* Soft background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-8%] top-[-10%] h-[320px] w-[320px] rounded-full bg-brand-primary/10 blur-3xl animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-8%] h-[320px] w-[320px] rounded-full bg-brand-accent/10 blur-3xl animate-pulse delay-700" />
        <div className="absolute left-1/2 top-1/2 h-[220px] w-[220px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-accent/5 blur-3xl" />
      </div>

      {/* Subtle grid */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.05] [background-image:linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] [background-size:40px_40px]" />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-3xl text-center"
        >
          {/* Top badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-primary/10 bg-white/80 px-4 py-2 text-sm font-semibold text-brand-primary shadow-sm backdrop-blur"
          >
            <Sparkles className="h-4 w-4 text-brand-accent" />
            দুঃখিত, এই পৃষ্ঠাটি পাওয়া যায়নি
          </motion.div>

          {/* Main card */}
          <div className="relative overflow-hidden rounded-[32px] border border-white/70 bg-white/80 px-6 py-12 shadow-[0_20px_80px_rgba(0,0,0,0.08)] backdrop-blur-xl md:px-12 md:py-16">
            {/* Decorative corners */}
            <div className="absolute left-0 top-0 h-24 w-24 rounded-br-[40px] bg-brand-primary/5" />
            <div className="absolute bottom-0 right-0 h-24 w-24 rounded-tl-[40px] bg-brand-accent/5" />

            <div className="relative">
              {/* 404 display */}
              <div className="relative mx-auto mb-10 w-fit">
                <h1 className="select-none text-[110px] font-black leading-none tracking-[-0.06em] text-brand-primary/10 md:text-[180px]">
                  404
                </h1>


              </div>

              {/* Text */}
              <div className="mx-auto max-w-2xl">
                <h2 className="text-3xl font-black tracking-tight text-brand-primary md:text-5xl">
                  পৃষ্ঠাটি{" "}
                  <span className="text-brand-accent">খুঁজে পাওয়া যায়নি</span>
                </h2>

                <p className="mx-auto mt-5 max-w-xl text-base leading-8 text-gray-600 md:text-lg">
                  আপনি যে পৃষ্ঠাটি খুঁজছেন সেটি হয়তো সরানো হয়েছে, নাম পরিবর্তন করা হয়েছে,
                  অথবা ঠিকানাটি ভুল লেখা হয়েছে।
                </p>
              </div>

              {/* Action buttons */}
              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link
                  href="/"
                  className="group inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-brand-primary px-7 py-4 text-sm font-extrabold uppercase tracking-[0.18em] text-white shadow-xl transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-primary/90 hover:shadow-brand-primary/20 sm:w-auto"
                >
                  <Home className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                  হোমে ফিরে যান
                </Link>

                <button
                  onClick={() => window.history.back()}
                  className="group inline-flex w-full items-center justify-center gap-3 rounded-2xl border border-gray-200 bg-white px-7 py-4 text-sm font-extrabold uppercase tracking-[0.18em] text-brand-primary shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-50 sm:w-auto"
                >
                  <ArrowLeft className="h-5 w-5 transition-transform duration-300 group-hover:-translate-x-1" />
                  আগের পাতায় যান
                </button>
              </div>

              {/* Bottom helper */}
              <div className="mt-12 border-t border-gray-100 pt-6">
                <div className="inline-flex items-center justify-center gap-2 rounded-full bg-gray-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-gray-500">
                  <Search className="h-4 w-4" />
                  সঠিক লিংক বা মেনু থেকে আবার চেষ্টা করুন
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
