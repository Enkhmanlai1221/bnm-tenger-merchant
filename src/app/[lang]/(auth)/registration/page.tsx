"use client";

import { authApi, authMerchantApi } from "@/apis";
import { UserType } from "@/interfaces/user";
import { useLanguage } from "@/providers/language";
import { RootState } from "@/store";
import { logout } from "@/store/auth-slice";
import { cn } from "@/utils";
import { Button, Spinner } from "@heroui/react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useSWR, { mutate as mutateSWR } from "swr";
import { MerchantContract } from "../merchant-verification/contract";
import { RegistrationProfileSetup } from "./profile-setup";

const RegisterationPage = () => {
  const { translate } = useLanguage();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const { accessToken, sessionScope } = useSelector(
    (state: RootState) => state.auth,
  );
  const { data: user, mutate } = useSWR(
    accessToken ? `swr.user.${accessToken}.${sessionScope}` : null,
    accessToken
      ? () => (sessionScope === "KYC" ? authMerchantApi.reme() : authApi.me())
      : null,
    {
      revalidateOnFocus: false,
    },
  );

  const steps = user?.type === UserType.APP_USER ? [0] : [0, 1, 2];

  const getInitialStep = () => {
    if (!user?.firstName) return 0;
    if (!user?.contract) return 1;

    return 2;
  };

  const [currentStep, setCurrentStep] = useState<number>(getInitialStep || 0);

  const onLogout = async () => {
    setLoading(true);
    await authApi.logout();
    dispatch(logout());
    localStorage.removeItem("token");
    sessionStorage.clear();
    setTimeout(() => {
      window.location.href = "/";
    }, 100);
    setLoading(false);
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center h-full">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="sm:p-8 p-4 h-full flex flex-col">
      <div className="flex flex-col h-full">
        <div
          className={cn(
            user?.type === UserType.APP_USER
              ? "grid gap-2 grid-cols-1"
              : "grid gap-2 grid-cols-3 py-2",
          )}
        >
          {steps.map((step) => (
            <button
              onClick={() => setCurrentStep(step)}
              key={step}
              className={cn(
                "bg-primary-200 rounded-full h-2",
                currentStep === step && "bg-primary-600",
              )}
            />
          ))}
        </div>
        <div className="flex flex-col h-full">
          {currentStep === 0 &&
            <div className="flex flex-col py-8">
              <span className="font-semibold text-lg">
                {translate("hereglegchiyn_medeelel", "Хэрэглэгчийн мэдээлэл")}
              </span>
              <span className="font-light text-sm/4">
                {translate(
                  "please_enter_your_information_correctly",
                  "Please enter your information correctly.",
                )}
              </span>
            </div>
          }
          {currentStep === 1 &&
            <div className="flex flex-col py-8">
              <span className="font-semibold text-lg">
                {translate("cooperation_agreement", "Cooperation agreement")}
              </span>
              <span className="font-light text-sm/4">
                {translate(
                  "please_enter_your_information_correctly",
                  "Please provide accurate information to ensure smooth processing of your cooperation agreement."
                )}
              </span>
            </div>
          }
          {currentStep === 2 &&
            <div className="flex flex-col py-8">
              <span className="font-semibold text-lg">
                {translate(
                  "bank_information",
                  "Bank information",
                )}
              </span>
              <span className="font-light text-sm/4">
                {translate(
                  "bank_information_correctly",
                  "Please check if you have entered your bank information correctly.",
                )}
              </span>
            </div>
          }
        </div>
      </div>
      <div className="">
        <div className="max-w-2xl mx-auto">
          <div className={cn(currentStep === 0 ? "block" : "hidden", "w-full")}>
            {user?.type === UserType.APP_USER ?
              <RegistrationProfileSetup
                user={user}
                onSuccess={() => {
                  mutate();
                  mutateSWR(`swr.user.${JSON.stringify(accessToken)}`);
                }}
              />
              :
              <RegistrationProfileSetup
                user={user}
                onNext={() => setCurrentStep(currentStep + 1)}
                onSuccess={() => {
                  mutate();
                  mutateSWR(`swr.user.${JSON.stringify(accessToken)}`);
                }}
              />
            }
          </div>
        </div>

        {currentStep === 1 && (
          <div className="w-full p-6 bg-white flex flex-col">
            <MerchantContract
              user={user}
              onSuccess={() => {
                mutate();
                setCurrentStep(2);
              }}
            />
          </div>
        )}

      </div>
      <div className="flex justify-center mt-10">
        <div className="flex gap-x-2 items-center">
          <span>{translate("not_your_account", "Not your account?")}</span>
          <Button variant="light" onPress={onLogout} isLoading={loading}>
            {translate("logout", "Logout")}
          </Button>
        </div>
      </div>
    </div>
  );
};

RegisterationPage.displayName = "RegisterationPage";

export default RegisterationPage;
