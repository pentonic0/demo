'use client';

import Link from "next/link";
import { useSettings } from "@/src/contexts/SettingsContext";
import { motion } from "motion/react";
import { Quote, ArrowRight } from "lucide-react";
import { getSafeImageSrc } from "@/src/lib/image";

export default function PrincipalCard() {
  const { settings } = useSettings();

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 overflow-hidden border border-gray-100"
    >
      <div className="bg-brand-primary text-white px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-between">
        অধ্যক্ষের বাণী
        <Quote className="w-4 h-4 opacity-20" />
      </div>
      <div className="p-8 text-center">
        <div className="w-32 h-40 mx-auto bg-gray-50 rounded-xl overflow-hidden mb-6 shadow-inner border border-gray-100">
          <img 
            src={getSafeImageSrc(settings.principalImage)} 
            alt={settings.principalName} 
            className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
            referrerPolicy="no-referrer"
          />
        </div>
        <h4 className="text-lg font-serif font-bold text-brand-primary leading-tight mb-1">{settings.principalName}</h4>
        <p className="text-[10px] text-gray-400 font-bold mb-6 uppercase tracking-widest">অধ্যক্ষ, {settings.schoolName}</p>
        <div className="relative">
          <Quote className="absolute -top-2 -left-2 w-8 h-8 text-brand-accent/10 -z-10" />
          <p className="text-sm text-gray-500 text-justify line-clamp-6 leading-relaxed italic font-medium">
            "{settings.principalMessage}"
          </p>
        </div>
        <Link 
          href="/principal-message" 
          className="inline-flex items-center gap-2 mt-8 text-xs font-black uppercase tracking-widest text-brand-accent hover:text-brand-primary transition-all group"
        >
          পুরো বাণী পড়ুন
          <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </motion.div>
  );
}
