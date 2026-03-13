"use client";

import { useLanguage } from "@/providers/language";
import { RootState } from "@/store";
import {
  Badge,
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Drawer,
  DrawerContent,
  DrawerBody,
  DrawerHeader,
} from "@heroui/react";
import {
  IconBell,
  IconMenu2,
  IconX,
} from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { useState } from "react";
import { PreListNotfication } from "../notfication/pre-list";
import UserMenu from "./user-menu";
import Image from "next/image";

export function Header() {
  const { notificationCount } = useSelector(
    (state: RootState) => state.general,
  );
  const { lang, translate } = useLanguage();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isDashboard = pathname.startsWith(`/${lang}/dashboard`);
  const isListings = pathname.startsWith(`/${lang}/listings`);
  const isBookings = pathname.startsWith(`/${lang}/bookings`);
  const isCampGraphic = pathname.startsWith(`/${lang}/camp-graphic`);
  const isUsers = pathname.startsWith(`/${lang}/users`);
  const isCalendar = pathname.startsWith(`/${lang}/calendar`);

  const navLinks = [
    {
      name: "Дашбоард",
      href: `/${lang}/dashboard`,
      isActive: isDashboard,
    },
    {
      name: "Гэр / Өрөө",
      href: `/${lang}/listings`,
      isActive: isListings,
    },
    {
      name: "Захиалга",
      href: `/${lang}/bookings`,
      isActive: isBookings,
    },
    {
      name: "Календар",
      href: `/${lang}/calendar`,
      isActive: isCalendar,
    },
    {
      name: "Кемп график",
      href: `/${lang}/camp-graphic`,
      isActive: isCampGraphic,
    },
    {
      name: "Ажилчид",
      href: `/${lang}/users`,
      isActive: isUsers,
    },
  ];

  return (
    <>
      {/* Desktop Header */}
      <header
        className="hidden lg:block sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-[0_1px_2px_0_rgba(0,0,0,0.03)] transition-all"
      >
      <nav className="flex h-[76px] items-center justify-between gap-6 px-4 xl:px-8">

        <div className="flex min-w-0 items-center gap-8">
          <Link
            href={`/${lang}/dashboard`}
            aria-label="Home"
            className="group flex shrink-0 items-center gap-3 transition-opacity hover:opacity-90"
          >
            <Image src="/favicon.ico" alt="Tenger BNM" width={52} height={52} />
            <div className="leading-none">
              <p className="text-[17px] font-bold tracking-[0.28em] text-slate-900">
                TENGER
              </p>
              <p className="mt-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-blue-600/80">
                Travel Platform
              </p>
            </div>
          </Link>
        </div>

        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="flex items-center gap-1.5 rounded-2xl bg-slate-100/60 ring-1 ring-slate-200/50">
            {navLinks.map((link) => {
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`group flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-300 ${link.isActive
                    ? "bg-white text-blue-700 shadow-sm ring-1 ring-slate-200/50"
                    : "text-slate-500 hover:bg-slate-200/50 hover:text-slate-900"
                    }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Actions Section */}
        <div className="flex shrink-0 items-center gap-4">
          <Badge
            color="danger"
            content={notificationCount}
            isInvisible={notificationCount === 0}
            shape="circle"
            className="border-white"
          >
            <Popover
              placement="bottom-end"
              id="notification-popover"
              isNonModal={false}
            >
              <PopoverTrigger>
                <Button
                  isIconOnly
                  aria-label="notifications"
                  radius="full"
                  variant="light"
                  className="h-11 w-11 min-w-11 bg-slate-50 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
                >
                  <IconBell size={22} stroke={1.5} />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-96 rounded-2xl border border-slate-200 p-0 shadow-xl shadow-slate-200/50"
                id="notification-popover-content"
              >
                <div className="w-full overflow-hidden rounded-2xl bg-white">
                  <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                    <div className="text-sm font-semibold text-slate-900">
                      {translate("notifications", "Мэдэгдэл")}
                    </div>
                    {notificationCount > 0 && (
                      <span className="text-xs text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded-md">
                        Шинэ ({notificationCount})
                      </span>
                    )}
                  </div>
                  <div className="max-h-[400px] overflow-y-auto p-2">
                    <PreListNotfication />
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </Badge>

          <div className="h-8 w-px bg-slate-200" />

          <UserMenu />
        </div>
      </nav>
    </header>

      {/* Mobile Header */}
      <header className="lg:hidden sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-[0_1px_2px_0_rgba(0,0,0,0.03)] transition-all">
        <nav className="flex h-16 items-center justify-between gap-4 px-4">
          <Link
            href={`/${lang}/dashboard`}
            aria-label="Home"
            className="group flex shrink-0 items-center gap-2 transition-opacity hover:opacity-90"
          >
            <Image src="/favicon.ico" alt="Tenger BNM" width={40} height={40} />
            <div className="leading-none">
              <p className="text-sm font-bold tracking-[0.28em] text-slate-900">
                TENGER
              </p>
              <p className="mt-0.5 text-[9px] font-semibold uppercase tracking-[0.22em] text-blue-600/80">
                Travel Platform
              </p>
            </div>
          </Link>

          <div className="flex shrink-0 items-center gap-2">
            <Badge
              color="danger"
              content={notificationCount}
              isInvisible={notificationCount === 0}
              shape="circle"
              className="border-white"
            >
              <Popover
                placement="bottom-end"
                id="notification-popover-mobile"
                isNonModal={false}
              >
                <PopoverTrigger>
                  <Button
                    isIconOnly
                    aria-label="notifications"
                    radius="full"
                    variant="light"
                    className="h-9 w-9 min-w-9 bg-slate-50 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
                  >
                    <IconBell size={20} stroke={1.5} />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-[calc(100vw-2rem)] max-w-sm rounded-2xl border border-slate-200 p-0 shadow-xl shadow-slate-200/50"
                  id="notification-popover-content-mobile"
                >
                  <div className="w-full overflow-hidden rounded-2xl bg-white">
                    <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                      <div className="text-sm font-semibold text-slate-900">
                        {translate("notifications", "Мэдэгдэл")}
                      </div>
                      {notificationCount > 0 && (
                        <span className="text-xs text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded-md">
                          Шинэ ({notificationCount})
                        </span>
                      )}
                    </div>
                    <div className="max-h-[400px] overflow-y-auto p-2">
                      <PreListNotfication />
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </Badge>

            <Button
              isIconOnly
              aria-label="Open menu"
              radius="full"
              variant="light"
              className="h-9 w-9 min-w-9 bg-slate-50 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
              onPress={() => setIsMobileMenuOpen(true)}
            >
              <IconMenu2 size={20} stroke={1.5} />
            </Button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu Drawer */}
      <Drawer
        isOpen={isMobileMenuOpen}
        onOpenChange={setIsMobileMenuOpen}
        placement="right"
        size="sm"
      >
        <DrawerContent>
          <DrawerHeader className="flex flex-col gap-1 border-b border-gray-200">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <Image src="/favicon.ico" alt="Tenger BNM" width={32} height={32} />
                <div className="leading-none">
                  <p className="text-sm font-bold tracking-[0.28em] text-slate-900">
                    TENGER
                  </p>
                  <p className="mt-0.5 text-[9px] font-semibold uppercase tracking-[0.22em] text-blue-600/80">
                    Travel Platform
                  </p>
                </div>
              </div>
              <Button
                isIconOnly
                variant="light"
                size="sm"
                onPress={() => setIsMobileMenuOpen(false)}
                className="h-8 w-8 min-w-8"
              >
                <IconX size={18} stroke={1.5} />
              </Button>
            </div>
          </DrawerHeader>
          <DrawerBody className="p-0">
            <div className="flex flex-col">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 text-base font-medium transition-colors border-b border-gray-100 ${
                    link.isActive
                      ? "bg-blue-50 text-blue-700 border-l-4 border-l-blue-600"
                      : "text-slate-700 hover:bg-gray-50"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <div className="px-4 py-3 border-t border-gray-200 mt-auto">
                <UserMenu />
              </div>
            </div>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}