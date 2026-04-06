'use client';

import { MapPin, Phone, Mail, Clock, Send, Facebook, Twitter, Youtube, Loader2, Instagram, Linkedin } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import axios from "axios";
import { useSettings } from "@/src/contexts/SettingsContext";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { settings } = useSettings();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    try {
      await axios.post("/api/messages", data);
      setIsSuccess(true);
      reset();
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (error) {
      console.error("Failed to send message", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-12 font-sans pb-20">
      {/* Hero Section */}
      <div className="relative bg-green-800 rounded-[2rem] p-8 sm:p-12 overflow-hidden text-white shadow-2xl shadow-green-900/20">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-64 h-64 bg-black/10 rounded-full blur-2xl" />
        
        <div className="relative z-10 space-y-3 text-center md:text-left">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
            যোগাযোগ করুন
          </div>
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tighter leading-none">
            আমাদের সাথে <span className="text-green-300">যোগাযোগ</span>
          </h1>
          <p className="text-green-100/70 text-xs font-medium max-w-md">
            কোনো প্রশ্ন আছে? আমরা সাহায্য করতে এখানে আছি। নিচের যেকোনো মাধ্যমে আমাদের সাথে যোগাযোগ করুন।
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Form */}
        <div className="bg-white p-8 sm:p-10 rounded-[2.5rem] shadow-2xl shadow-gray-200/50 border border-gray-100">
          <div className="space-y-2 mb-8">
            <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tight">
              বার্তা পাঠান
            </h2>
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">আমরা যত দ্রুত সম্ভব আপনার সাথে যোগাযোগ করব</p>
          </div>
          
          {isSuccess && (
            <div className="mb-8 p-4 bg-green-50 text-green-700 border border-green-100 rounded-2xl text-xs font-bold flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm">
                <Send className="w-4 h-4" />
              </div>
              বার্তা সফলভাবে পাঠানো হয়েছে! আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব।
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">পূর্ণ নাম</label>
                <input
                  {...register("name")}
                  className={`w-full px-5 py-3 bg-gray-50 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm font-bold transition-all ${errors.name ? 'border-red-500' : 'border-gray-100'}`}
                  placeholder="আপনার নাম"
                />
                {errors.name && <p className="text-red-500 text-[9px] mt-1 font-black uppercase tracking-widest">{errors.name.message}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">ইমেইল ঠিকানা</label>
                <input
                  {...register("email")}
                  className={`w-full px-5 py-3 bg-gray-50 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm font-bold transition-all ${errors.email ? 'border-red-500' : 'border-gray-100'}`}
                  placeholder="example@email.com"
                />
                {errors.email && <p className="text-red-500 text-[9px] mt-1 font-black uppercase tracking-widest">{errors.email.message}</p>}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">বিষয়</label>
              <input
                {...register("subject")}
                className={`w-full px-5 py-3 bg-gray-50 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm font-bold transition-all ${errors.subject ? 'border-red-500' : 'border-gray-100'}`}
                placeholder="আমরা কীভাবে সাহায্য করতে পারি?"
              />
              {errors.subject && <p className="text-red-500 text-[9px] mt-1 font-black uppercase tracking-widest">{errors.subject.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">বার্তা</label>
              <textarea
                {...register("message")}
                rows={5}
                className={`w-full px-5 py-3 bg-gray-50 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm font-bold transition-all ${errors.message ? 'border-red-500' : 'border-gray-100'}`}
                placeholder="এখানে আপনার বার্তা লিখুন..."
              />
              {errors.message && <p className="text-red-500 text-[9px] mt-1 font-black uppercase tracking-widest">{errors.message.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-green-700 text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-green-800 transition-all flex items-center justify-center gap-3 disabled:opacity-50 shadow-xl shadow-green-900/20 active:scale-95"
            >
              {isSubmitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Send className="w-4 h-4" /> বার্তা পাঠান
                </>
              )}
            </button>
          </form>
        </div>

        {/* Contact Info & Map */}
        <div className="space-y-8">
          <div className="bg-white p-8 sm:p-10 rounded-[2.5rem] shadow-2xl shadow-gray-200/50 border border-gray-100 space-y-8">
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tight">
                দ্রুত যোগাযোগ
              </h2>
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">সরাসরি আমাদের সাথে যোগাযোগ করুন</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-4 group">
                  <div className="bg-green-50 p-3 rounded-2xl text-green-700 group-hover:bg-green-700 group-hover:text-white transition-all shadow-sm">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-black text-gray-400 uppercase text-[9px] tracking-widest">ঠিকানা</h4>
                    <p className="text-xs font-bold text-gray-700 mt-1 leading-relaxed">{settings.location}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 group">
                  <div className="bg-green-50 p-3 rounded-2xl text-green-700 group-hover:bg-green-700 group-hover:text-white transition-all shadow-sm">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-black text-gray-400 uppercase text-[9px] tracking-widest">ফোন</h4>
                    <p className="text-xs font-bold text-gray-700 mt-1">{settings.contactPhone}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-4 group">
                  <div className="bg-green-50 p-3 rounded-2xl text-green-700 group-hover:bg-green-700 group-hover:text-white transition-all shadow-sm">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-black text-gray-400 uppercase text-[9px] tracking-widest">ইমেইল</h4>
                    <p className="text-xs font-bold text-gray-700 mt-1 break-all">{settings.contactEmail}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 group">
                  <div className="bg-green-50 p-3 rounded-2xl text-green-700 group-hover:bg-green-700 group-hover:text-white transition-all shadow-sm">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-black text-gray-400 uppercase text-[9px] tracking-widest">সময়</h4>
                    <p className="text-xs font-bold text-gray-700 mt-1">শনি - বৃহস্পতি: সকাল ৮টা - বিকাল ৪টা</p>
                    <p className="text-[9px] text-red-500 font-black uppercase tracking-widest mt-0.5">শুক্রবার বন্ধ</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-gray-100">
              <h4 className="font-black text-gray-400 uppercase text-[9px] mb-4 tracking-widest">আমাদের সাথে যুক্ত থাকুন</h4>
              <div className="flex gap-3">
                {settings.facebookLink && (
                  <a href={settings.facebookLink} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-50 text-gray-400 hover:bg-green-700 hover:text-white rounded-xl flex items-center justify-center transition-all shadow-sm border border-gray-100">
                    <Facebook className="w-4 h-4" />
                  </a>
                )}
                {settings.twitterLink && (
                  <a href={settings.twitterLink} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-50 text-gray-400 hover:bg-green-700 hover:text-white rounded-xl flex items-center justify-center transition-all shadow-sm border border-gray-100">
                    <Twitter className="w-4 h-4" />
                  </a>
                )}
                {settings.youtubeLink && (
                  <a href={settings.youtubeLink} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-50 text-gray-400 hover:bg-green-700 hover:text-white rounded-xl flex items-center justify-center transition-all shadow-sm border border-gray-100">
                    <Youtube className="w-4 h-4" />
                  </a>
                )}
                {settings.instagramLink && (
                  <a href={settings.instagramLink} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-50 text-gray-400 hover:bg-green-700 hover:text-white rounded-xl flex items-center justify-center transition-all shadow-sm border border-gray-100">
                    <Instagram className="w-4 h-4" />
                  </a>
                )}
                {settings.linkedinLink && (
                  <a href={settings.linkedinLink} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-50 text-gray-400 hover:bg-green-700 hover:text-white rounded-xl flex items-center justify-center transition-all shadow-sm border border-gray-100">
                    <Linkedin className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-[2.5rem] shadow-2xl shadow-gray-200/50 overflow-hidden h-[350px] relative">
            {settings.googleMapsLink ? (
              <iframe
                src={settings.googleMapsLink}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            ) : (
              <div className="w-full h-full bg-gray-50 flex flex-col items-center justify-center text-gray-400 p-8 text-center">
                <MapPin className="w-16 h-16 mb-4 opacity-10" />
                <p className="font-black uppercase text-[10px] tracking-widest">অবস্থান মানচিত্র</p>
                <p className="text-[9px] mt-2 italic">সেটিংসে কনফিগার করা হয়নি।</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
