"use client";

import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="relative flex min-h-screen shrink-0 justify-center">
        <div className="relative z-10 flex flex-1 flex-col bg-white px-4 py-10 md:flex-none md:p-20">
          <main className="mx-auto w-full max-w-md sm:px-4 md:w-[450px] md:px-0 h-full">
            {children}
          </main>
        </div>
      </div>
    </>
  );
}
