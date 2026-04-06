'use client';

import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "en" | "bn";

interface Translations {
  [key: string]: {
    en: string;
    bn: string;
  };
}

const translations: Translations = {
  // Navigation
  home: { en: "Home", bn: "হোম" },
  notice: { en: "Notice", bn: "নোটিশ" },
  teachers: { en: "Teachers", bn: "শিক্ষক" },
  committee: { en: "Committee", bn: "কমিটি" },
  staff: { en: "Staff", bn: "কর্মচারী" },
  history: { en: "History", bn: "ইতিহাস" },
  gallery: { en: "Gallery", bn: "গ্যালারি" },
  contact: { en: "Contact", bn: "যোগাযোগ" },
  academic: { en: "Academic", bn: "একাডেমিক" },
  admission: { en: "Admission", bn: "ভর্তি" },
  results: { en: "Results", bn: "ফলাফল" },
  admin_login: { en: "Admin Login", bn: "অ্যাডমিন লগইন" },
  
  // Home Page
  latest_notices: { en: "Latest Notices", bn: "সর্বশেষ নোটিশ" },
  view_all: { en: "View All", bn: "সব দেখুন" },
  principal_message_title: { en: "Message from the Principal", bn: "অধ্যক্ষের বাণী" },
  read_full_message: { en: "Read Full Message", bn: "পুরো বাণী পড়ুন" },
  important_links: { en: "Important Links", bn: "গুরুত্বপূর্ণ লিঙ্ক" },
  latest_updates: { en: "Latest Updates", bn: "সর্বশেষ আপডেট" },
  
  // Footer
  quick_links: { en: "Quick Links", bn: "দ্রুত লিঙ্ক" },
  useful_links: { en: "Useful Links", bn: "দরকারী লিঙ্ক" },
  contact_us: { en: "Contact Us", bn: "যোগাযোগ করুন" },
  our_address: { en: "Our Address", bn: "আমাদের ঠিকানা" },
  phone_number: { en: "Phone Number", bn: "ফোন নম্বর" },
  email_address: { en: "Email Address", bn: "ইমেইল ঠিকানা" },
  all_rights_reserved: { en: "All Rights Reserved", bn: "সর্বস্বত্ব সংরক্ষিত" },
  developed_by: { en: "Developed by", bn: "ডেভেলপড বাই" },
  
  // Principal Message Page
  leadership: { en: "Leadership", bn: "নেতৃত্ব" },
  head_of_institution: { en: "Head of Institution", bn: "প্রতিষ্ঠানের প্রধান" },
  words_of_wisdom: { en: "Words of Wisdom", bn: "জ্ঞানের কথা" },
  warm_regards: { en: "Warm Regards", bn: "শুভেচ্ছান্তে" },
  
  // Contact Page
  send_us_message: { en: "Send us a Message", bn: "আমাদের মেসেজ পাঠান" },
  full_name: { en: "Full Name", bn: "পুরো নাম" },
  subject: { en: "Subject", bn: "বিষয়" },
  message: { en: "Message", bn: "মেসেজ" },
  send_message: { en: "Send Message", bn: "মেসেজ পাঠান" },
  office_hours: { en: "Office Hours", bn: "অফিস আওয়ার" },
  follow_us: { en: "Follow Us", bn: "আমাদের অনুসরণ করুন" },
  
  // Common
  loading: { en: "Loading...", bn: "লোড হচ্ছে..." },
  back_to_home: { en: "Back to Home", bn: "হোমে ফিরে যান" },
  go_back: { en: "Go Back", bn: "ফিরে যান" },
  not_found_title: { en: "Oops! Page Not Found", bn: "উফ! পৃষ্ঠাটি পাওয়া যায়নি" },
  not_found_desc: { en: "The page you're looking for might have been moved, deleted, or never existed.", bn: "আপনি যে পৃষ্ঠাটি খুঁজছেন সেটি সরানো হয়েছে, মুছে ফেলা হয়েছে বা কখনও ছিল না।" }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window === "undefined") {
      return "bn";
    }

    const saved = window.localStorage.getItem("app_lang");
    return saved === "en" || saved === "bn" ? saved : "bn";
  });

  useEffect(() => {
    window.localStorage.setItem("app_lang", language);
    // Add class to body for font styling
    if (language === "bn") {
      document.body.classList.add("font-bangla");
      document.body.classList.remove("font-sans");
    } else {
      document.body.classList.remove("font-bangla");
      document.body.classList.add("font-sans");
    }
  }, [language]);

  const t = (key: string) => {
    if (!translations[key]) return key;
    return translations[key][language];
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
