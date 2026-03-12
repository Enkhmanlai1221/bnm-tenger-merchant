"use client";

import { IContactInfo } from "@/interfaces/contact-info";
import { createContext, useContext } from "react";

type LanguageContextType = {
  currencyRate: (
    price: number,
    decimals?: number,
    isNumber?: boolean,
  ) => string | number;
  currency: {
    usd: number;
  };
  dictionary: Record<string, string>;
  lang: string;
  translate: (key: string, fallback?: string) => string;
  init: {
    contact: IContactInfo;
  };
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

export function LanguageProvider({
  children,
  dictionary,
  lang,
  currency = { usd: 0 },
  init,
}: {
  children: React.ReactNode;
  dictionary: Record<string, string>;
  lang: string;
  currency: {
    usd: number;
  };
  init: any;
}) {
  const translate = (key: string, fallback?: string): string => {
    // const translation = dictionary[key];
    // if (!translation) {
    //   // Log missing translation in development
    //   if (process.env.NODE_ENV === "development") {
    //     console.warn(`Translation missing for key: ${key}`);
    //   }
    //   return fallback || key;
    // }
    return key;
  };

  const currencyRate = (
    price: number,
    decimals = 2,
    isNumber = false,
  ): string | number => {
    if (isNaN(price)) return "0";
    const rate = isNaN(parseFloat(`${currency.usd}`.replace(/,/g, "")))
      ? 1
      : parseFloat(`${currency.usd}`.replace(/,/g, ""));
    const calculatedPrice = lang !== "mn" ? price / rate : price;
    const factor = Math.pow(10, decimals);
    const ceiledPrice = Math.ceil(calculatedPrice * factor) / factor;

    if (isNumber) return ceiledPrice;
    return (
      `${parseFloat(ceiledPrice.toFixed(decimals))}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (lang !== "mn" ? "$" : "₮")
    );
  };

  return (
    <LanguageContext.Provider
      value={{
        dictionary,
        lang,
        translate,
        currencyRate,
        currency,
        init,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
