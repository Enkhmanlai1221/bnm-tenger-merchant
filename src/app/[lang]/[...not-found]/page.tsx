"use client";

import Link from "next/link";
import { useLanguage } from "@/providers/language";

export default function NotFound() {
  const { translate } = useLanguage();
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-xl font-semibold text-gray-600 mb-6">
          {translate("page_not_found", "Page Not Found")}
        </h2>
        <p className="text-gray-500 mb-8">
          {translate(
            "the_page_you_re_looking_for_doesn_t_exist_or_has_been_moved",
            "The page you&apos;re looking for doesn&apos;t exist or has been moved.",
          )}
        </p>
        <Link
          href="/"
          className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          {translate("go_back_home", "Go back home")}
        </Link>
      </div>
    </div>
  );
}
