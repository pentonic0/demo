'use client';

import { X, AlertTriangle, Loader2, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/src/lib/utils";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isSubmitting?: boolean;
  variant?: "danger" | "warning" | "info";
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "নিশ্চিত করুন",
  cancelText = "বাতিল করুন",
  isSubmitting = false,
  variant = "danger"
}: ConfirmModalProps) {
  if (!isOpen) return null;

  const variantColors = {
    danger: "bg-red-600 hover:bg-red-700 text-white",
    warning: "bg-yellow-600 hover:bg-yellow-700 text-white",
    info: "bg-blue-600 hover:bg-blue-700 text-white"
  };

  const iconColors = {
    danger: "text-red-600 bg-red-50",
    warning: "text-yellow-600 bg-yellow-50",
    info: "text-blue-600 bg-blue-50"
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.2)] overflow-hidden border border-slate-200"
          >
            <div className="p-8 sm:p-10">
              <div className="flex flex-col items-center text-center gap-6">
                <div className={cn("p-5 rounded-3xl shrink-0 shadow-lg ring-4 ring-white", iconColors[variant])}>
                  <AlertTriangle className="w-10 h-10" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight">{title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed font-medium">{message}</p>
                </div>
              </div>
            </div>
            <div className="bg-slate-50/50 px-8 py-8 flex flex-col sm:flex-row justify-center gap-4 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-8 py-4 border border-slate-200 rounded-2xl text-xs font-black text-slate-500 hover:bg-white transition-all uppercase tracking-widest disabled:opacity-50 active:scale-95"
              >
                {cancelText}
              </button>
              <button
                type="button"
                onClick={onConfirm}
                disabled={isSubmitting}
                className={cn(
                  "px-8 py-4 rounded-2xl text-xs font-black transition-all uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl active:scale-95 disabled:opacity-50",
                  variantColors[variant]
                )}
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle className="w-5 h-5" />}
                {confirmText}
              </button>
            </div>
            <button 
              onClick={onClose} 
              className="absolute top-6 right-6 text-slate-400 hover:text-rose-500 transition-colors p-2 hover:bg-rose-50 rounded-xl"
            >
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
