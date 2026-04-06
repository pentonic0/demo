'use client';

import { useState, useEffect } from "react";
import { BookOpen, FileText, Download, Loader2, ExternalLink, Calendar, GraduationCap } from "lucide-react";
import { supabasePublic } from "@/src/lib/supabase";
import { motion } from "motion/react";

interface AcademicData {
  subjects: string[];
  routineUrl: string;
}

export default function Academic() {
  const [academicData, setAcademicData] = useState<AcademicData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAcademic = async () => {
      try {
        const { data, error } = await supabasePublic
          .from("settings")
          .select("academic_subjects, academic_routine_url")
          .eq("id", "main")
          .single();
        if (error) throw error;
        if (data) {
          setAcademicData({
            subjects: data.academic_subjects || [],
            routineUrl: data.academic_routine_url || ""
          });
        }
      } catch (error) {
        console.error("Failed to fetch academic Data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAcademic();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-10 h-10 text-green-700 animate-spin" />
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
            একাডেমিক শ্রেষ্ঠত্ব
          </div>
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tighter leading-none">
            আমাদের <span className="text-green-300">পাঠ্যক্রম</span>
          </h1>
          <p className="text-green-100/70 text-xs font-medium max-w-xl">
            আমরা একটি ব্যাপক এবং ভারসাম্যপূর্ণ শিক্ষা প্রদান করি যা বুদ্ধিবৃত্তিক কৌতূহল এবং ব্যক্তিগত বৃদ্ধি লালন করার জন্য ডিজাইন করা হয়েছে।
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Subjects Section */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-8"
        >
          <div className="flex items-center gap-4 border-b-2 border-green-600 pb-4">
            <div className="w-12 h-12 bg-green-100 text-green-700 rounded-2xl flex items-center justify-center">
              <BookOpen className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tight">পাঠ্য বিষয়সমূহ</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {academicData?.subjects && academicData.subjects.length > 0 ? (
              academicData.subjects.map((subject, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  key={i}
                  className="bg-white p-4 rounded-2xl border border-gray-100 shadow-lg shadow-gray-200/30 flex items-center gap-3 group hover:border-green-500 transition-all"
                >
                  <div className="w-8 h-8 bg-green-50 text-green-700 rounded-lg flex items-center justify-center group-hover:bg-green-700 group-hover:text-white transition-all">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-bold text-gray-700 uppercase tracking-tight">{subject}</span>
                </motion.div>
              ))
            ) : (
              <p className="text-gray-500 italic col-span-full">এখনো কোনো বিষয় তালিকাভুক্ত করা হয়নি।</p>
            )}
          </div>
        </motion.div>

        {/* Class Routine Section */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-8"
        >
          <div className="flex items-center gap-4 border-b-2 border-green-600 pb-4">
            <div className="w-12 h-12 bg-green-100 text-green-700 rounded-2xl flex items-center justify-center">
              <Calendar className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tight">ক্লাস রুটিন</h2>
          </div>

          {academicData?.routineUrl ? (
            <div className="bg-white rounded-3xl border border-gray-100 shadow-2xl shadow-gray-200/50 overflow-hidden">
              <div className="p-6 bg-gray-50 flex items-center justify-between border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-red-500" />
                  <span className="text-xs font-black text-gray-800 uppercase tracking-widest">Routine_2026.pdf</span>
                </div>
                <div className="flex items-center gap-2">
                  <a 
                    href={academicData.routineUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 bg-white text-gray-500 hover:text-green-700 rounded-xl border border-gray-200 transition-all shadow-sm"
                    title="নতুন ট্যাবে খুলুন"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <button 
                    onClick={async () => {
                      try {
                        const response = await fetch(academicData.routineUrl);
                        const blob = await response.blob();
                        const url = window.URL.createObjectURL(blob);
                        const link = document.createElement('a');
                        link.href = url;
                        link.setAttribute('download', 'Class_Routine.pdf');
                        document.body.appendChild(link);
                        link.click();
                        link.parentNode?.removeChild(link);
                        window.URL.revokeObjectURL(url);
                      } catch (error) {
                        window.open(academicData.routineUrl, '_blank');
                      }
                    }}
                    className="flex items-center gap-2 bg-green-700 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-green-800 transition-all shadow-lg shadow-green-900/20"
                  >
                    <Download className="w-4 h-4" /> ডাউনলোড
                  </button>
                </div>
              </div>
              <div className="aspect-[3/4] w-full bg-gray-100">
                <iframe 
                  src={`https://docs.google.com/viewer?url=${encodeURIComponent(academicData.routineUrl)}&embedded=true`} 
                  className="w-full h-full"
                  title="Class Routine Preview"
                  frameBorder="0"
                />
              </div>
            </div>
          ) : (
            <div className="bg-white p-12 rounded-3xl border border-dashed border-gray-300 text-center space-y-4">
              <Calendar className="w-12 h-12 text-gray-300 mx-auto" />
              <p className="text-sm text-gray-500 font-bold uppercase tracking-widest">ক্লাস রুটিন এখনো আপলোড করা হয়নি।</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
