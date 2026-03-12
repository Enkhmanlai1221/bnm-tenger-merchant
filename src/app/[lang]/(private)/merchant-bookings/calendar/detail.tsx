import { merchantApi } from "@/apis";
import { BOOKING_STATUS, ICalendarCell } from "@/interfaces/booking";
import { useLanguage } from "@/providers/language";
import { formatDateTime } from "@/utils/time-age";
import { Chip } from "@heroui/react";
import { IconCalendar, IconExternalLink } from "@tabler/icons-react";
import dayjs, { Dayjs } from "dayjs";
import Link from "next/link";
import useSWR from "swr";

export function CalendarDetail({
  selectedDate,
  selectedCalendar,
}: {
  selectedDate: Dayjs;
  selectedCalendar: ICalendarCell | null;
}) {
  const { translate } = useLanguage();

  const isNoBookings =
    !selectedCalendar ||
    (selectedCalendar.totalBlocked === 0 &&
      selectedCalendar.totalBookings === 0);

  const { data: bookingData } = useSWR(
    selectedCalendar && selectedCalendar.totalBookings > 0
      ? `swr.merchant.booking.list.${selectedDate.format("YYYY-MM-DD")}`
      : null,
    () =>
      merchantApi.bookinglistings({
        page: 1,
        limit: 1000,
        status: BOOKING_STATUS.PAID,
        startDate: dayjs(selectedDate).startOf("day").toISOString(),
        endDate: dayjs(selectedDate).endOf("day").toISOString(),
      }),
    {
      revalidateOnFocus: false,
    },
  );

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <IconCalendar size={24} stroke={1.5} />
        <div className="text-lg text-gray-900">
          {selectedDate.format("YYYY-MM-DD")}
        </div>
      </div>
      {isNoBookings ? (
        <div className="mt-4">
          <p className="text-gray-500">
            {translate(
              "no_bookings_for_this_date",
              "No bookings for this date.",
            )}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {selectedCalendar.totalBlocked > 0 && (
            <div className="flex flex-col gap-2">
              <div className="text-lg text-gray-900">
                {translate("blocked_gers_info", "Blocked gers info")}
              </div>
              <div className="flex flex-col gap-2">
                {selectedCalendar.blocks?.map((block, index) => (
                  <div
                    key={block.property._id + index}
                    className="border-1 border-gray-200 p-2 rounded-md"
                  >
                    <Link
                      href={`/listings/${block.property._id}`}
                      target="_blank"
                      className="flex justify-between w-full gap-1 items-center"
                    >
                      <span>{block.property.code}</span>
                      <div className="flex gap-1 items-center">
                        <span>{block.quantity}</span>
                        <span className="text-gray-500">
                          {translate("gers_are_blocked", "gers are blocked")}
                        </span>
                        <IconExternalLink size={16} />
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {bookingData?.rows?.length && (
            <div className="flex flex-col gap-2">
              <div className="text-lg text-gray-900">
                {translate("date_of_booking_info", "Date of booking info")}
              </div>
              {bookingData?.rows?.map((booking, index) => (
                <div
                  key={booking._id}
                  className="border-1 border-gray-200 p-2 rounded-md"
                >
                  <Link
                    href={`/merchant-bookings/${booking._id}`}
                    target="_blank"
                    className="flex flex-col gap-2"
                  >
                    <div className="flex justify-between items-center">
                      <span>{booking.code}</span>

                      <IconExternalLink size={16} />
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="flex gap-1 items-center justify-between">
                        <span className="text-gray-500">
                          {translate("booked_date", "booked date")}
                        </span>
                        <span>{formatDateTime(booking.startDate)}</span>
                      </div>
                      <div className="flex gap-1 items-center justify-between">
                        <span className="text-gray-500">
                          {translate(
                            "booked_guests_count",
                            "booked guests count",
                          )}
                        </span>
                        <span>{booking.personCount}</span>
                      </div>
                      <div className="flex gap-1 items-center justify-between">
                        <span className="text-gray-500">
                          {translate("booked_nights", "booked nights")}
                        </span>
                        <span>{booking.days}</span>
                      </div>
                      <div className="flex gap-1 items-center justify-between">
                        <span className="text-gray-500">
                          {translate("booked_gers_count", "booked gers count")}
                        </span>
                        <span>{booking.propertyQuantity}</span>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
