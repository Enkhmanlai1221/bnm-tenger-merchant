import { IBooking } from "@/interfaces/booking";
import { useLanguage } from "@/providers/language";
import { IconUser } from "@tabler/icons-react";
import Image from "next/image";
import { TextLabel } from "../ui/text-label";

const SubscriberInfo = ({ data }: { data: IBooking }) => {
  const { translate } = useLanguage();
  return (
    <div className="border rounded-2xl p-8 flex gap-x-8 md:flex-nowrap flex-wrap justify-center">
      <div className="flex flex-col items-center col-span-1 gap-y-3">
        <div className="border rounded-full w-36 h-36 flex-none flex">
          {data.user?.avatar ? (
            <Image
              src={data.user?.avatar.url}
              alt="avatar"
              width={144}
              height={144}
              className="rounded-full object-cover h-auto"
            />
          ) : (
            <div className="size-36 rounded-full bg-gray-100 flex items-center justify-center border-2 border-gray-400">
              <IconUser size={144} stroke={0.6} className="text-gray-400" />
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <TextLabel
            label={translate("last_name", "Lastname")}
            text={data.user.lastName}
          />
          <TextLabel
            label={translate("first_name", "Firstname")}
            text={data.user.firstName}
          />
          <TextLabel label={translate("code", "Code")} text={data.code} />
          <TextLabel
            label={translate("email", "Email")}
            text={data.user.email}
          />
          <TextLabel
            label={translate("phone", "Phone")}
            text={data.user.phone}
          />
        </div>
      </div>
    </div>
  );
};

export { SubscriberInfo };
