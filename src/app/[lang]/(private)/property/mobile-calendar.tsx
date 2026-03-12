"use client";

import {
  eachDayOfInterval,
  endOfMonth,
  format,
  startOfMonth,
} from "date-fns";
import { motion } from "framer-motion";
import {
  IconCalendar,
  IconCalendarCancel,
  IconCurrencyDollar,
  IconSquareRoundedChevronLeft,
  IconSquareRoundedChevronRight,
  IconX,
} from "@tabler/icons-react";
import { cn } from "@/utils";
import useSWR from "swr";
import { merchantApi } from "@/apis";
import { useLanguage } from "@/providers/language";
import { IPropertyCalendar } from "@/interfaces/property";
import dayjs from "dayjs";
import { Drawer, DrawerBody, DrawerContent, DrawerHeader, Modal, ModalBody, ModalContent, ModalHeader, useDisclosure } from "@heroui/react";
import { useState } from "react";
import { isSameMonth } from "date-fns";
import { formatDate } from "@/utils/time-age";
import { mn } from "date-fns/locale";
import { BlockedDates } from "@/components/blocked-dates/page";
import { PriceDateForm } from "../listings/[id]/price-date-form";
import { BlockDateForm } from "../listings/[id]/block-date-form";

interface MobileCalendarProps {
  _id: string;
  onSuccess: () => void;
}

