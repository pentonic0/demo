'use client';

import Link from "next/link";
import { FileText, Calendar, ChevronLeft, Download, Search, Loader2, ArrowRight, Clock, Paperclip, ExternalLink, ChevronRight, X, Filter } from "lucide-react";
import { useState, useEffect } from "react";
import { supabasePublic } from "@/src/lib/supabase";
import { getSafeImageSrc } from "@/src/lib/image";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/src/lib/utils";

interface NoticeData {
  id: string;
  title: string;
  date: string;
  content: string;
  fileUrl?: string;
}

const ITEMS_PER_PAGE = 10;

export interface NoticePageProps {
  id?: string;
}

export default function NoticePage({ id }: NoticePageProps) {
  const [notices, setNotices] = useState<NoticeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [selectedDay, setSelectedDay] = useState<string>("");
  const [singleNotice, setSingleNotice] = useState<NoticeData | null>(null);
  const [singleLoading, setSingleLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const BENGALI_MONTHS = [
    "জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন",
    "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর"
  ];

  useEffect(() => {
    if (!id) {
      const fetchNotices = async () => {
        try {
          const { data, error } = await supabasePublic
            .from("notices")
            .select("*")
            .lte("date", new Date().toISOString())
            .order("date", { ascending: false });
          if (error) throw error;
          if (data) {
            setNotices(data.map((m: any) => ({
              id: m.id,
              title: m.title,
              date: m.date,
              content: m.content,
              fileUrl: m.file_url
            })));
          }
        } catch (error) {
          console.warn("Notice fetch skipped:", error instanceof Error ? error.message : error);
      setNotices([]);
        } finally {
          setLoading(false);
        }
      };
      fetchNotices();
    } else {
      const fetchSingle = async () => {
        setSingleLoading(true);
        try {
          const { data, error } = await supabasePublic
            .from("notices")
            .select("*")
            .eq("id", id)
            .lte("date", new Date().toISOString())
            .single();
          if (error) throw error;
          if (data) {
            setSingleNotice({
              id: data.id,
              title: data.title,
              date: data.date,
              content: data.content,
              fileUrl: data.file_url
            } as NoticeData);
          } else {
            setSingleNotice(null);
          }
        } catch (error) {
          console.error(`Failed to fetch notice ${id}`, error);
          setSingleNotice(null);
        } finally {
          setSingleLoading(false);
        }
      };
      fetchSingle();
    }
  }, [id]);

  const filteredNotices = notices.filter(notice => {
    const noticeDate = new Date(notice.date);
    const matchesSearch = notice.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesYear = selectedYear === "" || noticeDate.getFullYear().toString() === selectedYear;
    const matchesMonth = selectedMonth === "" || (noticeDate.getMonth() + 1).toString() === selectedMonth;
    const matchesDay = selectedDay === "" || noticeDate.getDate().toString() === selectedDay;
    
    return matchesSearch && matchesYear && matchesMonth && matchesDay;
  });

  // Get unique options for filters
  const years = Array.from(new Set(notices.map(n => new Date(n.date).getFullYear()))).sort((a, b) => b - a);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  // Pagination logic
  const totalPages = Math.ceil(filteredNotices.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedNotices = filteredNotices.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedYear, selectedMonth, selectedDay]);

  const isPDF = (url: string) => {
    if (!url) return false;
    const lowerUrl = url.toLowerCase();
    return lowerUrl.endsWith('.pdf') || 
           lowerUrl.includes('.pdf?') || 
           url.includes('/raw/upload/') || 
           (url.includes('res.cloudinary.com') && lowerUrl.includes('pdf'));
  };

  if (id) {
    if (singleLoading) {
      return (
        <div className="flex items-center justify-center py-32">
          <Loader2 className="w-10 h-10 text-green-700 animate-spin" />
        </div>
      );
    }

    if (!singleNotice) return (
      <div className="max-w-xl mx-auto text-center py-20 font-sans">
        <div className="bg-red-50 text-red-600 p-8 rounded-2xl border border-red-100">
          <FileText className="w-16 h-16 mx-auto mb-4 opacity-20" />
          <h2 className="text-2xl font-bold uppercase tracking-tight mb-2">নোটিশ পাওয়া যায়নি</h2>
          <p className="text-sm opacity-80 mb-6">আপনি যে নোটিশটি খুঁজছেন তা হয়তো সরিয়ে ফেলা হয়েছে অথবা লিঙ্কটি ভুল।</p>
          <Link href="/notice" className="inline-flex items-center gap-2 bg-green-700 text-white px-6 py-2 rounded-full font-bold uppercase text-xs tracking-widest hover:bg-green-800 transition-all">
            <ChevronLeft className="w-4 h-4" /> নোটিশ বোর্ডে ফিরে যান
          </Link>
        </div>
      </div>
    );

    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto space-y-8 font-sans pb-20"
      >
        <div className="flex items-center justify-between">
          <Link href="/notice" className="group inline-flex items-center gap-2 text-gray-500 hover:text-green-700 transition-colors font-bold text-xs uppercase tracking-widest">
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-green-100 group-hover:text-green-700 transition-all">
              <ChevronLeft className="w-4 h-4" />
            </div>
            নোটিশ বোর্ডে ফিরে যান
          </Link>
          <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] bg-gray-100 px-3 py-1 rounded-full">
            সূত্র: IHS/NOTICE/{new Date(singleNotice.date).getFullYear()}/{singleNotice.id.slice(0, 6).toUpperCase()}
          </div>
        </div>
        
        <article className="bg-white border border-gray-100 rounded-3xl shadow-2xl shadow-gray-200/50 overflow-hidden">
          <div className="bg-gradient-to-br from-green-800 to-green-600 text-white p-8 sm:p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-48 h-48 bg-black/10 rounded-full blur-2xl" />
            
            <div className="relative z-10 space-y-4">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                <Clock className="w-3 h-3" /> প্রকাশিত: {new Date(singleNotice.date).toLocaleDateString('bn-BD', { month: 'long', day: 'numeric', year: 'numeric' })} | {new Date(singleNotice.date).toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })}
              </div>
              <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight leading-[1.1]">{singleNotice.title}</h1>
            </div>
          </div>

          <div className="p-8 sm:p-12 space-y-10">
            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap font-medium">
              {singleNotice.content}
            </div>

            {singleNotice.fileUrl && (
              <div className="space-y-6 pt-10 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-gray-800 uppercase tracking-[0.2em] flex items-center gap-2">
                    <Paperclip className="w-4 h-4 text-green-600" /> সংযুক্ত ফাইল প্রিভিউ
                  </h3>
                  <a 
                    href={singleNotice.fileUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[10px] font-bold text-blue-600 uppercase tracking-widest hover:underline flex items-center gap-1"
                  >
                    নতুন ট্যাবে খুলুন <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                
                {isPDF(singleNotice.fileUrl) ? (
                  <div className="aspect-[3/4] sm:aspect-video w-full border border-gray-200 rounded-2xl overflow-hidden bg-gray-50 shadow-inner">
                    <iframe 
                      src={`https://docs.google.com/viewer?url=${encodeURIComponent(singleNotice.fileUrl)}&embedded=true`} 
                      className="w-full h-full"
                      title="PDF Preview"
                      frameBorder="0"
                    />
                  </div>
                ) : (
                  <div className="border border-gray-200 rounded-2xl overflow-hidden bg-gray-50 shadow-inner group cursor-zoom-in">
                    <img 
                      src={getSafeImageSrc(singleNotice.fileUrl)} 
                      alt={singleNotice.title} 
                      className="w-full h-auto max-h-[800px] object-contain mx-auto transition-transform duration-500 group-hover:scale-[1.02]"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}
              </div>
            )}

            <div className="pt-10 flex flex-col sm:flex-row justify-between items-center gap-6">
              {singleNotice.fileUrl ? (
                <button 
                  onClick={async () => {
                    if (!singleNotice.fileUrl) return;
                    try {
                      const response = await fetch(singleNotice.fileUrl);
                      const blob = await response.blob();
                      const url = window.URL.createObjectURL(blob);
                      const link = document.createElement('a');
                      link.href = url;
                      link.setAttribute('download', `${singleNotice.title.replace(/\s+/g, '_')}.pdf`);
                      document.body.appendChild(link);
                      link.click();
                      link.parentNode?.removeChild(link);
                      window.URL.revokeObjectURL(url);
                    } catch (error) {
                      console.error("Download failed:", error);
                      window.open(singleNotice.fileUrl, '_blank');
                    }
                  }}
                  className="w-full sm:w-auto flex items-center justify-center gap-3 bg-red-600 text-white px-8 py-4 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-red-700 transition-all shadow-xl shadow-red-200 hover:shadow-red-300 active:scale-95"
                >
                  <Download className="w-5 h-5" /> ডকুমেন্ট ডাউনলোড করুন
                </button>
              ) : (
                <div />
              )}
              
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">অনুমোদিত</p>
                  <p className="text-sm font-bold text-gray-800">স্কুল প্রশাসন</p>
                </div>
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                  <FileText className="w-6 h-6 text-gray-300" />
                </div>
              </div>
            </div>
          </div>
        </article>
      </motion.div>
    );
  }

  return (
    <div className="space-y-12 font-sans pb-20">
      <div className="relative bg-green-800 rounded-[2rem] p-8 sm:p-12 overflow-hidden text-white shadow-2xl shadow-green-900/20">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-64 h-64 bg-black/10 rounded-full blur-2xl" />
        
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-end gap-6">
          <div className="space-y-3 text-center lg:text-left w-full lg:w-auto">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
              অফিসিয়াল যোগাযোগ
            </div>
            <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tighter leading-none">
              নোটিশ <span className="text-green-300">বোর্ড</span>
            </h1>
            <p className="text-green-100/70 text-xs font-medium max-w-md">
              আমাদের স্কুলের সর্বশেষ ঘোষণা, সময়সূচী এবং গুরুত্বপূর্ণ তথ্যের সাথে আপডেট থাকুন।
            </p>
          </div>
          
          <div className="w-full lg:flex-1 max-w-4xl space-y-4">
            <div className="flex flex-col sm:flex-row items-end gap-3">
              <div className="flex-1 space-y-1.5 w-full">
                <p className="text-[10px] font-black uppercase tracking-widest text-green-200/50 ml-1">খুঁজুন</p>
                <div className="relative group">
                  <input
                    type="text"
                    placeholder="শিরোনাম..."
                    className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50 text-white placeholder:text-white/40 text-sm transition-all group-hover:bg-white/15"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50 group-hover:text-white transition-colors" />
                </div>
              </div>
              
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={cn(
                  "p-3 rounded-xl border transition-all flex items-center gap-2 text-xs font-bold uppercase tracking-widest h-[46px]",
                  isFilterOpen 
                    ? "bg-white text-green-800 border-white shadow-lg" 
                    : "bg-white/10 text-white border-white/20 hover:bg-white/20"
                )}
              >
                <Filter className="w-4 h-4" />
                <span>ফিল্টার</span>
                {(selectedYear || selectedMonth || selectedDay) && (
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                )}
              </button>

              {(searchTerm || selectedYear || selectedMonth || selectedDay) && (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedYear("");
                    setSelectedMonth("");
                    setSelectedDay("");
                    setIsFilterOpen(false);
                  }}
                  className="p-3 bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-500/30 rounded-xl transition-all h-[46px]"
                  title="রিসেট"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <AnimatePresence>
              {isFilterOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0, y: -10 }}
                  animate={{ height: "auto", opacity: 1, y: 0 }}
                  exit={{ height: 0, opacity: 0, y: -10 }}
                  className="overflow-hidden"
                >
                  <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="space-y-1.5">
                      <p className="text-[10px] font-black uppercase tracking-widest text-green-200/50 ml-1">বছর</p>
                      <select
                        className="w-full px-4 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50 text-white text-sm transition-all hover:bg-white/15 appearance-none cursor-pointer"
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                      >
                        <option value="" className="bg-green-900">সব বছর</option>
                        {years.map(year => (
                          <option key={year} value={year} className="bg-green-900">{year}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <p className="text-[10px] font-black uppercase tracking-widest text-green-200/50 ml-1">মাস</p>
                      <select
                        className="w-full px-4 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50 text-white text-sm transition-all hover:bg-white/15 appearance-none cursor-pointer"
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                      >
                        <option value="" className="bg-green-900">সব মাস</option>
                        {BENGALI_MONTHS.map((month, i) => (
                          <option key={i} value={i + 1} className="bg-green-900">{month}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <p className="text-[10px] font-black uppercase tracking-widest text-green-200/50 ml-1">দিন</p>
                      <select
                        className="w-full px-4 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50 text-white text-sm transition-all hover:bg-white/15 appearance-none cursor-pointer"
                        value={selectedDay}
                        onChange={(e) => setSelectedDay(e.target.value)}
                      >
                        <option value="" className="bg-green-900">সব</option>
                        {days.map(day => (
                          <option key={day} value={day} className="bg-green-900">{day}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-32">
            <Loader2 className="w-10 h-10 text-green-700 animate-spin" />
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {paginatedNotices.map((notice, i) => (
              <motion.div
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2, delay: i * 0.05 }}
                key={notice.id}
                className="group"
              >
                <Link href={`/notice/${notice.id}`} className="block bg-white border border-gray-100 rounded-2xl p-5 shadow-lg shadow-gray-200/30 hover:shadow-xl hover:shadow-green-900/5 transition-all hover:bg-green-50/30">
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 bg-green-50 text-green-700 rounded-2xl flex flex-col items-center justify-center shrink-0 group-hover:bg-green-700 group-hover:text-white transition-all duration-500">
                      <span className="text-[10px] font-black uppercase leading-none">{new Date(notice.date).toLocaleDateString('bn-BD', { month: 'short' })}</span>
                      <span className="text-xl font-black leading-none mt-1">{new Date(notice.date).getDate()}</span>
                    </div>
                    
                    <div className="flex-1 min-w-0 space-y-1">
                      <h3 className="text-lg font-black text-gray-800 uppercase tracking-tight leading-tight group-hover:text-green-700 transition-colors truncate">
                        {notice.title}
                      </h3>
                      <div className="flex items-center gap-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(notice.date).getFullYear()} | {new Date(notice.date).toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })}</span>
                        {notice.fileUrl && (
                          <span className="flex items-center gap-1 text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                            <Paperclip className="w-3 h-3" /> সংযুক্ত ফাইল
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="hidden sm:flex items-center gap-2 text-[10px] font-black text-green-700 uppercase tracking-widest group-hover:translate-x-1 transition-transform">
                      দেখুন <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Pagination Controls */}
      {!loading && totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 pt-8">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-green-700 hover:text-white disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-gray-500 transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={cn(
                  "w-10 h-10 rounded-xl text-xs font-black transition-all",
                  currentPage === i + 1 
                    ? "bg-green-700 text-white shadow-lg shadow-green-900/20" 
                    : "bg-white border border-gray-200 text-gray-500 hover:border-green-700 hover:text-green-700"
                )}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-green-700 hover:text-white disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-gray-500 transition-all"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
      
      {!loading && filteredNotices.length === 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-32 space-y-4"
        >
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
            <Search className="w-10 h-10 text-gray-300" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-gray-800 uppercase tracking-tight">কোনো ফলাফল পাওয়া যায়নি</h3>
            <p className="text-sm text-gray-500 font-medium">আমরা "{searchTerm}" এর সাথে মিল থাকা কোনো নোটিশ খুঁজে পাইনি</p>
          </div>
          <button 
            onClick={() => setSearchTerm("")}
            className="text-xs font-bold text-green-700 uppercase tracking-widest hover:underline"
          >
            অনুসন্ধান মুছুন
          </button>
        </motion.div>
      )}
    </div>
  );
}
