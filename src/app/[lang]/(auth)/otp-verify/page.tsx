"use client";

import { authApi } from "@/apis";
import { AuthHeader } from "@/components/header/auth-header";
import AlertMessage from "@/components/ui/alert-message";
import { Form } from "@/components/ui/form";
import { PinField } from "@/components/ui/form/pin-field";
import { AuthPageLayout } from "@/components/ui/page-layout/auth-layout";
import { setToken } from "@/store/auth-slice";
import { cn } from "@/utils";
import { ErrorMessage } from "@/utils/http/http-handler";
import { Button } from "@heroui/react";
import { IconChevronLeft, IconStopwatch } from "@tabler/icons-react";
import dayjs from "dayjs";
import { parseAsString, useQueryStates } from "next-usequerystate";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import useSWR from "swr";
import * as yup from "yup";
import { useLanguage } from "@/providers/language";

const FormSchema = yup.object().shape({
  code: yup.string().required("Заавал бөглөнө үү!"),
});

const OtpVerifyPage = () => {
  const { translate } = useLanguage();
  const dispatch = useDispatch();
  const router = useRouter();
  const [lang, setLang] = useState<string>("ENG");
  const [error, setError] = useState<string>();
  const [{ otpMethod, type }] = useQueryStates({
    otpMethod: parseAsString.withDefault("FORGOT"),
    type: parseAsString.withDefault("type"),
  });
  const [timeout, setTimeout] = useState(30);
  const {
    data: otp,
    mutate,
    isValidating,
  } = useSWR(`swr.otp`, () => authApi.otp({ otpMethod }), {
    revalidateOnFocus: false,
  });

  const [loading, setLoading] = useState(false);
  const [data] = useState({
    code: undefined,
  });

  const onSubmit = async (values: any) => {
    try {
      setLoading(true);
      let res;

      res = await authApi.verify({
        otpCode: values.code,
        otpMethod: otpMethod,
      });

      dispatch(setToken(res));
      if (res.sessionScope === "AUTHORIZED") {
        router.push("/?categoryId=otc-62");
      } else {
        router.push("/change-password");
      }
    } catch (err) {
      setError((err as ErrorMessage).message);
    } finally {
      setLoading(false);
    }
  };

  const onGet = () => {
    mutate();
  };

  const timer = useCallback(() => {
    setTimeout(dayjs(otp?.resendIn).diff(dayjs(), "seconds"));
  }, [otp?.resendIn]);

  useEffect(() => {
    timer();

    const id = setInterval(() => {
      timer();
    }, 1000);

    return () => {
      clearInterval(id);
    };
  }, [otp, timer]);

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
          {translate("please_enter_otp_code", "Please enter OTP code")}
        </h1>
        {otp && (
          <div className="text-sm text-gray-500 leading-5 text-left">
            {otp.message}
          </div>
        )}
        <>
          {error && (
            <AlertMessage message={error} type="error" className="mb-2" />
          )}
          <Form
            initialValues={data}
            validationSchema={FormSchema}
            onSubmit={onSubmit}
          >
            {() => {
              return (
                <div className="space-y-4">
                  <div className="flex gap-y-2 justify-center">
                    <PinField
                      label={translate(
                        "please_enter_otp_code",
                        "Please enter OTP code",
                      )}
                      name="code"
                      length={6}
                      required
                      size="lg"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    {otp && timeout > 0 && (
                      <div className="flex items-center gap-x-2">
                        <IconStopwatch size={23} stroke={1.5} />
                        <span>{translate("sec", "sec")}</span>
                      </div>
                    )}
                    <Button
                      variant="bordered"
                      className={cn([
                        "text-sm font-medium text-primary-600",
                        !(otp && timeout) ? "hover:text-gray-500" : "",
                      ])}
                      isLoading={isValidating}
                      onPress={() => onGet()}
                      isDisabled={otp && timeout > 0}
                      color="primary"
                    >
                      <span className="text-primary-600">
                        {otp && timeout > 0
                          ? `${timeout} ${translate("sec", "sec")}`
                          : translate("resend", "Resend")}
                      </span>
                    </Button>
                  </div>
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

OtpVerifyPage.displayName = "OtpVerifyPage";

export default OtpVerifyPage;