export function ListingsMobileCalendar({ _id, onSuccess }: MobileCalendarProps) {
  const { translate, currencyRate } = useLanguage();
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [activeTab, setActiveTab] = useState<"price" | "availability">("price");
  const [isOpen, setIsOpen] = useState(false);
  const { isOpen: isLocked, onOpen, onClose } = useDisclosure();

  const { data: propertyData, mutate: refresh, isLoading } = useSWR(
    `swr.merchant.property.detail.${_id}`,
    () => merchantApi.getProperty(_id),
    { revalidateOnFocus: false }
  );

  if (!propertyData || isLoading) {
    return (
      <div className="flex h-96 w-full items-center justify-center">
        <div className="text-sm text-gray-500">
          {translate("loading", "Loading...")}
        </div>
      </div>
    );
  }

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  const today = dayjs();
  const basePrice = propertyData.price;
  const quantity = propertyData.quantity;

  const mappedPropertyCalendar: Record<string, IPropertyCalendar & {
    blocked: number;
    isBlocked: boolean;
  }> = propertyData.calendars.reduce(
    (acc, curr) => {
      const blockedQuantity = propertyData.blockedDates.find(bd => bd.date === curr.date)?.quantity || 0;
      acc[dayjs(curr.date).format("YYYY-MM-DD")] = {
        ...curr,
        blocked: blockedQuantity,
        isBlocked: blockedQuantity > 0,
      };
      return acc;
    },
    {} as Record<string, IPropertyCalendar & { blocked: number; isBlocked: boolean }>
  );

  const goToPrevMonth = () =>
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() - 1);
      return newDate;
    });

  const goToNextMonth = () =>
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + 1);
      return newDate;
    });

  return (
    <div className="lg:hidden bg-white">
      <div className="flex items-center justify-between mb-2 min-h-14 hover:bg-gray-50 transition">
        <button onClick={goToPrevMonth}>
          <IconSquareRoundedChevronLeft size={28} stroke={1} />
        </button>
        <div className="text-sm font-medium">
          {format(currentMonth, "yyyy 'он' MMMM", { locale: mn })}
        </div>
        <button onClick={goToNextMonth}>
          <IconSquareRoundedChevronRight size={28} stroke={1} />
        </button>

        <button
          onClick={onOpen}
          type="button"
          className="flex h-9 px-3 items-center justify-center rounded-md border border-gray-300 text-gray-600 hover:text-gray-800 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary font-semibold text-sm transition-colors duration-150"
        >
          {translate("house_lock", "House lock")}
        </button>
      </div>

      <div className="overflow-y-auto flex flex-col gap-2 pb-4" style={{ maxHeight: "calc(100dvh - 128px)" }}>
        {daysInMonth.map((day, index) => {
          const key = format(day, "yyyy-MM-dd");
          const isToday = dayjs(day).isSame(today, "day");
          const isPast = dayjs(day).isBefore(today, "day");
          const isOtherMonth = !isSameMonth(day, currentMonth);
          const calendarData = mappedPropertyCalendar?.[key];
          const price = calendarData?.price ?? basePrice;
          const blocked = calendarData?.blockedQuantity ?? 0;
          const available = calendarData?.availableQuantity ?? quantity;
          const bookings = calendarData?.bookings?.length ?? 0;

          return (
            <motion.div
              layout
              key={index}
              onClick={() => {
                if (!isPast) {
                  setSelectedDate(day);
                  setIsOpen(true);
                }
              }}
              className={cn(
                "flex gap-3 border rounded-xl bg-white shadow-sm transition min-h-14 overflow-hidden",
                isPast ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-gray-50",
                isOtherMonth && "opacity-50",
                isToday && "border-2 border-primary bg-primary/10"
              )}
            >
              <div className="w-24 flex flex-col items-center justify-center border-r border-gray-200 text-center py-3">
                <div className="text-lg font-bold text-gray-900 leading-none">{format(day, "d")}</div>
                <div className="text-xs text-gray-500">{format(day, "E")}</div>
              </div>

              <div className="grid grid-cols-2 gap-y-1 gap-x-2 text-[10px] w-full py-2 pr-3">
                <div className="text-gray-600 font-medium">
                  {calendarData?.price ? translate("discounted_price", "Discounted price") : translate("price", "Price")}:
                  <span className={calendarData?.price ? "text-red-500 font-semibold" : "text-gray-800"}>
                    {" "}{currencyRate(price)}
                  </span>
                </div>
                <div className="text-gray-600 font-medium">
                  {translate("in_stock", "In stock")}: <span className="text-gray-800 font-semibold">{available}</span>
                </div>
                <div className="text-gray-600 font-medium">
                  {translate("the_order", "In the order")}: <span className="text-green-600 font-semibold">{bookings}</span>
                </div>
                <div className="text-gray-600 font-medium">
                  {translate("locked", "Locked")}: <span className="text-red-500 font-semibold">{blocked}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <Drawer
        isOpen={isOpen && !!selectedDate}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedDate(null);
            setIsOpen(false);
          }
        }}
        placement="bottom"
        hideCloseButton
      >
        <DrawerContent className="h-[40vh] rounded-t-2xl">
          <>
            <DrawerHeader className="relative px-4 pt-4 pb-2 border-b border-gray-100">
              <button
                onClick={() => {
                  setIsOpen(false);
                  setSelectedDate(null);
                }}
                aria-label="Close"
                className="absolute right-4 top-4 p-1 rounded hover:bg-gray-100 transition"
              >
                <IconX size={16} className="text-gray-500" />
              </button>
              <div className="space-y-1 pr-10">
                <h3 className="text-base font-semibold text-gray-900">
                  {translate("price_control", "Price control")}
                </h3>
                <p className="text-xs text-gray-500">
                  {translate("price_control_description", "Price control for the current month.")}
                </p>
              </div>
            </DrawerHeader>

            <DrawerBody>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <IconCalendar size={24} stroke={1.5} />
                  <div className="text-lg text-gray-900">
                    {formatDate(selectedDate!)}
                  </div>
                </div>
                <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
                  <button
                    onClick={() => setActiveTab("price")}
                    className={cn(
                      "flex-1 py-1 text-sm rounded-md text-center",
                      activeTab === "price" ? "bg-white shadow" : "text-gray-500"
                    )}
                  >
                    <IconCurrencyDollar size={16} className="inline" /> {translate("daily_price", "Daily price")}
                  </button>
                  <button
                    onClick={() => setActiveTab("availability")}
                    className={cn(
                      "flex-1 py-1 text-sm rounded-md text-center",
                      activeTab === "availability" ? "bg-white shadow" : "text-gray-500"
                    )}
                  >
                    <IconCalendarCancel size={16} className="inline" /> {translate("house_lock", "House lock")}
                  </button>
                </div>
                {activeTab === "price" ?
                  <PriceDateForm
                    propertyId={propertyData._id}
                    selectedDate={selectedDate}
                    price={mappedPropertyCalendar[formatDate(selectedDate!)]?.price}
                    basePrice={basePrice}
                    blockedQuantity={mappedPropertyCalendar[formatDate(selectedDate!)]?.blockedQuantity ?? 0}
                    onSuccess={() => {
                      refresh();
                      setSelectedDate(null);
                    }}
                  /> :
                  <BlockDateForm
                    propertyId={propertyData._id}
                    selectedDate={selectedDate}
                    price={mappedPropertyCalendar[formatDate(selectedDate!)]?.price}
                    basePrice={basePrice}
                    blockedQuantity={mappedPropertyCalendar[formatDate(selectedDate!)]?.blockedQuantity ?? 0}
                    onSuccess={() => {
                      refresh();
                      setSelectedDate(null);
                    }}
                  />
                }
              </div>
            </DrawerBody>
          </>
        </DrawerContent>
      </Drawer>

      <Modal
        isOpen={isLocked}
        size="xl"
        radius="sm"
        onClose={onClose}
        hideCloseButton
      >
        <ModalContent className="shadow-lg rounded-xl">
          <ModalHeader className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-foreground text-md font-medium">
                {translate("configure_blocked_dates", "Configure blocked dates")}
              </h2>
            </div>
            <button
              type="button"
              className="text-gray-500 hover:text-gray-700"
              onClick={onClose}
            >
              <IconX size={16} />
            </button>
          </ModalHeader>
          <ModalBody>
            <BlockedDates
              item={propertyData}
              onSuccess={() => {
                refresh();
                onClose();
              }}
              onCancel={onClose}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </div >
  );
}
