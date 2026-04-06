'use client';

import { AlertTriangle, Clock3, Mail, Phone, Wrench } from "lucide-react";
import { useSettings } from "@/src/contexts/SettingsContext";

export default function MaintenancePage() {
  const { settings } = useSettings();

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#020617] text-white">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-[#0b1120] to-slate-900" />

        <div className="absolute inset-0 opacity-[0.05] [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [background-size:42px_42px]" />

        <div className="absolute -top-32 -left-32 h-80 w-80 rounded-full bg-red-500/20 blur-3xl" />
        <div className="absolute top-1/3 right-[-100px] h-96 w-96 rounded-full bg-orange-400/10 blur-3xl" />
        <div className="absolute -bottom-24 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-cyan-400/10 blur-3xl" />

        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),transparent_35%)]" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-10">
        <div className="w-full max-w-3xl overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl">
          {/* Top bar */}
          <div className="h-1.5 w-full bg-gradient-to-r from-red-600 via-orange-400 to-yellow-300" />

          <div className="px-6 py-10 text-center sm:px-10 md:px-14 md:py-14">
            {/* Icon */}
            <div className="mb-8 flex justify-center">
              <div className="relative flex h-28 w-28 items-center justify-center rounded-full border border-red-400/30 bg-red-500/10">
                <div className="absolute inset-0 rounded-full bg-red-500/20 blur-2xl" />
                <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-red-500/15 ring-1 ring-red-300/20">
                  <Wrench className="h-10 w-10 text-red-400" />
                </div>
              </div>
            </div>

            {/* Badge */}
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-red-400/20 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-300">
              <AlertTriangle className="h-4 w-4" />
              সাময়িক রক্ষণাবেক্ষণ চলছে
            </div>

            {/* Heading */}
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl">
              ওয়েবসাইট বর্তমানে
              <span className="block bg-gradient-to-r from-red-400 to-orange-300 bg-clip-text text-transparent">
                মেইনটেন্যান্স মোডে আছে
              </span>
            </h1>

            {/* Description */}
            <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base md:text-lg">
              দুঃখিত, আমাদের ওয়েবসাইটে বর্তমানে উন্নয়ন ও রক্ষণাবেক্ষণের কাজ চলছে।
              এই কারণে কিছু সময়ের জন্য সাইটটি ব্যবহার করা যাচ্ছে না। আমরা খুব দ্রুত
              সেবা পুনরায় চালু করব।
            </p>

            {/* Status box */}
            <div className="mx-auto mt-8 max-w-xl rounded-2xl border border-white/10 bg-black/20 p-4 sm:p-5">
              <div className="flex flex-col items-center justify-center gap-3 text-sm text-slate-300 sm:flex-row">
                <div className="flex items-center gap-2 font-medium text-white">
                  <Clock3 className="h-4 w-4 text-orange-300" />
                  <span>স্ট্যাটাস: আপডেট চলমান</span>
                </div>
                <div className="hidden h-4 w-px bg-white/10 sm:block" />
                <span>শীঘ্রই পুনরায় চালু হবে</span>
              </div>
            </div>

            {/* School + Contact */}
            <div className="mt-10 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-left">
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-slate-400">
                  প্রতিষ্ঠান
                </p>
                <h2 className="break-words text-lg font-bold text-white sm:text-xl">
                  {settings.schoolName}
                </h2>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-left">
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-slate-400">
                  যোগাযোগ
                </p>

                <div className="space-y-3 text-sm text-slate-300">
                  <div className="flex items-start gap-3">
                    <div className="rounded-lg bg-white/10 p-2">
                      <Phone className="h-4 w-4 text-red-300" />
                    </div>
                    <span className="break-all">{settings.contactPhone}</span>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="rounded-lg bg-white/10 p-2">
                      <Mail className="h-4 w-4 text-red-300" />
                    </div>
                    <span className="break-all">{settings.contactEmail}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer note */}
            <div className="mt-10 border-t border-white/10 pt-6 text-xs uppercase tracking-[0.28em] text-slate-500">
              আপনার ধৈর্যের জন্য ধন্যবাদ
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
