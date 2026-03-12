"use client";
import { Dispatch, SetStateAction, useState } from "react";
import * as yup from "yup";
import { Form } from "../ui/form";
import Button from "../ui/button/button";
import { PasswordField } from "../ui/form/password-field";
import { useLanguage } from "@/providers/language";

const FormSchema = yup.object().shape({
  password: yup.string().required("Please enter your email!"),
});

const VerifyPasswordForm = ({
  setCurrentStep,
  onClose,
}: {
  setCurrentStep: Dispatch<SetStateAction<string>>;
  onClose: () => void;
}) => {
  const { translate } = useLanguage();
  const [data] = useState({
    password: undefined,
  });
  const onSubmit = (values: any) => {
    try {
      // sss
      onClose();
    } catch (error) {
      // error
    } finally {
      onClose();
    }
  };

  return (
    <div>
      <h2 className="flex text-xl font-medium my-4 mb-6">
        {translate("verify_your_password", "Verify your password")}
      </h2>
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
                  "for_your_security_please_re_enter_your_password_to_continue",
                  "For your security, please re-enter your password to continue.",
                )}
              </p>
              <PasswordField
                label="Password"
                name="password"
                placeholder="Please enter your email"
              />
              <div className="grid grid-cols-2 gap-x-4">
                <Button variant="primary" onClick={onClose}>
                  {translate("cancel", "Cancel")}
                </Button>
                <Button variant="default" type="submit">
                  {translate("deactive_account", "Deactive account")}
                </Button>
              </div>
            </div>
          );
        }}
      </Form>
    </div>
  );
};

VerifyPasswordForm.displayName = "VerifyPasswordForm";

export default VerifyPasswordForm;
