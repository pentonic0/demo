'use client';

import { useState, useEffect } from "react";
import { UserCheck, Phone, Briefcase, Loader2 } from "lucide-react";
import { supabasePublic } from "@/src/lib/supabase";

interface StaffMember {
  id: string;
  name: string;
  designation: string;
  department: string;
  experience: string;
  phone: string;
  image: string;
  order: number;
}

export default function Staff() {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const { data, error } = await supabasePublic
          .from("staff")
          .select("*")
          .order("display_order", { ascending: true });
        if (error) throw error;
        if (data) {
          setStaff(data.map((m: any) => ({
            id: m.id,
            name: m.name,
            designation: m.designation,
            department: m.department,
            experience: m.experience,
            phone: m.phone,
            image: m.image,
            order: m.display_order
          })));
        }
      } catch (error) {
        console.error("Failed to fetch staff", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStaff();
  }, []);

  return (
    <div className="space-y-8 font-sans">
      <div className="border-b-2 border-green-600 pb-4">
        <h1 className="text-3xl font-bold text-gray-800 uppercase tracking-tight flex items-center gap-3">
          <UserCheck className="w-8 h-8 text-green-700" /> সহায়ক কর্মচারী
        </h1>
        <p className="text-sm text-gray-600 mt-2 italic">
          আমাদের স্কুলকে সুচারুভাবে পরিচালনার জন্য কঠোর পরিশ্রমী ব্যক্তিদের সাথে পরিচিত হোন।
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-10 h-10 text-green-700 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {staff.map((member) => (
            <div key={member.id} className="bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden group hover:shadow-md transition-shadow">
              <div className="h-64 overflow-hidden bg-gray-100">
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-800 leading-tight">{member.name}</h3>
                  <p className="text-sm font-bold text-green-700 uppercase tracking-wide">{member.designation}</p>
                  <p className="text-xs text-gray-500 font-medium">{member.department} বিভাগ</p>
                </div>
                
                <div className="space-y-2 text-sm text-gray-700">
                  <div className="flex items-start gap-2">
                    <Briefcase className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                    <span>অভিজ্ঞতা: {member.experience}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-green-600 shrink-0" />
                    <a href={`tel:${member.phone}`} className="hover:text-green-700 hover:underline">{member.phone}</a>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {staff.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-500 italic">কোনো কর্মচারী পাওয়া যায়নি।</div>
          )}
        </div>
      )}
    </div>
  );
}
