'use client';

import Link from "next/link";
import {
  Facebook,
  Twitter,
  Youtube,
  MapPin,
  Phone,
  Mail,
  Instagram,
  Linkedin,
  ArrowUpRight,
  GraduationCap
} from "lucide-react";
import { useSettings } from "@/src/contexts/SettingsContext";
import { getSafeImageSrc } from "@/src/lib/image";
import { useLanguage } from "@/src/contexts/LanguageContext";

export default function Footer() {
  const { settings } = useSettings();
  const { t } = useLanguage();

  const socialLinks = [
    { icon: Facebook, link: settings.facebookLink, label: "Facebook" },
    { icon: Twitter, link: settings.twitterLink, label: "Twitter" },
    { icon: Youtube, link: settings.youtubeLink, label: "YouTube" },
    { icon: Instagram, link: settings.instagramLink, label: "Instagram" },
    { icon: Linkedin, link: settings.linkedinLink, label: "LinkedIn" },
  ].filter((item) => item.link);

  const usefulLinks = [
    { name: "ঢাকা শিক্ষা বোর্ড", url: "https://dhakaeducationboard.gov.bd/" },
    { name: "শিক্ষা মন্ত্রণালয়", url: "http://www.moedu.gov.bd/" },
    { name: "মাধ্যমিক ও উচ্চ শিক্ষা অধিদপ্তর", url: "http://www.dshe.gov.bd/" },
    { name: "BANBEIS", url: "http://www.banbeis.gov.bd/" },
  ];

  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-brand-primary text-gray-300">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-[-80px] top-[-80px] h-72 w-72 rounded-full bg-brand-accent/20 blur-3xl" />
        <div className="absolute right-[-100px] bottom-[-100px] h-80 w-80 rounded-full bg-green-400/10 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.08),transparent_30%),linear-gradient(to_bottom,rgba(255,255,255,0.03),transparent_40%)]" />
        <div className="absolute inset-0 opacity-[0.05] bg-[linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] bg-[size:32px_32px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 gap-8 xl:grid-cols-12">
          {/* Brand */}
          <div className="xl:col-span-5">
            <div className="rounded-3xl border border-white/10 bg-white/[0.05] backdrop-blur-xl p-6 md:p-8 shadow-[0_10px_40px_rgba(0,0,0,0.20)]">
              <div className="flex items-start gap-4">
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-white/10 shadow-lg">
                  {settings.schoolLogo ? (
                    <img
                      src={getSafeImageSrc(settings.schoolLogo)}
                      alt="School Logo"
                      className="h-full w-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-brand-accent">
                      <GraduationCap className="h-9 w-9" />
                    </div>
                  )}
                </div>

                <div className="min-w-0">
                  <h3 className="text-2xl md:text-3xl font-black tracking-tight text-white leading-tight">
                    {settings.schoolName || t("loading")}
                  </h3>
                  <div className="mt-2 inline-flex items-center rounded-full border border-brand-accent/30 bg-brand-accent/10 px-3 py-1 text-xs font-bold tracking-[0.2em] uppercase text-brand-accent">
                    স্থাপিত {settings.establishedYear || "N/A"}
                  </div>
                </div>
              </div>

              <p className="mt-6 max-w-xl text-sm md:text-base leading-7 text-gray-300">
                মানসম্মত শিক্ষা, নৈতিক মূল্যবোধ, শৃঙ্খলা ও নেতৃত্ব বিকাশের মাধ্যমে
                শিক্ষার্থীদের আধুনিক, মানবিক ও দক্ষ নাগরিক হিসেবে গড়ে তুলতে আমরা প্রতিশ্রুতিবদ্ধ।
              </p>

              {socialLinks.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-3">
                  {socialLinks.map((social, idx) => {
                    const Icon = social.icon;
                    return (
                      <a
                        key={idx}
                        href={social.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={social.label}
                        className="group inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-gray-300 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-brand-accent hover:bg-brand-accent hover:text-brand-primary shadow-md"
                      >
                        <Icon className="h-4.5 w-4.5" />
                      </a>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Useful Links */}
          <div className="xl:col-span-3">
            <div className="rounded-3xl border border-white/10 bg-white/[0.05] backdrop-blur-xl p-6 md:p-7 h-full">
              <h4 className="mb-6 text-sm font-extrabold uppercase tracking-[0.25em] text-white">
                {t("useful_links")}
              </h4>

              <div className="space-y-3">
                {usefulLinks.map((link) => (
                  <a
                    key={link.url}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between rounded-2xl border border-white/8 bg-white/5 px-4 py-3 text-sm text-gray-300 transition-all duration-300 hover:border-brand-accent/50 hover:bg-white/10 hover:text-white"
                  >
                    <span className="flex items-center gap-3">
                      <span className="h-2.5 w-2.5 rounded-full bg-brand-accent shadow-[0_0_12px_rgba(255,255,255,0.25)]" />
                      <span>{link.name}</span>
                    </span>
                    <ArrowUpRight className="h-4 w-4 opacity-50 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="xl:col-span-4">
            <div className="rounded-3xl border border-white/10 bg-white/[0.05] backdrop-blur-xl p-6 md:p-7 h-full">
              <h4 className="mb-6 text-sm font-extrabold uppercase tracking-[0.25em] text-white">
                {t("contact_us")}
              </h4>

              <div className="space-y-4">
                <div className="group flex gap-4 rounded-2xl border border-white/8 bg-white/5 p-4 transition-all duration-300 hover:border-brand-accent/40 hover:bg-white/10">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-accent/10 text-brand-accent">
                    <MapPin className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400">
                      ঠিকানা
                    </p>
                    <p className="text-sm leading-6 text-gray-300">
                      {settings.location || "School address not added yet"}
                    </p>
                  </div>
                </div>

                <div className="group flex gap-4 rounded-2xl border border-white/8 bg-white/5 p-4 transition-all duration-300 hover:border-brand-accent/40 hover:bg-white/10">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-accent/10 text-brand-accent">
                    <Phone className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400">
                      ফোন
                    </p>
                    <p className="text-sm text-gray-300">
                      {settings.contactPhone || "No phone number added"}
                    </p>
                  </div>
                </div>

                <div className="group flex gap-4 rounded-2xl border border-white/8 bg-white/5 p-4 transition-all duration-300 hover:border-brand-accent/40 hover:bg-white/10">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-accent/10 text-brand-accent">
                    <Mail className="h-4.5 w-4.5" />
                  </div>
                  <div className="min-w-0">
                    <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400">
                      ইমেইল
                    </p>
                    <p className="break-all text-sm text-gray-300">
                      {settings.contactEmail || "No email added"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 backdrop-blur-md">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="text-center md:text-left">
              <p className="text-sm text-gray-300">
                © {new Date().getFullYear()}{" "}
                <span className="font-semibold text-white">
                  {settings.schoolName || "School Name"}
                </span>
                . <span>{t("all_rights_reserved")}.</span>
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 md:justify-end">
              <Link
                href="/admin/login"
                className="inline-flex items-center rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-300 transition-all duration-300 hover:bg-white/10 hover:text-white"
              >
                {t("admin_login")}
              </Link>

              <div className="hidden h-5 w-px bg-white/10 md:block" />

              <p className="text-sm text-gray-300">
                {t("developed_by")}{" "}
                <a
                  href="#"
                  className="font-semibold text-brand-accent transition-colors hover:text-white"
                >
                  School IT Team
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}