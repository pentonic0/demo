'use client';

import React, { useState, useRef } from "react";
import { Upload, X, FileText, Image as ImageIcon, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { uploadFile, UploadProgress } from "@/src/lib/storage";
import { cn } from "@/src/lib/utils";

interface FileUploadProps {
  onUploadComplete: (url: string) => void;
  path: string;
  accept?: string;
  label?: string;
  className?: string;
  previewType?: "image" | "file";
}

export default function FileUpload({ 
  onUploadComplete, 
  path, 
  accept = "image/*,application/pdf", 
  label = "ফাইল আপলোড করুন",
  className,
  previewType = "image"
}: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<UploadProgress | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
      setUploadStatus(null);
      
      // Create preview for images
      if (selectedFile.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(selectedFile);
      } else {
        setPreview(null);
      }

      // Automatically start upload
      try {
        const fileName = `${Date.now()}_${selectedFile.name.replace(/\s+/g, "_")}`;
        const fullPath = `${path}/${fileName}`;
        
        const url = await uploadFile(selectedFile, fullPath, (progress) => {
          setUploadStatus(progress);
        });
        
        onUploadComplete(url);
      } catch (err: any) {
        console.error("Upload error:", err);
        setError(err.message || "ফাইল আপলোড করতে ব্যর্থ হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।");
        setUploadStatus({ progress: 0, state: 'error' });
      }
    }
  };

  const clearFile = () => {
    setFile(null);
    setPreview(null);
    setUploadStatus(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">{label}</label>
        
        {!file ? (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center gap-2 hover:border-green-500 hover:bg-green-50 transition-all cursor-pointer group"
          >
            <Upload className="w-8 h-8 text-gray-400 group-hover:text-green-600 transition-colors" />
            <p className="text-sm text-gray-500 font-medium">আপলোড করতে ক্লিক করুন বা ড্র্যাগ করুন</p>
            <p className="text-[10px] text-gray-400 uppercase tracking-tighter">ছবি বা PDF (সর্বোচ্চ ৫ মেগাবাইট)</p>
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileChange}
              accept={accept}
              className="hidden"
            />
          </div>
        ) : (
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 relative">
            <button 
              onClick={clearFile}
              className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-sm hover:text-red-500 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            
            <div className="flex items-center gap-4">
              {preview ? (
                <div className="w-16 h-16 rounded-md overflow-hidden border border-gray-200 bg-white">
                  <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-md bg-white border border-gray-200 flex items-center justify-center">
                  {file.type.includes("pdf") ? (
                    <FileText className="w-8 h-8 text-red-500" />
                  ) : (
                    <ImageIcon className="w-8 h-8 text-gray-400" />
                  )}
                </div>
              )}
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-800 truncate">{file.name}</p>
                <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                
                {uploadStatus && (
                  <div className="mt-2 space-y-1">
                    <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={cn(
                          "h-full transition-all duration-300",
                          uploadStatus.state === 'success' ? "bg-green-500" : 
                          uploadStatus.state === 'error' ? "bg-red-500" : "bg-blue-500"
                        )}
                        style={{ width: `${uploadStatus.progress}%` }}
                      />
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-tighter">
                      <span className={cn(
                        uploadStatus.state === 'success' ? "text-green-600" : 
                        uploadStatus.state === 'error' ? "text-red-600" : "text-blue-600"
                      )}>
                        {uploadStatus.state === 'running' && `আপলোড হচ্ছে... ${Math.round(uploadStatus.progress)}%`}
                        {uploadStatus.state === 'success' && "আপলোড সম্পন্ন হয়েছে"}
                        {uploadStatus.state === 'error' && "আপলোড ব্যর্থ হয়েছে"}
                      </span>
                    </div>
                  </div>
                )}
              </div>
              
              {uploadStatus?.state === 'running' && (
                <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
              )}
              
              {uploadStatus?.state === 'success' && (
                <CheckCircle className="w-5 h-5 text-green-600" />
              )}
            </div>
          </div>
        )}
        
        {error && (
          <div className="flex items-center gap-2 text-red-600 text-xs font-bold uppercase tracking-tight">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
