import { authApi } from "@/apis";
import { setToken } from "@/store/auth-slice";
import { errorParse } from "@/utils/error-parse";
import { useState } from "react";
import { useDispatch } from "react-redux";
import * as yup from "yup";
import { Form } from "../ui/form";
import { PasswordField } from "../ui/form/password-field";
import { Button } from "@heroui/react";
import { message } from "@/utils/message";
import { useLanguage } from "@/providers/language";

const ChangePasswordForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const { translate } = useLanguage();

  const formSchema = yup.object().shape({
    oldPassword: yup
      .string()
      .required(translate("this_field_is_required", "This field is required")),
    password: yup
      .string()
      .required(translate("this_field_is_required", "This field is required"))
      .min(
        8,
        translate(
          "this_field_is_required",
          "This field must be at least 8 characters",
        ),
      )
      .matches(
        /^(?=.*[a-z])/,
        translate(
          "this_field_is_required",
          "This field must contain a lowercase letter",
        ),
      )
      .matches(
        /^(?=.*[A-Z])/,
        translate(
          "this_field_is_required",
          "This field must contain an uppercase letter",
        ),
      )
      .matches(
        /^(?=.*[0-9])/,
        translate("this_field_is_required", "This field must contain a number"),
      ),
    confirmPassword: yup
      .string()
      .required(translate("this_field_is_required", "This field is required"))
      .oneOf(
        [yup.ref("password")],
        translate(
          "this_field_is_required",
          "This field must match the password",
        ),
      )
      .min(
        8,
        translate(
          "this_field_is_required",
          "This field must be at least 8 characters",
        ),
      )
      .matches(
        /^(?=.*[a-z])/,
        translate(
          "this_field_is_required",
          "This field must contain a lowercase letter",
        ),
      )
      .matches(
        /^(?=.*[A-Z])/,
        translate(
          "this_field_is_required",
          "This field must contain an uppercase letter",
        ),
      )
      .matches(
        /^(?=.*[0-9])/,
        translate("this_field_is_required", "This field must contain a number"),
      ),
  });
  const [loading, setLoading] = useState(false);

  const [data] = useState({
    oldPassword: undefined,
    password: undefined,
    confirmPassword: undefined,
  });
  const onSubmit = async (value: any) => {
    try {
      setLoading(true);
      await authApi.changePassword({
        password: value.password,
        oldPassword: value.oldPassword,
      });
      onSuccess?.();
      message.success(
        translate(
          "password_updated_successfully",
          "Password updated successfully",
        ),
      );
    } catch (err) {
      errorParse(err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <Form
        initialValues={data}
        validationSchema={formSchema}
        onSubmit={onSubmit}
      >
        {({ values, errors }) => {
          const isValidPassword =
            values.password === values.confirmPassword && !errors.password;
          return (
            <div className="flex flex-col gap-y-4">
              <PasswordField
                name="oldPassword"
                label={translate("current_password", "Current password")}
                placeholder={translate(
                  "please_enter_your_current_password",
                  "Please enter your current password.",
                )}
                required
              />

              <PasswordField
                name="password"
                label={translate("new_password", "New password")}
                placeholder={translate(
                  "please_enter_your_new_password",
                  "Please enter your new password.",
                )}
                required
              />
              <PasswordField
                name="confirmPassword"
                label={translate("confirm_password", "Confirm password")}
                placeholder={translate(
                  "please_verify_your_confirm_password",
                  "Please verify your confirm password.",
                )}
                required
                isInvalid={!isValidPassword}
                errorMessage={
                  isValidPassword
                    ? ""
                    : translate("passwords_must_match", "Passwords must match")
                }
              />
              <div className="flex justify-end">
                <Button
                  type="submit"
                  variant="solid"
                  isLoading={loading}
                  color="primary"
                >
                  {translate("update_password", "Update password")}
                </Button>
              </div>
            </div>
          );
        }}
      </Form>
    </>
  );
};

export { ChangePasswordForm };
