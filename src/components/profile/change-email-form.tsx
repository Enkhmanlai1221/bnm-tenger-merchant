import { useLanguage } from "@/providers/language";
import * as yup from "yup";
import { useState } from "react";
import { Form } from "../ui/form";
import { message } from "@/utils/message";
import { authApi } from "@/apis";
import { ErrorMessage } from "@/utils/http/http-handler";
import { MerchantOtpForm } from "./merchant-otp-form";
import { TextField } from "../ui/form/text-field";
import { Button } from "@heroui/react";

interface Props {
  email?: string;
  onClose: () => void;
}

export function EmailChangeForm({ email, onClose }: Props) {
  const { translate } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [changeNumber, setChangeNumber] = useState<"EMAIL">();

  const formSchema = yup.object().shape({
    email: yup
      .string()
      .email(translate("please_enter_valid_email", "Please enter valid email!"))
      .required(translate("this_field_is_required", "This field is required!")),
  });

  const onSubmit = async (values: { email: string }) => {
    setLoading(true);
    try {
      await authApi.emailChange({ newEmail: values.email, });
      setChangeNumber("EMAIL");
      message.success(translate("otp_sent_successfully", "OTP sent successfully"));
      setOtpSent(true);
    } catch (err) {
      message.error((err as ErrorMessage).message);
    } finally {
      setLoading(false);
    }
  };

  if (otpSent) return <MerchantOtpForm username={changeNumber} itemType="EMAIL" onClose={onClose} />;

  return (
    <Form
      initialValues={{ email: email || "" }}
      validationSchema={formSchema}
      onSubmit={onSubmit}
    >
      {() => (
        <div className="flex flex-col gap-y-4">
          <TextField
            isRequired
            name="email"
            label={translate("email", "Email")}
            placeholder={translate("please_enter_your_email_address", "Please enter your email address")}
          />

          <Button type="submit" variant="solid" isLoading={loading} className="w-full" color="primary">
            {translate("continue", "Continue")}
          </Button>
        </div>
      )}
    </Form>
  );
}
