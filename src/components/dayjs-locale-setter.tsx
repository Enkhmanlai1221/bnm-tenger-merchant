"use client";

import { useEffect } from "react";
import dayjs from "dayjs";
import "dayjs/locale/mn";
import "dayjs/locale/en";
import "dayjs/locale/zh";
import "dayjs/locale/ja";
import "dayjs/locale/ko";
import { GerLocale } from "@/utils/lang";

export default function DayjsLocaleSetter({ lang }: { lang: GerLocale }) {
  useEffect(() => {
    dayjs.locale(lang);
  }, [lang]);

  return null;
}
