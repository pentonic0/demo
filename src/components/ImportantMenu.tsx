'use client';

import Link from "next/link";
import { Users, UserCheck, FileText, Image, Phone, BookOpen, GraduationCap, ClipboardList, ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";

const menuItems = [
  { name: "শিক্ষক তালিকা", icon: Users, path: "/teachers", color: "bg-blue-500" },
  { name: "কর্মচারী তালিকা", icon: UserCheck, path: "/staff", color: "bg-emerald-500" },
  { name: "নোটিশ বোর্ড", icon: FileText, path: "/notice", color: "bg-rose-500" },
  { name: "ফটো গ্যালারি", icon: Image, path: "/gallery", color: "bg-violet-500" },
  { name: "যোগাযোগ", icon: Phone, path: "/contact", color: "bg-amber-500" },
  { name: "একাডেমিক", icon: BookOpen, path: "/academic", color: "bg-indigo-500" },
  { name: "ভর্তি", icon: GraduationCap, path: "/admission", color: "bg-pink-500" },
  { name: "ফলাফল", icon: ClipboardList, path: "/results", color: "bg-cyan-500" },
];

export default function ImportantMenu() {
  return (
    <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 overflow-hidden border border-gray-100 font-sans">
      <div className="bg-brand-primary text-white px-8 py-5 flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-[0.2em]">দ্রুত অ্যাক্সেস পোর্টাল</span>
        <div className="flex gap-1">
          <div className="w-1.5 h-1.5 bg-brand-accent rounded-full" />
          <div className="w-1.5 h-1.5 bg-brand-accent/50 rounded-full" />
          <div className="w-1.5 h-1.5 bg-brand-accent/20 rounded-full" />
        </div>
      </div>
      <div className="p-8 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-6">
        {menuItems.map((item, i) => (
          <motion.div
            key={item.name}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
          >
            <Link 
              href={item.path} 
              className="group flex flex-col items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100 relative"
            >
              <div className={`${item.color} text-white p-4 rounded-2xl group-hover:scale-110 group-hover:rotate-3 transition-all shadow-lg shadow-gray-200`}>
                <item.icon className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-black text-gray-500 text-center uppercase tracking-widest group-hover:text-brand-primary transition-colors">
                {item.name}
              </span>
              <ArrowUpRight className="absolute top-2 right-2 w-3 h-3 text-gray-300 opacity-0 group-hover:opacity-100 transition-all" />
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
