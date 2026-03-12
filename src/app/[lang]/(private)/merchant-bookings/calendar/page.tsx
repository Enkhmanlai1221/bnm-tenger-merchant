"use client";

import { merchantApi } from "@/apis";
import { ICalendarCell } from "@/interfaces/booking";
import { useLanguage } from "@/providers/language";
import { Drawer, DrawerBody, DrawerContent, DrawerHeader } from "@heroui/react";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import dayjs from "dayjs";
import { useState } from "react";
import useSWR from "swr";
import { CalendarCell } from "./calendar-cell";
import { CalendarDetail } from "./detail";

export default function CalendarPage() {
  const { translate } = useLanguage();
  const [currentMonth, setCurrentMonth] = useState(dayjs().startOf("month"));
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(null);
  const [selectedCalendar, setSelectedCalendar] =
    useState<ICalendarCell | null>(null);
  const firstDayOfMonth = currentMonth.startOf("month");
  const lastDayOfMonth = currentMonth.endOf("month");

  // Generate array of dates for the current month
  const dates = [];
  // Adjust day of week (0-6) to make Monday=0, Sunday=6
  const firstDayOffset =
    firstDayOfMonth.day() === 0 ? 6 : firstDayOfMonth.day() - 1;

  // Add dates from previous month to fill the first week
  for (let i = 0; i < firstDayOffset; i++) {
    const prevMonthDate = firstDayOfMonth.subtract(firstDayOffset - i, "day");
    dates.push(prevMonthDate);
  }

  // Add all days of the current month
  for (let i = 0; i < lastDayOfMonth.date(); i++) {
    dates.push(firstDayOfMonth.add(i, "day"));
  }

  // Add dates from next month to fill remaining cells
  const remainingDays = 42 - dates.length;
  for (let i = 1; i <= remainingDays; i++) {
    const nextMonthDate = lastDayOfMonth.add(i, "day");
    dates.push(nextMonthDate);
  }

  // const { data: calendars } = useSWR(
  //   [
  //     `swr.merchant.calendar.${currentMonth.format("YYYY-MM")}`,
  //     firstDayOffset,
  //     remainingDays,
  //   ],
  //   async ([_, firstDayOffset, remainingDays]) => {
  //     const res = await merchantApi.getCalendar({
  //       startDate: firstDayOfMonth
  //         .subtract(firstDayOffset, "day")
  //         .toISOString(),
  //       endDate: lastDayOfMonth.add(remainingDays, "day").toISOString(),
  //     });
  //     return {
  //       ...res,
  //       mappedCalendar: res.calendars.reduce(
  //         (acc, curr) => {
  //           acc[dayjs(curr._id).format("YYYY-MM-DD")] = curr;
  //           return acc;
  //         },
  //         {} as Record<string, any>,
  //       ),
  //     };
  //   },
  // );

  const calendars = {
    totalQuantity: 0,
    mappedCalendar: {} as Record<string, any>,
  };

  if (!calendars)
    return (
      <div className="flex items-center justify-center h-screen">
        {translate("loading", "Loading...")}
      </div>
    );

  return (
    <div className="p-4 max-w-screen-2xl mx-auto">
      <div className="lg:flex lg:h-full lg:flex-col">
        <header className="flex items-center justify-between border-b border-gray-200 pb-4 lg:flex-none">
          <h1 className="text-base font-semibold text-gray-900">
            {translate("booking_calendar", "Booking calendar")}
          </h1>
          <div className="flex items-center">
            <div className="relative flex items-center rounded-md bg-white shadow-sm md:items-stretch">
              <button
                onClick={() =>
                  setCurrentMonth(currentMonth.subtract(1, "month"))
                }
                type="button"
                className="flex h-9 w-12 items-center justify-center rounded-l-md border-y border-l border-gray-300 pr-1 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:pr-0 md:hover:bg-gray-50"
              >
                <span className="sr-only">
                  {translate("previous_month", "Previous month")}
                </span>
                <IconChevronLeft className="size-5" aria-hidden="true" />
              </button>
              <button
                type="button"
                className="hidden border-y border-gray-300 px-3.5 text-sm font-semibold text-gray-900 hover:bg-gray-50 focus:relative md:block"
              >
                {currentMonth.format("MMMM")}
              </button>
              <span className="relative -mx-px h-5 w-px bg-gray-300 md:hidden" />
              <button
                onClick={() => setCurrentMonth(currentMonth.add(1, "month"))}
                type="button"
                className="flex h-9 w-12 items-center justify-center rounded-r-md border-y border-r border-gray-300 pl-1 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:pl-0 md:hover:bg-gray-50"
              >
                <span className="sr-only">
                  {translate("next_month", "Next month")}
                </span>
                <IconChevronRight className="size-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </header>
        <div className="shadow ring-1 ring-black/5 lg:flex lg:flex-auto lg:flex-col">
          <div className="grid grid-cols-7 gap-px border-b border-gray-300 bg-gray-200 text-center text-xs/6 font-semibold text-gray-700 lg:flex-none">
            <div className="bg-white py-2">{dayjs().day(1).format("dd")}</div>
            <div className="bg-white py-2">{dayjs().day(2).format("dd")}</div>
            <div className="bg-white py-2">{dayjs().day(3).format("dd")}</div>
            <div className="bg-white py-2">{dayjs().day(4).format("dd")}</div>
            <div className="bg-white py-2">{dayjs().day(5).format("dd")}</div>
            <div className="bg-white py-2">{dayjs().day(6).format("dd")}</div>
            <div className="bg-white py-2">{dayjs().day(7).format("dd")}</div>
          </div>
          <div className="flex bg-gray-200 text-xs/6 text-gray-700 lg:flex-auto">
            <div className="hidden w-full lg:grid lg:grid-cols-7 lg:grid-rows-6 lg:gap-px">
              {dates.map((day) => (
                <div key={day.format("YYYY-MM-DD")} className="min-h-40">
                  <CalendarCell
                    day={day}
                    onSelect={(day, calendar) => {
                      setSelectedDate(day);
                      setSelectedCalendar(calendar);
                    }}
                    totalQuantity={calendars?.totalQuantity || 0}
                    mappedCalendar={calendars?.mappedCalendar || {}}
                    data={
                      calendars?.mappedCalendar[day.format("YYYY-MM-DD")] || {}
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Drawer
        isOpen={!!selectedDate}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedDate(null);
            setSelectedCalendar(null);
          }
        }}
      >
        <DrawerContent>
          {() => (
            <>
              <DrawerHeader className="flex flex-col gap-1">
                <div className="px-4 sm:px-0">
                  <h3 className="text-base/7 font-semibold text-gray-900">
                    {translate(
                      "booking_calendar_control",
                      "Booking calendar control",
                    )}
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm/6 text-gray-500">
                    {translate(
                      "booking_calendar_control_description",
                      "Price control for the current month.",
                    )}
                  </p>
                </div>
              </DrawerHeader>
              <DrawerBody>
                {selectedDate && (
                  <CalendarDetail
                    selectedDate={selectedDate}
                    selectedCalendar={selectedCalendar}
                  />
                )}
              </DrawerBody>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </div>
  );
}
