'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  UserCheck, 
  ShieldCheck, 
  GraduationCap,
  Image as ImageIcon, 
  MessageSquare, 
  LogOut, 
  Menu, 
  X, 
  Bell, 
  User, 
  ChevronRight,
  Globe,
  LayoutPanelTop,
  Settings as SettingsIcon
} from "lucide-react";
import { cn } from "@/src/lib/utils";
import { useAuth } from "@/src/contexts/AuthContext";

const sidebarItems = [
  { name: "ওভারভিউ", icon: LayoutDashboard, path: "/admin" },
  { name: "বিদ্যালয় পরিচিতি", icon: Globe, path: "/admin/introduction" },
  { name: "নোটিশ পরিচালনা", icon: FileText, path: "/admin/notices" },
  { name: "শিক্ষক পরিচালনা", icon: Users, path: "/admin/teachers" },
  { name: "কমিটি পরিচালনা", icon: ShieldCheck, path: "/admin/committee" },
  { name: "কর্মচারী পরিচালনা", icon: UserCheck, path: "/admin/staff" },
  { name: "একাডেমিক পরিচালনা", icon: GraduationCap, path: "/admin/academic" },
  { name: "গ্যালারি পরিচালনা", icon: ImageIcon, path: "/admin/gallery" },
  { name: "স্লাইডার পরিচালনা", icon: LayoutPanelTop, path: "/admin/slider" },
  { name: "যোগাযোগ বার্তা", icon: MessageSquare, path: "/admin/messages" },
  { name: "অ্যাকাউন্ট সেটিংস", icon: User, path: "/admin/settings/user" },
  { name: "ওয়েবসাইট সেটিংস", icon: SettingsIcon, path: "/admin/settings" },
];

