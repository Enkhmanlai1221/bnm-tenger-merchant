import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getLocale, locales } from "./utils/lang";
import { jwtDecode } from "jwt-decode";
import { getPathnameWithoutLocale } from "./utils";

export const runtime = "experimental-edge";

const AUTH_EXEMPT_PATHS = [
  "/login",
  "/register",
  "/forgot",
  "/otp-verify",
  "/register-failed",
  "/auth-token",
  "/registration",
  "/change-password",
  "/merchant-verification",
  "/manual-kyc",
  "/shared",
];

export function middleware(request: NextRequest) {
  const start = performance.now();
  const pathname = request.nextUrl.pathname;
  const pathnameWithoutLocale = getPathnameWithoutLocale(pathname);
  if (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/app/") ||
    pathname.startsWith("/oauth/") ||
    pathname.startsWith("/callback/") ||
    pathname.startsWith("/socket.io/") ||
    pathname.includes(".")
  ) {
    // Handle Apple Pay merchant validation file
    if (
      pathname === "/.well-known/apple-developer-merchantid-domain-association"
    ) {
      const response = NextResponse.next();
      response.headers.set("Content-Type", "text/plain");
      return response;
    }
    return NextResponse.next();
  }

  // get access token from cookie
  const cookieStore = cookies();
  const accessToken = cookieStore.get("gerbook-service.sec")?.value;
  let decodedToken: {
    uid: string;
    sid: string;
    scp: string;
    iat: number;
    exp: number;
  } | null = null;

  if (accessToken) {
    try {
      decodedToken = jwtDecode(accessToken);

      if (
        decodedToken!.scp === "KYC" &&
        !["/merchant-verification", "/manual-kyc"].some((path) =>
          pathnameWithoutLocale.startsWith(path),
        )
      ) {
        return NextResponse.redirect(
          new URL("/merchant-verification", request.url),
        );
      }
    } catch (error) { }
  }

  if (pathname.indexOf("/merchant-verification") !== -1) {
    if (decodedToken?.scp !== "KYC") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // Check if the current path is auth-exempt
  const isAuthExempt = AUTH_EXEMPT_PATHS.some(
    (path) =>
      pathnameWithoutLocale === path ||
      pathnameWithoutLocale.startsWith(`${path}/`),
  );

  // if (!accessToken && !isAuthExempt) {
  //   const currentLocale = getLocale(request);
  //   return NextResponse.redirect(
  //     new URL(`/${currentLocale}/login`, request.url),
  //   );
  // }

  // Check if there is any supported locale in the pathname
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  );
  // If pathname already has locale, don't redirect
  if (pathnameHasLocale) {
    return NextResponse.next();
  }

  // Get the current locale from the request headers or cookies
  const currentLocale = getLocale(request);

  // Redirect using the current locale instead of checking pathname
  const response = NextResponse.redirect(
    new URL(
      `/${currentLocale}${pathname.startsWith("/") ? "" : "/"}${pathname}${request.nextUrl.search}`,
      request.url,
    ),
  );
  const end = performance.now();
  response.headers.set("Server-Timing", `total;dur=${end - start}`);
  return response;
}

export const config = {
  // Matcher ignoring static files
  matcher: ["/((?!api|_next/static|_next/image|assets|favicon.ico|rest).*)"],
};
