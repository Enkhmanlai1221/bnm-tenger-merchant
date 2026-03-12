import { IconCalendar, IconX } from "@tabler/icons-react";
import { useState } from "react";
import { calculateNights } from "@/utils/time-age";
import dayjs from "dayjs";
import { cn } from "@/utils";
import { Button } from "@heroui/react";
import { HeroRangeCalendar } from "../ui/widgets/hero-range-calendar";
import { useClickOutside } from "@/utils/outside-click";
import { useLanguage } from "@/providers/language";
import { useMediaQuery } from "@/hooks/use-media-query";

export const BookingDatePicker = ({
  value,
  onChange,
  disabledDates,
  error,
  disabled,
}: {
  value: { startDate: string; endDate: string };
  onChange?: (value: { startDate: string; endDate: string }) => void;
  disabledDates?: string[];
  error?: string;
  disabled?: boolean;
}) => {
  const { translate } = useLanguage();
  const matches = useMediaQuery("(max-width: 64em)");
  const [currentDisabledDates, setCurrentDisabledDates] = useState<string[]>(
    disabledDates || [],
  );
  const [opened, setOpened] = useState(false);
  const ref = useClickOutside(() => setOpened(false));

  return (
    <div ref={ref} className="lg:relative">
      <a
        onClick={() => {
          if (disabled) return;
          setOpened(true);
        }}
        className={cn(
          "flex flex-row cursor-pointer h-20 justify-between items-center",
        )}
      >
        <div className="flex flex-col gap-2">
          <div className="flex flex-row gap-2 items-baseline">
            <div
              className={cn("text-sm font-medium", error ? "text-red-500" : "")}
            >
              {translate("when", "When")}
            </div>
            {error ? <div className="text-red-500 text-xs">{error}</div> : null}
          </div>
          <div className="flex flex-row gap-2 items-center text-sm/4 font-light text-gray-600">
            <div>
              {value.startDate ? (
                <span>{dayjs(value.startDate).format("YYYY-MM-DD")}</span>
              ) : (
                <span className={cn(error ? "text-red-500" : "")}>
                  {translate("add_dates", "Add dates")}
                </span>
              )}
            </div>
            <div className={cn(error ? "text-red-500" : "")}>-</div>
            <div>
              {value.endDate ? (
                <span>{dayjs(value.endDate).format("YYYY-MM-DD")}</span>
              ) : (
                <span className={cn(error ? "text-red-500" : "")}>
                  {translate("add_dates", "Add dates")}
                </span>
              )}
            </div>
          </div>
        </div>
        {
          !disabled ? (<div>
            {value.startDate || value.endDate ? (
              <Button
                isIconOnly
                variant="light"
                type="button"
                onPress={() => onChange?.({ startDate: "", endDate: "" })}
              >
                <IconX />
              </Button>
            ) : null}
          </div>) : null
        }
      </a>

      <div
        className={cn(
          "absolute z-50 top-40 lg:top-full lg:p-4 flex lg:justify-end w-full",
          matches ? "w-full left-0 right-0" : "w-auto -left-[calc(100%+20px)]",
          opened ? "visible" : "hidden",
        )}
      >
        <div className="w-full">
          <div className="bg-white rounded-4xl shadow-3xl">
            <div className="p-8 flex flex-col gap-4 justify-center items-center">
              <div className="flex flex-row gap-2 items-center justify-between w-full">
                <div className="flex flex-row gap-1 items-center">
                  <IconCalendar size={18} />
                  <div className="text-base">
                    {value.startDate && value.endDate
                      ? `${dayjs(value.startDate).format("YYYY-MM-DD")} - ${dayjs(value.endDate).format("YYYY-MM-DD")}`
                      : translate("select_dates", "Select dates")}
                  </div>
                </div>
                <div>
                  {value.startDate && value.endDate ? (
                    <div className="flex flex-row gap-1 items-center">
                      <span className="text-base font-semibold">
                        {calculateNights(value.startDate, value.endDate)}
                      </span>
                      {translate("nights", "nights")}
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>
              <HeroRangeCalendar
                isMobile={matches}
                disabledDates={currentDisabledDates}
                value={{
                  start: value.startDate,
                  end: value.endDate,
                }}
                onChange={(value) => {
                  onChange?.({
                    endDate: value.end ? dayjs(value.end).toISOString() : "",
                    startDate: value.start
                      ? dayjs(value.start).toISOString()
                      : "",
                  });
                  if (matches) {
                    if (value.start && value.end) {
                      setOpened(false);
                    }
                  }
                }}
                onSuccess={() => setOpened(false)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
