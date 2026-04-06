'use client';

import { useState, useEffect } from "react";
import { Plus, Search, Edit2, Trash2, FileText, Calendar, Clock, X, CheckCircle, Loader2, Paperclip, AlertTriangle, Bell } from "lucide-react";
import { supabasePublic } from "@/src/lib/supabase";
import { createNoticeAction, updateNoticeAction, deleteNoticeAction, updateSettingsAction } from "@/src/actions/admin";
import FileUpload from "@/src/components/FileUpload";
import ConfirmModal from "@/src/components/ConfirmModal";
import { useSettings } from "@/src/contexts/SettingsContext";
import { cn } from "@/src/lib/utils";

interface Notice {
  id: string;
  title: string;
  date: string;
  content: string;
  authorId: string;
  fileUrl?: string;
}

export default function ManageNotices() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState<null | Notice>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState<{ title: string; date: string; content: string; fileUrl?: string; isScheduled: boolean }>({ 
    title: "", 
    date: "", 
    content: "",
    fileUrl: "",
    isScheduled: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; id: string | null }>({ isOpen: false, id: null });
  const [isDeleting, setIsDeleting] = useState(false);
  const { settings, refreshSettings } = useSettings();
  const [isMarking, setIsMarking] = useState<string | null>(null);

  const fetchNotices = async () => {
    try {
      const { data, error } = await supabasePublic
        .from("notices")
        .select("*")
        .order("date", { ascending: false });
      if (error) throw error;
      if (data) {
        setNotices(data.map((n: any) => ({
          id: n.id,
          title: n.title,
          date: n.date,
          content: n.content,
          authorId: n.author_id,
          fileUrl: n.file_url
        })));
      }
    } catch (error) {
      console.warn("Notice fetch skipped:", error instanceof Error ? error.message : error);
      setNotices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const filteredNotices = notices.filter(n => n.title.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleOpenModal = (notice?: Notice) => {
    if (notice) {
      const noticeDate = new Date(notice.date);
      const now = new Date();
      setEditingNotice(notice);
      
      // Format notice date for datetime-local
      const dateForInput = new Date(noticeDate.getTime() - noticeDate.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
      
      setFormData({ 
        title: notice.title, 
        date: dateForInput, 
        content: notice.content,
        fileUrl: notice.fileUrl || "",
        isScheduled: noticeDate > now
      });
    } else {
      setEditingNotice(null);
      const now = new Date();
      // Format to YYYY-MM-DDTHH:mm for datetime-local
      const nowStr = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
      setFormData({ 
        title: "", 
        date: nowStr, 
        content: "",
        fileUrl: "",
        isScheduled: false
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingNotice(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const dbDate = formData.isScheduled 
        ? new Date(formData.date).toISOString() 
        : new Date().toISOString();

      const submitData = {
        title: formData.title,
        date: dbDate,
        content: formData.content,
        fileUrl: formData.fileUrl
      };

      if (editingNotice) {
        await updateNoticeAction(editingNotice.id, submitData);
      } else {
        await createNoticeAction(submitData);
      }
      await fetchNotices();
      handleCloseModal();
    } catch (error) {
      console.error("Error submitting notice:", error);
      alert("Failed to save notice.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm.id) return;
    setIsDeleting(true);
    try {
      await deleteNoticeAction(deleteConfirm.id);
      await fetchNotices();
      setDeleteConfirm({ isOpen: false, id: null });
    } catch (error) {
      console.error("Error deleting notice:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleMarkLatest = async (notice: Notice) => {
    setIsMarking(notice.id);
    try {
      // Fetch fresh settings from DB to avoid stale client state issues
      const { data: currentSettings } = await supabasePublic
        .from("settings")
        .select("latest_updates, maintenance_mode, show_popup_banner, popup_banner_image, popup_banner_link, popup_banner_id")
        .eq("id", "main")
        .single();

      if (currentSettings) {
        const currentUpdates = currentSettings.latest_updates || [];
        const exists = currentUpdates.some((u: any) => u.text === notice.title);
        let newUpdates;

        if (exists) {
          // Remove it
          newUpdates = currentUpdates.filter((u: any) => u.text !== notice.title);
        } else {
          // Add it
          const newUpdate = {
            text: notice.title,
            link: `/notice/${notice.id}`
          };
          newUpdates = [...currentUpdates, newUpdate];
        }

        await updateSettingsAction({
          maintenanceMode: currentSettings.maintenance_mode,
          showLatestUpdate: true,
          latestUpdates: newUpdates,
          showPopupBanner: currentSettings.show_popup_banner,
          popupBannerImage: currentSettings.popup_banner_image,
          popupBannerLink: currentSettings.popup_banner_link,
          popupBannerId: currentSettings.popup_banner_id
        });

        // Sync the context state
        await refreshSettings();
      }
    } catch (error) {
      console.error("Failed to toggle latest update", error);
    } finally {
      setIsMarking(null);
    }
  };

  const isPDF = (url: string) => {
    if (!url) return false;
    const lowerUrl = url.toLowerCase();
    return lowerUrl.endsWith('.pdf') || 
           lowerUrl.includes('.pdf?') || 
           url.includes('/raw/upload/') || 
           (url.includes('res.cloudinary.com') && lowerUrl.includes('pdf'));
  };

  return (
    <div className="space-y-8 font-sans pb-10">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 bg-white p-8 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-gray-800 uppercase tracking-tighter flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 text-green-700 rounded-2xl flex items-center justify-center">
              <FileText className="w-7 h-7" />
            </div>
            নোটিশ পরিচালনা
          </h1>
          <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] ml-1">কেন্দ্রীভূত নোটিশ বোর্ড প্রশাসন</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="w-full lg:w-auto bg-green-700 text-white px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-green-800 transition-all flex items-center justify-center gap-2 shadow-xl shadow-green-900/20 hover:shadow-green-900/30 active:scale-95"
        >
          <Plus className="w-5 h-5" /> নতুন নোটিশ যোগ করুন
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-50 bg-gray-50/30 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="relative w-full md:w-96 group">
            <input
              type="text"
              placeholder="শিরোনাম দিয়ে অনুসন্ধান করুন..."
              className="w-full pl-12 pr-10 py-3.5 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm transition-all group-hover:border-green-300 shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-green-500 transition-colors" />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">মোট রেকর্ড</p>
              <p className="text-lg font-black text-gray-800">{filteredNotices.length} <span className="text-xs text-gray-400 font-bold uppercase">নোটিশ</span></p>
            </div>
            <div className="w-px h-10 bg-gray-200" />
            <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-gray-300" />
            </div>
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
                    <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">তারিখ ও রেফারেন্স</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">নোটিশের বিবরণ</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-right">অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredNotices.map((notice) => (
                    <tr key={notice.id} className="hover:bg-green-50/30 transition-all duration-300 group">
                      <td className="px-8 py-6 whitespace-nowrap">
                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center gap-2 text-sm font-black text-slate-800">
                            <Calendar className="w-4 h-4 text-green-600" />
                            {new Date(notice.date).toLocaleDateString('bn-BD', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </div>
                          <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
                            {new Date(notice.date).toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })}
                          </div>
                          <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-0.5 rounded-md self-start border border-slate-100">
                            ID: {notice.id.slice(0, 8).toUpperCase()}
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <div className="text-base font-black text-slate-800 group-hover:text-green-700 transition-colors leading-tight">
                              {notice.title}
                            </div>
                            {notice.fileUrl && (
                              <div className="flex items-center gap-1 bg-blue-50 text-blue-600 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-tighter border border-blue-100 shadow-sm">
                                <Paperclip className="w-3 h-3" /> PDF
                              </div>
                            )}
                          </div>
                          <div className="text-xs text-slate-400 line-clamp-1 font-medium italic max-w-xl">
                            {notice.content}
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex justify-end items-center gap-3">
                          <button 
                            onClick={() => handleMarkLatest(notice)}
                            disabled={isMarking === notice.id}
                            className={cn(
                              "w-10 h-10 rounded-xl flex items-center justify-center transition-all shadow-sm group/btn",
                              settings.latestUpdates?.some(u => u.text === notice.title)
                                ? "text-white bg-green-600 shadow-green-200" 
                                : "text-slate-400 bg-slate-50 hover:bg-green-100 hover:text-green-600"
                            )}
                            title="সর্বশেষ আপডেট হিসেবে চিহ্নিত করুন"
                          >
                            {isMarking === notice.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Bell className={cn("w-4 h-4 group-hover/btn:scale-110 transition-transform", settings.latestUpdates?.some(u => u.text === notice.title) && "fill-current")} />
                            )}
                          </button>
                          <button 
                            onClick={() => handleOpenModal(notice)}
                            className="w-10 h-10 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-xl flex items-center justify-center transition-all shadow-sm shadow-blue-100 group/btn"
                            title="নোটিশ সম্পাদনা করুন"
                          >
                            <Edit2 className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                          </button>
                          <button 
                            onClick={() => setDeleteConfirm({ isOpen: true, id: notice.id })}
                            className="w-10 h-10 bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white rounded-xl flex items-center justify-center transition-all shadow-sm shadow-rose-100 group/btn"
                            title="নোটিশ মুছে ফেলুন"
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
              <div className="md:hidden divide-y divide-gray-50">
                {filteredNotices.map((notice) => (
                  <div key={notice.id} className="p-6 space-y-4">
                    <div className="flex justify-between items-start gap-4">
                      <div className="space-y-1">
                        <div className="text-sm font-black text-gray-800 leading-tight">{notice.title}</div>
                        <div className="flex flex-col gap-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-3 h-3 text-green-600" />
                            {new Date(notice.date).toLocaleDateString('bn-BD', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </div>
                          <div className="flex items-center gap-1.5 ml-0.5">
                            <Clock className="w-2.5 h-2.5 text-slate-400" />
                            {new Date(notice.date).toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </div>
                      {notice.fileUrl && (
                        <div className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter shrink-0">
                          PDF
                        </div>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 line-clamp-2 italic">{notice.content}</div>
                    <div className="flex items-center gap-2 pt-2">
                      <button 
                        onClick={() => handleMarkLatest(notice)}
                        disabled={isMarking === notice.id}
                        className={cn(
                          "flex-1 h-10 rounded-xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all",
                          settings.latestUpdates?.some(u => u.text === notice.title)
                            ? "text-white bg-green-600" 
                            : "text-gray-500 bg-gray-50 border border-gray-100"
                        )}
                      >
                        {isMarking === notice.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Bell className="w-3 h-3" />}
                        আপডেট
                      </button>
                      <button 
                        onClick={() => handleOpenModal(notice)}
                        className="flex-1 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest"
                      >
                        <Edit2 className="w-3 h-3" /> সম্পাদনা
                      </button>
                      <button 
                        onClick={() => setDeleteConfirm({ isOpen: true, id: notice.id })}
                        className="w-10 h-10 bg-red-50 text-red-600 rounded-xl flex items-center justify-center"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
          {filteredNotices.length === 0 && !loading && (
            <div className="text-center py-24 space-y-4">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
                <Search className="w-10 h-10 text-gray-200" />
              </div>
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest italic">আপনার অনুসন্ধানের সাথে মেলে এমন কোনো নোটিশ পাওয়া যায়নি।</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 lg:p-8">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={handleCloseModal} />
          <div className="bg-white w-full max-w-3xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col relative z-10 animate-in fade-in zoom-in duration-300">
            <div className="bg-gradient-to-r from-green-800 to-emerald-900 text-white px-8 py-6 flex justify-between items-center shrink-0 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl" />
              <div className="relative z-10">
                <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight flex items-center gap-4">
                  <div className="bg-white/10 p-2.5 rounded-xl backdrop-blur-md ring-1 ring-white/20">
                    {editingNotice ? <Edit2 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                  </div>
                  {editingNotice ? "নোটিশ সম্পাদনা" : "নতুন নোটিশ যোগ করুন"}
                </h2>
              </div>
              <button 
                onClick={handleCloseModal} 
                className="relative z-10 w-10 h-10 bg-white/10 hover:bg-rose-500 text-white rounded-xl transition-all flex items-center justify-center group active:scale-90 shadow-lg"
              >
                <X className="w-5 h-5 group-hover:rotate-90 transition-transform" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 lg:p-10 overflow-y-auto flex-grow custom-scrollbar bg-slate-50/30 space-y-6">
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-5">
                <div>
                  <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">নোটিশের শিরোনাম</label>
                  <input
                    type="text"
                    required
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white text-sm font-bold transition-all"
                    placeholder="নোটিশের শিরোনাম লিখুন"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>
                
                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer"
                      checked={formData.isScheduled}
                      onChange={(e) => setFormData({ ...formData, isScheduled: e.target.checked })}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                  </label>
                  <span className="text-xs font-black text-slate-700 uppercase tracking-widest">শিডিউল নোটিশ</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 transition-all duration-300">
                  <div className={cn("transition-all duration-300", !formData.isScheduled && "opacity-50 pointer-events-none grayscale invisible")}>
                    <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">প্রকাশের তারিখ ও সময়</label>
                    <div className="relative">
                      <input
                        type="datetime-local"
                        required={formData.isScheduled}
                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white text-sm font-bold transition-all appearance-none"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      />
                      <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                  
                  <div className={cn("transition-all duration-300", !formData.isScheduled && "md:col-span-2")}>
                    <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">সংযুক্তি (ঐচ্ছিক)</label>
                    <div className="bg-slate-50 p-3 rounded-2xl border-2 border-dashed border-slate-200 hover:border-green-400 transition-colors">
                      <FileUpload 
                        path="notices"
                        onUploadComplete={(url) => setFormData(prev => ({ ...prev, fileUrl: url }))}
                        accept="image/*,application/pdf"
                        label="PDF বা ইমেজ আপলোড করুন"
                      />
                    </div>
                  </div>
                </div>

                {formData.fileUrl && (
                  <div className="mt-4 p-5 bg-slate-50 rounded-3xl border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-[10px] font-black text-green-600 uppercase tracking-widest">
                        <CheckCircle className="w-4 h-4" /> ফাইল সংযুক্ত করা হয়েছে
                      </div>
                      <button 
                        type="button"
                        onClick={() => setFormData({ ...formData, fileUrl: "" })}
                        className="text-[10px] font-black text-rose-500 uppercase tracking-widest hover:underline flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" /> মুছে ফেলুন
                      </button>
                    </div>
                    <div className="rounded-2xl overflow-hidden bg-white border border-slate-100 shadow-inner max-h-[200px] flex items-center justify-center">
                      {isPDF(formData.fileUrl) ? (
                        <div className="flex flex-col items-center justify-center p-8 gap-3 text-sm text-slate-600 font-bold">
                          <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-xl flex items-center justify-center shadow-sm">
                            <FileText className="w-6 h-6" />
                          </div>
                          <div className="text-center space-y-1">
                            <p className="uppercase tracking-tighter text-[10px]">PDF ডকুমেন্ট সংযুক্ত</p>
                            <a 
                              href={formData.fileUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-[10px] text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1 justify-center"
                            >
                              পুরো ডকুমেন্ট দেখুন <Paperclip className="w-3 h-3" />
                            </a>
                          </div>
                        </div>
                      ) : (
                        <img 
                          src={formData.fileUrl} 
                          alt="Preview" 
                          className="max-w-full max-h-[200px] object-contain p-2"
                          referrerPolicy="no-referrer"
                        />
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-3 ml-1">নোটিশের বিষয়বস্তু</label>
                <textarea
                  required
                  rows={6}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white text-sm font-medium transition-all leading-relaxed"
                  placeholder="নোটিশের বিস্তারিত বিবরণ এখানে লিখুন..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
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
                  {isSubmitting ? "সংরক্ষণ হচ্ছে..." : (editingNotice ? "নোটিশ আপডেট করুন" : "নোটিশ সংরক্ষণ করুন")}
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
        title="নোটিশ মুছে ফেলুন"
        message="আপনি কি নিশ্চিত যে আপনি এই নোটিশটি মুছে ফেলতে চান? এই পদক্ষেপটি পূর্বাবস্থায় ফিরিয়ে আনা যাবে না।"
        confirmText="নোটিশ মুছে ফেলুন"
      />
    </div>
  );
}

