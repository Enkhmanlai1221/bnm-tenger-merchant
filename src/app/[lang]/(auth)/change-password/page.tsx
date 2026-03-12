"use client";

import { authApi } from "@/apis";
import { AuthHeader } from "@/components/header/auth-header";
import { Form } from "@/components/ui/form";
import { PasswordField } from "@/components/ui/form/password-field";
import { AuthPageLayout } from "@/components/ui/page-layout/auth-layout";
import { IAuth } from "@/interfaces/auth";
import { setToken } from "@/store/auth-slice";
import { ErrorMessage } from "@/utils/http/http-handler";
import { Button, Link } from "@heroui/react";
import { IconChevronLeft } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";
import { useLanguage } from "@/providers/language";
import { message } from "@/utils/message";

const RegisterPage = () => {
  const { translate } = useLanguage();

  const formSchema = (sessionScope: string) => {
    const shape = {
      oldPassword: yup.string(),
      password: yup
        .string()
        .required(
          translate(
            "please_enter_your_password",
            "Please enter your password.",
          ),
        )
        .min(
          8,
          translate(
            "please_enter_your_password",
            "Please enter your password.",
          ),
        )
        .matches(
          /^(?=.*[a-z])/,
          translate(
            "please_enter_your_password",
            "Please enter your password.",
          ),
        )
        .matches(
          /^(?=.*[A-Z])/,
          translate(
            "please_enter_your_password",
            "Please enter your password.",
          ),
        )
        .matches(
          /^(?=.*[0-9])/,
          translate(
            "please_enter_your_password",
            "Please enter your password.",
          ),
        ),
      confirmPassword: yup
        .string()
        .oneOf(
          [yup.ref("password")],
          translate(
            "please_enter_your_password",
            "Please enter your password.",
          ),
        )
        .required(
          translate(
            "please_enter_your_password",
            "Please enter your password.",
          ),
        ),
    };

    if (sessionScope === "AUTHORIZED") {
      shape.oldPassword = yup
        .string()
        .required(
          translate(
            "please_enter_your_password",
            "Please enter your password.",
          ),
        );
    }

    return yup.object().shape(shape);
  };

  const router = useRouter();
  const dispatch = useDispatch();
  const { sessionScope } = useSelector((state: { auth: IAuth }) => state.auth);
  const [data] = useState({
    password: undefined,
    confirmPassword: undefined,
  });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (values: any) => {
    setLoading(true);
    try {
      const res = await authApi.changePassword({
        password: values.password,
        oldPassword:
          sessionScope === "AUTHORIZED" ? values.oldPassword : undefined,
      });
      dispatch(setToken(res));
      if (res.sessionScope === "AUTHORIZED") {
        await authApi.me();
        router.replace("/");
      } else {
        router.replace("/registration");
      }
    } catch (err) {
      message.error((err as ErrorMessage).message)
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthPageLayout>
      <AuthHeader />
      <div className="space-y-3">
        <Link
          href="/register"
          className="flex items-center gap-2 text-primary-600 mb-8"
        >
          <IconChevronLeft size={20} stroke={1.5} />
          <span>{translate("back_to_register", "Back to register")}</span>
        </Link>

        <h1 className="text-2xl font-semibold text-primary-600">
          {translate("add_password", "Add Password")}
        </h1>
        <>
          <Form
            initialValues={data}
            validationSchema={formSchema(sessionScope!)}
            onSubmit={onSubmit}
          >
            {({ values, errors }) => {
              const isValidPassword =
                values.password === values.confirmPassword && !errors.password;

              return (
                <div className="flex flex-col gap-y-4">
                  <PasswordField
                    name="password"
                    label={translate("password", "Password")}
                    placeholder={translate(
                      "please_enter_your_password",
                      "Please enter your password.",
                    )}
                    required
                  />
                  <PasswordField
                    name="confirmPassword"
                    label={translate("confirm_password", "Verify password")}
                    placeholder={translate(
                      "please_verify_your_confirm_password",
                      "Please verify your password.",
                    )}
                    required
                    isInvalid={!isValidPassword}
                    errorMessage={
                      isValidPassword
                        ? ""
                        : translate(
                          "passwords_must_match",
                          "Passwords must match",
                        )
                    }
                  />

                  <Button
                    type="submit"
                    variant="solid"
                    isLoading={loading}
                    className="w-full"
                    size="md"
                    color="primary"
                  >
                    {translate("continue", "Continue")}
                  </Button>
                </div>
              );
            }}
          </Form>
        </>
      </div>
      <br />
    </AuthPageLayout>
  );
};

RegisterPage.displayName = "RegisterPage";

export default RegisterPage;
