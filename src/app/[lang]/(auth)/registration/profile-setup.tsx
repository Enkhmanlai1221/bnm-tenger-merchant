import { useState } from "react";
import PersonalForm from "./personal-form";
import { IUser, UserType } from "@/interfaces/user";
import { authApi, authMerchantApi } from "@/apis";
import { useRouter } from "next/navigation";
import { message } from "@/utils/message";
import { useLanguage } from "@/providers/language";
import { ErrorMessage } from "@/utils/http/http-handler";
import MerchantForm from "./merchant-form";

interface Props {
  user: IUser;
  onNext?: () => void;
  onSuccess: () => void;
}


export function RegistrationProfileSetup({ user, onNext, onSuccess }: Props) {
  const router = useRouter();
  const { translate } = useLanguage();
  const [loading, setLoading] = useState<boolean>(false);
  const [segmentInput, setSegmentInput] = useState<"INDIVIDUAL" | "ORGANIZATION">(user?.merchantType || "INDIVIDUAL");

  const segments: { label: string; value: "INDIVIDUAL" | "ORGANIZATION" }[] = [
    { label: translate("individual", "Individual"), value: "INDIVIDUAL" },
    { label: translate("institution", "Institution"), value: "ORGANIZATION" },
  ];

  const onSubmit = async (values: any, stepIndex: number) => {
    setLoading(true);
    const merchantValues = {
      ...values,
      merchantType: segmentInput,
    };

    try {
      if (stepIndex === 0) {
        if (user?.type === UserType.MERCHANT) {
          await authMerchantApi.updateProfile(merchantValues);
          onSuccess?.();
          onNext?.();
        } else {
          await authApi.updateProfile(values);
          onSuccess?.();
          router.replace("/");
        }
      }

      message.success(
        translate("successfully_registered", "Successfully registered"),
      );
    } catch (error) {
      message.error((error as ErrorMessage).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {user?.type !== "APP_USER" && (
        <div className="flex justify-center">
          <div className="inline-flex bg-gray-100 rounded-full p-1 shadow-sm w-full">
            {segments.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => setSegmentInput(item.value)}
                className={`flex-1 px-5 py-2.5 text-sm font-medium rounded-full transition-all duration-200 
                  ${segmentInput === item.value
                    ? "bg-primary text-white shadow-sm"
                    : "text-gray-600 hover:text-gray-800"
                  }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {user?.type === "APP_USER" ? (
        <PersonalForm
          initialValues={{
            avatar: user.avatar?.originalUrl,
            firstName: user.firstName,
            lastName: user.lastName,
            registerNo: user.registerNo,
          }}
          onSuccess={(values) => onSubmit(values, 0)}
          isLoading={loading}
        />
      ) : (
        {
          INDIVIDUAL: (
            <PersonalForm
              initialValues={{
                avatar: user.avatar?.originalUrl,
                lastName: user.lastName,
              }}
              onSuccess={(values) => onSubmit(values, 0)}
              isLoading={loading}
            />
          ),
          ORGANIZATION: (
            <MerchantForm
              initialValues={{
                avatar: user.avatar?.originalUrl,
                firstName: user.firstName,
                registerNo: user.registerNo,
              }}
              onSuccess={(values) => onSubmit(values, 0)}
              isLoading={loading}
            />
          ),
        }[segmentInput]
      )}
    </div>
  );
}
//