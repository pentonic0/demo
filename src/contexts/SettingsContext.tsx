'use client';

import React, { createContext, useContext, useState, useEffect } from "react";
import { supabasePublic } from "@/src/lib/supabase";

interface LatestUpdate {
  text: string;
  link: string;
}

interface Settings {
  schoolName: string;
  schoolCode: string;
  principalName: string;
  principalMessage: string;
  principalImage: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  establishedYear: string;
  location: string;
  googleMapsLink: string;
  facebookLink: string;
  twitterLink: string;
  youtubeLink: string;
  instagramLink: string;
  linkedinLink: string;
  schoolLogo: string;
  chairmanName: string;
  chairmanMessage: string;
  chairmanImage: string;
  latestUpdates: LatestUpdate[];
  showLatestUpdate: boolean;
  showPopupBanner: boolean;
  popupBannerImage: string;
  popupBannerLink: string;
  popupBannerId: string;
  maintenanceMode: boolean;
}

interface SliderItem {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  order: number;
}

interface SettingsContextType {
  settings: Settings;
  sliderItems: SliderItem[];
  loading: boolean;
  refreshSettings: () => Promise<void>;
}

const defaultSettings: Settings = {
  schoolName: "",
  schoolCode: "",
  principalName: "",
  principalMessage: "",
  principalImage: "",
  contactEmail: "",
  contactPhone: "",
  address: "",
  establishedYear: "",
  location: "",
  googleMapsLink: "",
  facebookLink: "",
  twitterLink: "",
  youtubeLink: "",
  instagramLink: "",
  linkedinLink: "",
  schoolLogo: "",
  chairmanName: "",
  chairmanMessage: "",
  chairmanImage: "",
  latestUpdates: [],
  showLatestUpdate: false,
  showPopupBanner: false,
  popupBannerImage: "",
  popupBannerLink: "",
  popupBannerId: "",
  maintenanceMode: false
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [sliderItems, setSliderItems] = useState<SliderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [settingsLoaded, setSettingsLoaded] = useState(false);
  const [sliderLoaded, setSliderLoaded] = useState(false);

  const fetchSettingsOnly = async () => {
    try {
      const { data: settingsData, error: settingsError } = await supabasePublic
        .from("settings")
        .select("*")
        .eq("id", "main")
        .maybeSingle();
        
      if (!settingsError && settingsData) {
        const dbSettings: Partial<Settings> = {
          schoolName: settingsData.school_name || "",
          schoolCode: settingsData.school_code || "",
          principalName: settingsData.principal_name || "",
          principalMessage: settingsData.principal_message || "",
          principalImage: settingsData.principal_image || "",
          chairmanName: settingsData.chairman_name || "",
          chairmanMessage: settingsData.chairman_message || "",
          chairmanImage: settingsData.chairman_image || "",
          contactEmail: settingsData.contact_email || "",
          contactPhone: settingsData.contact_phone || "",
          address: settingsData.address || "",
          establishedYear: settingsData.established_year || "",
          location: settingsData.location || "",
          googleMapsLink: settingsData.google_maps_link || "",
          facebookLink: settingsData.facebook_link || "",
          twitterLink: settingsData.twitter_link || "",
          youtubeLink: settingsData.youtube_link || "",
          instagramLink: settingsData.instagram_link || "",
          linkedinLink: settingsData.linkedin_link || "",
          schoolLogo: settingsData.school_logo || "",
          maintenanceMode: settingsData.maintenance_mode || false,
          showLatestUpdate: settingsData.show_latest_update || false,
          latestUpdates: settingsData.latest_updates || [],
          showPopupBanner: settingsData.show_popup_banner || false,
          popupBannerImage: settingsData.popup_banner_image || "",
          popupBannerLink: settingsData.popup_banner_link || "",
          popupBannerId: settingsData.popup_banner_id || ""
        };
        setSettings({ ...defaultSettings, ...dbSettings });
      }
    } catch (err) {
      console.warn("Settings fetch skipped:", err instanceof Error ? err.message : err);
    }
  };

  const fetchData = async () => {
    await fetchSettingsOnly();
    setSettingsLoaded(true);

    try {
      const { data: sliderData, error: sliderError } = await supabasePublic
        .from("sliders")
        .select("*")
        .order("display_order", { ascending: true });
      
      if (!sliderError && sliderData) {
        setSliderItems(sliderData.map((s: any) => ({
          id: s.id,
          title: s.title,
          subtitle: s.subtitle,
          image: s.image_url,
          order: s.display_order
        })));
      } else {
          setSliderItems([]);
      }
    } catch (err) {
      console.warn("Slider fetch skipped:", err instanceof Error ? err.message : err);
      setSliderItems([]);
    } finally {
      setSliderLoaded(true);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (settingsLoaded && sliderLoaded) {
      // Add a small artificial delay to ensure smooth transition
      const timer = setTimeout(() => {
        setLoading(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [settingsLoaded, sliderLoaded]);

  return (
    <SettingsContext.Provider value={{ settings, sliderItems, loading, refreshSettings: fetchSettingsOnly }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
