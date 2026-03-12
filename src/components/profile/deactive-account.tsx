"use client";

import React, { useState } from "react";
import { authApi } from "@/apis";
import { errorParse } from "@/utils/error-parse";
import { Button } from "@heroui/react";
import { useLanguage } from "@/providers/language";
import VerifyEmailForm from "./verify-email-form";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { logout } from "@/store/auth-slice";

const DeactivationStepOne = ({
  isLoading,
  onContinue,
  onCancel,
}: {
  isLoading: boolean;
  onContinue: () => void;
  onCancel: () => void;
}) => {
  const { translate } = useLanguage();
  return (
    <div className="space-y-4">
      <h2 className="flex text-xl font-medium mt-4 mb-6">
        {translate("deactivate_account", "Deactivate Account")}
      </h2>
      <p className="text-base/5 text-gray-800">
        {translate(
          "deactivating_your_account_is_temporary",
          "Deactivating your account is temporary. Your account and main profile will be deactivated, and your name and photos will be removed from most things youve done.",
        )}
      </p>
      <div className="grid grid-cols-2 gap-x-4">
        <Button variant="solid" onPress={onCancel} isDisabled={isLoading}>
          {translate("cancel", "Cancel")}
        </Button>
        <Button
          variant="solid"
          onPress={onContinue}
          isLoading={isLoading}
          color="primary"
        >
          {translate("continue", "Continue")}
        </Button>
      </div>
    </div>
  );
};

const FinishStep = () => {
  const { translate } = useLanguage();
  const dispatch = useDispatch();
  const router = useRouter();

  dispatch(logout());
  router.replace("/");
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h2 className="flex text-xl font-medium mt-4 mb-6">
        {translate(
          "your_account_has_been_deactivated",
          "Your account has been deactivated",
        )}
      </h2>
    </div>
  );
};

export function DeactiveAccount({ onClose }: { onClose: () => void }) {
  const [currentStep, setCurrentStep] = useState<string>("first");
  const [loading, setLoading] = useState(false);
  const handleContinue = async () => {
    setLoading(true);
    try {
      await authApi.deactivateAccount();
      setCurrentStep("otp");
    } catch (error) {
      errorParse(error);
    } finally {
      setLoading(false);
    }
  };

  const stepComponents: Record<string, JSX.Element> = {
    first: (
      <DeactivationStepOne
        isLoading={loading}
        onContinue={handleContinue}
        onCancel={onClose}
      />
    ),
    otp: <VerifyEmailForm setCurrentStep={setCurrentStep} />,
    finish: <FinishStep />,
  };

  return stepComponents[currentStep];
}