export default function AdminDashboard({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading, logout, isAdmin } = useAuth();

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) setIsSidebarOpen(true);
      else setIsSidebarOpen(false);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      router.replace("/admin/login");
    }
  }, [user, loading, isAdmin, router]);

  // Close sidebar on mobile when route changes
  useEffect(() => {
    if (isMobile) setIsSidebarOpen(false);
  }, [pathname, isMobile]);

  const handleLogout = async () => {
    await logout();
    router.push("/admin/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 font-sans">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">যাচাই করা হচ্ছে...</p>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isMobile && isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={cn(
          "bg-gradient-to-b from-[#0f172a] via-[#1e293b] to-[#0f172a] text-slate-300 transition-all duration-500 fixed inset-y-0 left-0 z-50 flex flex-col shadow-[8px_0_32px_rgba(0,0,0,0.15)] border-r border-slate-800/50",
          isSidebarOpen ? "translate-x-0 w-72" : "-translate-x-full lg:translate-x-0",
          !isSidebarOpen && !isMobile && "w-24"
        )}
      >
        <div className={cn(
          "flex items-center border-b border-slate-800/30 bg-[#0f172a] sticky top-0 z-10 transition-all duration-500",
          (isSidebarOpen || isMobile) ? "gap-4 px-8 py-8" : "justify-center px-0 py-10"
        )}>
          <div className="bg-gradient-to-br from-green-500 to-emerald-700 p-2.5 rounded-2xl shrink-0 shadow-xl shadow-green-900/30 ring-2 ring-white/10 group-hover:rotate-6 transition-transform">
            <LayoutDashboard className="w-6 h-6 text-white" />
          </div>
          {(isSidebarOpen || isMobile) && (
            <div className="overflow-hidden whitespace-nowrap">
              <h1 className="text-xl font-black text-white uppercase tracking-tight leading-none">অ্যাডমিন</h1>
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mt-1.5">কন্ট্রোল প্যানেল</p>
            </div>
          )}
          {isMobile && (
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="ml-auto p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <nav className="flex-grow py-8 overflow-y-auto custom-scrollbar px-4">
          <div className="mb-6 px-4">
            <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.25em] mb-4">প্রধান মেনু</p>
            <ul className="space-y-1.5">
              {sidebarItems.map((item) => {
                const isActive = pathname === item.path || (item.path === "/admin" && pathname === "/admin/");
                return (
                  <li key={item.path}>
                    <Link
                      href={item.path}
                      className={cn(
                        "flex items-center rounded-2xl transition-all duration-300 group relative overflow-hidden",
                        isActive
                          ? "bg-gradient-to-r from-green-600/20 to-transparent text-green-400 shadow-[inset_1px_0_0_rgba(255,255,255,0.05)]" 
                          : "hover:bg-slate-800/40 hover:text-white text-slate-400",
                        (isSidebarOpen || isMobile) ? "gap-4 px-4 py-3.5" : "justify-center px-0 py-4"
                      )}
                    >
                      {isActive && (
                        <>
                          <div className="absolute inset-0 bg-green-500/5 blur-xl pointer-events-none" />
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-green-500 rounded-r-full shadow-[0_0_12px_rgba(34,197,94,0.8)]" />
                        </>
                      )}
                      <item.icon className={cn(
                        "w-5 h-5 shrink-0 transition-all duration-300 group-hover:scale-110 relative z-10", 
                        isActive ? "text-green-500 drop-shadow-[0_0_8px_rgba(34,197,94,0.6)]" : "text-slate-500 group-hover:text-slate-300"
                      )} />
                      {(isSidebarOpen || isMobile) && <span className="text-sm font-bold tracking-tight relative z-10">{item.name}</span>}
                      {!isSidebarOpen && !isMobile && (
                        <div className="absolute left-full ml-6 px-4 py-2.5 bg-slate-900 text-white text-xs font-black rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 whitespace-nowrap z-50 shadow-2xl border border-slate-800 translate-x-[-10px] group-hover:translate-x-0 uppercase tracking-widest">
                          {item.name}
                        </div>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>

        <div className="p-6 border-t border-slate-800/30 bg-[#0f172a]/80 backdrop-blur-sm">
          <button
            onClick={handleLogout}
            className={cn(
              "w-full flex items-center rounded-2xl text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-all group relative border border-transparent hover:border-rose-500/20",
              (isSidebarOpen || isMobile) ? "gap-4 px-4 py-4" : "justify-center px-0 py-4"
            )}
          >
            <LogOut className="w-5 h-5 shrink-0 group-hover:rotate-12 transition-transform" />
            {(isSidebarOpen || isMobile) && <span className="text-sm font-black tracking-tight uppercase">লগআউট</span>}
            {!isSidebarOpen && !isMobile && (
              <div className="absolute left-full ml-6 px-4 py-2.5 bg-rose-600 text-white text-xs font-black rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 whitespace-nowrap z-50 shadow-2xl translate-x-[-10px] group-hover:translate-x-0 uppercase tracking-widest">
                লগআউট
              </div>
            )}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className={cn(
        "flex-grow flex flex-col min-w-0 h-screen overflow-hidden transition-all duration-500",
        !isMobile && (isSidebarOpen ? "pl-72" : "pl-24")
      )}>
        {/* Top Header */}
        <header className="bg-white/90 backdrop-blur-xl border-b border-slate-200 h-20 flex items-center justify-between px-8 sticky top-0 z-40 shadow-[0_4px_20px_rgba(0,0,0,0.03)] shrink-0">
          <div className="flex items-center gap-6">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-3 rounded-2xl hover:bg-slate-100 text-slate-500 transition-all active:scale-90 border border-slate-100 hover:border-slate-200 shadow-sm"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden sm:flex items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
              <span className="hover:text-slate-600 cursor-default transition-colors">অ্যাডমিন</span>
              <ChevronRight className="w-4 h-4 text-slate-300" />
              <span className="text-green-700 bg-green-50 px-4 py-1.5 rounded-xl border border-green-100 shadow-[0_2px_8px_rgba(22,163,74,0.1)]">
                {sidebarItems.find(i => i.path === pathname)?.name || "ওভারভিউ"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-8">
            <Link href="/" className="hidden md:flex items-center gap-3 text-[10px] font-black text-slate-600 hover:text-green-700 transition-all uppercase tracking-[0.15em] border border-slate-200 px-5 py-2.5 rounded-2xl hover:bg-slate-50 hover:shadow-md active:scale-95 bg-white">
              <Globe className="w-4 h-4" />
              সাইট দেখুন
            </Link>
            <button className="p-3 rounded-2xl hover:bg-slate-100 text-slate-500 relative transition-all border border-slate-100 hover:border-slate-200 shadow-sm group">
              <Bell className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white shadow-[0_0_8px_rgba(244,63,94,0.5)]"></span>
            </button>
            <div className="flex items-center gap-5 pl-8 border-l border-slate-200">
              <div className="hidden lg:block text-right">
                <p className="text-sm font-black text-slate-800 uppercase tracking-tight leading-none">{user?.username || "অ্যাডমিন ইউজার"}</p>
                <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.25em] mt-1.5">{user?.role === 'admin' ? "সুপার অ্যাডমিন" : "অ্যাডমিন"}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-200 rounded-2xl flex items-center justify-center text-green-700 border-2 border-white shadow-lg overflow-hidden shrink-0 ring-1 ring-slate-200 group cursor-pointer hover:scale-105 transition-transform">
                <User className="w-6 h-6" />
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="p-8 flex-grow overflow-y-auto custom-scrollbar bg-[#f8fafc]">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
