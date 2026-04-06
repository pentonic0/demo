'use client';

import { useState, useEffect } from "react";
import { Plus, Trash2, Image as ImageIcon, X, CheckCircle, Upload, Loader2, Edit2, AlertTriangle } from "lucide-react";
import { supabasePublic } from "@/src/lib/supabase";
import { createGenericAction, updateGenericAction, deleteGenericAction } from "@/src/actions/admin";
import FileUpload from "@/src/components/FileUpload";
import ConfirmModal from "@/src/components/ConfirmModal";

interface SliderItem {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  order: number;
}

export default function ManageSlider() {
  const [sliderItems, setSliderItems] = useState<SliderItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<null | SliderItem>(null);
  const [formData, setFormData] = useState({ 
    title: "", 
    subtitle: "", 
    image: "",
    order: 0
  });
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; id: string | null }>({ isOpen: false, id: null });
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchSliders = async () => {
    try {
      const { data, error } = await supabasePublic
        .from("sliders")
        .select("*")
        .order("display_order", { ascending: true });
      if (error) throw error;
      if (data) {
        setSliderItems(data.map((s: any) => ({
          id: s.id,
          title: s.title,
          subtitle: s.subtitle,
          image: s.image_url,
          order: s.display_order
        })));
      }
    } catch (error) {
      console.error("Failed to fetch sliders", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSliders();
  }, []);

  const handleOpenModal = (item?: SliderItem) => {
    if (item) {
      setEditingItem(item);
      setFormData({ ...item });
    } else {
      setEditingItem(null);
      setFormData({ 
        title: "", 
        subtitle: "", 
        image: "",
        order: sliderItems.length > 0 ? Math.max(...sliderItems.map(i => i.order)) + 1 : 0
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.image) {
      alert("Please upload an image for the slide.");
      return;
    }
    setIsSubmitting(true);
    try {
      const dbData = {
        title: formData.title,
        subtitle: formData.subtitle,
        image_url: formData.image,
        display_order: formData.order
      };
      if (editingItem) {
        await updateGenericAction('sliders', editingItem.id, dbData);
      } else {
        await createGenericAction('sliders', dbData);
      }
      await fetchSliders();
      handleCloseModal();
    } catch (error) {
      console.error("Error submitting slider:", error);
      alert("Failed to save slider.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm.id) return;
    setIsDeleting(true);
    try {
      await deleteGenericAction('sliders', deleteConfirm.id);
      await fetchSliders();
      setDeleteConfirm({ isOpen: false, id: null });
    } catch (error) {
      console.error("Error deleting slider:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-6 rounded-sm shadow-sm border border-gray-200">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 uppercase tracking-tight flex items-center gap-3">
            <ImageIcon className="w-8 h-8 text-green-700" /> হিরো স্লাইডার পরিচালনা
          </h1>
          <p className="text-xs text-gray-500 font-bold uppercase tracking-tighter mt-1">হোমপেজ ব্যানার ইমেজ পরিচালনা করুন</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-green-700 text-white px-6 py-2.5 rounded-md font-bold uppercase tracking-wider hover:bg-green-800 transition-all flex items-center gap-2 shadow-md hover:shadow-lg active:scale-95"
        >
          <Plus className="w-5 h-5" /> স্লাইড যোগ করুন
        </button>
      </div>

      <div className="bg-white rounded-sm shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-10 h-10 text-green-700 animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {sliderItems.map((item) => (
                <div key={item.id} className="bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden group relative">
                  <div className="h-56 overflow-hidden">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                  </div>
                  <div className="p-4 bg-gray-900 text-white">
                    <h3 className="text-sm font-bold uppercase truncate">{item.title}</h3>
                    <p className="text-xs text-yellow-400 mt-1 italic line-clamp-1">{item.subtitle}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded uppercase">ক্রম: {item.order}</span>
                    </div>
                  </div>
                  <div className="absolute top-2 right-2 flex gap-2 z-10">
                    <button 
                      onClick={() => handleOpenModal(item)}
                      className="p-2 bg-blue-600/90 hover:bg-blue-600 text-white rounded-md shadow-lg transition-all active:scale-95"
                      title="সম্পাদনা করুন"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => setDeleteConfirm({ isOpen: true, id: item.id })}
                      className="p-2 bg-red-600/90 hover:bg-red-600 text-white rounded-md shadow-lg transition-all active:scale-95"
                      title="মুছে ফেলুন"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              {sliderItems.length === 0 && (
                <div className="col-span-full text-center py-12 text-gray-500 italic">কোনো স্লাইড পাওয়া যায়নি।</div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 lg:p-8">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={handleCloseModal} />
          <div className="bg-white w-full max-w-xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col relative z-10 animate-in fade-in zoom-in duration-300">
            <div className="bg-gradient-to-r from-green-800 to-emerald-900 text-white px-8 py-6 flex justify-between items-center shrink-0 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl" />
              <div className="relative z-10">
                <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight flex items-center gap-4">
                  <div className="bg-white/10 p-2.5 rounded-xl backdrop-blur-md ring-1 ring-white/20">
                    {editingItem ? <Edit2 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                  </div>
                  {editingItem ? "স্লাইড সম্পাদনা" : "নতুন স্লাইড যোগ করুন"}
                </h2>
              </div>
              <button 
                onClick={handleCloseModal} 
                className="relative z-10 w-10 h-10 bg-white/10 hover:bg-rose-500 text-white rounded-xl transition-all flex items-center justify-center group active:scale-90 shadow-lg"
              >
                <X className="w-5 h-5 group-hover:rotate-90 transition-transform" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 lg:p-8 overflow-y-auto flex-grow custom-scrollbar bg-slate-50/30 space-y-6">
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-5">
                <div>
                  <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">স্লাইড শিরোনাম</label>
                  <input
                    type="text"
                    required
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white text-sm font-bold transition-all"
                    placeholder="স্লাইড শিরোনাম লিখুন"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">উপশিরোনাম / ক্যাপশন</label>
                  <input
                    type="text"
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white text-sm font-bold transition-all"
                    placeholder="উপশিরোনাম লিখুন"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
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

              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-5">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                  <Upload className="w-3 h-3" /> ব্যানার ইমেজ
                </h3>
                <div className="bg-slate-50 p-5 rounded-2xl border-2 border-dashed border-slate-200 hover:border-green-400 transition-colors">
                  <FileUpload 
                    path="slider"
                    onUploadComplete={(url) => setFormData({ ...formData, image: url })}
                    accept="image/*"
                    label="স্লাইড ইমেজ নির্বাচন করুন"
                  />
                  {formData.image && (
                    <div className="mt-4 flex items-center gap-3 p-3 bg-green-50 rounded-xl border border-green-100">
                      <div className="text-[10px] font-black text-green-700 uppercase tracking-widest flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" /> ইমেজ আপলোড সফল
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
                  {isSubmitting ? "সংরক্ষণ হচ্ছে..." : (editingItem ? "স্লাইড আপডেট করুন" : "স্লাইড সংরক্ষণ করুন")}
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
        title="স্লাইডার ইমেজ মুছে ফেলুন"
        message="আপনি কি নিশ্চিত যে আপনি এই স্লাইডার ইমেজটি মুছে ফেলতে চান? এই কাজটি আর ফিরিয়ে আনা যাবে না।"
        confirmText="স্লাইড মুছে ফেলুন"
      />
    </div>
  );
}

