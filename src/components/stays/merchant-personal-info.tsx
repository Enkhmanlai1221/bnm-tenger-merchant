/* eslint-disable @next/next/no-img-element */
import { IMerchant } from "@/interfaces/merchant";
import { IconMail, IconPhone, IconUserCircle } from "@tabler/icons-react";
import dayjs from "dayjs";
import Image from "next/image";
import { useLanguage } from "@/providers/language";

const MerchantPersonalInfo = ({ data }: { data: IMerchant }) => {
  const { translate } = useLanguage();
  return (
    <div className="border p-4 rounded-2xl">
      <div className="flex flex-col items-center justify-center">
        <div className="flex flex-col items-center gap-4 mb-4">
          {data.avatar?.url ? (
            <Image
              src={data.avatar?.url}
              alt="profile"
              width={120}
              height={120}
              className="object-cover w-36 h-36 rounded-full ring ring-gray-200"
            />
          ) : (
            <div className="w-36 h-36 rounded-full ring ring-gray-200 flex items-center justify-center">
              <IconUserCircle size={48} />
            </div>
          )}
          <div className="flex flex-col items-center ">
            <span className="text-2xl font-semibold">
              {data.lastName} {data.firstName}
            </span>
            <span className="text-base font-normal text-gray-400">
              {translate("created_by", "Created by")}{" "}
              {dayjs(data.createdAt).format("YYYY")}
            </span>
            <span className="text-base font-normal text-gray-400">
              {data.merchantType === "INDIVIDUAL" ? (
                <span className="text-gray-600">
                  {translate("individual", "Individual")}
                </span>
              ) : (
                <span className="text-gray-600">
                  {translate("organization", "Organization")}
                </span>
              )}
            </span>
          </div>
        </div>
      </div>
      <div className="space-y-4">
        {data.phone && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <IconPhone size={18} />
              <span className="text-sm font-semibold text-gray-800">
                {translate("phone", "Phone")}:
              </span>
            </div>
            <span className="text-sm font-normal text-gray-800">
              {data.phone}
            </span>
          </div>
        )}
        {data.email && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <IconMail size={18} />
              <span className="text-sm font-semibold text-gray-800">
                {translate("email", "Email")}:
              </span>
            </div>
            <span className="text-sm font-normal text-gray-800">
              {data.email}
            </span>
          </div>
        )}
        {data.city && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img src="/global-icon.svg" alt="" width={18} height={18} />
              <span className="text-sm font-semibold text-gray-800">
                {translate("city", "City:")}
              </span>
            </div>
            <span className="text-sm font-normal text-gray-800">
              {data.city || "N/A"}
            </span>
          </div>
        )}
        {data.state && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img src="/global-icon.svg" alt="" width={18} height={18} />
              <span className="text-sm font-semibold text-gray-800">
                {translate("state", "State")}:
              </span>
            </div>
            <span className="text-sm font-normal text-gray-800">
              {data.state || "N/A"}
            </span>
          </div>
        )}
        {data.country && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img src="/global-pin-icon.svg" alt="" width={18} height={18} />
              <span className="text-sm font-semibold text-gray-800">
                {translate("country", "Country")}:
              </span>
            </div>
            <span className="text-sm font-normal text-gray-800">
              {data.country || "N/A"}
            </span>
          </div>
        )}
        {data.postalCode && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img src="/market-pin-icon.svg" alt="" width={18} height={18} />
              <span className="text-sm font-semibold text-gray-800">
                {translate("postal_code", "Postal Code")}:
              </span>
            </div>
            <span className="text-sm font-normal text-gray-800">
              {data.postalCode || "N/A"}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export { MerchantPersonalInfo };
