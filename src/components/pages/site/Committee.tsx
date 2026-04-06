'use client';

import { useState, useEffect } from "react";
import { UserCheck, Mail, Phone, ShieldCheck, Loader2 } from "lucide-react";
import { supabasePublic } from "@/src/lib/supabase";

interface CommitteeMember {
  id: string;
  name: string;
  designation: string;
  role: string;
  email: string;
  phone: string;
  image: string;
  order: number;
}

export default function Committee() {
  const [members, setMembers] = useState<CommitteeMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCommittee = async () => {
      try {
        const { data, error } = await supabasePublic
          .from("committee")
          .select("*")
          .order("display_order", { ascending: true });
        if (error) throw error;
        if (data) {
          setMembers(data.map((m: any) => ({
            id: m.id,
            name: m.name,
            designation: m.designation,
            role: m.role,
            email: m.email,
            phone: m.phone,
            image: m.image_url,
            order: m.display_order
          })));
        }
      } catch (error) {
        console.error("Failed to fetch committee", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCommittee();
  }, []);

  return (
    <div className="space-y-12 font-sans pb-20">
      {/* Hero Section */}
      <div className="relative bg-green-800 rounded-[2rem] p-8 sm:p-12 overflow-hidden text-white shadow-2xl shadow-green-900/20">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-64 h-64 bg-black/10 rounded-full blur-2xl" />
        
        <div className="relative z-10 space-y-3 text-center md:text-left">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
            গভর্নিং বডি
          </div>
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tighter leading-none">
            আমাদের <span className="text-green-300">নেতৃত্ব</span>
          </h1>
          <p className="text-green-100/70 text-xs font-medium max-w-md">
            স্বপ্নদর্শী নেতৃবৃন্দ যারা আমাদের প্রতিষ্ঠানকে শ্রেষ্ঠত্ব এবং অখণ্ডতার দিকে পরিচালিত করেন।
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-10 h-10 text-green-700 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {members.map((member) => (
            <div key={member.id} className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden group hover:border-green-500 transition-all">
              <div className="h-72 overflow-hidden bg-gray-100 relative">
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                  <p className="text-white text-[10px] font-black uppercase tracking-[0.2em]">{member.role}</p>
                </div>
              </div>
              <div className="p-8 space-y-6">
                <div className="space-y-1">
                  <h3 className="text-xl font-black text-gray-800 uppercase tracking-tight leading-tight">{member.name}</h3>
                  <p className="text-xs font-black text-green-700 uppercase tracking-widest">{member.designation}</p>
                </div>
                
                <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex gap-2">
                    <a 
                      href={`mailto:${member.email}`} 
                      className="w-10 h-10 bg-gray-50 text-gray-400 hover:bg-green-700 hover:text-white rounded-xl flex items-center justify-center transition-all shadow-sm border border-gray-100"
                      title={member.email}
                    >
                      <Mail className="w-4 h-4" />
                    </a>
                    <a 
                      href={`tel:${member.phone}`} 
                      className="w-10 h-10 bg-gray-50 text-gray-400 hover:bg-green-700 hover:text-white rounded-xl flex items-center justify-center transition-all shadow-sm border border-gray-100"
                      title={member.phone}
                    >
                      <Phone className="w-4 h-4" />
                    </a>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest">সদস্য</p>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">#{member.id.slice(-6).toUpperCase()}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {members.length === 0 && (
            <div className="col-span-full text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
              <ShieldCheck className="w-16 h-16 text-gray-200 mx-auto mb-4" />
              <p className="text-sm font-black text-gray-400 uppercase tracking-widest italic">কোনো কমিটি সদস্য পাওয়া যায়নি।</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
