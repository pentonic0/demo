'use client';

import { useSettings } from "@/src/contexts/SettingsContext";
import { motion } from "motion/react";
import { Quote, Calendar, User, Award } from "lucide-react";
import { getSafeImageSrc } from "@/src/lib/image";

export default function PrincipalMessage() {
  const { settings } = useSettings();

  return (
    <div className="min-h-screen bg-[#fafafa] font-sans pb-20">
      {/* Hero Section */}
      <div className="relative h-[400px] bg-brand-primary overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-brand-primary/80"></div>
        <div className="container mx-auto px-4 h-full flex flex-col justify-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-1 bg-brand-accent text-brand-primary text-[10px] font-black uppercase tracking-[0.3em] rounded-full mb-6">
              নেতৃত্ব
            </span>
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-4 leading-tight">
              অধ্যক্ষের <span className="text-brand-accent">বাণী</span>
            </h1>
            <div className="flex items-center gap-6 text-white/70 text-sm font-medium uppercase tracking-widest">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-brand-accent" />
                {settings.principalName}
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-brand-accent" />
                প্রতিষ্ঠানের প্রধান
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-20 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Image Sidebar */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-4"
          >
            <div className="sticky top-24">
              <div className="relative group">
                <div className="absolute -inset-4 bg-brand-accent/20 rounded-3xl blur-2xl group-hover:bg-brand-accent/30 transition-all duration-500"></div>
                <div className="relative bg-white p-4 rounded-3xl shadow-2xl border border-gray-100">
                  <img 
                    src={getSafeImageSrc(settings.principalImage)} 
                    alt={settings.principalName}
                    className="w-full aspect-[3/4] object-cover rounded-2xl shadow-inner"
                    referrerPolicy="no-referrer"
                  />
                  <div className="mt-8 text-center">
                    <h3 className="text-2xl font-serif font-bold text-brand-primary mb-1">
                      {settings.principalName}
                    </h3>
                    <p className="text-xs font-black text-brand-accent uppercase tracking-[0.2em]">
                      অধ্যক্ষ
                    </p>
                    <div className="mt-6 pt-6 border-t border-gray-100 flex justify-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-brand-primary hover:bg-brand-accent hover:text-white transition-colors cursor-pointer">
                        <User className="w-5 h-5" />
                      </div>
                      <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-brand-primary hover:bg-brand-accent hover:text-white transition-colors cursor-pointer">
                        <Calendar className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Content Area */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="lg:col-span-8"
          >
            <div className="bg-white rounded-[40px] p-8 md:p-16 shadow-xl border border-gray-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
                <Quote className="w-64 h-64 text-brand-primary" />
              </div>

              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-12">
                  <div className="w-16 h-[2px] bg-brand-accent"></div>
                  <span className="text-xs font-black text-brand-accent uppercase tracking-[0.3em]">জ্ঞানের কথা</span>
                </div>

                <div className="prose prose-lg max-w-none">
                  <p className="text-2xl md:text-3xl font-serif text-brand-primary leading-relaxed mb-12 italic font-medium border-l-4 border-brand-accent pl-8 py-2">
                    "{settings.principalMessage.split('.')[0]}."
                  </p>
                  
                  <div className="space-y-8 text-gray-600 leading-loose text-lg">
                    {settings.principalMessage.split('\n').map((paragraph, idx) => (
                      <p key={idx}>{paragraph}</p>
                    ))}
                    
                    <p>
                      আমাদের লক্ষ্য হল প্রতিটি শিক্ষার্থীকে পরিবর্তনশীল বিশ্বে সফল হওয়ার জন্য প্রয়োজনীয় জ্ঞান, দক্ষতা এবং মূল্যবোধের সাথে ক্ষমতায়ন করা। আমরা কৌতূহল, সমালোচনামূলক চিন্তাভাবনা এবং সহানুভূতির সংস্কৃতি গড়ে তুলতে বিশ্বাস করি।
                    </p>
                    
                    <p>
                      {settings.schoolName}-এ আমরা কেবল ক্যারিয়ার গড়ছি না; আমরা চরিত্র গঠন করছি। আমরা আপনাকে আমাদের প্রাণবন্ত লার্নিং কমিউনিটির অংশ হতে এবং তরুণ মনকে ভবিষ্যতের নেতায় রূপান্তরিত হতে দেখার জন্য আমন্ত্রণ জানাই।
                    </p>
                  </div>

                  <div className="mt-20 pt-12 border-t border-gray-100">
                    <div className="flex flex-col items-end">
                      <div className="text-right">
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">শুভেচ্ছান্তে,</p>
                        <h4 className="text-3xl font-serif font-bold text-brand-primary">
                          {settings.principalName}
                        </h4>
                        <p className="text-xs font-black text-brand-accent uppercase tracking-[0.2em] mt-2">
                          অধ্যক্ষ, {settings.schoolName}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
