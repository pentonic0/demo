'use client';

import { useState, useEffect } from "react";
import { 
  FileText, 
  Users, 
  MessageSquare, 
  GraduationCap,
  Calendar
} from "lucide-react";
import { supabasePublic } from "@/src/lib/supabase";

interface Stats {
  notices: number;
  teachers: number;
  messages: number;
  subjects: number;
  hasRoutine: boolean;
}

export default function Overview() {
  const [stats, setStats] = useState<Stats>({ notices: 0, teachers: 0, messages: 0, subjects: 0, hasRoutine: false });
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [noticesCount, teachersCount, messagesCount, settingsData] = await Promise.all([
          supabasePublic.from("notices").select("*", { count: 'exact', head: true }),
          supabasePublic.from("teachers").select("*", { count: 'exact', head: true }),
          supabasePublic.from("messages").select("*", { count: 'exact', head: true }),
          supabasePublic.from("settings").select("academic_subjects, academic_routine_url").eq("id", "main").single()
        ]);

        const subjects = settingsData.data?.academic_subjects || [];

        setStats({
          notices: noticesCount.count || 0,
          teachers: teachersCount.count || 0,
          messages: messagesCount.count || 0,
          subjects: Array.isArray(subjects) ? subjects.length : 0,
          hasRoutine: !!settingsData.data?.academic_routine_url
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoadingStats(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    { name: "মোট নোটিশ", value: stats.notices, icon: FileText, color: "bg-blue-500", shadow: "shadow-blue-200" },
    { name: "মোট শিক্ষক", value: stats.teachers, icon: Users, color: "bg-green-500", shadow: "shadow-green-200" },
    { name: "মোট বিষয়", value: stats.subjects, icon: GraduationCap, color: "bg-orange-500", shadow: "shadow-orange-200" },
    { name: "যোগাযোগ বার্তা", value: stats.messages, icon: MessageSquare, color: "bg-purple-500", shadow: "shadow-purple-200" },
    { name: "ক্লাস রুটিন", value: stats.hasRoutine ? "আপলোড করা হয়েছে" : "পাওয়া যায়নি", icon: Calendar, color: stats.hasRoutine ? "bg-emerald-500" : "bg-red-500", shadow: stats.hasRoutine ? "shadow-emerald-200" : "shadow-red-200" },
  ];

  return (
    <div className="space-y-8 font-sans pb-20">
      {/* Welcome Header */}
      <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-200 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-green-50/50 rounded-full -mr-48 -mt-48 blur-3xl opacity-60" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-50/30 rounded-full -ml-32 -mb-32 blur-3xl opacity-40" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-slate-800 uppercase tracking-tight leading-tight">ড্যাশবোর্ড ওভারভিউ</h1>
            <p className="text-slate-500 font-medium mt-2 max-w-xl">স্বাগতম! আপনার স্কুলের ডিজিটাল কার্যক্রমের একটি সংক্ষিপ্ত চিত্র এখানে দেওয়া হলো। এখান থেকে আপনি দ্রুত তথ্য আপডেট করতে পারেন।</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-slate-50 border border-slate-200 px-5 py-3 rounded-2xl flex items-center gap-3 shadow-sm">
              <Calendar className="w-5 h-5 text-green-600" />
              <div className="text-left">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">আজকের তারিখ</p>
                <p className="text-sm font-black text-slate-700 mt-1">{new Date().toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {statCards.map((stat) => (
          <div key={stat.name} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex flex-col gap-6 group hover:border-green-500 transition-all duration-300 hover:shadow-xl hover:shadow-green-900/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-full -mr-12 -mt-12 group-hover:bg-green-50 transition-colors" />
            
            <div className={`${stat.color} w-14 h-14 rounded-2xl text-white shadow-lg ${stat.shadow} flex items-center justify-center group-hover:scale-110 transition-transform duration-500 relative z-10`}>
              <stat.icon className="w-7 h-7" />
            </div>
            
            <div className="relative z-10">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{stat.name}</p>
              <h3 className="text-3xl font-black text-slate-800 mt-2 tracking-tight">
                {loadingStats ? (
                  <div className="h-8 w-16 bg-slate-100 animate-pulse rounded-lg" />
                ) : stat.value}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight flex items-center gap-3">
              <div className="w-2 h-8 bg-green-600 rounded-full" />
              দ্রুত অ্যাকশন
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { title: "নতুন নোটিশ যোগ করুন", desc: "জরুরী ঘোষণা বা নোটিশ প্রকাশ করুন", icon: FileText, path: "/admin/notices", color: "text-blue-600", bg: "bg-blue-50" },
              { title: "শিক্ষক প্রোফাইল আপডেট", desc: "শিক্ষকদের তথ্য বা ছবি পরিবর্তন করুন", icon: Users, path: "/admin/teachers", color: "text-green-600", bg: "bg-green-50" },
              { title: "গ্যালারি আপডেট করুন", desc: "নতুন ছবি বা ইভেন্ট ফটো আপলোড করুন", icon: Calendar, path: "/admin/gallery", color: "text-orange-600", bg: "bg-orange-50" },
              { title: "সেটিংস পরিবর্তন করুন", desc: "ওয়েবসাইটের সাধারণ সেটিংস কনফিগার করুন", icon: GraduationCap, path: "/admin/settings", color: "text-purple-600", bg: "bg-purple-50" },
            ].map((action) => (
              <a 
                key={action.title}
                href={action.path}
                className="flex items-center gap-5 p-5 rounded-2xl border border-slate-100 hover:border-green-200 hover:bg-green-50/30 transition-all group"
              >
                <div className={`${action.bg} ${action.color} w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <action.icon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-800 uppercase tracking-tight">{action.title}</h4>
                  <p className="text-xs text-slate-400 mt-1">{action.desc}</p>
                </div>
              </a>
            ))}
          </div>
        </div>

        <div className="bg-[#0f172a] p-8 rounded-3xl shadow-2xl shadow-slate-900/20 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 rounded-full -mr-32 -mt-32 blur-3xl" />
          <div className="relative z-10">
            <h2 className="text-xl font-black uppercase tracking-tight flex items-center gap-3 mb-8">
              <div className="w-2 h-8 bg-green-500 rounded-full" />
              সিস্টেম স্ট্যাটাস
            </h2>
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-400">সার্ভার স্ট্যাটাস</span>
                </div>
                <span className="text-xs font-black text-green-400 uppercase">অনলাইন</span>
              </div>
              <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-400">ডাটাবেস কানেকশন</span>
                </div>
                <span className="text-xs font-black text-blue-400 uppercase">সক্রিয়</span>
              </div>
              <div className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-green-600 to-emerald-800 shadow-lg">
                <p className="text-[10px] font-black text-white/60 uppercase tracking-[0.2em]">সুপার অ্যাডমিন টিপস</p>
                <p className="text-xs font-medium mt-3 leading-relaxed">নিয়মিত নোটিশ আপডেট করুন এবং গ্যালারিতে নতুন ছবি যোগ করুন যাতে ভিজিটররা স্কুলের কার্যক্রম সম্পর্কে জানতে পারে।</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
