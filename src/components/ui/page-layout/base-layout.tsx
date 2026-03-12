import { Header } from "@/components/header";
import dynamic from "next/dynamic";
import React from "react";

const FooterSkeleton = () => <div className="h-48 bg-gray-50 animate-pulse" />;

const TabBarSkeleton = () => (
  <div className="h-16 bg-white border-t animate-pulse" />
);

export function BaseLayout({
  children,
  provider: Provider,
}: {
  children: React.ReactNode;
  provider: React.ComponentType<{ children: React.ReactNode }>;
}) {
  const Footer = dynamic(
    () => import("@/components/footer").then((mod) => mod.Footer),
    {
      ssr: false,
      loading: () => <FooterSkeleton />,
    },
  );

  const TabBar = dynamic(
    () => import("@/components/tab-bar/tab-bar").then((mod) => mod.TabBar),
    {
      ssr: false,
      loading: () => <TabBarSkeleton />,
    },
  );

  return (
    <Provider>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow min-h-[calc(100vh-274px-68px)] md:min-h-[calc(100vh-146.24px-55px-32px)]">
          {children}
        </main>
        <Footer />
        <TabBar />
      </div>
    </Provider>
  );
}
