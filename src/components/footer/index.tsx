"use client";

import { useLanguage } from "@/providers/language";
import {
  IconBrandFacebook,
  IconBrandInstagram,
  IconMail,
  IconPhone,
} from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";

const NAV_LINKS = [
  { name: "Дашбоард", href: "/dashboard" },
  { name: "Гэр / Өрөө", href: "/listings" },
  { name: "Захиалга", href: "/bookings" },
  { name: "Кемп график", href: "/camp-graphic" },
  { name: "Ажилчид", href: "/users" },
];

const SOCIAL_LINKS = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/tenger.mn",
    icon: IconBrandFacebook,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/tenger.mn",
    icon: IconBrandInstagram,
  },
];

export function Footer() {
  const { lang } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer className="hidden lg:block border-t border-slate-200 bg-white">
      <div className="px-4 xl:px-8 py-8">
        <div className="grid grid-cols-3 gap-10">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <Link
              href={`/${lang}/dashboard`}
              className="flex items-center gap-3 w-fit"
            >
              <div className="leading-none">
                <p className="text-[15px] font-bold tracking-[0.28em] text-slate-900">
                  TENGER
                </p>
                <p className="mt-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-blue-600/80">
                  Travel Platform
                </p>
              </div>
            </Link>
            <p className="text-sm text-slate-500 leading-relaxed max-w-[220px]">
              Монголын тэргүүлэгч аялал жуулчлалын платформ
            </p>
            <div className="flex items-center gap-2 mt-1">
              {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex items-center justify-center size-8 rounded-lg bg-slate-100 text-slate-500 transition-colors hover:bg-blue-50 hover:text-blue-600"
                >
                  <Icon size={16} stroke={1.6} />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex flex-col gap-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
              Навигац
            </p>
            <ul className="flex flex-col gap-2">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={`/${lang}${link.href}`}
                    className="text-sm text-slate-500 transition-colors hover:text-blue-600"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
              Холбоо барих
            </p>
            <ul className="flex flex-col gap-3">
              <li>
                <a
                  href="tel:99770146"
                  className="flex items-center gap-2.5 text-sm text-slate-500 transition-colors hover:text-blue-600"
                >
                  <span className="flex items-center justify-center size-7 rounded-lg bg-slate-100 text-slate-400">
                    <IconPhone size={14} stroke={1.6} />
                  </span>
                  99770146
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@tenger.mn"
                  className="flex items-center gap-2.5 text-sm text-slate-500 transition-colors hover:text-blue-600"
                >
                  <span className="flex items-center justify-center size-7 rounded-lg bg-slate-100 text-slate-400">
                    <IconMail size={14} stroke={1.6} />
                  </span>
                  info@tenger.mn
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-5">
          <p className="text-xs text-slate-400">
            © {year} Tenger Travel Platform. Бүх эрх хуулиар хамгаалагдсан.
          </p>
          <p className="text-xs text-slate-400">
            Монгол улс, Улаанбаатар
          </p>
        </div>
      </div>
    </footer>
  );
}
