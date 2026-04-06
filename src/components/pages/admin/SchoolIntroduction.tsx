'use client';

import { useState, useEffect } from "react";
import { Info, Phone, Mail, MapPin, User, Image as ImageIcon, Save, Loader2, CheckCircle, Globe, Share2 } from "lucide-react";
import { updateSettingsAction } from "@/src/actions/admin";
import FileUpload from "@/src/components/FileUpload";
import { useSettings } from "@/src/contexts/SettingsContext";
import { getSafeImageSrc } from "@/src/lib/image";

export default function SchoolIntroduction() {
  const { settings: globalSettings } = useSettings();
  const [settings, setSettings] = useState(globalSettings);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (globalSettings) {
      setSettings(globalSettings);
      setLoading(false);
    }
  }, [globalSettings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSaveSuccess(false);
    try {
      await updateSettingsAction(settings);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error("Error updating school introduction", error);
    } finally {
      setIsSubmitting(false);
    }
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
            <Globe className="w-8 h-8 text-green-700" /> বিদ্যালয় পরিচিতি
          </h1>
          <p className="text-xs text-gray-500 font-bold uppercase tracking-tighter mt-1">স্কুলের সাধারণ তথ্য ও পরিচিতি পরিচালনা করুন</p>
        </div>
        {saveSuccess && (
          <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-md border border-green-200 animate-in fade-in slide-in-from-right-4">
            <CheckCircle className="w-5 h-5" />
            <span className="text-sm font-bold uppercase tracking-tight">তথ্য সফলভাবে সংরক্ষিত হয়েছে</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* General Information */}
          <div className="bg-white rounded-sm shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center gap-2">
              <Info className="w-5 h-5 text-green-700" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-gray-700">সাধারণ তথ্য</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-1">স্কুলের নাম</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                  value={settings.schoolName}
                  onChange={(e) => setSettings({ ...settings, schoolName: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">স্কুল কোড</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                    value={settings.schoolCode}
                    onChange={(e) => setSettings({ ...settings, schoolCode: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">প্রতিষ্ঠিত সাল</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                    value={settings.establishedYear}
                    onChange={(e) => setSettings({ ...settings, establishedYear: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-1">অবস্থান / শহর</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                  value={settings.location}
                  onChange={(e) => setSettings({ ...settings, location: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-1">গুগল ম্যাপস এমবেড লিঙ্ক</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                  value={settings.googleMapsLink}
                  onChange={(e) => setSettings({ ...settings, googleMapsLink: e.target.value })}
                  placeholder="https://www.google.com/maps/embed?..."
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-1">স্কুল লোগো URL</label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gray-100 border border-gray-200 rounded-md flex items-center justify-center overflow-hidden">
                    {settings.schoolLogo ? (
                      <img src={getSafeImageSrc(settings.schoolLogo)} alt="Logo" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-gray-300" />
                    )}
                  </div>
                  <div className="flex-1">
                    <FileUpload 
                      path="logo"
                      onUploadComplete={(url) => setSettings({ ...settings, schoolLogo: url })}
                      accept="image/*"
                      label="স্কুল লোগো আপলোড করুন"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-sm shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center gap-2">
              <Phone className="w-5 h-5 text-green-700" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-gray-700">যোগাযোগের তথ্য</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-1">যোগাযোগের ফোন নম্বর</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                    value={settings.contactPhone}
                    onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                  />
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-1">যোগাযোগের ইমেইল</label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                    value={settings.contactEmail}
                    onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                  />
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-1">সম্পূর্ণ ঠিকানা</label>
                <div className="relative">
                  <textarea
                    required
                    rows={3}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                    value={settings.address}
                    onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                  />
                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="bg-white rounded-sm shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center gap-2">
              <Share2 className="w-5 h-5 text-green-700" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-gray-700">সোশ্যাল লিঙ্ক</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">ফেসবুক</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                    value={settings.facebookLink}
                    onChange={(e) => setSettings({ ...settings, facebookLink: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">টুইটার / X</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                    value={settings.twitterLink}
                    onChange={(e) => setSettings({ ...settings, twitterLink: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">ইউটিউব</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                    value={settings.youtubeLink}
                    onChange={(e) => setSettings({ ...settings, youtubeLink: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">ইনস্টাগ্রাম</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                    value={settings.instagramLink}
                    onChange={(e) => setSettings({ ...settings, instagramLink: e.target.value })}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">লিঙ্কডইন</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                    value={settings.linkedinLink}
                    onChange={(e) => setSettings({ ...settings, linkedinLink: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Chairman's Information */}
          <div className="lg:col-span-2 bg-white rounded-sm shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center gap-2">
              <User className="w-5 h-5 text-green-700" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-gray-700">সভাপতির তথ্য</h2>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-1 space-y-4">
                <div className="w-full aspect-[3/4] bg-gray-100 border-2 border-dashed border-gray-300 rounded-sm overflow-hidden relative group">
                  {settings.chairmanImage ? (
                    <img src={getSafeImageSrc(settings.chairmanImage)} alt="Chairman" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                      <ImageIcon className="w-12 h-12 mb-2 opacity-20" />
                      <p className="text-[10px] font-bold uppercase">কোনো ছবি নেই</p>
                    </div>
                  )}
                </div>
                <div>
                  <FileUpload 
                    path="chairman"
                    onUploadComplete={(url) => setSettings({ ...settings, chairmanImage: url })}
                    accept="image/*"
                    label="সভাপতির ছবি"
                  />
                </div>
              </div>
              <div className="md:col-span-2 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">সভাপতির নাম</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                    value={settings.chairmanName}
                    onChange={(e) => setSettings({ ...settings, chairmanName: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">সভাপতির বাণী</label>
                  <textarea
                    required
                    rows={8}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm leading-relaxed italic"
                    value={settings.chairmanMessage}
                    onChange={(e) => setSettings({ ...settings, chairmanMessage: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Principal's Information */}
          <div className="lg:col-span-2 bg-white rounded-sm shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center gap-2">
              <User className="w-5 h-5 text-green-700" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-gray-700">প্রধান শিক্ষকের তথ্য</h2>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-1 space-y-4">
                <div className="w-full aspect-[3/4] bg-gray-100 border-2 border-dashed border-gray-300 rounded-sm overflow-hidden relative group">
                  {settings.principalImage ? (
                    <img src={getSafeImageSrc(settings.principalImage)} alt="Principal" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                      <ImageIcon className="w-12 h-12 mb-2 opacity-20" />
                      <p className="text-[10px] font-bold uppercase">কোনো ছবি নেই</p>
                    </div>
                  )}
                </div>
                <div>
                  <FileUpload 
                    path="principal"
                    onUploadComplete={(url) => setSettings({ ...settings, principalImage: url })}
                    accept="image/*"
                    label="প্রধান শিক্ষকের ছবি"
                  />
                </div>
              </div>
              <div className="md:col-span-2 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">প্রধান শিক্ষকের নাম</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                    value={settings.principalName}
                    onChange={(e) => setSettings({ ...settings, principalName: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">প্রধান শিক্ষকের বাণী</label>
                  <textarea
                    required
                    rows={8}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm leading-relaxed italic"
                    value={settings.principalMessage}
                    onChange={(e) => setSettings({ ...settings, principalMessage: e.target.value })}
                  />
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
            {isSubmitting ? "পরিবর্তনগুলি সংরক্ষণ করা হচ্ছে..." : "সব তথ্য সংরক্ষণ করুন"}
          </button>
        </div>
      </form>
    </div>
  );
}
