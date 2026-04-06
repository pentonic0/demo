'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Phone, Mail, Clock, Globe, Search, User, Languages } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { useSettings } from "@/src/contexts/SettingsContext";
import { getSafeImageSrc } from "@/src/lib/image";
import { useLanguage } from "@/src/contexts/LanguageContext";
import { motion, AnimatePresence } from "motion/react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const { settings } = useSettings();
  const { language, setLanguage, t } = useLanguage();

  const navItems = [
    { name: t("home"), path: "/" },
    { name: t("notice"), path: "/notice" },
    { name: t("academic"), path: "/academic" },
    { name: t("teachers"), path: "/teachers" },
    { name: t("committee"), path: "/committee" },
    { name: t("gallery"), path: "/gallery" },
    { name: t("contact"), path: "/contact" },
    { name: t("admission"), path: "/admission", highlight: true },
  ];

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header className="w-full font-sans">
      {/* Top Info Bar - More Minimal */}
      <div className="bg-brand-primary text-white/90 py-2 px-4 text-[10px] sm:text-xs font-medium tracking-wider uppercase">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2">
              <span className="opacity-60">স্কুল কোড:</span> {settings.schoolCode}
            </span>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4">
              <a href={`tel:${settings.contactPhone}`} className="flex items-center gap-2 hover:text-white transition-colors">
                <Phone className="w-3 h-3 opacity-60" />
                {settings.contactPhone}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Banner - Elegant Typography */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-full flex items-center justify-center shadow-xl border border-gray-100 overflow-hidden p-1"
            >
              {settings.schoolLogo ? (
                <img 
                  src={getSafeImageSrc(settings.schoolLogo)} 
                  alt="School Logo" 
                  className="w-full h-full object-contain rounded-full"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-full h-full bg-brand-primary/5 rounded-full flex items-center justify-center">
                  <Globe className="w-10 h-10 text-brand-primary/20" />
                </div>
              )}
            </motion.div>
            <div>
              <motion.h1 
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className={cn(
                  "text-2xl sm:text-4xl font-bold text-brand-primary leading-tight tracking-tight font-bangla"
                )}
              >
                {settings.schoolName || t("loading")}
              </motion.h1>
              <motion.p 
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-xs sm:text-sm text-gray-500 font-medium mt-1 flex items-center gap-2"
              >
                <span className="text-brand-accent font-bold">স্থাপিত {settings.establishedYear}</span>
                <span className="w-1 h-1 bg-gray-300 rounded-full" />
                <span className="italic">{settings.location}</span>
              </motion.p>
            </div>
          </div>
          
          <div className="hidden lg:flex items-center gap-4">
            <Link 
              href="/admin/login" 
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-brand-primary transition-colors"
            >
              <User className="w-4 h-4" />
              {t("admin_login")}
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation Menu - Sticky & Modern */}
      <nav className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        isScrolled ? "bg-brand-primary/95 backdrop-blur-md shadow-lg py-0" : "bg-brand-secondary py-1"
      )}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-14">
            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center gap-1 h-full">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={cn(
                    "px-4 h-10 flex items-center text-[11px] font-bold uppercase tracking-widest transition-all rounded-md",
                    pathname === item.path 
                      ? "bg-white/10 text-white" 
                      : "text-white/70 hover:text-white hover:bg-white/5",
                    item.highlight && "bg-brand-accent text-brand-primary hover:bg-brand-accent/90 ml-4 px-6 shadow-lg shadow-brand-accent/20"
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center justify-between w-full">
              <span className="text-xs font-bold text-white uppercase tracking-widest">নেভিগেশন</span>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-white rounded-md hover:bg-white/10 transition-colors"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden bg-brand-primary border-t border-white/10 overflow-hidden"
            >
              <div className="px-4 py-6 space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    href={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={cn(
                      "block px-4 py-3 rounded-lg text-sm font-bold uppercase tracking-widest transition-colors",
                      pathname === item.path 
                        ? "bg-white/10 text-white" 
                        : "text-white/60 hover:text-white hover:bg-white/5",
                      item.highlight && "bg-brand-accent text-brand-primary mt-4"
                    )}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
