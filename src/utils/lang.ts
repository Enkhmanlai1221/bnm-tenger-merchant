export type GerLocale = "mn" | "en" | "zh" | "ja" | "ko" | "ru" | "de";
export const gerLocales = ["mn", "en", "zh", "ja", "ko", "ru", "de"];
export const defaultLocale = "mn";

export type Locale = "mn" | GerLocale;
export const locales = gerLocales;

const COOKIE_NAME = "NEXT_LOCALE";

// Cookie getter
function getCookie(request: Request, name: string): string | undefined {
  const cookie = request.headers.get("cookie");
  if (!cookie) return undefined;

  const match = cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? match[2] : undefined;
}

export function getLocale(request: Request): string {
  // Get locale from cookie
  const cookieLocale = getCookie(request, COOKIE_NAME);

  // Validate if cookie locale is supported
  if (cookieLocale && locales.includes(cookieLocale)) {
    return cookieLocale;
  }

  return defaultLocale;
}

// For client-side cookie operations (can be used in LanguageSwitcher)
export function setLocale(locale: string): void {
  document.cookie = `${COOKIE_NAME}=${locale}; path=/; max-age=31536000`; // 1 year
}
