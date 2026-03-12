"use client";

import DayjsLocaleSetter from "@/components/dayjs-locale-setter";
import { GerLocale } from "@/utils/lang";
import dynamic from "next/dynamic";
import ReduxProvider from "./redux";

// Dynamically import non-critical components with no loading state
const DynamicToaster = dynamic(
  () => import("react-hot-toast").then((mod) => mod.Toaster),
  {
    ssr: false,
    loading: () => null,
  },
);

// Dynamically import ModalProvider with no loading state
const DynamicModalProvider = dynamic(
  () => import("@/providers/modal").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => null,
  },
);

// Dynamically import HeroUIProvider
const DynamicHeroUIProvider = dynamic(
  () => import("@heroui/react").then((mod) => mod.HeroUIProvider),
  {
    ssr: false,
    loading: () => null,
  },
);

interface ClientProvidersProps {
  children: React.ReactNode;
  lang: GerLocale;
}

export default function ClientProviders({
  children,
  lang,
}: ClientProvidersProps) {
  return (
    <ReduxProvider>
      <DynamicHeroUIProvider disableRipple>
        <DynamicModalProvider>
          <DayjsLocaleSetter lang={lang} />
          {children}
          <DynamicToaster />
        </DynamicModalProvider>
      </DynamicHeroUIProvider>
    </ReduxProvider>
  );
}
