'use client';

import { useState, useEffect } from "react";
import { MessageSquare, Search, Trash2, Mail, User, Calendar, Eye, X, CheckCircle, Reply, Loader2, AlertTriangle } from "lucide-react";
import { updateGenericAction, deleteGenericAction, getMessagesAction } from "@/src/actions/admin";
import ConfirmModal from "@/src/components/ConfirmModal";
import { cn } from "@/src/lib/utils";

interface MessageData {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
  isRead: boolean;
}

export default function ManageMessages() {
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<null | MessageData>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; id: string | null }>({ isOpen: false, id: null });
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchMessages = async () => {
    try {
      const data = await getMessagesAction();
      if (data) {
        setMessages(data.map((m: any) => ({
          id: m.id,
          name: m.name,
          email: m.email,
          subject: m.subject,
          message: m.message,
          date: m.date,
          isRead: m.is_read
        })));
      }
    } catch (error) {
      console.error("Failed to fetch messages", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const filteredMessages = messages.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenMessage = async (message: MessageData) => {
    setSelectedMessage({ ...message, isRead: true });
    if (!message.isRead) {
      try {
        await updateGenericAction('messages', message.id, { is_read: true });
        setMessages(prev => prev.map(m => m.id === message.id ? { ...m, isRead: true } : m));
      } catch (error) {
        console.error("Failed to update message status", error);
      }
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm.id) return;
    setIsDeleting(true);
    try {
      await deleteGenericAction('messages', deleteConfirm.id);
      if (selectedMessage?.id === deleteConfirm.id) setSelectedMessage(null);
      await fetchMessages();
      setDeleteConfirm({ isOpen: false, id: null });
    } catch (error) {
      console.error("Error deleting message", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="bg-white p-6 rounded-sm shadow-sm border border-gray-200">
        <h1 className="text-2xl font-bold text-gray-800 uppercase tracking-tight flex items-center gap-3">
          <MessageSquare className="w-8 h-8 text-green-700" /> যোগাযোগের বার্তা
        </h1>
        <p className="text-xs text-gray-500 font-bold uppercase tracking-tighter mt-1">ওয়েবসাইট ভিজিটরদের পাঠানো বার্তা দেখুন এবং পরিচালনা করুন</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-auto lg:h-[700px]">
        {/* Message List */}
        <div className={cn(
          "lg:col-span-5 bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-[500px] lg:h-full",
          selectedMessage && "hidden lg:flex"
        )}>
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <div className="relative group">
              <input
                type="text"
                placeholder="বার্তা খুঁজুন..."
                className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm transition-all group-hover:border-green-300 shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-hover:text-green-500 transition-colors" />
            </div>
          </div>

          <div className="flex-grow overflow-y-auto custom-scrollbar p-2">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-10 h-10 text-green-700 animate-spin" />
              </div>
            ) : (
              <div className="space-y-1">
                {filteredMessages.map((message) => (
                  <div 
                    key={message.id} 
                    onClick={() => handleOpenMessage(message)}
                    className={cn(
                      "p-5 cursor-pointer rounded-2xl transition-all relative group",
                      selectedMessage?.id === message.id 
                        ? "bg-green-50 border border-green-100 shadow-sm" 
                        : "hover:bg-slate-50 border border-transparent"
                    )}
                  >
                    {!message.isRead && (
                      <div className="absolute left-2 top-1/2 -translate-y-1/2 w-2 h-2 bg-green-600 rounded-full shadow-[0_0_8px_rgba(22,163,74,0.5)]"></div>
                    )}
                    <div className="flex justify-between items-start mb-2">
                      <h3 className={cn(
                        "text-sm tracking-tight",
                        !message.isRead ? "font-black text-slate-900" : "font-bold text-slate-600"
                      )}>
                        {message.name}
                      </h3>
                      <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{new Date(message.date).toLocaleDateString('bn-BD')}</span>
                    </div>
                    <p className={cn(
                      "text-xs truncate",
                      !message.isRead ? "font-bold text-slate-800" : "text-slate-500"
                    )}>
                      {message.subject}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-2 line-clamp-1 italic font-medium">{message.message}</p>
                  </div>
                ))}
              </div>
            )}
            {!loading && filteredMessages.length === 0 && (
              <div className="text-center py-20 space-y-4">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
                  <MessageSquare className="w-8 h-8 text-slate-200" />
                </div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest italic">কোনো বার্তা পাওয়া যায়নি।</p>
              </div>
            )}
          </div>
        </div>

        {/* Message Detail */}
        <div className={cn(
          "lg:col-span-7 bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-[500px] lg:h-full",
          !selectedMessage && "hidden lg:flex"
        )}>
          {selectedMessage ? (
            <div className="flex flex-col h-full">
              <div className="p-6 sm:p-8 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setSelectedMessage(null)}
                    className="lg:hidden p-2.5 bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 rounded-xl shadow-sm"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  <div>
                    <h2 className="text-lg sm:text-2xl font-black text-slate-800 uppercase tracking-tight leading-tight">{selectedMessage.subject}</h2>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-2 text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest">
                        <Calendar className="w-4 h-4 text-green-600" />
                        {new Date(selectedMessage.date).toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={() => setDeleteConfirm({ isOpen: true, id: selectedMessage.id })}
                    className="w-11 h-11 bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white rounded-xl flex items-center justify-center transition-all shadow-sm shadow-rose-100 group/btn"
                    title="মুছে ফেলুন"
                  >
                    <Trash2 className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                  </button>
                </div>
              </div>

              <div className="p-6 sm:p-10 flex-grow overflow-y-auto custom-scrollbar">
                <div className="flex items-center gap-5 mb-10 p-6 bg-slate-50 rounded-3xl border border-slate-100">
                  <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-700 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-green-900/20 ring-4 ring-white shrink-0">
                    <User className="w-7 h-7" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-lg font-black text-slate-800 tracking-tight truncate">{selectedMessage.name}</p>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1 truncate">{selectedMessage.email}</p>
                  </div>
                </div>
                <div className="relative">
                  <div className="absolute -left-4 top-0 bottom-0 w-1 bg-green-100 rounded-full" />
                  <div className="text-base leading-relaxed whitespace-pre-wrap italic text-slate-700 font-medium pl-4">
                    "{selectedMessage.message}"
                  </div>
                </div>
              </div>

              <div className="p-6 sm:p-8 border-t border-slate-100 bg-slate-50/50 shrink-0">
                <a 
                  href={`mailto:${selectedMessage.email}`}
                  className="w-full sm:w-auto bg-gradient-to-r from-green-600 to-emerald-700 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest hover:shadow-xl hover:shadow-green-900/20 transition-all inline-flex items-center justify-center gap-3 active:scale-95"
                >
                  <Reply className="w-5 h-5" /> উত্তর দিন
                </a>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-300 p-10 text-center">
              <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                <MessageSquare className="w-12 h-12 opacity-20" />
              </div>
              <h3 className="text-xl font-black uppercase tracking-widest opacity-40">একটি বার্তা নির্বাচন করুন</h3>
              <p className="text-sm italic mt-3 max-w-xs font-medium">বিস্তারিত দেখতে তালিকা থেকে একটি বার্তায় ক্লিক করুন।</p>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, id: null })}
        onConfirm={handleDelete}
        isSubmitting={isDeleting}
        title="বার্তা মুছে ফেলুন"
        message="আপনি কি নিশ্চিত যে আপনি এই বার্তাটি মুছে ফেলতে চান? এই কাজটি আর ফিরিয়ে আনা যাবে না।"
        confirmText="বার্তা মুছে ফেলুন"
      />
    </div>
  );
}
