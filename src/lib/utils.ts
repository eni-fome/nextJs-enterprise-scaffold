import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines class names using clsx and merges Tailwind classes intelligently.
 * Works with Tailwind v4's utility class structure.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
