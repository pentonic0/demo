'use client';

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { supabasePublic } from "@/src/lib/supabase";
import { getSafeImageSrc } from "@/src/lib/image";

export default function LoadingScreen() {
  const [schoolInfo, setSchoolInfo] = useState({
    name: "Ideal High School & College",
    logo: "https://i.postimg.cc/xCKssmG3/aaghs.png",
  });

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const { data, error } = await supabasePublic
          .from("settings")
          .select("school_name, school_logo")
          .eq("id", "main")
          .single();

        if (!error && data) {
          setSchoolInfo({
            name: data.school_name || "Ideal High School & College",
            logo: getSafeImageSrc(
              data.school_logo,
              "https://i.postimg.cc/xCKssmG3/aaghs.png"
            ),
          });
        }
      } catch (e) {}
    };

    fetchInfo();
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] overflow-hidden bg-gradient-to-br from-brand-primary via-brand-primary to-slate-950 text-white">
      {/* Background blobs */}
      <div className="absolute inset-0">
        <motion.div
          animate={{ x: [0, 40, -20, 0], y: [0, -30, 20, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-80px] left-[-80px] h-72 w-72 rounded-full bg-brand-accent/20 blur-3xl"
        />
        <motion.div
          animate={{ x: [0, -30, 20, 0], y: [0, 20, -30, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[-100px] right-[-100px] h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl"
        />
        <motion.div
          animate={{ scale: [1, 1.06, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/5 blur-3xl"
        />
      </div>

      {/* subtle grid */}
      <div className="absolute inset-0 opacity-[0.05] [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [background-size:38px_38px]" />

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45 }}
          className="relative mb-8 flex h-44 w-44 items-center justify-center"
        >
          {/* glow */}
          <motion.div
            animate={{ scale: [1, 1.08, 1], opacity: [0.28, 0.5, 0.28] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 rounded-full bg-brand-accent/20 blur-2xl"
          />

          {/* only one outer ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full border-[3px] border-dashed border-brand-accent/75"
          />

          {/* logo */}
<div className="relative z-10 flex h-40 w-40 items-center justify-center">
  <img
    src={getSafeImageSrc(
      schoolInfo.logo,
      "https://i.postimg.cc/xCKssmG3/aaghs.png"
    )}
    alt="School Logo"
    className="h-full w-full object-contain"
    referrerPolicy="no-referrer"
  />
</div>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="max-w-2xl text-2xl font-bold tracking-tight text-white md:text-3xl"
        >
          {schoolInfo.name}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18, duration: 0.4 }}
          className="mt-3 text-sm text-white/70 md:text-base"
        >
          ডিজিটাল প্ল্যাটফর্ম প্রস্তুত করা হচ্ছে
        </motion.p>

        <motion.div
          animate={{ opacity: [0.45, 1, 0.45] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="mt-6 text-[11px] font-bold uppercase tracking-[0.35em] text-brand-accent"
        >
          লোড হচ্ছে
        </motion.div>
      </div>
    </div>
  );
}