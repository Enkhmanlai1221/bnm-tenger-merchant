"use client";

import { authApi, authMerchantApi } from "@/apis";
import Button from "@/components/ui/button/button";
import { Form } from "@/components/ui/form";
import { PasswordField } from "@/components/ui/form/password-field";
import { TextField } from "@/components/ui/form/text-field";
import TypeSelectField from "@/components/ui/form/type-select-field";
import { useLanguage } from "@/providers/language";
import { RootState } from "@/store";
import { setRememberMe, setToken } from "@/store/auth-slice";
import { setAuthModal } from "@/store/general-slice";
import { emailRegex, phoneRegex } from "@/utils";
import { errorParse } from "@/utils/error-parse";
import { message } from "@/utils/message";
import { Checkbox, cn } from "@heroui/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";

export function LoginForm({
  onSuccess,
  backTo,
}: {
  onSuccess?: () => void;
  backTo?: string;
}) {
  const { translate } = useLanguage();
  const dispatch = useDispatch();
  const router = useRouter();
  const { remember, accountType } = useSelector((state: RootState) => state.auth);
  const [checked, setChecked] = useState<boolean>(true);
  const [loading, setLoading] = useState(false);

  const formSchema = yup.object().shape({
    password: yup
      .string()
      .required(
        translate("please_enter_your_password", "Please enter your password!"),
      ),
    type: yup
      .string()
      .required(translate("please_enter_your_type", "Please enter your type!")),

    email: yup.string().when("type", ([type], schema) => {
      return type === "USER" ? schema.required(translate("please_enter_your_email", "Please enter your email")) :
        schema.required(translate("please_enter_your_email_or_phone", "Please enter your email or phone"))
    }),
  });

  const options = [
    { label: "Аялагч", value: "USER" },
    { label: "Бизнес харилцагч", value: "MERCHANT" },
  ];

  const onSubmit = async (values: any) => {
    const isEmail = emailRegex.test(values.email);
    const isPhone = phoneRegex.test(values.email);

    const formData = {
      email: isEmail ? values.email : undefined,
      phone: isPhone ? values.email : undefined,
      password: values.password,
    };

    try {
      setLoading(true);
      let res;

      if (values.type === "MERCHANT") {
        res = await authMerchantApi.login(formData);
      } else {
        res = await authApi.login(formData);
      }

      message.success("Амжилттай нэвтэрлээ");
      dispatch(setToken(res));
      dispatch(setAuthModal(false));
      dispatch(setRememberMe({
        remember: checked ? values.email : "",
        accountType: values.type,
      }));

      if (res.sessionScope === "AUTHORIZED") {
        await authApi.me();
      }

      router.push(backTo || "/mn/dashboard");
      onSuccess?.();
    } catch (err) {
      errorParse(err);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="h-screen space-y-3">
      <div className="flex flex-row items-center justify-start gap-2">
        <Image src="/favicon.ico" alt="Tenger BNM" width={64} height={64} />
        <div>
          <h1 className="text-xl font-semibold text-primary-600">
            Нэвтрэх
          </h1>
          <p className="text-sm text-gray-500 text-center">
            Тавтай морилно уу!
          </p>
        </div>
      </div>
      <Form
        initialValues={{
          email: remember || "",
          password: "",
          type: accountType || "USER",
        }}
        validationSchema={formSchema}
        onSubmit={onSubmit}
      >
        {() => {
          return (
            <div className="flex flex-col gap-4">
              <TypeSelectField name="type" options={options} />
              <TextField
                name="email"
                label={"Утас / И-мэйл"}
                placeholder={"Утас / И-мэйл оруулна уу"}
              />
              <PasswordField
                label={"Нууц үг"}
                name="password"
                placeholder={"Нууц үг оруулна уу"}
              />
              <div className="flex justify-between">
                <Checkbox
                  size="lg"
                  isSelected={checked}
                  classNames={{
                    label: cn(
                      "text-sm text-gray-500 leading-4",
                    ),
                  }}
                  onChange={(event) => setChecked(event.currentTarget.checked)}
                >
                  Намайг санах
                </Checkbox>
                <Link href={"/forgot"}>
                  <div className="text text-primary-400 underline">
                    Нууц үгээ мартсан уу?
                  </div>
                </Link>
              </div>
              <div className="pb-3">
                <Button
                  variant="primary"
                  type="submit"
                  loading={loading}
                  className="w-full"
                  size="md"
                >
                  <span>Нэвтрэх</span>
                </Button>
              </div>
            </div>
          );
        }}
      </Form >
    </div >
  );
}
