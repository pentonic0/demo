'use client';

import { useState, useEffect } from "react";
import { Plus, Search, Edit2, Trash2, ShieldCheck, Mail, Phone, UserCheck, X, CheckCircle, Upload, Loader2, AlertTriangle } from "lucide-react";
import { supabasePublic } from "@/src/lib/supabase";
import { createGenericAction, updateGenericAction, deleteGenericAction } from "@/src/actions/admin";
import FileUpload from "@/src/components/FileUpload";
import ConfirmModal from "@/src/components/ConfirmModal";

interface CommitteeMember {
  id: string;
  name: string;
  designation: string;
  role: string;
  qualification: string;
  experience: string;
  email: string;
  phone: string;
  image: string;
  order: number;
  facebookLink?: string;
  about?: string;
}

export default function ManageCommittee() {
  const [committee, setCommittee] = useState<CommitteeMember[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<null | CommitteeMember>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; id: string | null }>({ isOpen: false, id: null });
  const [isDeleting, setIsDeleting] = useState(false);
  const [formData, setFormData] = useState({ 
    name: "", 
    designation: "", 
    role: "Governing Body", 
    qualification: "", 
    experience: "", 
    email: "", 
    phone: "",
    image: "",
    order: 0,
    facebookLink: "",
    about: ""
  });

  const fetchCommittee = async () => {
    try {
      const { data, error } = await supabasePublic
        .from("committee")
        .select("*")
        .order("display_order", { ascending: true });
      if (error) throw error;
      if (data) {
        setCommittee(data.map((m: any) => ({
          id: m.id,
          name: m.name,
          designation: m.designation,
          role: m.role,
          qualification: m.qualification,
          experience: m.experience,
          email: m.email,
          phone: m.phone,
          image: m.image,
          order: m.display_order,
          facebookLink: m.facebook_link,
          about: m.about
        })));
      }
    } catch (error) {
      console.error("Failed to fetch committee", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommittee();
  }, []);

  const filteredCommittee = committee.filter(m => m.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleOpenModal = (member?: CommitteeMember) => {
    if (member) {
      setEditingMember(member);
      setFormData({ 
        name: member.name,
        designation: member.designation,
        role: member.role,
        qualification: member.qualification,
        experience: member.experience,
        email: member.email,
        phone: member.phone,
        image: member.image,
        order: member.order,
        facebookLink: member.facebookLink || "",
        about: member.about || ""
      });
    } else {
      setEditingMember(null);
      setFormData({ 
        name: "", 
        designation: "", 
        role: "Governing Body", 
        qualification: "", 
        experience: "", 
        email: "", 
        phone: "",
        image: "",
        order: committee.length > 0 ? Math.max(...committee.map(m => m.order)) + 1 : 0,
        facebookLink: "",
        about: ""
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingMember(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const dbData = {
        name: formData.name,
        designation: formData.designation,
        role: formData.role,
        qualification: formData.qualification,
        experience: formData.experience,
        email: formData.email,
        phone: formData.phone,
        image: formData.image,
        display_order: formData.order,
        facebook_link: formData.facebookLink,
        about: formData.about
      };
      if (editingMember) {
        await updateGenericAction('committee', editingMember.id, dbData);
      } else {
        await createGenericAction('committee', dbData);
      }
      await fetchCommittee();
      handleCloseModal();
    } catch (error) {
      console.error("Error submitting committee member:", error);
      alert("Failed to save member.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm.id) return;
    setIsDeleting(true);
    try {
      await deleteGenericAction('committee', deleteConfirm.id);
      await fetchCommittee();
      setDeleteConfirm({ isOpen: false, id: null });
    } catch (error) {
      console.error("Error deleting committee member:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-6 rounded-sm shadow-sm border border-gray-200">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 uppercase tracking-tight flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-green-700" /> কমিটি পরিচালনা
          </h1>
          <p className="text-xs text-gray-500 font-bold uppercase tracking-tighter mt-1">পরিচালনা পর্ষদের তথ্য পরিচালনা করুন</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-green-700 text-white px-6 py-2.5 rounded-md font-bold uppercase tracking-wider hover:bg-green-800 transition-all flex items-center gap-2 shadow-md hover:shadow-lg active:scale-95"
        >
          <Plus className="w-5 h-5" /> নতুন সদস্য যোগ করুন
        </button>
      </div>

      <div className="bg-white rounded-sm shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="সদস্য অনুসন্ধান করুন..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
          <div className="text-xs text-gray-500 font-bold uppercase tracking-widest">
            মোট: {filteredCommittee.length} জন সদস্য
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-10 h-10 text-green-700 animate-spin" />
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-gray-600 uppercase tracking-wider">সদস্য</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-600 uppercase tracking-wider">পদবী</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-600 uppercase tracking-wider text-right">পদক্ষেপ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredCommittee.map((member) => (
                  <tr key={member.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-200 shadow-sm shrink-0">
                          <img src={member.image || "https://picsum.photos/seed/placeholder/300/400"} alt={member.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-gray-800 group-hover:text-green-700 transition-colors">{member.name}</div>
                          <div className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">{member.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-bold uppercase tracking-tight">
                      {member.designation}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => handleOpenModal(member)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                          title="সম্পাদনা করুন"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => setDeleteConfirm({ isOpen: true, id: member.id })}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                          title="মুছে ফেলুন"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {!loading && filteredCommittee.length === 0 && (
            <div className="text-center py-12 text-gray-500 italic">কোনো সদস্য পাওয়া যায়নি।</div>
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
                    {editingMember ? <Edit2 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                  </div>
                  {editingMember ? "সদস্যের তথ্য সম্পাদনা" : "নতুন সদস্য যোগ করুন"}
                </h2>
              </div>
              <button 
                onClick={handleCloseModal} 
                className="relative z-10 w-10 h-10 bg-white/10 hover:bg-rose-500 text-white rounded-xl transition-all flex items-center justify-center group active:scale-90 shadow-lg"
              >
                <X className="w-5 h-5 group-hover:rotate-90 transition-transform" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 lg:p-10 overflow-y-auto flex-grow custom-scrollbar bg-slate-50/30 space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-5">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                      <UserCheck className="w-3 h-3" /> ব্যক্তিগত তথ্য
                    </h3>
                    <div>
                      <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">পুরো নাম</label>
                      <input
                        type="text"
                        required
                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white text-sm font-bold transition-all"
                        placeholder="পুরো নাম লিখুন"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">পদবী</label>
                      <input
                        type="text"
                        required
                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white text-sm font-bold transition-all"
                        placeholder="যেমন: সভাপতি"
                        value={formData.designation}
                        onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">ভূমিকা</label>
                      <input
                        type="text"
                        required
                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white text-sm font-bold transition-all"
                        placeholder="যেমন: পরিচালনা পর্ষদ"
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">শিক্ষাগত যোগ্যতা</label>
                      <input
                        type="text"
                        required
                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white text-sm font-bold transition-all"
                        placeholder="যেমন: বি.এসসি ইন সিভিল ইঞ্জিনিয়ারিং"
                        value={formData.qualification}
                        onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-5">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                      <Mail className="w-3 h-3" /> যোগাযোগের তথ্য
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
                </div>

                <div className="space-y-6">
                  <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-5">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                      <Upload className="w-3 h-3" /> প্রোফাইল ছবি
                    </h3>
                    <div className="bg-slate-50 p-5 rounded-2xl border-2 border-dashed border-slate-200 hover:border-green-400 transition-colors">
                      <FileUpload 
                        path="committee"
                        onUploadComplete={(url) => setFormData({ ...formData, image: url })}
                        accept="image/*"
                        label="সদস্যের ছবি নির্বাচন করুন"
                      />
                      {formData.image && (
                        <div className="mt-4 flex items-center gap-3 p-3 bg-green-50 rounded-xl border border-green-100">
                          <div className="text-[10px] font-black text-green-700 uppercase tracking-widest flex items-center gap-2">
                            <CheckCircle className="w-4 h-4" /> ছবি আপলোড সফল
                          </div>
                        </div>
                      )}
                    </div>
                    {formData.image && (
                      <div className="mt-4 border border-slate-100 rounded-2xl overflow-hidden h-40 bg-slate-50 shadow-inner group relative">
                        <img src={formData.image} alt="Preview" className="w-full h-full object-contain p-2" referrerPolicy="no-referrer" />
                      </div>
                    )}
                  </div>

                  <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-5">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                      <Edit2 className="w-3 h-3" /> অন্যান্য তথ্য
                    </h3>
                    <div>
                      <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">অভিজ্ঞতা</label>
                      <input
                        type="text"
                        required
                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white text-sm font-bold transition-all"
                        placeholder="যেমন: ২০ বছর"
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
                    <div>
                      <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">সম্পর্কে / জীবনী</label>
                      <textarea
                        rows={4}
                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white text-sm font-bold transition-all resize-none"
                        placeholder="সদস্য সম্পর্কে সংক্ষিপ্ত জীবনী লিখুন..."
                        value={formData.about || ""}
                        onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
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
                  {isSubmitting ? "সংরক্ষণ হচ্ছে..." : (editingMember ? "সদস্যের তথ্য আপডেট করুন" : "সদস্য সংরক্ষণ করুন")}
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
        title="সদস্য মুছে ফেলুন"
        message="আপনি কি নিশ্চিত যে আপনি এই কমিটির সদস্যের তথ্য মুছে ফেলতে চান? এই পদক্ষেপটি পূর্বাবস্থায় ফিরিয়ে আনা যাবে না।"
        confirmText="সদস্য মুছে ফেলুন"
      />
    </div>
  );
}

