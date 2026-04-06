'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Users, Mail, Phone, GraduationCap, Briefcase, Loader2, Facebook, X, ArrowRight, User } from "lucide-react";
import { supabasePublic } from "@/src/lib/supabase";
import { motion, AnimatePresence } from "motion/react";
import { getSafeImageSrc } from "@/src/lib/image";

interface Teacher {
  id: string;
  name: string;
  designation: string;
  department: string;
  qualification: string;
  email: string;
  phone: string;
  image: string;
  order: number;
  facebookLink?: string;
  about?: string;
}

export interface TeachersPageProps {
  id?: string;
}

export default function TeachersPage({ id }: TeachersPageProps) {
  const router = useRouter();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const { data, error } = await supabasePublic
          .from("teachers")
          .select("*")
          .order("display_order", { ascending: true });
        if (error) throw error;
        if (data) {
          setTeachers(data.map((t: any) => ({
            id: t.id,
            name: t.name,
            designation: t.designation,
            department: t.department,
            qualification: t.qualification,
            email: t.email,
            phone: t.phone,
            image: getSafeImageSrc(t.image, "https://picsum.photos/seed/placeholder/300/400"),
            order: t.display_order,
            facebookLink: t.facebook_link,
            about: t.about
          })));
        }
      } catch (error) {
        console.error("Failed to fetch teachers", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTeachers();
  }, []);

  useEffect(() => {
    if (id && teachers.length > 0) {
      const teacher = teachers.find(t => t.id === id);
      if (teacher) {
        setSelectedTeacher(teacher);
      } else {
        router.replace("/teachers");
      }
    } else {
      setSelectedTeacher(null);
    }
  }, [id, teachers, router]);

  const handleCloseDetail = () => {
    router.replace("/teachers");
  };

  return (
    <div className="space-y-12 font-sans pb-20 relative">
      {/* Hero Section */}
      <div className="relative bg-green-800 rounded-[2rem] p-8 sm:p-12 overflow-hidden text-white shadow-2xl shadow-green-900/20">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-64 h-64 bg-black/10 rounded-full blur-2xl" />
        
        <div className="relative z-10 space-y-3 text-center md:text-left">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
            আমাদের শিক্ষকবৃন্দ
          </div>
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tighter leading-none">
            আমাদের <span className="text-green-300">শিক্ষকদের</span> সাথে পরিচিত হন
          </h1>
          <p className="text-green-100/70 text-xs font-medium max-w-md">
            পরবর্তী প্রজন্মের নেতা এবং চিন্তাবিদদের লালনপালনের জন্য নিবেদিত পেশাদার শিক্ষকবৃন্দ।
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-10 h-10 text-green-700 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {teachers.map((teacher) => (
            <motion.div 
              layoutId={`teacher-${teacher.id}`}
              key={teacher.id} 
              onClick={() => router.push(`/teachers/${teacher.id}`)}
              className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden group hover:border-green-500 transition-all cursor-pointer"
            >
              <div className="h-72 overflow-hidden bg-gray-100 relative">
                <img 
                  src={getSafeImageSrc(teacher.image, "https://picsum.photos/seed/placeholder/300/400")} 
                  alt={teacher.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                  <p className="text-white text-[10px] font-black uppercase tracking-[0.2em]">{teacher.department} বিভাগ</p>
                </div>
              </div>
              <div className="p-8 space-y-6">
                <div className="space-y-1">
                  <h3 className="text-xl font-black text-gray-800 uppercase tracking-tight leading-tight">{teacher.name}</h3>
                  <p className="text-xs font-black text-green-700 uppercase tracking-widest">{teacher.designation}</p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-2xl border border-gray-100 group-hover:border-green-100 transition-all">
                    <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center shadow-sm text-green-600">
                      <GraduationCap className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">যোগ্যতা</p>
                      <p className="text-xs font-bold text-gray-700">{teacher.qualification}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex gap-2">
                    <div className="w-10 h-10 bg-gray-50 text-gray-400 group-hover:bg-green-700 group-hover:text-white rounded-xl flex items-center justify-center transition-all shadow-sm border border-gray-100">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest">আইডি নম্বর</p>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">#{teacher.id.slice(-6).toUpperCase()}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
          {teachers.length === 0 && (
            <div className="col-span-full text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
              <Users className="w-16 h-16 text-gray-200 mx-auto mb-4" />
              <p className="text-sm font-black text-gray-400 uppercase tracking-widest italic">ডিরেক্টরিতে কোনো শিক্ষক পাওয়া যায়নি।</p>
            </div>
          )}
        </div>
      )}

      {/* Teacher Detail Modal */}
      <AnimatePresence>
        {selectedTeacher && (
          <div key="teacher-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseDetail}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div
              layoutId={`teacher-${selectedTeacher.id}`}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-4xl max-h-[90vh] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row"
            >
              <button 
                onClick={handleCloseDetail}
                className="absolute top-6 right-6 z-10 w-10 h-10 bg-white/20 backdrop-blur-md hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-all"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-full md:w-2/5 h-64 md:h-auto relative overflow-hidden bg-gray-100">
                <img 
                  src={getSafeImageSrc(selectedTeacher.image, "https://picsum.photos/seed/placeholder/300/400")} 
                  alt={selectedTeacher.name} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8">
                  <p className="text-green-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">{selectedTeacher.department} বিভাগ</p>
                  <h2 className="text-2xl font-black text-white uppercase tracking-tight leading-tight">{selectedTeacher.name}</h2>
                  <p className="text-xs font-black text-gray-300 uppercase tracking-widest mt-1">{selectedTeacher.designation}</p>
                </div>
              </div>

              <div className="flex-1 p-8 sm:p-12 overflow-y-auto custom-scrollbar space-y-8">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 bg-green-50 px-3 py-1 rounded-full text-[10px] font-black text-green-700 uppercase tracking-widest">
                    <User className="w-3 h-3" /> পেশাদার প্রোফাইল
                  </div>
                  <div className="prose prose-sm max-w-none">
                    <p className="text-gray-600 leading-relaxed italic">
                      {selectedTeacher.about || "এই শিক্ষকের জন্য কোনো জীবনী উপলব্ধ নেই।"}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center shadow-sm text-green-600">
                        <GraduationCap className="w-4 h-4" />
                      </div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">যোগ্যতা</p>
                    </div>
                    <p className="text-sm font-bold text-gray-800">{selectedTeacher.qualification}</p>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center shadow-sm text-green-600">
                        <Mail className="w-4 h-4" />
                      </div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">ইমেইল</p>
                    </div>
                    <a href={`mailto:${selectedTeacher.email}`} className="text-sm font-bold text-green-700 hover:underline">{selectedTeacher.email}</a>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center shadow-sm text-green-600">
                        <Phone className="w-4 h-4" />
                      </div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">ফোন</p>
                    </div>
                    <a href={`tel:${selectedTeacher.phone}`} className="text-sm font-bold text-green-700 hover:underline">{selectedTeacher.phone}</a>
                  </div>
                </div>

                {selectedTeacher.facebookLink && (
                  <div className="pt-6 border-t border-gray-100">
                    <a 
                      href={selectedTeacher.facebookLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-3 bg-[#1877F2] text-white px-6 py-3 rounded-2xl font-bold uppercase tracking-widest text-xs hover:shadow-lg hover:scale-105 transition-all"
                    >
                      <Facebook className="w-5 h-5" /> ফেসবুকে অনুসরণ করুন
                    </a>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
