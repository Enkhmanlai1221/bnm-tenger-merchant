import { ApplePayScript } from "@/components/apple-pay/apple-pay-script";
import InitProvider from "@/providers/init-provider";
import "@/styles/global.css";
import "@/styles/override.css";
import { GerLocale } from "@/utils/lang";
import "mapbox-gl/dist/mapbox-gl.css";
import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { Roboto } from "next/font/google";

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin", "cyrillic", "cyrillic-ext"],
  display: "swap",
  variable: "--font-roboto",
  preload: true,
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  title: "Tenger BNM | Brave New Mongolia",
  description: "Tenger BNM | Brave New Mongolia",
};

// Critical providers that need to be server-side rendered
const ServerProviders = ({
  children,
  lang,
}: {
  children: React.ReactNode;
  lang: GerLocale;
}) => <InitProvider lang={lang}>{children}</InitProvider>;

// Non-critical providers that can be client-side rendered
const ClientProviders = dynamic(
  () => import("@/providers/client-providers").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => null,
  },
) as React.ComponentType<{ children: React.ReactNode; lang: GerLocale }>;

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: GerLocale }>;
}>) {
  const { lang } = await params;

  return (
    <html lang={lang} className="light" style={{ height: "100%" }}>
      <head>
        <link rel="shortcut icon" href="/bnm-logo.svg" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
        <meta
          name="facebook-domain-verification"
          content="wfyxeatohbdmpf7tf9ur05brng9huh"
        />
      </head>
      <body className={`${roboto.variable}`} style={{ height: "100%" }}>
        <ServerProviders lang={lang}>
          <ClientProviders lang={lang}>
            <ApplePayScript />
            {children}
          </ClientProviders>
        </ServerProviders>
      </body>
    </html>
  );
}
