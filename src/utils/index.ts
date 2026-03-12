import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// cryllic alphabet regex pattern for input validation allow whitespace
export const alphabetRegex = /^[а-яА-ЯёЁүҮөӨ\s]+$/;

export const getPathnameWithoutLocale = (pathname: string) => {
  return pathname.replace(/^\/[a-z]{2}(?:\/|$)/, "/");
};

export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const phoneRegex = /^\+?\d{7,15}$/;
