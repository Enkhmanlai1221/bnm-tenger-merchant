"use client";

import { useRouter, notFound } from "next/navigation";
import { useEffect } from "react";
import { useLanguage } from "@/providers/language";

export default function SharedPage({ params }: { params: { obj?: string[] } }) {
  const { translate } = useLanguage();
  const router = useRouter();
  const [type, id] = params.obj || [];

  if (!type || !id) {
    notFound();
  }

  // useEffect(() => {
  //   if (!type || !id) return;

  //   const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  //   const routeType = type === "showPlace" ? "places" : type;

  //   if (isMobile) {
  //     const appUrl = `gerbook://shared/${type}/${id}`;
  //     window.location.href = appUrl;

  //     const timeout = setTimeout(() => {
  //       router.push(`/${routeType}/${id}`);
  //     }, 2000);

  //     return () => clearTimeout(timeout);
  //   } else {
  //     router.push(`/${routeType}/${id}`);
  //   }
  // }, [type, id, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      {/* <div className="text-center">
        <h1 className="text-xl font-semibold mb-2">
          {translate("opening_gerbook", "Opening Gerbook...")}
        </h1>
        <p className="text-gray-600">
          {translate(
            "if_nothing_happens",
            "If nothing happens, please download our app",
          )}
        </p>
      </div> */}
    </div>
  );
}
