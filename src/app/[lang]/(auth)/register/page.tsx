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

export default function Login() {
  const { translate } = useLanguage();
  const formSchema = yup.object().shape({
    type: yup.string().required(translate("this_field_is_required", "This field is required!")),
    email: yup.string().required(translate("please_enter_your_email_or_phone", "Please enter your email or phone"))
  });
  const dispatch = useDispatch();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [data] = useState({
    email: "",
    type: "APP_USER",
  });

  const onSubmit = async (values: any) => {
    setLoading(true);

    const isEmail = emailRegex.test(values.email);
    const isPhone = phoneRegex.test(values.email);

    const formData = {
      email: isEmail ? values.email : undefined,
      phone: isPhone ? values.email : undefined,
      password: values.password,
    };

    try {
      let res;
      if (values.type === "MERCHANT") {
        res = await authMerchantApi.register(formData);
      } else {
        res = await authApi.register(formData);
      }

      dispatch(setToken(res));
      message.success(
        translate("register_successfully", "Register successfully!"),
      );
      router.push(
        `/otp-verify?${qs.stringify({
          otpMethod: "REGISTER",
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
          {translate("sign_up", "Sign up")}
        </h1>
        <>
          <Form
            initialValues={data}
            validationSchema={formSchema}
            onSubmit={onSubmit}
          >
            {() => {
              return (
                <div className="flex flex-col gap-y-4">
                  <TypeSelectField name="type" options={options} />
                  <TextField
                    label={translate("phone_email", "Phone / Email")}
                    name="email"
                    placeholder={translate("please_enter_your_email_or_phone", "Please enter your email or phone")}
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
