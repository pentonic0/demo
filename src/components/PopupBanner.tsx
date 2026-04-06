'use client';

import { useState, useEffect } from "react";
import { X, ExternalLink } from "lucide-react";
import { useSettings } from "@/src/contexts/SettingsContext";
import { motion, AnimatePresence } from "motion/react";
import { getSafeImageSrc } from "@/src/lib/image";
import { formatLink } from "@/src/lib/utils";

export default function PopupBanner() {
  const { settings } = useSettings();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (settings.showPopupBanner && settings.popupBannerImage) {
      const bannerId = settings.popupBannerId || "default";
      const dismissedId = window.localStorage.getItem("dismissed_banner_id");
      
      if (dismissedId !== bannerId) {
        const timer = setTimeout(() => {
          setIsOpen(true);
        }, 1500);
        return () => clearTimeout(timer);
      }
    }
  }, [settings.showPopupBanner, settings.popupBannerImage, settings.popupBannerId]);

  const handleClose = () => {
    setIsOpen(false);
    window.localStorage.setItem("dismissed_banner_id", settings.popupBannerId || "default");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative bg-white w-full max-w-lg rounded-sm shadow-2xl overflow-hidden border-4 border-white"
          >
            <button 
              onClick={handleClose}
              className="absolute top-2 right-2 z-10 bg-black/50 text-white p-1.5 rounded-full hover:bg-black transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="relative group">
              <img 
                src={getSafeImageSrc(settings.popupBannerImage)} 
                alt="Announcement" 
                className="w-full h-auto object-cover max-h-[70vh]"
                referrerPolicy="no-referrer"
              />
              {settings.popupBannerLink && (
                <a 
                  href={formatLink(settings.popupBannerLink)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-all"
                >
                  <div className="bg-white text-black px-6 py-3 rounded-full font-black uppercase tracking-widest text-xs flex items-center gap-2 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all shadow-xl">
                    আরও জানুন <ExternalLink className="w-4 h-4" />
                  </div>
                </a>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
