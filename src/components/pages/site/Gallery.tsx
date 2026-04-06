'use client';

import { Image as ImageIcon, Search, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { supabasePublic } from "@/src/lib/supabase";
import { getSafeImageSrc } from "@/src/lib/image";
import { useLanguage } from "@/src/contexts/LanguageContext";

interface GalleryItem {
  id: string;
  title: string;
  category: string;
  image: string;
  createdAt: any;
}

export default function Gallery() {
  const { t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState("All");
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<null | GalleryItem>(null);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const { data, error } = await supabasePublic
          .from("gallery")
          .select("*")
          .order("display_order", { ascending: true });
        if (error) throw error;
        if (data) {
          setGalleryItems(data.map((m: any) => ({
            id: m.id,
            title: m.title,
            category: m.category,
            image: getSafeImageSrc(m.image_url),
            createdAt: m.created_at
          })));
        }
      } catch (error) {
        console.error("Failed to fetch gallery", error);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  const categories = ["All", ...Array.from(new Set(galleryItems.map(item => item.category)))];

  const filteredItems = activeCategory === "All" 
    ? galleryItems 
    : galleryItems.filter(item => item.category === activeCategory);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="w-10 h-10 text-green-700 animate-spin" />
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400">গ্যালারি লোড হচ্ছে...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 font-sans pb-20">
      {/* Hero Section */}
      <div className="relative bg-green-800 rounded-[2rem] p-8 sm:p-12 overflow-hidden text-white shadow-2xl shadow-green-900/20">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-64 h-64 bg-black/10 rounded-full blur-2xl" />
        
        <div className="relative z-10 space-y-3 text-center md:text-left">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
            দৃশ্যমান স্মৃতি
          </div>
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tighter leading-none">
            ফটো <span className="text-green-300">গ্যালারি</span>
          </h1>
          <p className="text-green-100/70 text-xs font-medium max-w-md">
            আমাদের স্কুল কমিউনিটির প্রাণবন্ত মুহূর্ত, অর্জন এবং দৈনন্দিন জীবনের ছবি।
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-6 bg-white p-4 rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/30">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                activeCategory === category 
                  ? "bg-green-700 text-white shadow-lg shadow-green-900/20" 
                  : "bg-gray-50 text-gray-400 hover:bg-gray-100 border border-gray-100"
              }`}
            >
              {category === "All" ? "সব" : category}
            </button>
          ))}
        </div>
        <div className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] px-4 py-2 bg-gray-50 rounded-xl border border-gray-100">
          {filteredItems.length} টি ছবি পাওয়া গেছে
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredItems.map((item) => (
          <div 
            key={item.id} 
            className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden group cursor-pointer hover:border-green-500 transition-all"
            onClick={() => setSelectedImage(item)}
          >
            <div className="h-72 overflow-hidden relative">
              <img 
                src={item.image} 
                alt={item.title} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-green-700 shadow-2xl scale-50 group-hover:scale-100 transition-transform">
                  <Search className="w-6 h-6" />
                </div>
              </div>
              <div className="absolute top-4 left-4">
                <span className="bg-white/90 backdrop-blur-md text-green-700 text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">
                  {item.category}
                </span>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-sm font-black text-gray-800 uppercase tracking-tight leading-tight">{item.title}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 sm:p-8"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-5xl w-full max-h-full flex flex-col items-center">
            <button 
              className="absolute -top-12 right-0 text-white hover:text-red-500 transition-colors"
              onClick={() => setSelectedImage(null)}
            >
              <span className="text-4xl font-light">×</span>
            </button>
            <img 
              src={getSafeImageSrc(selectedImage.image)} 
              alt={selectedImage.title} 
              className="max-w-full max-h-[80vh] object-contain border-4 border-white shadow-2xl"
              referrerPolicy="no-referrer"
            />
            <div className="mt-4 text-center text-white">
              <h3 className="text-xl font-bold uppercase tracking-wider">{selectedImage.title}</h3>
              <p className="text-sm text-yellow-400 font-bold uppercase mt-1">{selectedImage.category}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
