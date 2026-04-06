'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { FileText, Calendar, ChevronRight, Loader2, Paperclip, ArrowRight } from "lucide-react";
import { supabasePublic } from "@/src/lib/supabase";
import { motion } from "motion/react";

interface NoticeData {
  id: string;
  title: string;
  date: string;
  fileUrl?: string;
}

export default function NoticeList() {
  const [notices, setNotices] = useState<NoticeData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const { data, error } = await supabasePublic
          .from("notices")
          .select("id, title, date, file_url")
          .lte("date", new Date().toISOString())
          .order("date", { ascending: false })
          .limit(5);

        if (error) throw error;
        if (data) {
          setNotices(data.map((m: any) => ({
            id: m.id,
            title: m.title,
            date: m.date,
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
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 overflow-hidden border border-gray-100 font-sans">
      <div className="bg-brand-primary text-white px-6 py-4 flex justify-between items-center">
        <span className="text-[10px] font-black uppercase tracking-[0.2em]">নোটিশ বোর্ড</span>
        <Link href="/notice" className="text-[10px] font-black uppercase tracking-widest hover:text-brand-accent transition-colors flex items-center gap-1">
          সব <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
      <div className="p-4">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 text-brand-primary animate-spin" />
          </div>
        ) : (
          <ul className="space-y-4">
            {notices.map((notice, i) => (
              <motion.li 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                key={notice.id} 
                className="group"
              >
                <Link href={`/notice/${notice.id}`} className="block p-3 rounded-xl hover:bg-brand-accent/5 transition-all">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 bg-brand-primary/5 text-brand-primary rounded-lg flex items-center justify-center group-hover:bg-brand-primary group-hover:text-white transition-all shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="text-xs font-bold text-gray-700 group-hover:text-brand-primary transition-colors leading-snug flex items-center gap-2 truncate">
                        {notice.title}
                        {notice.fileUrl && (
                          <Paperclip className="w-3 h-3 text-brand-accent" />
                        )}
                      </h5>
                      <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-wider">
                        <Calendar className="w-3 h-3" />
                        {new Date(notice.date).toLocaleDateString('bn-BD', { month: 'short', day: 'numeric', year: 'numeric' })}
                        <span className="mx-1">|</span>
                        {new Date(notice.date).toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.li>
            ))}
            {notices.length === 0 && (
              <li className="text-center py-10 text-xs text-gray-400 font-bold uppercase tracking-widest italic">কোনো সাম্প্রতিক নোটিশ নেই।</li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
}
