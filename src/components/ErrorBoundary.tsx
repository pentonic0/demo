'use client';

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      let errorMessage = "একটি অপ্রত্যাশিত ত্রুটি ঘটেছে।";
      try {
        const parsedError = JSON.parse(this.state.error?.message || "");
        if (parsedError.error && parsedError.error.includes("Missing or insufficient permissions")) {
          errorMessage = "আপনার এই কাজটি করার অনুমতি নেই। অনুগ্রহ করে আপনার অ্যাডমিন স্ট্যাটাস যাচাই করুন।";
        }
      } catch (e) {
        // Not a JSON error
      }

      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
          <div className="max-w-md w-full bg-white rounded-sm shadow-xl p-8 border border-gray-200 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 text-red-600">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 uppercase tracking-tight mb-2">কিছু ভুল হয়েছে</h1>
            <p className="text-sm text-gray-600 mb-8 leading-relaxed">
              {errorMessage}
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-green-700 text-white py-3 rounded-sm font-bold uppercase tracking-wider hover:bg-green-800 transition-colors flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" /> পেজ রিলোড করুন
              </button>
              <a
                href="/"
                className="w-full bg-gray-100 text-gray-700 py-3 rounded-sm font-bold uppercase tracking-wider hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
              >
                <Home className="w-4 h-4" /> হোমে ফিরে যান
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
