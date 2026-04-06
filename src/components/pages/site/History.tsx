'use client';

import { History as HistoryIcon, BookOpen, Target, Lightbulb, Award, Users, Calendar, ArrowRight, Sparkles, Shield, GraduationCap, Trophy, Star } from "lucide-react";
import { motion } from "motion/react";
import { useLanguage } from "@/src/contexts/LanguageContext";
import { cn } from "@/src/lib/utils";

export default function History() {
  const { t } = useLanguage();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="space-y-0 pb-20 font-sans overflow-hidden">
      {/* Hero Section - Modern & Impactful */}
      <section className="-mx-4 sm:-mx-6 lg:-mx-8 relative h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1523050853064-80d83904895d?auto=format&fit=crop&q=80&w=2000" 
            alt="School Heritage" 
            className="w-full h-full object-cover grayscale opacity-40"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-primary/90 via-brand-primary/70 to-white" />
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center px-4 space-y-6"
        >
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-white mb-4">
            <Sparkles className="w-4 h-4 text-brand-accent" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">১৯৭৫ সাল থেকে শ্রেষ্ঠত্বের যাত্রা</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-serif font-black text-white tracking-tight leading-tight">
            আমাদের <span className="text-brand-accent">গৌরবময়</span> ইতিহাস
          </h1>
          <p className="text-white/70 max-w-2xl mx-auto text-lg font-medium leading-relaxed">
            অর্ধশতাব্দীর ঐতিহ্য, হাজারো সফল শিক্ষার্থীর স্বপ্নপূরণ এবং শিক্ষার আলো ছড়িয়ে দেওয়ার এক নিরন্তর গল্প।
          </p>
        </motion.div>

        {/* Decorative Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 w-6 h-10 border-2 border-white/30 rounded-full flex justify-center p-1"
        >
          <div className="w-1 h-2 bg-white/50 rounded-full" />
        </motion.div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 space-y-32">
        
        {/* Main Narrative Section */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start"
        >
          <div className="lg:col-span-7 space-y-12">
            <motion.div variants={itemVariants} className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-brand-primary/5 rounded-2xl flex items-center justify-center shadow-inner border border-brand-primary/5">
                  <Shield className="w-8 h-8 text-brand-primary" />
                </div>
                <div>
                  <h2 className="text-3xl font-serif font-bold text-brand-primary tracking-tight">আমাদের ঐতিহ্য ও ভিত্তি</h2>
                  <div className="h-1.5 w-12 bg-brand-accent rounded-full mt-2" />
                </div>
              </div>
              
              <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed space-y-6 font-medium">
                <p className="first-letter:text-5xl first-letter:font-serif first-letter:font-black first-letter:text-brand-primary first-letter:mr-3 first-letter:float-left first-letter:leading-[0.8]">
                  আইডিয়াল হাই স্কুল অ্যান্ড কলেজ ১৯৭৫ সালে একদল স্বপ্নদর্শী শিক্ষাবিদ এবং সমাজসেবীদের দ্বারা প্রতিষ্ঠিত হয়েছিল যারা ঢাকার প্রাণকেন্দ্রে একটি মানসম্মত শিক্ষা প্রতিষ্ঠানের প্রয়োজনীয়তা অনুভব করেছিলেন। মাত্র কয়েকজন শিক্ষার্থী এবং একটি ছোট ভবন নিয়ে শুরু করে, স্কুলটি আজ দেশের অন্যতম মর্যাদাপূর্ণ প্রতিষ্ঠানে পরিণত হয়েছে।
                </p>
                <p>
                  কয়েক দশক ধরে, আমরা জাতীয় পরীক্ষায় ধারাবাহিকভাবে অসামান্য ফলাফল অর্জন করেছি এবং হাজার হাজার সফল পেশাদার তৈরি করেছি যারা দেশে এবং বিদেশে সমাজে অবদান রাখছেন। একাডেমিক শ্রেষ্ঠত্বের প্রতি আমাদের প্রতিশ্রুতি, নৈতিক মূল্যবোধ এবং পাঠ্যক্রম বহির্ভূত কার্যক্রমের উপর ফোকাস আমাদের অভিভাবকদের জন্য একটি পছন্দের পছন্দ করে তুলেছে।
                </p>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="relative rounded-[3rem] overflow-hidden shadow-2xl group border-8 border-white">
              <img 
                src="https://picsum.photos/seed/history-old/1200/800" 
                alt="Old Campus" 
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-100"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-primary/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-10">
                <p className="text-white font-bold uppercase tracking-widest text-sm">১৯৭৫ সালের মূল স্কুল ভবন ও প্রাঙ্গণ</p>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="prose prose-lg max-w-none text-gray-600 leading-relaxed font-medium">
              <p>
                ২০০৫ সালে, প্রতিষ্ঠানটি কলেজে উন্নীত হয়, যা বিজ্ঞান, মানবিক এবং ব্যবসায় শিক্ষা শাখায় উচ্চ মাধ্যমিক শিক্ষা প্রদান করে। আজ, আমরা অত্যাধুনিক ল্যাবরেটরি, একটি সমৃদ্ধ লাইব্রেরি, আইসিটি-ভিত্তিক ক্লাসরুম এবং একটি বড় খেলার মাঠ সহ একটি আধুনিক ক্যাম্পাসের গর্ব করি।
              </p>
            </motion.div>
          </div>

          {/* Sidebar: Quick Stats & Achievements */}
          <div className="lg:col-span-5 space-y-12">
            <motion.div 
              variants={itemVariants}
              className="bg-brand-primary p-10 rounded-[3rem] shadow-2xl shadow-brand-primary/20 text-white relative overflow-hidden group"
            >
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-1000" />
              <h3 className="text-2xl font-serif font-bold mb-8 tracking-tight">সাফল্যের মাইলফলক</h3>
              
              <div className="space-y-8">
                {[
                  { icon: Trophy, title: "সেরা স্কুল পুরস্কার", year: "২০১৮", desc: "ঢাকা শিক্ষা বোর্ড কর্তৃক প্রদান করা হয়েছে।" },
                  { icon: Users, title: "ক্রীড়ায় শ্রেষ্ঠত্ব", year: "২০২২", desc: "জাতীয় আন্তঃস্কুল ফুটবল চ্যাম্পিয়ন।" },
                  { icon: BookOpen, title: "১০০% পাসের হার", year: "২০২৪", desc: "এসএসসি এবং এইচএসসি উভয় পরীক্ষায় অর্জিত।" },
                ].map((achievement, idx) => (
                  <div key={idx} className="flex gap-6 group/item">
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center shrink-0 group-hover/item:bg-brand-accent group-hover/item:text-brand-primary transition-all">
                      <achievement.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold mb-1">{achievement.title}</h4>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-brand-accent">{achievement.year}</span>
                        <div className="w-1 h-1 bg-white/30 rounded-full" />
                      </div>
                      <p className="text-sm text-white/60 leading-relaxed">{achievement.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div 
              variants={itemVariants}
              className="bg-white p-10 rounded-[3rem] shadow-2xl shadow-gray-100 border border-gray-50 space-y-8"
            >
              <h3 className="text-2xl font-serif font-bold text-brand-primary tracking-tight">আমাদের দর্শন</h3>
              <div className="space-y-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Target className="w-6 h-6 text-brand-accent" />
                    <h4 className="text-lg font-bold text-brand-primary">মিশন</h4>
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed italic font-medium">
                    "শিক্ষার্থীদের জ্ঞান, দক্ষতা এবং মূল্যবোধের সাথে ক্ষমতায়ন করা যা তাদের পরিবর্তনশীল বিশ্বে দায়িত্বশীল নাগরিক এবং আজীবন শিক্ষার্থী হতে সক্ষম করে।"
                  </p>
                </div>
                <div className="h-px bg-gray-100" />
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Lightbulb className="w-6 h-6 text-brand-accent" />
                    <h4 className="text-lg font-bold text-brand-primary">ভিশন</h4>
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed italic font-medium">
                    "প্রতিটি শিক্ষার্থীর মধ্যে সৃজনশীলতা, সমালোচনামূলক চিন্তাভাবনা এবং নৈতিক অখণ্ডতা লালন করার পাশাপাশি ১০০% সাক্ষরতা এবং একাডেমিক শ্রেষ্ঠত্ব অর্জন করা।"
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Timeline Section - Interactive & Modern */}
        <section className="space-y-20">
          <div className="text-center space-y-4">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-accent block">ঐতিহাসিক পরিক্রমা</span>
            <h2 className="text-4xl md:text-5xl font-serif font-black text-brand-primary tracking-tight">সময়ের পাতায় আমরা</h2>
            <div className="h-1.5 w-20 bg-brand-accent rounded-full mx-auto mt-6" />
          </div>

          <div className="relative">
            {/* Center Line */}
            <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-brand-primary/5 via-brand-primary/20 to-brand-primary/5 hidden md:block" />
            
            <div className="space-y-16 md:space-y-0">
              {[
                { year: "১৯৭৫", title: "প্রতিষ্ঠা", desc: "স্কুলের ভিত্তিপ্রস্তর স্থাপন ও শিক্ষা কার্যক্রমের সূচনা।", icon: Star, align: "left" },
                { year: "১৯৮২", title: "প্রথম ব্যাচ", desc: "এসএসসি শিক্ষার্থীদের প্রথম ব্যাচ সফলভাবে উত্তীর্ণ।", icon: GraduationCap, align: "right" },
                { year: "১৯৯৫", title: "নতুন ভবন", desc: "আধুনিক সুযোগ-সুবিধা সম্বলিত নতুন ভবনের উদ্বোধন।", icon: Shield, align: "left" },
                { year: "২০০৫", title: "কলেজ শাখা", desc: "হাই স্কুল থেকে কলেজে উন্নীত ও উচ্চ মাধ্যমিক কার্যক্রম শুরু।", icon: BookOpen, align: "right" },
                { year: "২০১৫", title: "৪০তম বর্ষ", desc: "৪০তম বার্ষিকী উদযাপন ও প্রাক্তন শিক্ষার্থীদের পুনর্মিলনী।", icon: Trophy, align: "left" },
                { year: "২০২০", title: "ডিজিটাল যুগ", desc: "স্মার্ট ক্লাসরুম ও অনলাইন শিক্ষা কার্যক্রমের পূর্ণাঙ্গ প্রবর্তন।", icon: Sparkles, align: "right" },
              ].map((milestone, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: milestone.align === "left" ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  className={cn(
                    "relative flex flex-col md:flex-row items-center gap-8 md:gap-0",
                    milestone.align === "right" && "md:flex-row-reverse"
                  )}
                >
                  {/* Content */}
                  <div className="w-full md:w-1/2 px-4 md:px-12">
                    <div className={cn(
                      "bg-white p-8 rounded-[2.5rem] shadow-2xl shadow-gray-100 border border-gray-50 relative group hover:bg-brand-primary transition-all duration-500",
                      milestone.align === "left" ? "md:text-right" : "md:text-left"
                    )}>
                      <div className={cn(
                        "absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-4 border-brand-primary rounded-full hidden md:block",
                        milestone.align === "left" ? "-right-10" : "-left-10"
                      )} />
                      <span className="text-3xl font-black text-brand-accent mb-2 block group-hover:text-white transition-colors">{milestone.year}</span>
                      <h4 className="text-xl font-bold text-brand-primary mb-3 group-hover:text-white transition-colors">{milestone.title}</h4>
                      <p className="text-sm text-gray-500 leading-relaxed group-hover:text-white/70 transition-colors">{milestone.desc}</p>
                    </div>
                  </div>
                  
                  {/* Icon in Center */}
                  <div className="absolute left-1/2 -translate-x-1/2 w-12 h-12 bg-white rounded-full border-4 border-brand-primary shadow-xl z-10 flex items-center justify-center hidden md:flex">
                    <milestone.icon className="w-5 h-5 text-brand-primary" />
                  </div>
                  
                  {/* Spacer for other side */}
                  <div className="w-full md:w-1/2 hidden md:block" />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative py-24 px-8 bg-brand-primary rounded-[4rem] overflow-hidden text-center group">
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px] opacity-[0.03]" />
          <div className="relative z-10 space-y-8">
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-white tracking-tight">আমাদের ঐতিহ্যের অংশ হতে চান?</h2>
            <p className="text-white/60 max-w-xl mx-auto text-lg">
              ভর্তি সংক্রান্ত তথ্য বা অন্য কোনো জিজ্ঞাসার জন্য আমাদের সাথে যোগাযোগ করুন।
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button className="px-10 py-5 bg-brand-accent text-brand-primary font-black uppercase tracking-widest rounded-2xl hover:bg-white transition-all shadow-2xl shadow-black/20">
                ভর্তি তথ্য
              </button>
              <button className="px-10 py-5 bg-white/10 backdrop-blur-md border border-white/20 text-white font-black uppercase tracking-widest rounded-2xl hover:bg-white/20 transition-all">
                যোগাযোগ করুন
              </button>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}

