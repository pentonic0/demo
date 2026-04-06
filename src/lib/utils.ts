import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatLink(url?: string): string {
  if (!url) return "#";
  const normalized = url.trim();
  const lower = normalized.toLowerCase();
  
  // Allow only safe absolute and relative URL forms.
  const isSafeRelative = normalized.startsWith("/") && !normalized.startsWith("//");
  const isSafeAbsolute =
    lower.startsWith("http://") ||
    lower.startsWith("https://") ||
    lower.startsWith("mailto:") ||
    lower.startsWith("tel:");

  if (isSafeRelative || isSafeAbsolute) {
    return normalized;
  }
  
  // Otherwise, assume it's an external link and add https://
  return `https://${normalized}`;
}
