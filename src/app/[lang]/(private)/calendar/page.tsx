"use client";

import { merchantApi } from "@/apis";
import { BOOKING_STATUS, IBooking } from "@/interfaces/booking";
import { useLanguage } from "@/providers/language";
import { Drawer, DrawerBody, DrawerContent, DrawerHeader, Card, CardBody } from "@heroui/react";
import {
  IconChevronLeft,
  IconChevronRight,
  IconCalendar,
  IconUsers,
  IconCalendarEvent,
  IconArrowRight,
  IconArrowLeft
} from "@tabler/icons-react";
import dayjs, { Dayjs } from "dayjs";
import { useState, useMemo } from "react";
import useSWR from "swr";
import { formatDateTime } from "@/utils/time-age";
import Link from "next/link";
import { IconExternalLink } from "@tabler/icons-react";
import { Chip } from "@heroui/react";
import { cn } from "@/utils";

export default function CalendarPage() {
  const { translate } = useLanguage();
  const [currentMonth, setCurrentMonth] = useState(dayjs().startOf("month"));
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(null);

  const firstDayOfMonth = currentMonth.startOf("month");
  const lastDayOfMonth = currentMonth.endOf("month");

  // Calculate date range for fetching bookings (include previous/next month edges)
  const firstDayOffset = firstDayOfMonth.day() === 0 ? 6 : firstDayOfMonth.day() - 1;
  const remainingDays = 42 - (lastDayOfMonth.date() + firstDayOffset);
  const startDate = firstDayOfMonth.subtract(firstDayOffset, "day");
  const endDate = lastDayOfMonth.add(remainingDays, "day");

  // Static mock data for demonstration
  const mockBookings: IBooking[] = useMemo(() => {
    const today = dayjs();
    const mockData: IBooking[] = [];

    // Generate some mock bookings for the current month
    for (let i = 0; i < 15; i++) {
      const checkInDate = today.add(Math.floor(Math.random() * 30), "day");
      const checkOutDate = checkInDate.add(Math.floor(Math.random() * 5) + 1, "day");

      const statuses = [
        BOOKING_STATUS.PENDING,
        BOOKING_STATUS.CONFIRMED,
        BOOKING_STATUS.PAID,
        BOOKING_STATUS.COMPLETED,
      ];
      const status = statuses[Math.floor(Math.random() * statuses.length)];

      mockData.push({
        _id: `mock_booking_${i}`,
        code: `BK-${today.format("YYYYMMDD")}-${String(i + 1).padStart(3, "0")}`,
        startDate: checkInDate.toISOString(),
        endDate: checkOutDate.toISOString(),
        status: status,
        statusDate: today.subtract(Math.floor(Math.random() * 10), "day").toISOString(),
        days: checkOutDate.diff(checkInDate, "day"),
        amount: Math.floor(Math.random() * 200000) + 50000,
        totalAmount: Math.floor(Math.random() * 250000) + 60000,
        discount: 0,
        discountObj: null as any,
        property: {
          _id: `prop_${i}`,
          name: `Гэр ${i + 1}`,
          code: `PROP${i + 1}`,
        } as any,
        user: null as any,
        merchant: null as any,
        deadline: checkInDate.subtract(1, "day").toISOString(),
        propertyQuantity: Math.floor(Math.random() * 3) + 1,
        search: "",
        createdAt: today.subtract(Math.floor(Math.random() * 20), "day").toISOString(),
        updatedAt: today.subtract(Math.floor(Math.random() * 5), "day").toISOString(),
        payment: null as any,
        review: null,
        cancelRequest: null,
        personCount: Math.floor(Math.random() * 6) + 2,
        refundFee: 0,
        refundAmount: 0,
        cancelPolicy: null as any,
      });
    }

    return mockData;
  }, [currentMonth]);

  // Fetch all bookings for the visible calendar period
  const { data: bookingsData, isLoading } = useSWR(
    `swr.merchant.bookings.calendar.${currentMonth.format("YYYY-MM")}`,
    () =>
      merchantApi.bookinglistings({
        page: 1,
        limit: 1000,
        startDate: startDate.startOf("day").toISOString(),
        endDate: endDate.endOf("day").toISOString(),
      }),
    {
      revalidateOnFocus: false,
      fallbackData: { rows: mockBookings, count: mockBookings.length },
    },
  );

  // Organize bookings by date and type
  const bookingsByDate = useMemo(() => {
    if (!bookingsData?.rows) return {};

    const organized: Record<
      string,
      {
        preBooked: IBooking[];
        incoming: IBooking[];
        outgoing: IBooking[];
      }
    > = {};

    bookingsData.rows.forEach((booking) => {
      const checkInDate = dayjs(booking.startDate).format("YYYY-MM-DD");
      const checkOutDate = dayjs(booking.endDate).format("YYYY-MM-DD");

      // Pre-booked: PENDING or CONFIRMED status
      if (
        booking.status === BOOKING_STATUS.PENDING ||
        booking.status === BOOKING_STATUS.CONFIRMED
      ) {
        if (!organized[checkInDate]) {
          organized[checkInDate] = { preBooked: [], incoming: [], outgoing: [] };
        }
        organized[checkInDate].preBooked.push(booking);
      }

      // Incoming: PAID or CONFIRMED (check-in dates)
      if (
        booking.status === BOOKING_STATUS.PAID ||
        booking.status === BOOKING_STATUS.CONFIRMED
      ) {
        if (!organized[checkInDate]) {
          organized[checkInDate] = { preBooked: [], incoming: [], outgoing: [] };
        }
        organized[checkInDate].incoming.push(booking);
      }

      // Outgoing: COMPLETED (check-out dates)
      if (booking.status === BOOKING_STATUS.COMPLETED) {
        if (!organized[checkOutDate]) {
          organized[checkOutDate] = { preBooked: [], incoming: [], outgoing: [] };
        }
        organized[checkOutDate].outgoing.push(booking);
      }
    });

    return organized;
  }, [bookingsData]);

  // Generate array of dates for the current month
  const dates: Dayjs[] = [];

  // Add dates from previous month to fill the first week
  for (let i = 0; i < firstDayOffset; i++) {
    dates.push(firstDayOfMonth.subtract(firstDayOffset - i, "day"));
  }

  // Add all days of the current month
  for (let i = 0; i < lastDayOfMonth.date(); i++) {
    dates.push(firstDayOfMonth.add(i, "day"));
  }

  // Add dates from next month to fill remaining cells
  for (let i = 1; i <= remainingDays; i++) {
    dates.push(lastDayOfMonth.add(i, "day"));
  }

  const selectedBookings = selectedDate
    ? bookingsByDate[selectedDate.format("YYYY-MM-DD")] || {
      preBooked: [],
      incoming: [],
      outgoing: [],
    }
    : null;

  // Calculate statistics
  const stats = useMemo(() => {
    const allBookings = bookingsData?.rows || [];
    return {
      total: allBookings.length,
      preBooked: allBookings.filter(
        (b) =>
          b.status === BOOKING_STATUS.PENDING ||
          b.status === BOOKING_STATUS.CONFIRMED
      ).length,
      incoming: allBookings.filter(
        (b) =>
          b.status === BOOKING_STATUS.PAID ||
          b.status === BOOKING_STATUS.CONFIRMED
      ).length,
      outgoing: allBookings.filter(
        (b) => b.status === BOOKING_STATUS.COMPLETED
      ).length,
    };
  }, [bookingsData]);

  return (
    <div className="p-4 lg:p-6 max-w-screen-2xl mx-auto space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Нийт захиалга"
          value={stats.total}
          icon={<IconCalendarEvent size={20} />}
          color="blue"
        />
        <StatCard
          title="Өмнөх захиалга"
          value={stats.preBooked}
          icon={<IconCalendar size={20} />}
          color="yellow"
        />
        <StatCard
          title="Өнөөдөр ирсэн"
          value={stats.incoming}
          icon={<IconArrowRight size={20} />}
          color="green"
        />
        <StatCard
          title="Өнөөдөр гарсан"
          value={stats.outgoing}
          icon={<IconArrowLeft size={20} />}
          color="blue"
        />
      </div>

      <div className="lg:flex lg:h-full lg:flex-col">
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-200 pb-4 lg:flex-none">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Захиалгын жагсаалт
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Захиалгын цагпит гарын авсан, ирсэн, гарсан захиалгын тоог харах боломжтой.
            </p>
          </div>
          <div className="flex items-center gap-4">
            {/* Legend */}
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-yellow-50 border border-yellow-200">
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
                <span className="font-medium text-gray-700">Өмнөх захиалга</span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-green-50 border border-green-200">
                <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                <span className="font-medium text-gray-700">Өнөөдөр ирсэн</span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-blue-50 border border-blue-200">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
                <span className="font-medium text-gray-700">Өнөөдөр гарсан</span>
              </div>
            </div>

            {/* Month navigation */}
            <div className="relative flex items-center rounded-xl bg-white shadow-sm border border-gray-200 overflow-hidden">
              <button
                onClick={() => setCurrentMonth(currentMonth.subtract(1, "month"))}
                type="button"
                className="flex h-10 w-10 items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <span className="sr-only">
                  Өмнөх сарын
                </span>
                <IconChevronLeft className="size-5" aria-hidden="true" />
              </button>
              <button
                type="button"
                className="px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50 transition-colors border-x border-gray-200"
              >
                {currentMonth.format("MMMM YYYY")}
              </button>
              <button
                onClick={() => setCurrentMonth(currentMonth.add(1, "month"))}
                type="button"
                className="flex h-10 w-10 items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <span className="sr-only">
                  Дараа сарын
                </span>
                <IconChevronRight className="size-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </header>

        <Card shadow="sm" radius="lg" className="border border-gray-200">
          <CardBody className="p-0">
            {/* Day headers */}
            <div className="grid grid-cols-7 gap-px border-b border-gray-200 bg-gray-50 text-center text-xs font-semibold text-gray-600">
              <div className="bg-white py-3">{dayjs().day(1).format("dd")}</div>
              <div className="bg-white py-3">{dayjs().day(2).format("dd")}</div>
              <div className="bg-white py-3">{dayjs().day(3).format("dd")}</div>
              <div className="bg-white py-3">{dayjs().day(4).format("dd")}</div>
              <div className="bg-white py-3">{dayjs().day(5).format("dd")}</div>
              <div className="bg-white py-3">{dayjs().day(6).format("dd")}</div>
              <div className="bg-white py-3">{dayjs().day(7).format("dd")}</div>
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-px bg-gray-100">
              {dates.map((day) => {
                const dayKey = day.format("YYYY-MM-DD");
                const dayBookings = bookingsByDate[dayKey] || {
                  preBooked: [],
                  incoming: [],
                  outgoing: [],
                };
                const today = dayjs();
                const isCurrentMonth = day.month() === currentMonth.month();
                const isToday = day.isSame(today, "day");
                const isPast = day.isBefore(today, "day");

                const totalCount =
                  dayBookings.preBooked.length +
                  dayBookings.incoming.length +
                  dayBookings.outgoing.length;

                return (
                  <div
                    key={dayKey}
                    className={cn(
                      "min-h-28 lg:min-h-32 bg-white p-2 cursor-pointer transition-all duration-200",
                      "hover:bg-gray-50 hover:shadow-sm hover:z-10 relative",
                      !isCurrentMonth && "bg-gray-50/50 text-gray-400",
                      isPast && !isToday && "opacity-50",
                      totalCount > 0 && "border-l-2 border-l-primary-400"
                    )}
                    onClick={() => setSelectedDate(day)}
                  >
                    <time
                      dateTime={dayKey}
                      className={cn(
                        "flex size-7 items-center justify-center rounded-lg font-semibold mb-2 transition-colors",
                        isToday
                          ? "bg-primary-600 text-white shadow-md"
                          : isCurrentMonth
                            ? "text-gray-900 hover:bg-gray-100"
                            : "text-gray-400"
                      )}
                    >
                      {day.format("DD")}
                    </time>

                    {/* Booking indicators */}
                    {totalCount > 0 && (
                      <div className="flex flex-col gap-1.5 mt-1">
                        {dayBookings.preBooked.length > 0 && (
                          <div className="flex items-center gap-1.5 px-1.5 py-0.5 rounded-md bg-yellow-50 border border-yellow-200">
                            <div className="w-1.5 h-1.5 rounded-full bg-yellow-400"></div>
                            <span className="text-[10px] font-medium text-gray-700">
                              {dayBookings.preBooked.length}
                            </span>
                          </div>
                        )}
                        {dayBookings.incoming.length > 0 && (
                          <div className="flex items-center gap-1.5 px-1.5 py-0.5 rounded-md bg-green-50 border border-green-200">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                            <span className="text-[10px] font-medium text-gray-700">
                              {dayBookings.incoming.length}
                            </span>
                          </div>
                        )}
                        {dayBookings.outgoing.length > 0 && (
                          <div className="flex items-center gap-1.5 px-1.5 py-0.5 rounded-md bg-blue-50 border border-blue-200">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                            <span className="text-[10px] font-medium text-gray-700">
                              {dayBookings.outgoing.length}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Detail Drawer */}
      <Drawer
        isOpen={!!selectedDate}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedDate(null);
          }
        }}
      >
        <DrawerContent>
          {() => (
            <>
              <DrawerHeader className="flex flex-col gap-1">
                <div className="px-4 sm:px-0">
                  <div className="flex items-center gap-2">
                    <IconCalendar size={24} stroke={1.5} />
                    <h3 className="text-base/7 font-semibold text-gray-900">
                      {selectedDate?.format("YYYY-MM-DD")}
                    </h3>
                  </div>
                  <p className="mt-1 max-w-2xl text-sm/6 text-gray-500">
                    {selectedDate?.format("YYYY-MM-DD")} Өнөөдөр захиалгын тоог харах боломжтой.
                  </p>
                </div>
              </DrawerHeader>
              <DrawerBody>
                {selectedBookings && (
                  <div className="flex flex-col gap-6">
                    {/* Pre-booked */}
                    {selectedBookings.preBooked.length > 0 && (
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-3 h-3 rounded bg-yellow-400"></div>
                          <h4 className="text-lg font-semibold text-gray-900">
                            Өмнөх захиалга (
                            {selectedBookings.preBooked.length})
                          </h4>
                        </div>
                        <div className="flex flex-col gap-2">
                          {selectedBookings.preBooked.map((booking) => (
                            <BookingCard key={booking._id} booking={booking} />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Incoming */}
                    {selectedBookings.incoming.length > 0 && (
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-3 h-3 rounded bg-green-500"></div>
                          <h4 className="text-lg font-semibold text-gray-900">
                            Өнөөдөр ирсэн (
                            {selectedBookings.incoming.length})
                          </h4>
                        </div>
                        <div className="flex flex-col gap-2">
                          {selectedBookings.incoming.map((booking) => (
                            <BookingCard key={booking._id} booking={booking} />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Outgoing */}
                    {selectedBookings.outgoing.length > 0 && (
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-3 h-3 rounded bg-blue-500"></div>
                          <h4 className="text-lg font-semibold text-gray-900">
                            Өнөөдөр гарсан (
                            {selectedBookings.outgoing.length})
                          </h4>
                        </div>
                        <div className="flex flex-col gap-2">
                          {selectedBookings.outgoing.map((booking) => (
                            <BookingCard key={booking._id} booking={booking} />
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedBookings.preBooked.length === 0 &&
                      selectedBookings.incoming.length === 0 &&
                      selectedBookings.outgoing.length === 0 && (
                        <div className="mt-4">
                          <p className="text-gray-500">
                            {translate(
                              "no_bookings_for_this_date",
                              "No bookings for this date.",
                            )}
                          </p>
                        </div>
                      )}
                  </div>
                )}
              </DrawerBody>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  color = "blue",
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  color?: "blue" | "yellow" | "green" | "purple";
}) {
  const colorClasses = {
    blue: "bg-blue-50 border-blue-200 text-blue-700",
    yellow: "bg-yellow-50 border-yellow-200 text-yellow-700",
    green: "bg-green-50 border-green-200 text-green-700",
    purple: "bg-purple-50 border-purple-200 text-purple-700",
  };

  return (
    <Card shadow="sm" radius="lg" className="border border-gray-200">
      <CardBody className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
          </div>
          <div
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-xl border",
              colorClasses[color]
            )}
          >
            {icon}
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

function BookingCard({ booking }: { booking: IBooking }) {
  const { translate } = useLanguage();

  const getStatusColor = (status: BOOKING_STATUS) => {
    switch (status) {
      case BOOKING_STATUS.PENDING:
        return "warning";
      case BOOKING_STATUS.CONFIRMED:
      case BOOKING_STATUS.PAID:
        return "success";
      case BOOKING_STATUS.COMPLETED:
        return "primary";
      case BOOKING_STATUS.CANCELED:
      case BOOKING_STATUS.CANCELLED:
        return "danger";
      default:
        return "default";
    }
  };

  return (
    <Card shadow="sm" radius="lg" className="border border-gray-200 hover:border-primary-300 hover:shadow-md transition-all duration-200">
      <CardBody className="p-4">
        <Link
          href={`#`}
          target="_blank"
          className="flex flex-col gap-2"
        >
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-900">{booking.code}</span>
              <Chip
                size="sm"
                color={getStatusColor(booking.status)}
                variant="flat"
              >
                {booking.status}
              </Chip>
            </div>
            <IconExternalLink size={16} className="text-gray-400" />
          </div>

          <div className="flex flex-col gap-1.5 text-sm">
            <div className="flex gap-1 items-center justify-between">
              <span className="text-gray-500">
                Бүтээгдэхүүн:
              </span>
              <span className="font-medium">{booking.property?.name || booking.property?.code}</span>
            </div>
            <div className="flex gap-1 items-center justify-between">
              <span className="text-gray-500">
                Ирэх өдөр:
              </span>
              <span>{formatDateTime(booking.startDate)}</span>
            </div>
            <div className="flex gap-1 items-center justify-between">
              <span className="text-gray-500">
                Гарах өдөр:
              </span>
              <span>{formatDateTime(booking.endDate)}</span>
            </div>
            <div className="flex gap-1 items-center justify-between">
              <span className="text-gray-500">
                Зочид:
              </span>
              <span>{booking.personCount}</span>
            </div>
            <div className="flex gap-1 items-center justify-between">
              <span className="text-gray-500">
                Хоног:
              </span>
              <span>{booking.days}</span>
            </div>
            <div className="flex gap-1 items-center justify-between">
              <span className="text-gray-500">
                Нийт дүн:
              </span>
              <span className="font-semibold text-primary-600">{booking.totalAmount?.toLocaleString()} ₮</span>
            </div>
          </div>
        </Link>
      </CardBody>
    </Card>
  );
}
