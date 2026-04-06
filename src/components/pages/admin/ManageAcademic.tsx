'use client';

import { useState, useEffect } from "react";
import { BookOpen, FileText, Download, Loader2, ExternalLink, Calendar, GraduationCap, Plus, X, CheckCircle, Trash2 } from "lucide-react";
import { supabasePublic } from "@/src/lib/supabase";
import { updateGenericAction } from "@/src/actions/admin";
import { motion } from "motion/react";
import FileUpload from "@/src/components/FileUpload";

interface AcademicData {
  subjects: string[];
  routineUrl: string;
}

export default function ManageAcademic() {
  const [academicData, setAcademicData] = useState<AcademicData>({ subjects: [], routineUrl: "" });
  const [loading, setLoading] = useState(true);
  const [newSubject, setNewSubject] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchAcademicData = async () => {
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
      console.error("Failed to fetch academic data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAcademicData();
  }, []);

  const handleAddSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.trim()) return;
    
    setIsSubmitting(true);
    try {
      const updatedSubjects = [...(academicData.subjects || []), newSubject.trim()];
      await updateGenericAction("settings", "main", { academic_subjects: updatedSubjects });
      await fetchAcademicData();
      setNewSubject("");
    } catch (error) {
      console.error("Error adding subject", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveSubject = async (index: number) => {
    setIsSubmitting(true);
    try {
      const updatedSubjects = academicData.subjects.filter((_, i) => i !== index);
      await updateGenericAction("settings", "main", { academic_subjects: updatedSubjects });
      await fetchAcademicData();
    } catch (error) {
      console.error("Error removing subject", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRoutineUpload = async (url: string) => {
    setIsSubmitting(true);
    try {
      await updateGenericAction("settings", "main", { academic_routine_url: url });
      await fetchAcademicData();
    } catch (error) {
      console.error("Error uploading routine", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveRoutine = async () => {
    setIsSubmitting(true);
    try {
      await updateGenericAction("settings", "main", { academic_routine_url: "" });
      await fetchAcademicData();
    } catch (error) {
      console.error("Error removing routine", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-10 h-10 text-green-700 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans pb-10">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 bg-white p-8 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-gray-800 uppercase tracking-tighter flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 text-green-700 rounded-2xl flex items-center justify-center">
              <GraduationCap className="w-7 h-7" />
            </div>
            একাডেমিক পরিচালনা
          </h1>
          <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] ml-1">বিষয় এবং ক্লাস রুটিন পরিচালনা করুন</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Manage Subjects */}
        <div className="bg-white rounded-3xl shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-50 bg-gray-50/30">
            <h2 className="text-sm font-black text-gray-800 uppercase tracking-widest flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-green-600" /> পাঠদানকৃত বিষয়সমূহ
            </h2>
          </div>
          <div className="p-6 space-y-6">
            <form onSubmit={handleAddSubject} className="flex gap-2">
              <input 
                type="text"
                placeholder="বিষয়ের নাম লিখুন..."
                className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm font-bold"
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                disabled={isSubmitting}
              />
              <button 
                type="submit"
                disabled={isSubmitting || !newSubject.trim()}
                className="bg-green-700 text-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-green-800 transition-all disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
              </button>
            </form>

            <div className="space-y-2">
              {academicData.subjects && academicData.subjects.length > 0 ? (
                academicData.subjects.map((subject, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100 group hover:border-green-500 transition-all">
                    <span className="text-sm font-bold text-gray-700 uppercase tracking-tight">{subject}</span>
                    <button 
                      onClick={() => handleRemoveSubject(i)}
                      disabled={isSubmitting}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                      title="বিষয় মুছে ফেলুন"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest text-center py-8 italic">এখনও কোনো বিষয় যোগ করা হয়নি।</p>
              )}
            </div>
          </div>
        </div>

        {/* Manage Routine */}
        <div className="bg-white rounded-3xl shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-50 bg-gray-50/30">
            <h2 className="text-sm font-black text-gray-800 uppercase tracking-widest flex items-center gap-2">
              <Calendar className="w-4 h-4 text-green-600" /> ক্লাস রুটিন PDF
            </h2>
          </div>
          <div className="p-6 space-y-6">
            <div className="space-y-4">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">রুটিন আপলোড করুন (শুধুমাত্র PDF)</label>
              <FileUpload 
                path="academic"
                onUploadComplete={handleRoutineUpload}
                accept="application/pdf"
                label="নতুন রুটিন আপলোড করুন"
              />
            </div>

            {academicData.routineUrl ? (
              <div className="p-4 bg-green-50 rounded-2xl border border-green-100 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                      <FileText className="w-5 h-5 text-red-500" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-gray-800 uppercase tracking-tight">Class_Routine.pdf</p>
                      <p className="text-[9px] font-bold text-green-600 uppercase tracking-widest">সক্রিয় ডকুমেন্ট</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <a 
                      href={academicData.routineUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-2 bg-white text-gray-500 hover:text-green-700 rounded-xl border border-gray-200 transition-all shadow-sm"
                      title="রুটিন দেখুন"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                    <button 
                      onClick={handleRemoveRoutine}
                      disabled={isSubmitting}
                      className="p-2 bg-white text-red-500 hover:bg-red-50 rounded-xl border border-gray-200 transition-all shadow-sm"
                      title="রুটিন মুছে ফেলুন"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="aspect-video w-full bg-gray-100 rounded-xl overflow-hidden shadow-inner">
                  <iframe 
                    src={`https://docs.google.com/viewer?url=${encodeURIComponent(academicData.routineUrl)}&embedded=true`} 
                    className="w-full h-full"
                    title="Routine Preview"
                    frameBorder="0"
                  />
                </div>
              </div>
            ) : (
              <div className="p-12 border-2 border-dashed border-gray-200 rounded-3xl text-center space-y-3">
                <FileText className="w-12 h-12 text-gray-200 mx-auto" />
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest">এখনও কোনো রুটিন আপলোড করা হয়নি।</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
