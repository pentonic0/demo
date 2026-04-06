'use client';

import Header from "./Header";
import Footer from "./Footer";
import NoticeTicker from "./NoticeTicker";
import { motion } from "motion/react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa] selection:bg-brand-accent selection:text-brand-primary font-sans">
      <Header />
      <NoticeTicker />
      <motion.main 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex-grow max-w-7xl mx-auto px-4 py-12 w-full"
      >
        {children}
      </motion.main>
      <Footer />
    </div>
  );
}
