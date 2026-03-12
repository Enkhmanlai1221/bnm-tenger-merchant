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
  phone?: string;
  onClose: () => void;
}

export function PhoneChangeForm({ phone, onClose }: Props) {
  const { translate } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [changeNumber, setChangeNumber] = useState<"PHONE">();

  const formSchema = yup.object().shape({
    phone: yup.string().required(translate("this_field_is_required", "This field is required")),
  });

  const onSubmit = async (values: any) => {
    setLoading(true);

    try {
      await authApi.phoneChange({ newPhone: values.phone, });
      setChangeNumber("PHONE");
      message.success(translate("otp_sent_successfully", "OTP sent successfully"));
      setOtpSent(true);
    } catch (err) {
      message.error((err as ErrorMessage).message);
    } finally {
      setLoading(false);
    }
  };

  if (otpSent) return <MerchantOtpForm username={changeNumber} itemType="PHONE" onClose={onClose} />;

  return (
    <Form
      initialValues={{ phone: phone || "" }}
      validationSchema={formSchema}
      onSubmit={onSubmit}
    >
      {() => (
        <div className="flex flex-col gap-y-4">
          <TextField
            isRequired
            name="phone"
            label={translate("phone", "Phone")}
            placeholder={translate("please_enter_your_phone_number", "Please enter your phone number")}
          />

          <Button type="submit" variant="solid" isLoading={loading} className="w-full" color="primary">
            {translate("continue", "Continue")}
          </Button>
        </div>
      )}
    </Form>
  );
}
