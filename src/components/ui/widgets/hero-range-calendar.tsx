"use client";

import { Button } from "@heroui/react";
import { isWithinInterval } from "date-fns";
import dayjs from "dayjs";
import { forwardRef, useState } from "react";
import { DayPicker } from "react-day-picker";
import classNames from "./range-calendar.module.css";
import { useLanguage } from "@/providers/language";

export const HeroRangeCalendar = forwardRef<
  HTMLDivElement,
  {
    value?:
    | {
      start: string;
      end: string;
    }
    | undefined;
    onChange: (value: {
      start: string | undefined;
      end: string | undefined;
    }) => void;
    disabledDates?: string[];
    visibleMonths?: number;
    isMobile?: boolean;
    onSuccess?: () => void;
    focused?: () => void;
  }
>(
  (
    {
      value = undefined,
      onChange,
      disabledDates: defaultDisabledDates = [],
      visibleMonths = 2,
      isMobile,
      onSuccess,
      focused,
    },
    ref,
  ) => {
    const today = dayjs();
    const maxDate = today.add(3, "month");
    const { translate } = useLanguage();
    const [disableRange, setDisableRange] = useState<
      [Date | null, Date | null]
    >([null, null]);
    const disabledDays = defaultDisabledDates.map((date) =>
      dayjs(date).format("YYYY-MM-DD"),
    );

    const findNearestToBeforeDisabledDate = (from: Date) => {
      return disabledDays
        .filter((date) => dayjs(date).isBefore(dayjs(from)))
        .sort((a, b) => dayjs(b).diff(dayjs(a)))[0];
    };

    const findNearestToAfterDisabledDate = (from: Date) => {
      return disabledDays
        .filter((date) => dayjs(date).isAfter(dayjs(from)))
        .sort((a, b) => dayjs(a).diff(dayjs(b)))[0];
    };

    const highlightedDates = defaultDisabledDates.map((d) => new Date(d));

    return (
      <div ref={ref} className="lg:w-[620px]">
        <DayPicker
          weekStartsOn={1}
          classNames={{
            ...classNames,
          }}
          numberOfMonths={isMobile ? 1 : visibleMonths}
          mode="range"
          selected={{
            from: value?.start ? new Date(value.start) : undefined,
            to: value?.end ? new Date(value.end) : undefined,
          }}
          onSelect={(day) => {
            return;
          }}
          onDayClick={(day, modifiers) => {
            if (modifiers.disabled) return;
            if (!value?.start || (value.start && value.end)) {
              onChange({
                start: dayjs(day).format("YYYY-MM-DD"),
                end: undefined,
              });
              const nearestDisabled = findNearestToBeforeDisabledDate(day);
              const nearestDisabledFrom = findNearestToAfterDisabledDate(day);
              setDisableRange([
                nearestDisabled ? dayjs(nearestDisabled).toDate() : null,
                nearestDisabledFrom
                  ? dayjs(nearestDisabledFrom).toDate()
                  : null,
              ]);
            } else {
              if (dayjs(value.start).isAfter(dayjs(day).format("YYYY-MM-DD"))) {
                onChange({
                  start: dayjs(day).format("YYYY-MM-DD"),
                  end: dayjs(value.start).format("YYYY-MM-DD"),
                });
              } else {
                onChange({
                  start: dayjs(value.start).format("YYYY-MM-DD"),
                  end: dayjs(day).format("YYYY-MM-DD"),
                });
              }
            }
          }}
          disabled={(date) => {
            const today = dayjs();
            const dateStr = dayjs(date).format("YYYY-MM-DD");
            const maxDate = today.add(3, "month");

            if (dayjs(date).isBefore(today, "day")) return true;

            if (dayjs(date).isAfter(maxDate, "day")) return true;

            if (!value?.start || (value.start && value.end)) {
              return disabledDays.includes(dateStr);
            }

            if (
              disableRange[1] &&
              dayjs(date).isSame(dayjs(disableRange[1]), "day")
            ) {
              return false;
            }

            if (disabledDays.includes(dateStr)) return true;

            if (
              disableRange[0] &&
              dayjs(date).isBefore(dayjs(disableRange[0]))
            )
              return true;

            if (
              disableRange[1] &&
              dayjs(date).isAfter(dayjs(disableRange[1]))
            )
              return true;

            return false;
          }}
          modifiers={{
            disabledInRange: (date) => {
              const today = dayjs();
              const maxDate = today.add(3, "month");
              const dateStr = dayjs(date).format("YYYY-MM-DD");

              return (
                disabledDays.includes(dateStr) &&
                dayjs(date).isAfter(today, "day") &&
                dayjs(date).isBefore(maxDate, "day")
              );
            },
            selected: {
              from: value?.start ? new Date(value.start) : undefined,
              to: value?.end ? new Date(value.end) : undefined,
            },
            range_start: value?.start ? new Date(value.start) : undefined,
            range_end: value?.end ? new Date(value.end) : undefined,
            range_middle: (date) =>
              value?.start && value?.end
                ? isWithinInterval(date, {
                  start: value.start,
                  end: value.end,
                })
                : false,
            highlighted: highlightedDates,
            // disabled: highlightedDates,
          }}
          modifiersClassNames={{
            // highlighted: "highlighted",
            highlighted: "bg-orange-500 text-white rounded-full font-semibold",
            // disabled: "bg-[#ED0522]",
          }}
          footer={
            <footer className="mt-[12px] flex flex-row justify-between gap-2">
              <div className="flex fap-2">
                <></>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="light"
                  size="sm"
                  className="border border-[#326144] text-[#326144] hover:bg-gray-100 rounded-md px-4 py-1.5"
                  onPress={() => {
                    onChange({
                      start: undefined,
                      end: undefined,
                    });
                  }}
                >
                  {translate("clear_dates", "Clear dates")}
                </Button>

                <Button
                  variant="solid"
                  color="primary"
                  size="sm"
                  className="bg-[#326144] hover:bg-[#326144] text-white rounded-md px-4 py-1.5"
                  onPress={() => {
                    onSuccess?.();
                    focused?.();
                  }}
                >
                  {translate("done", "Done")}
                </Button>
              </div>
            </footer>
          }
        />
      </div >
    );
  },
);

HeroRangeCalendar.displayName = "HeroRangeCalendar";
