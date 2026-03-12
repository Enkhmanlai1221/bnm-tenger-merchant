"use client";

import { paymentApi } from "@/apis";
import { RadioGroup, RadioGroupProps } from "@heroui/react";
import useSWR from "swr";
import { CustomRadio } from "../ui/custom-radio";
import { useLanguage } from "@/providers/language";
import { PAYMENT_METHOD } from "@/interfaces/payment";
import { cn } from "@/utils";

export function PaymentMethodPicker(
  props: Omit<RadioGroupProps, "onValueChange"> & {
    onValueChange: (value: string, code: string) => void;
  },
) {
  const { translate } = useLanguage();
  const { data: methods } = useSWR(`/payment/methods`, () =>
    paymentApi.methodList({
      page: 1,
      limit: 100,
    }),
  );

  const handleValueChange = (value: string) => {
    const method = methods?.rows.find((m: any) => m._id === value);
    props.onValueChange(value, method.code);
  };

  if (methods?.rows.length === 0) {
    return (
      <div>
        {translate("no_payment_methods_found", "No payment methods found")}
      </div>
    );
  }

  return (
    <RadioGroup
      {...props}
      onValueChange={handleValueChange}
      classNames={{
        wrapper: "flex flex-col gap-2 w-full items-stretch",
      }}
    >
      {methods?.rows.map((method: {
        _id: string;
        code: PAYMENT_METHOD;
        name: string;
        image: string;
      }) => {
        return (
          <CustomRadio
            key={method._id}
            value={method._id}
            style={{
              backgroundColor:
                method.code === "QPAY" ? "#0F2C5B" :
                  method.code === "POCKET" ? "#E52F57" :
                    method.code === "WECHAT" ? "#61BE38" :
                      method.code === "STOREPAY" ? "#0055FF" :
                        method.code === "CARD" ? "#FFFFFF" :
                          undefined,
              border: method.code === "CARD" ? "border bord-gray" : "none",
            }}
          >
            {{
              [PAYMENT_METHOD.QPAY]:
                <div className="flex items-center gap-3">
                  <img src="/qpay.svg" alt={method.name} className="w-8 h-8" />
                  <span className={cn("text-md font-medium text-white")}>
                    {method.name}
                  </span>
                </div>,
              [PAYMENT_METHOD.POCKET]:
                <div className="flex items-center gap-3">
                  <img src="/pocket.svg" alt={method.name} className="w-8 h-8" />

                  <div className="flex flex-col">
                    <span className="text-md font-medium text-white leading-tight">{method.name}</span>
                    <span className="text-xs text-white leading-tight">Урьдчилгаагүй, шимтгэлгүй 2-6 хувааж төлнө.</span>
                  </div>
                </div>,
              [PAYMENT_METHOD.WECHAT]:
                <div className="flex items-center gap-3">
                  <img src="/wechat.svg" alt={method.name} className="w-8 h-8" />
                  <span className={cn("text-md font-medium text-white")}>
                    {method.name}
                  </span>
                </div>,
              [PAYMENT_METHOD.STOREPAY]:
                <div className="flex items-center gap-3">
                  <img src="/storypay.svg" alt={method.name} className="w-8 h-8" />
                  <div className="flex flex-col">
                    <span className="text-md font-medium text-white leading-tight">{method.name}</span>
                    <span className="text-xs text-white leading-tight">Хүүгүй, шимтгэлгүй хуваан төл.</span>
                  </div>
                </div>,
              [PAYMENT_METHOD.CARD]:
                <div className="flex justify-between items-center w-full">
                  <div className="flex items-center gap-3">
                    <img src="/bankcard.svg" alt={method.name} className="w-8 h-8" />
                    <span className="text-md font-medium text-black ">{method.name}</span>
                  </div>
                  <div className="w-28">
                    <img src="/card.svg" alt="card" />
                  </div>
                </div>,
            }[method.code]}
          </CustomRadio>
        );
      })}
    </RadioGroup>
  );
}
