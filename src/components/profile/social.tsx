/* eslint-disable @next/next/no-img-element */
import { Button, Input } from "@heroui/react";
import { Form } from "../ui/form";
import * as yup from "yup";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { errorParse } from "@/utils/error-parse";
import { message } from "@/utils/message";
import { useState } from "react";
import { authApi, authMerchantApi } from "@/apis";
import { TextField } from "../ui/form/text-field";
import { useLanguage } from "@/providers/language";
import IconViber from "../../../public/icons/viber.png";
import IconTelegram from "../../../public/icons/telegram.png";
import IconLine from "../../../public/icons/line.png";
import IconWhatsApp from "../../../public/icons/whatsapp.png";
import IconFacebook from "../../../public/icons/fb.png";
import Image from "next/image";

export function SocialForm() {
  const { translate } = useLanguage();
  const { user } = useSelector((state: RootState) => state.auth);
  const [isLoading, setIsLoading] = useState(false);

  const formSchema = yup.object().shape({
    facebookLink: yup
      .string()
      // .url(translate("invalid_url", "Invalid URL"))
      .optional(),
    viberLink: yup
      .string()
      // .url(translate("invalid_url", "Invalid URL"))
      .optional(),
    telegramLink: yup
      .string()
      // .url(translate("invalid_url", "Invalid URL"))
      .optional(),
    lineLink: yup
      .string()
      // .url(translate("invalid_url", "Invalid URL"))
      .optional(),
    whatsAppLink: yup
      .string()
      // .url(translate("invalid_url", "Invalid URL"))
      .optional(),
  });

  const onSubmit = async (values: any) => {
    setIsLoading(true);
    try {
      await authMerchantApi.updateSocial(values);

      await authApi.me();
      message.success("Profile updated successfully");
    } catch (error) {
      errorParse(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form
      initialValues={{
        facebookLink: user?.facebookLink,
        viberLink: user?.viberLink,
        telegramLink: user?.telegramLink,
        lineLink: user?.lineLink,
        whatsAppLink: user?.whatsAppLink,
      }}
      validationSchema={formSchema}
      onSubmit={onSubmit}
    >
      {() => {
        return (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-x-2 col-span-1">
                  <Image src={IconFacebook} alt="" width={24} height={24} />
                  <span>{translate("facebook", "Facebook")}</span>
                </div>
                <div className="col-span-2">
                  <TextField name="facebookLink" type="url" placeholder="https://www.facebook.com/" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-x-2 col-span-1">
                  <Image src={IconViber} alt="" width={24} height={24} />
                  <span>{translate("viber", "Viber")}</span>
                </div>
                <div className="col-span-2">
                  <TextField name="viberLink" type="url" placeholder="https://www.viber.com/" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-x-2 col-span-1">
                  <Image src={IconTelegram} alt="" width={24} height={24} />
                  <span>{translate("telegram", "Telegram")}</span>
                </div>
                <div className="col-span-2">
                  <TextField name="telegramLink" type="url" placeholder="https://www.telegram.com/" />
                </div>
              </div>

              {/* 
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-x-2 col-span-1">
                  <Image src={IconLine} alt="" width={24} height={24} />
                  <span>{translate("line", "Line")}</span>
                </div>
                <div className="col-span-2">
                  <TextField name="lineLink" type="url" placeholder={translate("line_number", "Line number")} />
                </div>
              </div> */}

              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-x-2 col-span-1">
                  <Image src={IconWhatsApp} alt="" width={24} height={24} />
                  <span>{translate("whatsapp", "WhatsApp")}</span>
                </div>
                <div className="col-span-2">
                  <TextField name="whatsAppLink" type="url" placeholder="https://www.whatsapp.com/" />
                </div>
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <Button
                isLoading={isLoading}
                type="submit"
                variant="solid"
                color="primary"
              >
                {translate("save", "Save")}
              </Button>
            </div>
          </div>
        );
      }}
    </Form>
  );
}

