import { redirect } from "next/navigation";
import { GerLocale } from "@/utils/lang";

export default async function LangRootPage({
  params,
}: {
  params: Promise<{ lang: GerLocale }>;
}) {
  const { lang } = await params;
  redirect(`/${lang}/login`);
}
