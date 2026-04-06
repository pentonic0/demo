'use client';

import { motion, useMotionValue, useAnimationFrame } from "motion/react";
import { Megaphone, ArrowRight, ExternalLink } from "lucide-react";
import { useSettings } from "@/src/contexts/SettingsContext";
import { useLanguage } from "@/src/contexts/LanguageContext";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { formatLink } from "@/src/lib/utils";

export default function NoticeTicker() {
  const { settings } = useSettings();
  const { t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const isHovered = useRef(false);
  const [containerWidth, setContainerWidth] = useState(0);
  const [contentWidth, setContentWidth] = useState(0);

  const x = useMotionValue(0);

  useEffect(() => {
    if (containerRef.current && contentRef.current) {
      setContainerWidth(containerRef.current.offsetWidth);
      setContentWidth(contentRef.current.offsetWidth);
      x.set(containerRef.current.offsetWidth);

      const resizeObserver = new ResizeObserver((entries) => {
        for (let entry of entries) {
          if (entry.target === containerRef.current) {
            const width = entry.contentRect.width;
            setContainerWidth(width);
            // If it's the first run or we are resizing, reset or adjust x?
            // Actually, if we are in the middle of an animation, 
            // the relative position might change. 
            // Simple approach: reset if containerWidth is 0? 
            // No, resize should be handled gracefully.
          } else if (entry.target === contentRef.current) {
            setContentWidth(entry.contentRect.width);
          }
        }
      });

      resizeObserver.observe(containerRef.current);
      resizeObserver.observe(contentRef.current);

      return () => resizeObserver.disconnect();
    }
  }, [settings.latestUpdates]);

  useAnimationFrame((time, delta) => {
    if (!isHovered.current && containerWidth && contentWidth) {
      // Speed: ~60 pixels per second
      const moveBy = (60 * delta) / 1000;
      let nextX = x.get() - moveBy;
      
      if (nextX < -contentWidth) {
        nextX = containerWidth;
      }
      
      x.set(nextX);
    }
  });

  if (!settings.showLatestUpdate || !settings.latestUpdates || settings.latestUpdates.length === 0) return null;

  return (
    <div className="bg-white border-y border-gray-100 py-2 overflow-hidden font-sans shadow-sm relative z-40">
      <div className="max-w-7xl mx-auto px-4 flex items-center gap-6">
        <div className="bg-brand-accent text-brand-primary px-4 py-1.5 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shrink-0 rounded-full shadow-lg shadow-brand-accent/20">
          <Megaphone className="w-3 h-3" />
          {t("latest_updates")}
        </div>
        
        <div 
          ref={containerRef} 
          className="flex-1 relative h-6 overflow-hidden flex items-center"
          onMouseEnter={() => (isHovered.current = true)}
          onMouseLeave={() => (isHovered.current = false)}
        >
          <motion.div
            style={{ x }}
            className="flex items-center gap-16 whitespace-nowrap absolute"
          >
            <div ref={contentRef} className="flex items-center gap-16">
              {settings.latestUpdates.map((update, index) => (
                <div key={`notice-${index}`} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-brand-accent rounded-full" />
                  {update.link ? (
                    <a 
                      href={formatLink(update.link)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-gray-600 hover:text-brand-primary transition-all flex items-center gap-1.5 group"
                    >
                      {update.text}
                      <ExternalLink className="w-3 h-3 text-gray-400 group-hover:text-brand-primary" />
                    </a>
                  ) : (
                    <span className="text-xs font-bold text-gray-600">
                      {update.text}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <Link href="/notice" className="hidden sm:flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-brand-primary hover:text-brand-accent transition-colors shrink-0">
          {t("view_all")}
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}
