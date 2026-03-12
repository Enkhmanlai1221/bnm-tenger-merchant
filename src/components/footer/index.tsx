"use client";

import { Container } from "@/components/ui/page-layout/container";
import { useLanguage } from "@/providers/language";

import { IconMail, IconPhone } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";

export function Footer() {
  const { init } = useLanguage();

  return (
    <footer className="hidden lg:block">
      <div className="bg-primary-900 text-white py-4">
        <Container>
          <div className="flex flex-col md:flex-row items-center justify-between gap-x-10 gap-y-4 md:gap-y-0">
            <div className="flex gap-x-2 items-center">
              <IconPhone className="size-4" />
              <span>99770146</span>
            </div>
            <div className="flex gap-x-2 items-center">
              <IconMail className="size-4" />
              <span>info@tenger.mn</span>
            </div>
            <div className="flex gap-x-2 items-center">
              {/* {init.contact.socials.map((social) => (
                <Link
                  href={social.link}
                  key={social._id}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    src={social.logo}
                    alt={social.name}
                    width={20}
                    height={20}
                  />
                </Link>
              ))} */}
            </div>
          </div>
        </Container>
      </div>
    </footer>
  );
}
