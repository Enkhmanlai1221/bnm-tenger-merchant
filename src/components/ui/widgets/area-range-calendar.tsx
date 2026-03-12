import { getLocalTimeZone, today } from "@internationalized/date";
import dayjs from "dayjs";
import React, { useRef, useState } from "react";
import { useLanguage } from "@/providers/language";
import {
  RangeCalendar as AriaRangeCalendar,
  RangeCalendarProps as AriaRangeCalendarProps,
  CalendarCell,
  CalendarGrid,
  CalendarGridBody,
  DateValue,
  RangeCalendarStateContext,
  Text,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import { CalendarGridHeader, CalendarHeader } from "./area-calendar";
import { focusRing } from "./utils";

export interface RangeCalendarProps<T extends DateValue>
  extends Omit<AriaRangeCalendarProps<T>, "visibleDuration"> {
  disabledDates?: string[];
  errorMessage?: string;
}

const cell = tv({
  extend: focusRing,
  base: "w-full h-full flex items-center justify-center rounded-full forced-color-adjust-none text-zinc-900 dark:text-zinc-200",
  variants: {
    selectionState: {
      none: "group-hover:bg-gray-100 dark:group-hover:bg-zinc-700 group-pressed:bg-gray-200 dark:group-pressed:bg-zinc-600",
      middle: [
        "group-hover:bg-blue-200 dark:group-hover:bg-blue-900 forced-colors:group-hover:bg-[Highlight]",
        "group-invalid:group-hover:bg-red-200 dark:group-invalid:group-hover:bg-red-900 forced-colors:group-invalid:group-hover:bg-[Mark]",
        "group-pressed:bg-blue-300 dark:group-pressed:bg-blue-800 forced-colors:group-pressed:bg-[Highlight] forced-colors:text-[HighlightText]",
        "group-invalid:group-pressed:bg-red-300 dark:group-invalid:group-pressed:bg-red-800 forced-colors:group-invalid:group-pressed:bg-[Mark]",
      ],
      cap: "bg-blue-600 group-invalid:bg-red-600 forced-colors:bg-[Highlight] forced-colors:group-invalid:bg-[Mark] text-white forced-colors:text-[HighlightText]",
    },
    isDisabled: {
      true: "text-gray-300 forced-colors:text-[GrayText]",
    },
    isUnavailable: {
      true: "text-red-300 forced-colors:text-[GrayText] cursor-not-allowed line-through",
    },
    onlyCheckOut: {
      true: "text-yellow-500",
    },
  },
});

export function RangeCalendar<T extends DateValue>({
  errorMessage,
  disabledDates = [],
  ...props
}: RangeCalendarProps<T>) {
  const { translate } = useLanguage();
  const cellRef = useRef<HTMLTableCellElement>(null);
  const [isUserSelectingRightNow, setIsUserSelectingRightNow] = useState(false);

  const isDateUnavailable = (date: DateValue) => {
    const dateStr = date.toString();
    const prevDate = dayjs(dateStr).subtract(1, "day").format("YYYY-MM-DD");
    const isCurrentDateDisabled = disabledDates.includes(dateStr);
    const isPrevDateDisabled = disabledDates.includes(prevDate);

    if (!isPrevDateDisabled && isCurrentDateDisabled) {
      return false;
    }

    return isCurrentDateDisabled;
  };

  const minValue = today(getLocalTimeZone()) as unknown as DateValue;
  return (
    <AriaRangeCalendar
      {...props}
      visibleDuration={{ months: 2 }}
      className="overflow-auto max-w-[calc(504px+1rem)]"
      firstDayOfWeek="mon"
      isDateUnavailable={isDateUnavailable}
      pageBehavior="single"
      minValue={minValue}
      onChange={(value) => {
        props.onChange?.(value);
      }}
    >
      <CalendarHeader />
      <div className="flex gap-x-2 overflow-auto justify-center">
        <CalendarGrid className="[&_td]:px-0 [&_td]:py-px">
          <CalendarGridHeader />
          <CalendarGridBody>
            {(date) => (
              <CalendarCell
                ref={cellRef}
                date={date}
                className="group w-9 h-9 text-sm outline outline-0 cursor-default outside-month:text-gray-300 selected:bg-blue-100 dark:selected:bg-blue-700/30 forced-colors:selected:bg-[Highlight] invalid:selected:bg-red-100 dark:invalid:selected:bg-red-700/30 forced-colors:invalid:selected:bg-[Mark] [td:first-child_&]:rounded-s-full selection-start:rounded-s-full [td:last-child_&]:rounded-e-full selection-end:rounded-e-full"
              >
                {({
                  formattedDate,
                  isSelected,
                  isSelectionStart,
                  isSelectionEnd,
                  isFocusVisible,
                  isDisabled,
                  isUnavailable,
                }) => {
                  return (
                    <span
                      className={cell({
                        selectionState:
                          isSelected && (isSelectionStart || isSelectionEnd)
                            ? "cap"
                            : isSelected
                              ? "middle"
                              : "none",
                        isDisabled,
                        isFocusVisible,
                        isUnavailable,
                      })}
                    >
                      {formattedDate}
                    </span>
                  );
                }}
              </CalendarCell>
            )}
          </CalendarGridBody>
        </CalendarGrid>
        <CalendarGrid
          className="[&_td]:px-0 [&_td]:py-px"
          offset={{ months: 1 }}
        >
          <CalendarGridHeader />
          <CalendarGridBody>
            {(date) => {
              return (
                <CalendarCell
                  ref={cellRef}
                  date={date}
                  className="group w-9 h-9 text-sm outline outline-0 cursor-default outside-month:text-gray-300 selected:bg-blue-100 dark:selected:bg-blue-700/30 forced-colors:selected:bg-[Highlight] invalid:selected:bg-red-100 dark:invalid:selected:bg-red-700/30 forced-colors:invalid:selected:bg-[Mark] [td:first-child_&]:rounded-s-full selection-start:rounded-s-full [td:last-child_&]:rounded-e-full selection-end:rounded-e-full"
                >
                  {({
                    formattedDate,
                    isSelected,
                    isSelectionStart,
                    isSelectionEnd,
                    isFocusVisible,
                    isDisabled,
                    isUnavailable,
                  }) => (
                    <>
                      <span
                        className={cell({
                          selectionState:
                            isSelected && (isSelectionStart || isSelectionEnd)
                              ? "cap"
                              : isSelected
                                ? "middle"
                                : "none",
                          isDisabled,
                          isFocusVisible,
                          isUnavailable,
                        })}
                      >
                        {formattedDate}
                      </span>
                    </>
                  )}
                </CalendarCell>
              );
            }}
          </CalendarGridBody>
        </CalendarGrid>
      </div>
      {errorMessage && (
        <Text slot="errorMessage" className="text-sm text-red-600">
          {errorMessage}
        </Text>
      )}
    </AriaRangeCalendar>
  );
}
