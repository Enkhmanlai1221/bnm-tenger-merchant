import { getCurrencies } from "@/actions/currency";
import { getDictionary } from "@/actions/lang";
import { LanguageProvider } from "./language";
import { getInit } from "@/actions/init";

export default async function InitProvider({
  children,
  lang,
}: {
  children: React.ReactNode;
  lang: string;
}) {
  const result = await getDictionary(lang);
  const currencies = await getCurrencies();
  const init = await getInit();
  // if (!result.success) {
  //   return <div>Error loading language data: {result.error}</div>;
  // }

  return (
    <LanguageProvider
      dictionary={result.data}
      lang={lang}
      currency={currencies.data}
      init={init.data}
    >
      {children}
    </LanguageProvider>
  );
}

InitProvider.displayName = "InitProvider";
