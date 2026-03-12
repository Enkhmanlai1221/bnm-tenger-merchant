"use client";

import React from "react";
import { Button } from "@heroui/react";
import { IconCalendar, IconList } from "@tabler/icons-react";
import Link from "next/link";
import { useLanguage } from "@/providers/language";
import { usePathname } from "next/navigation";
export default function MerchantBookingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { translate } = useLanguage();

  const isCalendar = pathname.includes("calendar");

  return (
    <div>
      <div className="container mt-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">
            {isCalendar
              ? translate(
                "merchant_bookings_calendar",
                "Merchant bookings calendar",
              )
              : translate("merchant_bookings", "Merchant bookings")}
          </h1>
          <div className="flex items-center gap-2">
            <Button
              as={Link}
              href="/merchant-bookings"
              variant={isCalendar ? "bordered" : "solid"}
            >
              <IconList />
              {translate("list", "List")}
            </Button>
            <Button
              as={Link}
              href="/merchant-bookings/calendar"
              variant={isCalendar ? "solid" : "bordered"}
            >
              <IconCalendar />
              {translate("calendar", "Calendar")}
            </Button>
          </div>
        </div>
      </div>
      <div>{children}</div>
    </div>
  );
}
