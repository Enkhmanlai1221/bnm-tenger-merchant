import React from "react";
import { Footer } from "@/components/footer";
import PriviteProvider from "@/providers/private";
import { Header } from "@/components/header";
import { TabBar } from "@/components/tab-bar/tab-bar";

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PriviteProvider>
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex-1">
          {children}
        </div>
        <Footer />
        {/* <TabBar /> */}
      </div>
    </PriviteProvider>
  );
}
