"use client";

import { authApi, authMerchantApi } from "@/apis";
import { AuthHeader } from "@/components/header/auth-header";
import { Form } from "@/components/ui/form";
import ImageUploadField from "@/components/ui/form/image-upload-field";
import { SelectField } from "@/components/ui/form/select-field";
import { TextField } from "@/components/ui/form/text-field";
import { AuthPageLayout } from "@/components/ui/page-layout/auth-layout";
import { useLanguage } from "@/providers/language";
import { logout } from "@/store/auth-slice";
import { errorParse } from "@/utils/error-parse";
import { message } from "@/utils/message";
import { Button } from "@heroui/react";
import { IconArrowLeft } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDispatch } from "react-redux";
import useSWR from "swr";
import * as yup from "yup";

export default function ManualKycPage() {
  const { translate } = useLanguage();
  const { data: user, mutate } = useSWR("swr.user", async () =>
    authMerchantApi.reme(),
  );

  const formSchema = yup.object().shape({
    type: yup
      .string()
      .required(translate("this_field_is_required", "This field is required")), // DRIVER_LICENSE | PASSPORT | IDENTITY_CARD
    frontImage: yup
      .string()
      .required(translate("this_field_is_required", "This field is required")),
    backImage: yup.string().optional(),
    selfie: yup
      .string()
      .required(translate("this_field_is_required", "This field is required")),
    phone: yup
      .string()
      .required(translate("this_field_is_required", "This field is required")),
  });
  const dispatch = useDispatch();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onLogout = async () => {
    setLoading(true);
    await authApi.logout();
    dispatch(logout());
    localStorage.removeItem("token"); // Add if you're using token
    sessionStorage.clear();
    setTimeout(() => {
      window.location.href = "/";
    }, 100);
    setLoading(false);
  };

  const onSubmit = async (values: any) => {
    try {
      setLoading(true);

      const res = await authMerchantApi.manualKyc({
        type: values.type,
        frontImage: values.frontImage,
        backImage: values.backImage,
        selfie: values.selfie,
        phone: values.phone,
      });
      message.success(translate("successfully_sent", "Successfully sent"));
      mutate();
      router.push("/merchant-verification");
    } catch (err) {
      errorParse(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthPageLayout>
      <AuthHeader />
      <div className="flex flex-col justify-center h-full">
        <div>
          <div className="pb-8">
            <div className="flex items-center gap-2">
              <Button
                isIconOnly
                variant="light"
                onPress={() => router.push("/merchant-verification")}
              >
                <IconArrowLeft />
              </Button>
              <h1 className="text-2xl font-semibold text-primary-600">
                {translate("manual_kyc", "Manual KYC")}
              </h1>
            </div>
            <div className="flex flex-col gap-4 py-6">
              <Form
                initialValues={{
                  type: "",
                  frontImage: "",
                  backImage: "",
                  selfie: "",
                  phone: "",
                }}
                validationSchema={formSchema}
                onSubmit={onSubmit}
              >
                {({ values }) => {
                  return (
                    <div className="flex flex-col gap-y-4">
                      <SelectField
                        label={translate("document_type", "Document Type")}
                        name="type"
                        placeholder={translate(
                          "select_document_type",
                          "Select document type",
                        )}
                        options={[
                          {
                            label: translate("national_id", "National ID"),
                            value: "IDENTITY_CARD",
                          },
                          {
                            label: translate("passport", "Passport"),
                            value: "PASSPORT",
                          },
                          {
                            label: translate(
                              "drivers_license",
                              "Driver's License",
                            ),
                            value: "DRIVER_LICENSE",
                          },
                        ]}
                      />

                      <ImageUploadField
                        label={translate("front_image", "Front Image")}
                        name="frontImage"
                      />
                      {values.type && values.type !== "PASSPORT" && (
                        <ImageUploadField
                          label={translate("back_image", "Back Image")}
                          name="backImage"
                        />
                      )}
                      <ImageUploadField
                        label={translate("selfie", "Selfie")}
                        name="selfie"
                      />
                      <TextField
                        label={translate("phone", "Phone")}
                        name="phone"
                        placeholder={translate("enter_phone", "Enter phone")}
                      />
                      <Button
                        isLoading={loading}
                        type="submit"
                        className="w-full"
                        size="md"
                        color="primary"
                        variant="solid"
                      >
                        {translate("continue", "Continue")}
                      </Button>
                    </div>
                  );
                }}
              </Form>
            </div>
          </div>
          <div className="flex justify-center mt-10 gap-2 flex-wrap">
            <div className="flex gap-x-2 items-center">
              <span>{user?.email}</span>
              <span className="text-sm text-gray-500">
                {translate("not_your_account", "Not your account?")}
              </span>
            </div>
            <Button variant="bordered" onPress={onLogout} isLoading={loading}>
              {translate("logout", "Logout")}
            </Button>
          </div>
        </div>
      </div>
    </AuthPageLayout>
  );
}
