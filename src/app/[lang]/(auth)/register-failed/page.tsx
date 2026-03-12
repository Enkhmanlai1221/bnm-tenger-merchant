"use client";

import { AuthHeader } from "@/components/header/auth-header";
import { AuthPageLayout } from "@/components/ui/page-layout/auth-layout";
import { useLanguage } from "@/providers/language";
import Link from "next/link";

export default function RegisterFailed() {
  const { translate } = useLanguage();
  return (
    <AuthPageLayout>
      <AuthHeader />
      <div className="space-y-3">
        <h1 className="text-2xl font-semibold text-primary-600">
          {translate("sign_up_failed", "Sign up failed")}
        </h1>
        <p className="text-gray-700 pb-3">
          {translate(
            "sign_up_failed_description",
            "While signing up, we did not receive your email. Please try again approve your email sharing while signing up.",
          )}
        </p>
        <div className="border-t-1 flex items-center justify-center">
          <div className="text-gray-500 bg-white px-4 -mt-3">
            {translate("or", "OR")}
          </div>
        </div>
        <>
          <div className="flex space-x-2 justify-center pt-6">
            <span>
              {translate(
                "click_here_to_register_by_email",
                "Click here to register by email",
              )}
            </span>
            <Link href={"/register"}>
              <div className="text-md text-primary-400 underline">
                {translate("register", "Register")}
              </div>
            </Link>
          </div>
        </>
      </div>
      <br />
    </AuthPageLayout>
  );
}
