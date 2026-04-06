'use client';

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSettings } from "@/src/contexts/SettingsContext";
import { motion, AnimatePresence } from "motion/react";
import { getSafeImageSrc } from "@/src/lib/image";

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { sliderItems } = useSettings();

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % sliderItems.length);
  }, [sliderItems.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + sliderItems.length) % sliderItems.length);
  }, [sliderItems.length]);

  useEffect(() => {
    if (sliderItems.length === 0) return;
    const timer = setInterval(nextSlide, 6000);
    return () => clearInterval(timer);
  }, [sliderItems.length, nextSlide]);

  if (sliderItems.length === 0) {
    return (
      <div className="relative w-full h-[400px] sm:h-[500px] md:h-[600px] bg-brand-primary/5 flex items-center justify-center font-sans">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-brand-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xs font-black uppercase tracking-widest text-brand-primary/40">স্লাইড প্রস্তুত করা হচ্ছে...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[400px] sm:h-[500px] md:h-[600px] overflow-hidden group font-sans">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <img
            src={getSafeImageSrc(sliderItems[currentSlide]?.image)}
            alt={sliderItems[currentSlide].title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-primary/90 via-brand-primary/20 to-transparent" />
          
          <div className="absolute inset-0 flex flex-col justify-end p-12 sm:p-20 text-white max-w-4xl">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <span className="inline-block px-4 py-1 bg-brand-accent text-brand-primary text-[10px] font-black uppercase tracking-[0.3em] rounded-full mb-6 shadow-xl shadow-brand-accent/20">
                শিক্ষায় শ্রেষ্ঠত্ব
              </span>
              <h2 className="text-4xl sm:text-6xl font-serif font-bold mb-6 leading-[1.1] tracking-tight drop-shadow-2xl">
                {sliderItems[currentSlide].title}
              </h2>
              <p className="text-lg sm:text-xl font-medium text-white/80 max-w-2xl leading-relaxed italic drop-shadow-lg">
                {sliderItems[currentSlide].subtitle}
              </p>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Controls */}
      <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <button
          onClick={prevSlide}
          className="w-12 h-12 bg-white/10 backdrop-blur-md hover:bg-brand-accent hover:text-brand-primary text-white rounded-full flex items-center justify-center transition-all duration-300 pointer-events-auto border border-white/20"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={nextSlide}
          className="w-12 h-12 bg-white/10 backdrop-blur-md hover:bg-brand-accent hover:text-brand-primary text-white rounded-full flex items-center justify-center transition-all duration-300 pointer-events-auto border border-white/20"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Indicators */}
      <div className="absolute bottom-10 right-12 flex gap-3">
        {sliderItems.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className="group relative h-1 transition-all duration-500"
            style={{ width: index === currentSlide ? '40px' : '12px' }}
          >
            <div className={`absolute inset-0 rounded-full transition-all duration-500 ${
              index === currentSlide ? "bg-brand-accent" : "bg-white/30 group-hover:bg-white/50"
            }`} />
          </button>
        ))}
      </div>
    </div>
  );
}
