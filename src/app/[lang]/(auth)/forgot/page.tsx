"use client";

import { authApi, authMerchantApi } from "@/apis";
import { AuthHeader } from "@/components/header/auth-header";
import { Form } from "@/components/ui/form";
import { TextField } from "@/components/ui/form/text-field";
import TypeSelectField from "@/components/ui/form/type-select-field";
import { AuthPageLayout } from "@/components/ui/page-layout/auth-layout";
import { setToken } from "@/store/auth-slice";
import { ErrorMessage } from "@/utils/http/http-handler";
import { message } from "@/utils/message";
import { Button } from "@heroui/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import qs from "querystring";
import { useState } from "react";
import { useDispatch } from "react-redux";
import * as yup from "yup";
import { useLanguage } from "@/providers/language";
import { emailRegex, phoneRegex } from "@/utils";

export default function ForgotPage() {
  const { translate } = useLanguage();

  const formSchema = yup.object().shape({
    type: yup
      .string()
      .required(translate("this_field_is_required", "This field is required")),
    email: yup.string().when("type", ([type], schema) => {
      return type === "APP_USER" ? schema.required(translate("please_enter_your_email", "Please enter your email")) :
        schema.required(translate("please_enter_your_email_or_phone", "Please enter your email or phone"))
    }),
  });
  const dispatch = useDispatch();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [data] = useState({
    email: "",
    type: "APP_USER",
  });

  const onSubmit = async (values: any) => {
    const formData = {
      email: emailRegex.test(values.email) ? values.email : undefined,
      phone: phoneRegex.test(values.email) ? values.email : undefined,
    }
    try {
      setLoading(true);

      let res;
      if (values.type === "MERCHANT") {
        res = await authMerchantApi.forgotPassword(formData);
      } else {
        res = await authApi.forgotPassword({
          email: values.email,
        });
      }

      dispatch(setToken(res));
      router.push(
        `/otp-verify?${qs.stringify({
          otpMethod: "FORGOT",
          type: values.type,
        })}`,
      );
    } catch (err) {
      message.error((err as ErrorMessage).message);
    } finally {
      setLoading(false);
    }
  };

  const options = [
    { label: translate("traveler", "Traveler"), value: "APP_USER" },
    { label: translate("merchant", "Merchant"), value: "MERCHANT" },
  ];

  return (
    <AuthPageLayout>
      <AuthHeader />
      <div className="space-y-3">
        <h1 className="text-2xl font-semibold text-primary-600">
          {translate("forgot_password", "Forgot password")}
        </h1>
        <>
          <Form
            initialValues={data}
            validationSchema={formSchema}
            onSubmit={onSubmit}
          >
            {({ values }) => {
              return (
                <div className="flex flex-col gap-y-4">
                  <TypeSelectField name="type" options={options} />
                  <TextField
                    label={values.type === "APP_USER" ? translate("email", "Email") : translate("phone_email", "Phone / Email")}
                    name="email"
                    placeholder={values.type === "APP_USER" ?
                      translate("please_enter_your_email", "Please enter your email") :
                      translate("please_enter_your_email_or_phone", "Please enter your email or phone")
                    }
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
          <div className="flex space-x-2 justify-center pt-6">
            <span>{translate("have_an_account", "Have an account?")}</span>
            <Link href={"/login"}>
              <div className="text-md text-primary-400 underline">
                {translate("login", "Login")}
              </div>
            </Link>
          </div>
        </>
      </div>
      <br />
    </AuthPageLayout>
  );
}
