import { ICalendarCell } from "@/interfaces/booking";
import { useLanguage } from "@/providers/language";
import { cn } from "@/utils";
import dayjs, { Dayjs } from "dayjs";

export function CalendarCell({
  data,
  mappedCalendar,
  day,
  onSelect,
  totalQuantity,
}: {
  data: ICalendarCell;
  mappedCalendar: Record<string, ICalendarCell>;
  day: Dayjs;
  onSelect: (day: Dayjs, calendar: ICalendarCell) => void;
  totalQuantity: number;
}) {
  const { translate } = useLanguage();

  const today = dayjs();
  const currentCalendar = mappedCalendar[day.format("YYYY-MM-DD")] || null;

  mappedCalendar[day.format("YYYY-MM-DD")] || null;


  const isDisabled = day.isBefore(today, "day");

  const bookingCount = currentCalendar?.totalBookings || 0;
  const blockedCount = currentCalendar?.totalBlocked || 0;

  const availableQuantity = totalQuantity - (blockedCount + bookingCount);

  return (
    <a
      aria-disabled={isDisabled}
      onClick={() => {
        if (isDisabled) return;
        onSelect(day, currentCalendar);
      }}
      key={day.format("YYYY-MM-DD")}
      className={cn(
        isDisabled ? "bg-gray-100 text-gray-500" : "bg-white",
        "relative px-3 py-2 cursor-pointer block h-full",
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
              {availableQuantity ? (
                <span>{`${availableQuantity} ${translate("stock_left", "stock left")}`}</span>
              ) : (
                <span className="text-red-500">
                  {translate("sold_out", "Sold out")}
                </span>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-2">
            <div className="text-sm text-gray-500">
              {availableQuantity} {translate("stock_left", "stock left")}
            </div>
          </div>
        )}
      </div>
      {currentCalendar && (
        <ol className="mt-2">
          {blockedCount > 0 && (
            <li key={day.format("YYYY-MM-DD")}>
              <span className="group flex">
                <p className="flex-auto truncate font-medium text-gray-900 group-hover:text-primary-600">
                  {blockedCount > 0 && (
                    <>
                      {blockedCount} {translate("blocked", "blocked")}
                    </>
                  )}
                </p>
                <time
                  dateTime={day.format("YYYY-MM-DD")}
                  className="ml-3 hidden flex-none text-gray-500 group-hover:text-primary-600 xl:block"
                >
                  {dayjs(day).format("YYYY-MM-DD")}
                </time>
              </span>
            </li>
          )}
          {bookingCount > 0 && (
            <li>
              <span className="group flex text-blue-500">
                <p className="flex-auto truncate font-medium group-hover:text-primary-600">
                  {bookingCount} {translate("bookings", "bookings")}
                </p>
                <time
                  dateTime={day.format("YYYY-MM-DD")}
                  className="ml-3 hidden flex-none group-hover:text-primary-600 xl:block"
                >
                  {dayjs(day).format("YYYY-MM-DD")}
                </time>
              </span>
            </li>
          )}
        </ol>
      )}
    </a>
  );
}
