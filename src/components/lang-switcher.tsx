"use client";

import { useLanguage } from "@/providers/language";
import { cn } from "@/utils";
import { setLocale } from "@/utils/lang";
import { Button, Popover, PopoverContent, PopoverTrigger } from "@heroui/react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function LanguageSwitcher() {
  const [loading, setLoading] = useState(false);
  const { lang: locale } = useLanguage();
  const pathname = usePathname();
  const router = useRouter();

  const languages = [
    { code: "mn", name: "mn.svg" },
    { code: "en", name: "en.svg" },
    // { code: "zh", name: "cn.svg" },
    // { code: "ja", name: "jp.svg" },
    // { code: "ko", name: "kr.svg" },
    // { code: "ru", name: "ru.svg" },
    // { code: "de", name: "de.svg" },
  ];

  const handleLanguageChange = (langCode: string) => {
    setLoading(true);

    // Set the cookie using the utility function
    setLocale(langCode);
    // Navigate to the new path
    const newPath =
      pathname?.replace(/^\/[a-z]{2}/, `/${langCode}`) || `/${langCode}`;

    // window.location.replace(newPath);

    router.replace(newPath);
    router.refresh();
  };

  const selectedLanguage =
    languages.find((lang) => lang.code === locale) || languages[0];

  useEffect(() => {
    if (loading) {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <div>
      <Popover>
        <PopoverTrigger>
          <Button
            isIconOnly
            aria-label="notifications"
            radius="full"
            variant="light"
            isLoading={loading}
          >
            <Image
              src={`/circle/${selectedLanguage?.name}`}
              alt={selectedLanguage?.name}
              width={22}
              height={22}
              className="rounded-full"
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-2">
          <div className="flex flex-col gap-2">
            {languages.map((lang) => (
              <Button
                key={lang.code}
                isIconOnly
                size="sm"
                className={cn(
                  "bg-white hover:bg-gray-200 p-0",
                  lang.code === locale && "bg-green-100",
                )}
                onPress={() =>
                  lang.code !== locale && handleLanguageChange(lang.code)
                }
                disabled={lang.code === locale}
              >
                <Image
                  src={`/circle/${lang.name}`}
                  alt={lang.name}
                  width={20}
                  height={20}
                  className="rounded-full"
                />
              </Button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
