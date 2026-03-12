import { useLanguage } from "@/providers/language";
import * as yup from "yup";
import { Form } from "../ui/form";
import { Button } from "@heroui/react";
import { useEffect, useState } from "react";
import { authApi } from "@/apis";
import { errorParse } from "@/utils/error-parse";
import { message } from "@/utils/message";
import { PinField } from "../ui/form/pin-field";
import { IconStopwatch } from "@tabler/icons-react";
import dayjs from "dayjs";

interface Props {
  itemType: "EMAIL" | "PHONE";
  username?: string;
  onClose: () => void
}

export function MerchantOtpForm({ username, onClose, itemType }: Props) {
  const { translate } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [timeout, setTimeoutState] = useState(30);
  const [expireAt, setExpireAt] = useState<Date>(dayjs().add(30, "second").toDate());

  const formSchema = yup.object({
    otpCode: yup.string().required(translate("please_enter_otp_code", "Please enter OTP code")),
  });

  const verifyOtp = async (values: { otpCode: string }) => {
    setLoading(true);
    try {
      if (itemType === "EMAIL") {
        await authApi.emailVerify({ otpCode: values.otpCode });
      } else {
        await authApi.phoneVerify({ otpCode: values.otpCode });
      }

      await authApi.me();
      message.success(translate("otp_verified", "OTP verified"));
      onClose();
    } catch (err) {
      errorParse(err);
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    setLoading(true);
    try {
      if (itemType === "EMAIL") {
        await authApi.emailChange(username);
      } else {
        await authApi.phoneChange(username);
      }

      const newExpire = dayjs().add(30, "second").toDate();
      setExpireAt(newExpire);
      message.success(translate("otp_resent", "OTP resent"));
    } catch (err) {
      errorParse(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!expireAt) return;

    const interval = setInterval(() => {
      const secondsLeft = dayjs(expireAt).diff(dayjs(), "second");
      setTimeoutState(secondsLeft > 0 ? secondsLeft : 0);
    }, 1000);

    return () => clearInterval(interval);
  }, [expireAt]);


  return (
    <Form
      initialValues={{ otpCode: "" }}
      validationSchema={formSchema}
      onSubmit={verifyOtp}
    >
      {() => (
        <div className="space-y-4">
          <div className="flex justify-center">
            <PinField
              label={translate("please_enter_otp_code", "Please enter OTP code")}
              name="otpCode"
              length={6}
              required
              size="lg"
            />
          </div>

          <div className="flex items-center justify-between">
            {timeout > 0 ? (
              <div className="flex items-center gap-x-2 text-gray-700">
                <IconStopwatch size={20} />
                <span>{`${timeout} ${translate("second", "second")}`}</span>
              </div>
            ) : (
              <Button variant="bordered" onPress={resendOtp} isLoading={loading}>
                {translate("resend", "Resend")}
              </Button>
            )}
          </div>

          <Button type="submit" variant="solid" isLoading={loading} className="w-full">
            {translate("verify", "Verify")}
          </Button>
        </div>
      )}
    </Form>
  );
}
