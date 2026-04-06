import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatLink(url?: string): string {
  if (!url) return "#";
  
  // If it starts with / or is a full URL, return it as is
  if (url.startsWith("/") || url.startsWith("http://") || url.startsWith("https://") || url.startsWith("mailto:") || url.startsWith("tel:")) {
    return url;
  }
  
  // Otherwise, assume it's an external link and add https://
  return `https://${url}`;
}
