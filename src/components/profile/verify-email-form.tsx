"use client";
import { authApi } from "@/apis";
import { useLanguage } from "@/providers/language";
import { ErrorMessage } from "@/utils/http/http-handler";
import { message } from "@/utils/message";
import { Dispatch, SetStateAction, useState } from "react";
import * as yup from "yup";
import Button from "../ui/button/button";
import { Form } from "../ui/form";
import { PinField } from "../ui/form/pin-field";

const FormSchema = yup.object().shape({
  otpCode: yup.string().required("Please enter your otp code!"),
});

const VerifyEmailForm = ({
  setCurrentStep,
}: {
  setCurrentStep: Dispatch<SetStateAction<string>>;
}) => {
  const { translate } = useLanguage();
  const [data] = useState({
    otpCode: undefined,
  });

  const onSubmit = async (value: any) => {
    try {
      await authApi.deactivateAccountVerify({
        otpCode: value.otpCode,
      });
      setCurrentStep("finish");
    } catch (error) {
      message.error((error as ErrorMessage).message);
    }
  };

  return (
    <div>
      <Form
        initialValues={data}
        validationSchema={FormSchema}
        onSubmit={onSubmit}
      >
        {() => {
          return (
            <div className="flex flex-col gap-y-4">
              <p className="text-base/5 text-gray-800">
                {translate(
                  "please_enter_the_otp_that_we_send_to_your_email",
                  "Please enter the OTP that we send to your email. Please check your email.",
                )}
              </p>
              <div className="flex">
                <PinField name="otpCode" length={6} />
              </div>
              <div className="flex justify-end">
                <Button type="submit" variant="primary">
                  {translate("continue", "Continue")}
                </Button>
              </div>
            </div>
          );
        }}
      </Form>
    </div>
  );
};

VerifyEmailForm.displayName = "VerifyEmailForm";

export default VerifyEmailForm;
