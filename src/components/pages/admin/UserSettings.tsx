'use client';

import { useState } from "react";
import { 
  User, 
  Lock, 
  ShieldCheck, 
  Save, 
  AlertCircle, 
  CheckCircle2,
  Eye,
  EyeOff
} from "lucide-react";
import { useAuth } from "@/src/contexts/AuthContext";
import { updateAdminCredentialsAction } from "@/src/actions/admin";

export default function UserSettings() {
  const { user, login } = useAuth();
  const [username, setUsername] = useState(user?.username || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    // Basic validation
    if (!username.trim()) {
      setMessage({ type: 'error', text: 'ইউজারনেম প্রয়োজন।' });
      setIsLoading(false);
      return;
    }

    if (password) {
      if (password !== confirmPassword) {
        setMessage({ type: 'error', text: 'পাসওয়ার্ড মিলছে না। ' });
        setIsLoading(false);
        return;
      }
    }

    try {
      const result = await updateAdminCredentialsAction({
        username,
        password: password || undefined
      });

      if (result.success) {
        setMessage({ type: 'success', text: 'অ্যাকাউন্ট সেটিংস সফলভাবে আপডেট করা হয়েছে।' });
        // Update local auth state if username changed
        if (user) {
          login({ ...user, username });
        }
        setPassword("");
        setConfirmPassword("");
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'আপডেট করতে ব্যর্থ হয়েছে।' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight uppercase">অ্যাকাউন্ট সেটিংস</h1>
          <p className="text-slate-500 mt-1 font-medium">আপনার প্রোফাইল এবং লগইন তথ্য পরিবর্তন করুন।</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
            <div className="p-8 space-y-6">
              {message && (
                <div className={`p-4 rounded-2xl flex items-start gap-3 animate-in zoom-in duration-300 ${
                  message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'
                }`}>
                  {message.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" /> : <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />}
                  <p className="text-sm font-bold">{message.text}</p>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-6">
                {/* Username */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">ইউজারনেম</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                      <User className="w-5 h-5" />
                    </div>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-bold text-slate-700 placeholder:text-slate-400 placeholder:font-medium"
                      placeholder="নতুন ইউজারনেম"
                    />
                  </div>
                </div>

                <div className="md:col-span-2 border-t border-slate-100 pt-6">
                  <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-4">পাসওয়ার্ড পরিবর্তন (ঐচ্ছিক)</h3>
                  <p className="text-xs text-slate-500 mb-6 bg-slate-50 p-4 rounded-xl border border-slate-100 italic leading-relaxed">
                    আপনি যদি পাসওয়ার্ড পরিবর্তন করতে না চান তবে নিচের ঘরগুলো খালি রাখুন। 
                  </p>
                </div>

                {/* Password */}
                <div className="relative">
                  <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">নতুন পাসওয়ার্ড</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                      <Lock className="w-5 h-5" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-bold text-slate-700"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="relative">
                  <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">পাসওয়ার্ড নিশ্চিত করুন</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-bold text-slate-700"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 bg-slate-50/50 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest transition-all shadow-lg shadow-emerald-600/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {isLoading ? 'আপডেট করা হচ্ছে...' : 'সেভ করুন'}
              </button>
            </div>
          </form>
        </div>

        <div className="space-y-8">
          <div className="bg-emerald-600 rounded-3xl p-8 text-white shadow-xl shadow-emerald-200/50 relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-700">
              <User className="w-40 h-40" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-70 mb-2">বর্তমান ইউজার</p>
            <h4 className="text-2xl font-black truncate">{user?.username}</h4>
            <div className="mt-6 flex items-center gap-2 bg-white/15 px-4 py-2 rounded-xl border border-white/10 w-fit">
              <div className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest">{user?.role === 'admin' ? 'সুপার অ্যাডমিন' : 'অ্যাডমিন'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
