'use client';

import HeroSlider from "@/src/components/HeroSlider";
import PrincipalCard from "@/src/components/PrincipalCard";
import NoticeList from "@/src/components/NoticeList";
import ImportantMenu from "@/src/components/ImportantMenu";
import Link from "next/link";
import { CheckCircle, History, Target, Lightbulb, ArrowRight, Quote, User } from "lucide-react";
import { motion } from "motion/react";
import { useLanguage } from "@/src/contexts/LanguageContext";
import { useSettings } from "@/src/contexts/SettingsContext";

export default function Home() {
  const { t } = useLanguage();
  const { settings } = useSettings();

  return (
    <div className="space-y-16 font-sans">
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Principal Info */}
        <aside className="lg:col-span-3 space-y-8">
          <PrincipalCard />
          
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 overflow-hidden border border-gray-100"
          >
            <div className="bg-brand-primary text-white px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-between">
              {t("committee")}
              <Quote className="w-4 h-4 opacity-20" />
            </div>
            <div className="p-8 text-center">
              <div className="w-32 h-40 mx-auto bg-gray-50 rounded-xl overflow-hidden mb-6 shadow-inner border border-gray-100 flex items-center justify-center">
                {settings.chairmanImage ? (
                  <img 
                    src={settings.chairmanImage} 
                    alt="Chairman" 
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <User className="w-12 h-12 text-brand-primary/10" />
                )}
              </div>
              <h4 className="text-lg font-serif font-bold text-brand-primary leading-tight mb-1">
                {settings.chairmanName || "চেয়ারম্যানের নাম"}
              </h4>
              <p className="text-[10px] text-gray-400 font-bold mb-6 uppercase tracking-widest">চেয়ারম্যান, গভর্নিং বডি</p>
              <Link href="/committee" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-brand-accent hover:text-brand-primary transition-all group">
                {t("read_full_message")}
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </aside>

        {/* Center Column: Slider & About */}
        <main className="lg:col-span-6 space-y-12">
          <div className="rounded-3xl overflow-hidden shadow-2xl shadow-brand-primary/10">
            <HeroSlider />
          </div>
          
          <section className="bg-white p-10 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-accent/5 rounded-bl-full -mr-16 -mt-16" />
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-brand-primary/5 rounded-xl flex items-center justify-center">
                <History className="w-6 h-6 text-brand-primary" />
              </div>
              <h2 className="text-3xl font-serif font-bold text-brand-primary tracking-tight">{t("history")}</h2>
            </div>
            <div className="space-y-6 text-gray-600 leading-relaxed text-lg font-medium">
              <p>
                আইডিয়াল হাই স্কুল অ্যান্ড কলেজ, ঢাকার প্রাণকেন্দ্রে অবস্থিত, ১৯৭৫ সালে প্রতিষ্ঠার পর থেকে জ্ঞান ও শ্রেষ্ঠত্বের আলোকবর্তিকা হিসেবে কাজ করছে। আমাদের প্রতিষ্ঠানটি একটি ব্যাপক শিক্ষা প্রদানের জন্য নিবেদিত যা চরিত্র বিকাশের সাথে একাডেমিক কঠোরতার ভারসাম্য বজায় রাখে।
              </p>
              <p>
                অত্যাধুনিক সুযোগ-সুবিধা এবং উচ্চ যোগ্যতাসম্পন্ন শিক্ষাবিদদের একটি দলের সাথে, আমরা এমন একটি পরিবেশ গড়ে তুলি যেখানে প্রতিটি শিশু উন্নতি করতে পারে। আমাদের পাঠ্যক্রমটি বিশ্বব্যাপী চ্যালেঞ্জের জন্য শিক্ষার্থীদের প্রস্তুত করার পাশাপাশি জাতীয় মান পূরণের জন্য ডিজাইন করা হয়েছে।
              </p>
            </div>
            <Link 
              href="/history" 
              className="inline-flex items-center gap-2 mt-10 text-xs font-black uppercase tracking-widest text-brand-primary hover:text-brand-accent transition-all group"
            >
              {t("view_all")}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-brand-primary p-10 rounded-3xl shadow-xl shadow-brand-primary/20 text-white relative overflow-hidden group"
            >
              <Target className="w-12 h-12 text-brand-accent mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-serif font-bold mb-4 tracking-tight">আমাদের লক্ষ্য</h3>
              <p className="text-sm text-white/70 leading-relaxed font-medium italic">
                "শিক্ষার্থীদের জ্ঞান, দক্ষতা এবং মূল্যবোধের সাথে ক্ষমতায়ন করা যা তাদের দায়িত্বশীল নাগরিক এবং আজীবন শিক্ষার্থী হতে সক্ষম করে।"
              </p>
            </motion.div>
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white p-10 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 group"
            >
              <Lightbulb className="w-12 h-12 text-brand-accent mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-serif font-bold text-brand-primary mb-4 tracking-tight">আমাদের ভিশন</h3>
              <p className="text-sm text-gray-500 leading-relaxed font-medium italic">
                "প্রতিটি শিক্ষার্থীর মধ্যে সৃজনশীলতা, সমালোচনামূলক চিন্তাভাবনা এবং নৈতিক অখণ্ডতা লালন করার পাশাপাশি একাডেমিক শ্রেষ্ঠত্ব অর্জন করা।"
              </p>
            </motion.div>
          </section>
        </main>

        {/* Right Column: Notice & Features */}
        <aside className="lg:col-span-3 space-y-8">
          <NoticeList />
          
          <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 overflow-hidden border border-gray-100">
            <div className="bg-brand-secondary text-white px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em]">
              মূল বৈশিষ্ট্যসমূহ
            </div>
            <div className="p-6 space-y-4">
              {[
                "আইসিটি ভিত্তিক ক্লাসরুম",
                "সুসজ্জিত ল্যাব",
                "সমৃদ্ধ লাইব্রেরি",
                "ক্রীড়া ও সংস্কৃতি",
                "নিরাপদ পরিবেশ",
                "সিসিটিভি নজরদারি",
              ].map((feature) => (
                <div key={feature} className="flex items-center gap-3 text-xs font-bold text-gray-600 uppercase tracking-wider">
                  <div className="w-5 h-5 bg-brand-accent/10 rounded-full flex items-center justify-center shrink-0">
                    <CheckCircle className="w-3 h-3 text-brand-accent" />
                  </div>
                  {feature}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 overflow-hidden border border-gray-100">
            <div className="bg-brand-primary text-white px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em]">
              {t("useful_links")}
            </div>
            <div className="p-2">
              <ul className="space-y-1">
                {[
                  { name: "শিক্ষা মন্ত্রণালয়", url: "http://www.moedu.gov.bd" },
                  { name: "ঢাকা শিক্ষা বোর্ড", url: "https://dhakaeducationboard.gov.bd" },
                  { name: "মাউশি (DSHE)", url: "http://www.dshe.gov.bd" },
                  { name: "ব্যানবেইস (BANBEIS)", url: "http://www.banbeis.gov.bd" },
                ].map((link) => (
                  <li key={link.name}>
                    <a 
                      href={link.url} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between px-4 py-3 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:bg-brand-accent/5 hover:text-brand-primary transition-all rounded-xl group"
                    >
                      {link.name}
                      <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>
      </div>

      {/* Important Menu Section */}
      <div className="pt-8">
        <ImportantMenu />
      </div>
    </div>
  );
}
