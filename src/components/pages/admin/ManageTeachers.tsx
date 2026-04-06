'use client';

import { useState, useEffect } from "react";
import { Plus, Search, Edit2, Trash2, Users, Mail, Phone, GraduationCap, Briefcase, X, CheckCircle, Upload, Loader2, AlertTriangle, User, FileText } from "lucide-react";
import { supabasePublic } from "@/src/lib/supabase";
import { createTeacherAction, updateTeacherAction, deleteTeacherAction } from "@/src/actions/admin";
import FileUpload from "@/src/components/FileUpload";
import ConfirmModal from "@/src/components/ConfirmModal";

interface TeacherData {
  id: string;
  name: string;
  designation: string;
  department: string;
  qualification: string;
  experience: string;
  email: string;
  phone: string;
  image: string;
  order: number;
  facebookLink?: string;
  about?: string;
}

export default function ManageTeachers() {
  const [teachers, setTeachers] = useState<TeacherData[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<null | TeacherData>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; id: string | null }>({ isOpen: false, id: null });
  const [isDeleting, setIsDeleting] = useState(false);
  const [formData, setFormData] = useState({ 
    name: "", 
    designation: "", 
    department: "", 
    qualification: "", 
    experience: "", 
    email: "", 
    phone: "",
    image: "",
    order: 0,
    facebookLink: "",
    about: ""
  });

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
          experience: t.experience,
          email: t.email,
          phone: t.phone,
          image: t.image,
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

  useEffect(() => {
    fetchTeachers();
  }, []);

  const filteredTeachers = teachers.filter(t => t.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleOpenModal = (teacher?: TeacherData) => {
    if (teacher) {
      setEditingTeacher(teacher);
      setFormData({ 
        name: teacher.name,
        designation: teacher.designation,
        department: teacher.department,
        qualification: teacher.qualification,
        experience: teacher.experience,
        email: teacher.email,
        phone: teacher.phone,
        image: teacher.image,
        order: teacher.order,
        facebookLink: teacher.facebookLink || "",
        about: teacher.about || ""
      });
    } else {
      setEditingTeacher(null);
      setFormData({ 
        name: "", 
        designation: "", 
        department: "", 
        qualification: "", 
        experience: "", 
        email: "", 
        phone: "",
        image: "",
        order: teachers.length > 0 ? Math.max(...teachers.map(t => t.order)) + 1 : 0,
        facebookLink: "",
        about: ""
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTeacher(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingTeacher) {
        await updateTeacherAction(editingTeacher.id, formData);
      } else {
        await createTeacherAction(formData);
      }
      await fetchTeachers();
      handleCloseModal();
    } catch (error) {
      console.error("Error submitting teacher:", error);
      alert("Failed to save teacher.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm.id) return;
    setIsDeleting(true);
    try {
      await deleteTeacherAction(deleteConfirm.id);
      await fetchTeachers();
      setDeleteConfirm({ isOpen: false, id: null });
    } catch (error) {
      console.error("Error deleting teacher:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-6 rounded-sm shadow-sm border border-gray-200">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 uppercase tracking-tight flex items-center gap-3">
            <Users className="w-8 h-8 text-green-700" /> শিক্ষক পরিচালনা
          </h1>
          <p className="text-xs text-gray-500 font-bold uppercase tracking-tighter mt-1">স্কুলের শিক্ষক ও কর্মকর্তাদের তথ্য পরিচালনা করুন</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-green-700 text-white px-6 py-2.5 rounded-md font-bold uppercase tracking-wider hover:bg-green-800 transition-all flex items-center gap-2 shadow-md hover:shadow-lg active:scale-95"
        >
          <Plus className="w-5 h-5" /> নতুন শিক্ষক যোগ করুন
        </button>
      </div>

      <div className="bg-white rounded-sm shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="শিক্ষক অনুসন্ধান করুন..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
          <div className="text-xs text-gray-500 font-bold uppercase tracking-widest">
            মোট: {filteredTeachers.length} জন শিক্ষক
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
              <Loader2 className="w-12 h-12 text-green-700 animate-spin" />
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ডেটা লোড হচ্ছে...</p>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <table className="w-full text-left border-collapse hidden md:table">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">শিক্ষক</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">পদবী ও বিভাগ</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">যোগাযোগ</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-right">অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredTeachers.map((teacher) => (
                    <tr key={teacher.id} className="hover:bg-green-50/30 transition-all duration-300 group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-white shadow-md ring-1 ring-slate-100 shrink-0 group-hover:scale-105 transition-transform duration-500">
                            <img src={teacher.image || "https://picsum.photos/seed/placeholder/300/400"} alt={teacher.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          </div>
                          <div>
                            <p className="text-base font-black text-slate-800 leading-tight group-hover:text-green-700 transition-colors">{teacher.name}</p>
                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">আইডি: {teacher.id.slice(0, 8).toUpperCase()}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="space-y-1">
                          <p className="text-sm font-black text-slate-700">{teacher.designation}</p>
                          <p className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-md inline-block">{teacher.department}</p>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                            <Mail className="w-3.5 h-3.5 text-slate-400" />
                            {teacher.email}
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex justify-end items-center gap-3">
                          <button 
                            onClick={() => handleOpenModal(teacher)}
                            className="w-10 h-10 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-xl flex items-center justify-center transition-all shadow-sm shadow-blue-100 group/btn"
                            title="সম্পাদনা করুন"
                          >
                            <Edit2 className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                          </button>
                          <button 
                            onClick={() => setDeleteConfirm({ isOpen: true, id: teacher.id })}
                            className="w-10 h-10 bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white rounded-xl flex items-center justify-center transition-all shadow-sm shadow-rose-100 group/btn"
                            title="মুছে ফেলুন"
                          >
                            <Trash2 className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Mobile Card View */}
              <div className="md:hidden divide-y divide-gray-100">
                {filteredTeachers.map((teacher) => (
                  <div key={teacher.id} className="p-4 space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-200 shadow-sm shrink-0">
                        <img src={teacher.image || "https://picsum.photos/seed/placeholder/300/400"} alt={teacher.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-bold text-gray-800 truncate">{teacher.name}</div>
                        <div className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter truncate">{teacher.email}</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-[10px] font-bold uppercase tracking-widest">
                      <div>
                        <div className="text-gray-400 mb-1">পদবী</div>
                        <div className="text-gray-700">{teacher.designation}</div>
                      </div>
                      <div>
                        <div className="text-gray-400 mb-1">বিভাগ</div>
                        <div className="text-gray-700">{teacher.department}</div>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-2 border-t border-gray-50">
                      <button 
                        onClick={() => handleOpenModal(teacher)}
                        className="flex-1 py-2 bg-blue-50 text-blue-600 rounded-md font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-2"
                      >
                        <Edit2 className="w-3 h-3" /> সম্পাদনা
                      </button>
                      <button 
                        onClick={() => setDeleteConfirm({ isOpen: true, id: teacher.id })}
                        className="flex-1 py-2 bg-red-50 text-red-600 rounded-md font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-2"
                      >
                        <Trash2 className="w-3 h-3" /> মুছুন
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
          {!loading && filteredTeachers.length === 0 && (
            <div className="text-center py-12 text-gray-500 italic">কোনো শিক্ষক পাওয়া যায়নি।</div>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 lg:p-8">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={handleCloseModal} />
          <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col relative z-10 animate-in fade-in zoom-in duration-300">
            <div className="bg-gradient-to-r from-green-800 to-emerald-900 text-white px-8 py-6 flex justify-between items-center shrink-0 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl" />
              <div className="relative z-10">
                <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight flex items-center gap-4">
                  <div className="bg-white/10 p-2.5 rounded-xl backdrop-blur-md ring-1 ring-white/20">
                    {editingTeacher ? <Edit2 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                  </div>
                  {editingTeacher ? "শিক্ষক তথ্য সম্পাদনা" : "নতুন শিক্ষক যোগ করুন"}
                </h2>
              </div>
              <button 
                onClick={handleCloseModal} 
                className="relative z-10 w-10 h-10 bg-white/10 hover:bg-rose-500 text-white rounded-xl transition-all flex items-center justify-center group active:scale-90 shadow-lg"
              >
                <X className="w-5 h-5 group-hover:rotate-90 transition-transform" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 lg:p-10 overflow-y-auto flex-grow custom-scrollbar bg-slate-50/30">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                <div className="space-y-6">
                  <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-5">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                      <User className="w-3 h-3" /> ব্যক্তিগত তথ্য
                    </h3>
                    <div>
                      <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">পুরো নাম</label>
                      <input
                        type="text"
                        required
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white text-sm font-bold transition-all"
                        placeholder="শিক্ষকের পুরো নাম লিখুন"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">পদবী</label>
                      <input
                        type="text"
                        required
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white text-sm font-bold transition-all"
                        placeholder="যেমন: সিনিয়র শিক্ষক"
                        value={formData.designation}
                        onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">বিভাগ</label>
                      <select
                        required
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white text-sm font-bold transition-all appearance-none cursor-pointer"
                        value={formData.department}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      >
                        <option value="">বিভাগ নির্বাচন করুন</option>
                        <option value="Administration">প্রশাসন</option>
                        <option value="Science">বিজ্ঞান</option>
                        <option value="English">ইংরেজি</option>
                        <option value="Mathematics">গণিত</option>
                        <option value="Social Science">সমাজবিজ্ঞান</option>
                        <option value="ICT">আইসিটি</option>
                        <option value="Religious Studies">ধর্ম শিক্ষা</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">শিক্ষাগত যোগ্যতা</label>
                      <input
                        type="text"
                        required
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white text-sm font-bold transition-all"
                        placeholder="যেমন: এম.এসসি (পদার্থবিজ্ঞান), বি.এড."
                        value={formData.qualification}
                        onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-5">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                      <Briefcase className="w-3 h-3" /> পেশাগত তথ্য
                    </h3>
                    <div>
                      <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">অভিজ্ঞতা</label>
                      <input
                        type="text"
                        required
                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white text-sm font-bold transition-all"
                        placeholder="যেমন: ১০ বছর"
                        value={formData.experience}
                        onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">প্রদর্শনের ক্রম</label>
                      <input
                        type="number"
                        required
                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white text-sm font-bold transition-all"
                        value={formData.order}
                        onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-5">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                      <Mail className="w-3 h-3" /> যোগাযোগ ও মিডিয়া
                    </h3>
                    <div>
                      <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">ইমেইল ঠিকানা</label>
                      <input
                        type="email"
                        required
                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white text-sm font-bold transition-all"
                        placeholder="email@school.edu.bd"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">ফোন নম্বর</label>
                      <input
                        type="text"
                        required
                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white text-sm font-bold transition-all"
                        placeholder="+৮৮০ ১XXX XXXXXX"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">ফেসবুক প্রোফাইল লিঙ্ক</label>
                      <input
                        type="url"
                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white text-sm font-bold transition-all"
                        placeholder="https://facebook.com/username"
                        value={formData.facebookLink || ""}
                        onChange={(e) => setFormData({ ...formData, facebookLink: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-5">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                      <Upload className="w-3 h-3" /> প্রোফাইল ছবি
                    </h3>
                    <div className="bg-slate-50 p-5 rounded-2xl border-2 border-dashed border-slate-200 hover:border-green-400 transition-colors">
                      <FileUpload 
                        path="teachers"
                        onUploadComplete={(url) => setFormData({ ...formData, image: url })}
                        accept="image/*"
                        label="ছবি নির্বাচন করুন"
                      />
                      {formData.image && (
                        <div className="mt-4 flex items-center gap-3 p-3 bg-green-50 rounded-xl border border-green-100">
                          <div className="w-10 h-10 rounded-lg overflow-hidden border border-white shadow-sm">
                            <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                          </div>
                          <div className="text-[10px] font-black text-green-700 uppercase tracking-widest flex items-center gap-2">
                            <CheckCircle className="w-4 h-4" /> ছবি আপলোড সফল
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                  <FileText className="w-3 h-3" /> সম্পর্কে / জীবনী
                </h3>
                <textarea
                  rows={4}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white text-sm font-medium transition-all leading-relaxed"
                  placeholder="শিক্ষক সম্পর্কে সংক্ষিপ্ত জীবনী লিখুন..."
                  value={formData.about || ""}
                  onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                />
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-3 pt-8 mt-8 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-8 py-3.5 border border-slate-200 rounded-xl text-sm font-black text-slate-500 hover:bg-slate-50 transition-all uppercase tracking-widest active:scale-95"
                >
                  বাতিল করুন
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3.5 bg-gradient-to-r from-green-700 to-emerald-800 text-white rounded-xl text-sm font-black hover:shadow-xl hover:shadow-green-900/20 transition-all uppercase tracking-widest flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <CheckCircle className="w-5 h-5" />
                  )}
                  {isSubmitting ? "সংরক্ষণ হচ্ছে..." : (editingTeacher ? "তথ্য আপডেট করুন" : "শিক্ষক সংরক্ষণ করুন")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, id: null })}
        onConfirm={handleDelete}
        isSubmitting={isDeleting}
        title="শিক্ষক মুছে ফেলুন"
        message="আপনি কি নিশ্চিত যে আপনি এই শিক্ষকের তথ্য মুছে ফেলতে চান? এই পদক্ষেপটি পূর্বাবস্থায় ফিরিয়ে আনা যাবে না।"
        confirmText="শিক্ষক মুছে ফেলুন"
      />
    </div>
  );
}

