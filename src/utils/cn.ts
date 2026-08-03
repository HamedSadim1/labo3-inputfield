import { clsx } from "clsx";
import type { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Voegt klassen samen (clsx: conditionals) en lost class-conflicten op
// (tailwind-merge: bijv. px-5 vs px-6 houdt de laatste aan).
export const cn = (...inputs: ClassValue[]): string => twMerge(clsx(inputs));
