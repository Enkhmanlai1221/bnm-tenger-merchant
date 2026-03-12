import { paymentApi } from "@/apis";
import { PaymentMethod } from "@/models/payment-method";
import { useLanguage } from "@/providers/language";
import Image from "next/image";
import useSWR from "swr";

export function PaymentMethodCard() {
  const { translate } = useLanguage();

  const { data, isLoading } = useSWR(`swr.public.payment.methods`, () =>
    paymentApi.methodList({
      page: 1,
      limit: 20,
    }),
  );

  const skeletons = Array.from({ length: 6 });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-1 gap-2 mt-2">
      {isLoading
        ? skeletons.map((_, index) => (
          <div
            key={index}
            className="group relative rounded-2xl bg-gray-100 animate-pulse flex items-center gap-4 p-4 h-16"
          >
            <div className="w-8 h-8 bg-gray-300 rounded-full" />
            <div className="flex flex-col justify-center flex-1 gap-1">
              <div className="h-3 bg-gray-300 rounded w-3/4" />
              <div className="h-2 bg-gray-200 rounded w-1/2" />
            </div>
          </div>
        )) :
        <>
          <div
            className="group relative rounded-2xl bg-gradient-to-br from-white to-gray-50 flex items-center gap-4 p-4"
            style={{ border: `1px solid gray` }}
          >
            <Image
              src="/apple-logo.png"
              height={40}
              width={120}
              className="w-auto h-10"
              alt="apple-logo-black-icon"
            />
            <div className="flex flex-col justify-center">
              <span className="font-medium text-sm text-color-red">
                {translate("apple_pay_name", "Apple pay")}
              </span>
              <span className="text-xs text-gray-500 mt-0.5">
                {translate(
                  "payment_method_apple_pay",
                  "You can make fast and secure payments using Apple Pay"
                )}
              </span>
            </div>
          </div>
          {(data?.rows || []).map((method: PaymentMethod) => {
            let description = "";
            let color = "#000000";

            switch (method.code) {
              case "APPLEPAY":
                color = "#0d6efd";
                description = translate(
                  "payment_method_apple_pay",
                  "You can make fast and secure payments using Apple Pay"
                );
                break;
              case "STOREPAY":
                color = "#2150f6";
                description = translate(
                  "payment_method_story_pay",
                  "You can make payments easily and quickly using Storepay."
                );
                break;
              case "POCKET":
                color = "#db4458";
                description = translate(
                  "payment_method_pocket",
                  "You can pay in installments without a down payment using Pocket."
                );
                break;
              case "WECHAT":
                color = "#60be38";
                description = translate(
                  "payment_method_wechat",
                  "You can make fast payments using WeChat Pay."
                );
                break;
              case "CARD":
                color = "#040404";
                description = translate(
                  "payment_method_card",
                  "You can make instant payments using a bank card."
                );
                break;
              case "QPAY":
                color = "#1e3059";
                description = translate(
                  "payment_method_qpay",
                  "You can make easy and secure payments using QPAY."
                );
                break;
              default:
                color = "#6c757d";
                description = translate(
                  "payment_method_other",
                  "You can make payments without a down payment or fees."
                );
            }

            return (
              <div
                key={method._id}
                className="group relative rounded-2xl bg-gradient-to-br from-white to-gray-50 flex items-center gap-4 p-4"
                style={{ border: `1px solid gray` }}
              >
                <Image
                  src={method.image || "/placeholder.svg"}
                  height={40}
                  width={120}
                  className="w-auto h-10"
                  alt={`${method._id}`}
                />
                <div className="flex flex-col justify-center">
                  <span className="font-medium text-md" style={{ color }}>
                    {method.name}
                  </span>
                  <span className="text-sm text-gray-500 mt-0.5">{description}</span>
                </div>
              </div>
            );
          })}
        </>
      }
    </div>
  );
}
