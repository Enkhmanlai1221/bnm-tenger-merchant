"use client";

import Security from "@/components/profile/security";
import { SocialForm } from "@/components/profile/social";
import { Container } from "@/components/ui/page-layout/container";
import { UserType } from "@/interfaces/user";
import { RootState } from "@/store";
import { useSelector } from "react-redux";
import { useLanguage } from "@/providers/language";
import PersonalProfileForm from "@/components/profile/personal-profile-form";
import MerchantProfileForm from "@/components/profile/merchant-profile-form";

export default function UserProfilePage() {
  const { translate } = useLanguage();
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <Container>
      <div className="space-y-6 mb-6">
        <div className="space-y-3">
          <h1 className="flex text-2xl font-semibold my-6">
            {translate("personal_information", "Personal information")}
          </h1>
          <div className="border border-gray-200 rounded-xl p-8">
            {user?.type === UserType.MERCHANT ? (
              <MerchantProfileForm onSuccess={() => { }} />
            ) : (
              <PersonalProfileForm onSuccess={() => { }} />
            )}
          </div>
        </div>
        {user?.type === UserType.MERCHANT && (
          <div className="space-y-3">
            <span className="text-lg font-semibold">
              {translate("social_account", "Social account")}
            </span>
            <div className="border border-gray-200 rounded-xl p-8">
              <SocialForm />
            </div>
          </div>
        )}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold">
              {translate("login_security", "Login & Security")}
            </span>
          </div>
          <Security />
        </div>
      </div>
    </Container>
  );
}
