import { merchantApi } from "@/apis";
import { IPropertyCalendar } from "@/interfaces/property";
import { useLanguage } from "@/providers/language";
import {
  Chip,
  cn,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@heroui/react";
import {
  IconCalendar,
  IconCalendarCancel,
  IconChevronLeft,
  IconChevronRight,
  IconCurrencyDollar,
  IconExternalLink,
  IconX,
} from "@tabler/icons-react";
import dayjs from "dayjs";
import Link from "next/link";
import { useState } from "react";
import useSWR from "swr";
import { BlockDateForm } from "./block-date-form";
import { PriceDateForm } from "./price-date-form";
import { BlockedDates } from "@/components/blocked-dates/page";

export default function PriceDateView({ propertyId }: { propertyId: string }) {
  const { translate, currencyRate } = useLanguage();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [activeTab, setActiveTab] = useState<"price" | "availability">("price");
  const [currentMonth, setCurrentMonth] = useState(dayjs().startOf("month"));
  const [selectedDate, setSelectedDate] = useState<any>(null);
  const [selectedCalendar, setSelectedCalendar] =
    useState<IPropertyCalendar | null>(null);

  const { data: propertyData, mutate: mutatePropertyData } = useSWR(
    `swr.merchant.property.detail.${propertyId}`,
    () => merchantApi.getProperty(propertyId),
    {
      revalidateOnFocus: false,
    },
  );

  if (!propertyData)
    return (
      <div className="flex h-96 w-full items-center justify-center">
        <div className="text-sm text-gray-500">
          {translate("loading", "Loading...")}
        </div>
      </div>
    );

  const basePrice = propertyData.price;
  const today = dayjs();
  const firstDayOfMonth = currentMonth.startOf("month");
  const lastDayOfMonth = currentMonth.endOf("month");

  const dates = [];
  const firstDayOffset =
    firstDayOfMonth.day() === 0 ? 6 : firstDayOfMonth.day() - 1;

  for (let i = 0; i < firstDayOffset; i++) {
    const prevMonthDate = firstDayOfMonth.subtract(firstDayOffset - i, "day");
    dates.push(prevMonthDate);
  }

  for (let i = 0; i < lastDayOfMonth.date(); i++) {
    dates.push(firstDayOfMonth.add(i, "day"));
  }

  const remainingDays = 42 - dates.length;
  for (let i = 1; i <= remainingDays; i++) {
    const nextMonthDate = lastDayOfMonth.add(i, "day");
    dates.push(nextMonthDate);
  }

  const mappedPropertyCalendar = propertyData.calendars.reduce(
    (acc, curr) => {
      acc[dayjs(curr.date).format("YYYY-MM-DD")] = {
        ...curr,
        blocked:
          propertyData.blockedDates.find((bd) => bd.date === curr.date)
            ?.quantity || 0,
      };
      return acc;
    },
    {} as Record<string, IPropertyCalendar & { blocked: number }>,
  );

  return (
    <div className="lg:flex lg:h-full lg:flex-col">
      <header className="flex items-center justify-between border-b border-gray-200 pb-4 lg:flex-none">
        <h1 className="text-base font-semibold text-gray-900">
          <time dateTime={currentMonth.format("YYYY-MM")}>
            {currentMonth.format("MMMM YYYY")}
          </time>
        </h1>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentMonth(currentMonth.subtract(1, "month"))}
            type="button"
            className="flex h-9 w-12 items-center justify-center rounded-md border border-gray-300 text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label={translate("previous_month", "Previous month")}
          >
            <IconChevronLeft className="size-5" aria-hidden="true" />
          </button>

          <button
            type="button"
            className="hidden px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50 rounded-md md:inline-block focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {currentMonth.format("MMMM")}
          </button>

          <button
            onClick={() => setCurrentMonth(currentMonth.add(1, "month"))}
            type="button"
            className="flex h-9 w-12 items-center justify-center rounded-md border border-gray-300 text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label={translate("next_month", "Next month")}
          >
            <IconChevronRight className="size-5" aria-hidden="true" />
          </button>
          <button
            onClick={onOpen}
            type="button"
            className="flex h-9 px-3 items-center justify-center rounded-md border border-gray-300 text-gray-600 hover:text-gray-800 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary font-semibold text-sm transition-colors duration-150"
          >
            {translate("house_lock", "House lock")}
          </button>
        </div>
      </header>

      <div className="shadow ring-1 ring-black/5 lg:flex lg:flex-auto lg:flex-col">
        <div className="grid grid-cols-7 gap-px border-b border-gray-300 bg-gray-200 text-center text-xs/6 font-semibold text-gray-700 lg:flex-none">
          <div className="bg-white py-2">{dayjs().day(1).format("ddd")}</div>
          <div className="bg-white py-2">{dayjs().day(2).format("ddd")}</div>
          <div className="bg-white py-2">{dayjs().day(3).format("ddd")}</div>
          <div className="bg-white py-2">{dayjs().day(4).format("ddd")}</div>
          <div className="bg-white py-2">{dayjs().day(5).format("ddd")}</div>
          <div className="bg-white py-2">{dayjs().day(6).format("ddd")}</div>
          <div className="bg-white py-2">{dayjs().day(7).format("ddd")}</div>
        </div>
        <div className="flex bg-gray-200 text-xs/6 text-gray-700 lg:flex-auto">
          <div className="hidden w-full lg:grid lg:grid-cols-7 lg:grid-rows-6 lg:gap-px">
            {dates.map((day) => {
              const currentCalendar =
                mappedPropertyCalendar[day.format("YYYY-MM-DD")] || null;

              const isDisabled = day.isBefore(today, "day");
              return (
                <a
                  aria-disabled={isDisabled}
                  onClick={() => {
                    if (isDisabled) return;
                    setSelectedDate(day);
                    setSelectedCalendar(currentCalendar);
                  }}
                  key={day.format("YYYY-MM-DD")}
                  className={cn(
                    isDisabled ? "bg-gray-100 text-gray-500" : "bg-white",
                    "relative px-3 py-2 cursor-pointer",
                  )}
                >
                  <time
                    dateTime={day.format("YYYY-MM-DD")}
                    className={
                      day.isSame(today, "day")
                        ? "flex size-6 items-center justify-center rounded-full bg-primary-600 font-semibold text-white"
                        : undefined
                    }
                  >
                    {day.format("DD")}
                  </time>
                  <div>
                    {currentCalendar ? (
                      <div className="flex items-center justify-between gap-2">
                        <div className="text-sm text-gray-500">
                          {currentCalendar.availableQuantity ? (
                            <span>{`${currentCalendar.availableQuantity} ${translate("stock_left", "stock left")}`}</span>
                          ) : (
                            <span className="text-red-500">
                              {translate("sold_out", "Sold out")}
                            </span>
                          )}
                        </div>
                        <div
                          className={cn(
                            "text-lg font-medium",
                            currentCalendar.price
                              ? "text-lime-600"
                              : "text-sm text-gray-500",
                          )}
                        >
                          {currencyRate(currentCalendar.price || basePrice)}
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between gap-2">
                        <div className="text-sm text-gray-500">
                          {propertyData.quantity}{" "}
                          {translate("stock_left", "stock left")}
                        </div>
                        <div className="text-lg font-medium">
                          {currencyRate(basePrice)}
                        </div>
                      </div>
                    )}
                  </div>
                  {currentCalendar && (
                    <ol className="mt-2">
                      {currentCalendar.blockedQuantity > 0 && (
                        <li key={day.format("YYYY-MM-DD")}>
                          <span className="group flex">
                            <p className="flex-auto truncate font-medium text-gray-900 group-hover:text-primary-600">
                              {currentCalendar.blockedQuantity > 0 && (
                                <>
                                  {currentCalendar.blockedQuantity}{" "}
                                  {translate("blocked", "blocked")}
                                </>
                              )}
                            </p>
                            <time
                              dateTime={day.format("YYYY-MM-DD")}
                              className="ml-3 hidden flex-none text-gray-500 group-hover:text-primary-600 xl:block"
                            >
                              {dayjs(currentCalendar.createdAt).format(
                                "YYYY-MM-DD",
                              )}
                            </time>
                          </span>
                        </li>
                      )}
                      {currentCalendar.bookings?.length > 0 && (
                        <li>
                          <span className="group flex text-blue-500">
                            <p className="flex-auto truncate font-medium group-hover:text-primary-600">
                              {currentCalendar.bookings.length}{" "}
                              {translate("bookings", "bookings")}
                            </p>
                            <time
                              dateTime={day.format("YYYY-MM-DD")}
                              className="ml-3 hidden flex-none group-hover:text-primary-600 xl:block"
                            >
                              {dayjs(currentCalendar.createdAt).format(
                                "YYYY-MM-DD",
                              )}
                            </time>
                          </span>
                        </li>
                      )}
                    </ol>
                  )}
                </a>
              );
            })}
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
                    {translate("price_control", "Price control")}
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm/6 text-gray-500">
                    {translate(
                      "price_control_description",
                      "Price control for the current month.",
                    )}
                  </p>
                </div>
              </DrawerHeader>
              <DrawerBody>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <IconCalendar size={24} stroke={1.5} />
                    <div className="text-lg text-gray-900">
                      {selectedDate.format("YYYY-MM-DD")}
                    </div>
                  </div>
                  {selectedCalendar ? (
                    <>
                      {selectedCalendar.bookings?.length > 0 ? (
                        <div className="mt-4">
                          <h4 className="text-lg font-semibold text-gray-900">
                            {translate("bookings", "Bookings")} (
                            {selectedCalendar.bookings?.length})
                          </h4>
                          <div className="mt-2 flex flex-col gap-2">
                            {selectedCalendar.bookings?.map(
                              (booking, index) => (
                                <div key={booking._id}>
                                  <Link
                                    href={`/merchant-bookings/${booking.booking._id}`}
                                    target="_blank"
                                    className="flex items-center gap-2"
                                  >
                                    <span>{index + 1}</span>
                                    <Chip>{booking.booking.code}</Chip>
                                    <span>
                                      {booking.booking.personCount}{" "}
                                      {translate("guests", "guests")}
                                    </span>
                                    <span>
                                      {booking.quantity}{" "}
                                      {translate("gers", "gers")}
                                    </span>
                                    <IconExternalLink size={16} />
                                  </Link>
                                </div>
                              ),
                            )}
                          </div>
                        </div>
                      ) : null}
                    </>
                  ) : null}
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
                      price={
                        mappedPropertyCalendar[
                          selectedDate.format("YYYY-MM-DD")
                        ]?.price
                      }
                      basePrice={basePrice}
                      onSuccess={() => {
                        mutatePropertyData();
                        setSelectedDate(null);
                      }}
                      blockedQuantity={
                        mappedPropertyCalendar[
                          selectedDate.format("YYYY-MM-DD")
                        ]?.blockedQuantity || 0
                      }
                    />
                    :
                    <BlockDateForm
                      propertyId={propertyData._id}
                      selectedDate={selectedDate}
                      price={
                        mappedPropertyCalendar[
                          selectedDate.format("YYYY-MM-DD")
                        ]?.price
                      }
                      basePrice={basePrice}
                      blockedQuantity={
                        mappedPropertyCalendar[
                          selectedDate.format("YYYY-MM-DD")
                        ]?.blockedQuantity || 0
                      }
                      onSuccess={() => {
                        mutatePropertyData();
                        setSelectedDate(null);
                        // setSelectedCalendar(null);
                      }}
                    // onSuccess?.();
                    />
                  }
                </div>
              </DrawerBody>
            </>
          )}
        </DrawerContent>
      </Drawer>

      <Modal
        isOpen={isOpen}
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
                mutatePropertyData();
                onClose();
              }}
              onCancel={onClose}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
}
