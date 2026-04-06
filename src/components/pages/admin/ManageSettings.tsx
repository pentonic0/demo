'use client';

import { useState, useEffect } from "react";
import { Settings as SettingsIcon, Save, Loader2, CheckCircle, Bell, Image as ImageIcon, Link as LinkIcon, Trash2, Plus, ExternalLink, AlertTriangle } from "lucide-react";
import { updateSettingsAction } from "@/src/actions/admin";
import { supabasePublic } from "@/src/lib/supabase";
import FileUpload from "@/src/components/FileUpload";
import { useSettings } from "@/src/contexts/SettingsContext";
import { cn } from "@/src/lib/utils";
import ConfirmModal from "@/src/components/ConfirmModal";
import { getSafeImageSrc } from "@/src/lib/image";

const Toggle = ({ enabled, onChange, label }: { enabled: boolean; onChange: (val: boolean) => void; label: string }) => (
  <div className="flex items-center gap-3">
    <button
      type="button"
      onClick={() => onChange(!enabled)}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
        enabled ? "bg-green-600" : "bg-gray-200"
      )}
    >
      <span
        className={cn(
          "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
          enabled ? "translate-x-5" : "translate-x-0"
        )}
      />
    </button>
    <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">{label}</span>
  </div>
);

export default function ManageSettings() {
  const { settings: globalSettings, refreshSettings } = useSettings();
  const [settings, setSettings] = useState(globalSettings);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showMaintenanceConfirm, setShowMaintenanceConfirm] = useState(false);
  const [pendingMaintenanceMode, setPendingMaintenanceMode] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data, error } = await supabasePublic
          .from("settings")
          .select("*")
          .eq("id", "main")
          .single();
        if (error) throw error;
        if (data) {
          // Map snake_case to camelCase
          setSettings({ 
            ...globalSettings, 
            maintenanceMode: data.maintenance_mode,
            showLatestUpdate: data.show_latest_update,
            latestUpdates: data.latest_updates || [],
            showPopupBanner: data.show_popup_banner,
            popupBannerImage: data.popup_banner_image,
            popupBannerLink: data.popup_banner_link,
            popupBannerId: data.popup_banner_id,
          });
        }
      } catch (error) {
        console.error("Failed to load settings from Supabase", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, [globalSettings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSaveSuccess(false);
    try {
      const updateData = { ...settings };
      if (settings.popupBannerImage !== globalSettings.popupBannerImage || 
          settings.popupBannerLink !== globalSettings.popupBannerLink) {
        updateData.popupBannerId = Date.now().toString();
      }

      await updateSettingsAction(updateData);
      await refreshSettings();
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error("Failed to update settings", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addUpdate = () => {
    setSettings({
      ...settings,
      latestUpdates: [...(settings.latestUpdates || []), { text: "", link: "" }]
    });
  };

  const removeUpdate = (index: number) => {
    const newUpdates = [...settings.latestUpdates];
    newUpdates.splice(index, 1);
    setSettings({ ...settings, latestUpdates: newUpdates });
  };

  const updateUpdate = (index: number, field: "text" | "link", value: string) => {
    const newUpdates = [...settings.latestUpdates];
    newUpdates[index] = { ...newUpdates[index], [field]: value };
    setSettings({ ...settings, latestUpdates: newUpdates });
  };

  const handleMaintenanceToggle = (val: boolean) => {
    if (val) {
      setPendingMaintenanceMode(true);
      setShowMaintenanceConfirm(true);
    } else {
      setSettings({ ...settings, maintenanceMode: false });
    }
  };

  const confirmMaintenanceMode = () => {
    setSettings({ ...settings, maintenanceMode: true });
    setShowMaintenanceConfirm(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-10 h-10 text-green-700 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans">
      <div className="bg-white p-6 rounded-sm shadow-sm border border-gray-200 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 uppercase tracking-tight flex items-center gap-3">
            <SettingsIcon className="w-8 h-8 text-green-700" /> ওয়েবসাইট সেটিংস
          </h1>
          <p className="text-xs text-gray-500 font-bold uppercase tracking-tighter mt-1">স্কুল ওয়েবসাইটের গ্লোবাল কনফিগারেশন</p>
        </div>
        {saveSuccess && (
          <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-md border border-green-200 animate-in fade-in slide-in-from-right-4">
            <CheckCircle className="w-5 h-5" />
            <span className="text-sm font-bold uppercase tracking-tight">সেটিংস সফলভাবে সংরক্ষিত হয়েছে</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Maintenance Mode */}
          <div className="lg:col-span-2 bg-white rounded-sm shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-red-50 px-6 py-4 border-b border-red-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <h2 className="text-sm font-bold uppercase tracking-wider text-red-800">মেইনটেন্যান্স মোড</h2>
              </div>
              <Toggle 
                enabled={settings.maintenanceMode} 
                onChange={handleMaintenanceToggle}
                label={settings.maintenanceMode ? "সক্রিয়" : "নিষ্ক্রিয়"}
              />
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-600">
                মেইনটেন্যান্স মোড সক্রিয় থাকলে সাধারণ ব্যবহারকারীরা ওয়েবসাইটটি দেখতে পারবেন না। শুধুমাত্র অ্যাডমিন প্যানেল অ্যাক্সেসযোগ্য থাকবে।
              </p>
              {settings.maintenanceMode && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-xs font-bold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" /> বর্তমানে ওয়েবসাইটটি মেইনটেন্যান্স মোডে আছে।
                </div>
              )}
            </div>
          </div>

          {/* Latest Update Management */}
          <div className="bg-white rounded-sm shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-green-700" />
                <h2 className="text-sm font-bold uppercase tracking-wider text-gray-700">সর্বশেষ আপডেট মারকিউ</h2>
              </div>
              <Toggle 
                enabled={settings.showLatestUpdate} 
                onChange={(val) => setSettings({ ...settings, showLatestUpdate: val })}
                label={settings.showLatestUpdate ? "দৃশ্যমান" : "লুকানো"}
              />
            </div>
            <div className="p-6 space-y-6">
              <div className="space-y-4">
                {(settings.latestUpdates || []).map((update, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-md border border-gray-200 space-y-3 relative group">
                    <button 
                      type="button"
                      onClick={() => removeUpdate(index)}
                      className="absolute top-2 right-2 p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-white border border-gray-200 rounded flex items-center justify-center text-[10px] font-black text-gray-400">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <input
                          type="text"
                          className="w-full px-3 py-1.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 text-xs font-bold"
                          placeholder="আপডেট টেক্সট..."
                          value={update.text}
                          onChange={(e) => updateUpdate(index, "text", e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        className="w-full pl-8 pr-3 py-1.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 text-[10px]"
                        placeholder="লিঙ্ক (ঐচ্ছিক)..."
                        value={update.link}
                        onChange={(e) => updateUpdate(index, "link", e.target.value)}
                      />
                      <LinkIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400" />
                    </div>
                  </div>
                ))}
                
                <button 
                  type="button"
                  onClick={addUpdate}
                  className="w-full py-3 border-2 border-dashed border-gray-200 rounded-md text-gray-400 hover:border-green-500 hover:text-green-600 transition-all flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest"
                >
                  <Plus className="w-4 h-4" /> আরও একটি আপডেট যোগ করুন
                </button>
              </div>
            </div>
          </div>

          {/* Popup Banner Management */}
          <div className="bg-white rounded-sm shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-blue-600" />
                <h2 className="text-sm font-bold uppercase tracking-wider text-gray-700">পপআপ ব্যানার</h2>
              </div>
              <Toggle 
                enabled={settings.showPopupBanner} 
                onChange={(val) => setSettings({ ...settings, showPopupBanner: val })}
                label={settings.showPopupBanner ? "সক্রিয়" : "নিষ্ক্রিয়"}
              />
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-1">ব্যানার ইমেজ</label>
                <div className="flex items-center gap-4">
                  <div className="w-24 h-24 bg-gray-100 border border-gray-200 rounded-md flex items-center justify-center overflow-hidden shrink-0">
                    {settings.popupBannerImage ? (
                      <img src={getSafeImageSrc(settings.popupBannerImage)} alt="Banner" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <ImageIcon className="w-8 h-8 text-gray-300" />
                    )}
                  </div>
                  <div className="flex-1">
                    <FileUpload 
                      path="banners"
                      onUploadComplete={(url) => setSettings({ ...settings, popupBannerImage: url })}
                      accept="image/*"
                      label="ব্যানার আপলোড করুন"
                    />
                  </div>
                </div>
                <p className="text-[10px] text-gray-400 mt-2 italic">* ইমেজ বা লিঙ্ক পরিবর্তন করলে ব্যানারটি সকল ব্যবহারকারীর জন্য আবার প্রদর্শিত হবে।</p>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-1">ক্লিক লিঙ্ক</label>
                <div className="relative">
                  <input
                    type="text"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                    placeholder="https://..."
                    value={settings.popupBannerLink}
                    onChange={(e) => setSettings({ ...settings, popupBannerLink: e.target.value })}
                  />
                  <ExternalLink className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end sticky bottom-6 z-10">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-green-700 text-white px-10 py-4 rounded-md font-bold uppercase tracking-widest hover:bg-green-800 transition-all flex items-center gap-3 shadow-2xl hover:shadow-green-900/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <Save className="w-6 h-6" />
            )}
            {isSubmitting ? "পরিবর্তনগুলি সংরক্ষণ করা হচ্ছে..." : "সব সেটিংস সংরক্ষণ করুন"}
          </button>
        </div>
      </form>

      <ConfirmModal 
        isOpen={showMaintenanceConfirm}
        onClose={() => setShowMaintenanceConfirm(false)}
        onConfirm={confirmMaintenanceMode}
        title="মেইনটেন্যান্স মোড নিশ্চিত করুন"
        message="আপনি কি নিশ্চিত যে আপনি মেইনটেন্যান্স মোড চালু করতে চান? এটি চালু করলে সাধারণ ব্যবহারকারীরা ওয়েবসাইটটি দেখতে পারবেন না।"
        confirmText="হ্যাঁ, চালু করুন"
        cancelText="না, ফিরে যান"
      />
    </div>
  );
}

