"use client";

import { authApi, authMerchantApi, merchantApi } from "@/apis";
import { AuthHeader } from "@/components/header/auth-header";
import { AuthPageLayout } from "@/components/ui/page-layout/auth-layout";
import { useLanguage } from "@/providers/language";
import { logout } from "@/store/auth-slice";
import { ErrorMessage } from "@/utils/http/http-handler";
import { message } from "@/utils/message";
import { Button, Modal, ModalBody, ModalContent, ModalHeader, useDisclosure } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDispatch } from "react-redux";
import useSWR from "swr";
import { MerchantContract } from "./contract";

export default function MerchantVerificationPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { translate } = useLanguage();
  const [loading, setLoading] = useState(false);
  const { data: user, mutate } = useSWR("swr.user", async () => authMerchantApi.reme());
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleInactiveUser = () => {
    onOpen();
  };

  const onLogout = async () => {
    setLoading(true);
    dispatch(logout());
    localStorage.removeItem("token"); // Add if you're using token
    sessionStorage.clear();
    setTimeout(() => {
      window.location.href = "/";
    }, 100);
    await authApi.logout();
    setLoading(false);
  };

  const onDomesticUser = async () => {
    if (!user?.contract) {
      handleInactiveUser();
      return;
    }

    try {
      const res: {
        url: string;
      } = await merchantApi.danVerify();


      // Check if we're in Safari
      const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

      if (isSafari) {
        // For Safari, open in the same window
        window.location.href = res.url;
      } else {
        // For other browsers, try popup first
        const popup = window.open(res.url, "_blank", "noopener,noreferrer");
        if (!popup || popup.closed || typeof popup.closed === 'undefined') {
          window.location.href = res.url;
        }
      }
    } catch (error) {
      message.error((error as ErrorMessage).message);
    }
  };

  const onForeignUser = () => {
    if (!user?.contract) {
      handleInactiveUser();
      return;
    }
    router.push("/manual-kyc");
  };

  const kycType = (type: string) => {
    switch (type) {
      case "IDENTITY_CARD":
        return translate("identity_card", "Identity Card");
      case "PASSPORT":
        return translate("passport", "Passport");
      case "DRIVER_LICENSE":
        return translate("driver_license", "Driver License");
    }
  };

  const kycStatus = (status: string) => {
    switch (status) {
      case "NEW":
        return translate("pending", "Pending");
      case "CONFIRMED":
        return translate("approved", "Approved");
      case "DECLINED":
        return translate("rejected", "Rejected");
    }
  };

  return (
    <AuthPageLayout>
      <AuthHeader />
      <div className="flex flex-col justify-center h-full">
        <div>
          <div className="pb-8">
            <h1 className="text-2xl font-semibold text-primary-600">
              {translate("merchant_verification", "Merchant Verification")}
            </h1>
            <div className="flex flex-col gap-4 py-6">
              <Button variant="solid" color="primary" onPress={onDomesticUser}>
                <span>{translate("domestic_user", "Domestic User")}</span>
              </Button>
              {user?.kyc ? (
                <div className="border border-gray-200 rounded-md p-4 bg-gray-50">
                  <div className="flex flex-col gap-2">
                    <span>
                      {translate(
                        "kyc_verification_pending_description",
                        "Your KYC verification is pending. Please wait for the approval.",
                      )}
                    </span>
                    <div className="flex flex-col gap-2">
                      <div className="flex flex-col gap-2">
                        <span className="text-sm text-gray-500">
                          {translate("document_type", "Document Type")}
                        </span>
                        <div className="">{kycType(user?.kyc?.type)}</div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <span className="text-sm text-gray-500">
                          {translate("status", "Status")}
                        </span>
                        <div className="">{kycStatus(user?.kyc?.status)}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <Button variant="solid" color="primary" onPress={onForeignUser}>
                  <span>{translate("iam_foriegn", "I'm foriegn")}</span>
                </Button>
              )}
            </div>
          </div>
          <div className="border border-gray-200 rounded-md p-4 bg-gray-50">
            <div className="flex flex-col justify-center gap-2 flex-wrap">
              <div className="flex gap-x-2 items-center justify-center flex-wrap">
                <span>{user?.email}</span>
              </div>
              <div className="flex justify-center items-center gap-x-2">
                <span className="text-sm text-gray-500">
                  {translate("not_your_account", "Not your account?")}
                </span>
                <Button variant="bordered" onPress={onLogout} isLoading={loading}>
                  {translate("logout", "Logout")}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={isOpen} onClose={onClose} size="full">
        <ModalContent>
          {(onClose) =>
            <>
              <ModalHeader>
                {translate("merchant_contract", "Бүүк эксчейнж ХХК гэрээ байгуулах")}
              </ModalHeader>
              <ModalBody style={{ overflowY: "auto" }}>
                <MerchantContract
                  user={user}
                  onSuccess={() => {
                    onClose();
                    mutate()
                  }}
                />
              </ModalBody>
            </>
          }
        </ModalContent>
      </Modal>
    </AuthPageLayout>
  );
}
