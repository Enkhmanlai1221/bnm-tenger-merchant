import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import type {
  ButtonProps,
  DateValue,
  PopoverProps,
  RangeCalendarProps,
} from "react-aria-components";
import {
  Button,
  CalendarCell,
  CalendarGrid,
  Heading,
  Popover,
  RangeCalendar,
  Text,
} from "react-aria-components";

interface MyRangeCalendarProps<T extends DateValue>
  extends RangeCalendarProps<T> {
  errorMessage?: string;
}

export function GTRangeCalendar<T extends DateValue>({
  errorMessage,
  ...props
}: MyRangeCalendarProps<T>) {
  return (
    <RangeCalendar {...props}>
      <header className="flex items-center gap-1 pb-4 px-1 font-serif w-full">
        <Heading className="flex-1 font-semibold text-2xl ml-2" />
        <RoundButton slot="previous">
          <IconChevronLeft />
        </RoundButton>
        <RoundButton slot="next">
          <IconChevronRight />
        </RoundButton>
      </header>
      <CalendarGrid className="isolate mt-2 grid grid-cols-7 gap-px rounded-lg bg-gray-200 text-sm shadow ring-1 ring-gray-200">
        {(date) => (
          <CalendarCell
            date={date}
            className="relative py-1.5 hover:bg-gray-100 focus:z-10 rounded-md flex flex-col items-center justify-center"
          />
        )}
      </CalendarGrid>
      {errorMessage && <Text slot="errorMessage">{errorMessage}</Text>}
    </RangeCalendar>
  );
}

function RoundButton(props: ButtonProps) {
  return (
    <Button
      {...props}
      className="w-9 h-9 outline-none cursor-default bg-transparent text-gray-600 border-0 rounded-full flex items-center justify-center hover:bg-gray-100 pressed:bg-gray-200 focus-visible:ring ring-violet-600/70 ring-offset-2"
    />
  );
}

function MyPopover(props: PopoverProps) {
  return (
    <Popover
      {...props}
      className={({ isEntering, isExiting }) => `
          overflow-auto rounded-lg drop-shadow-lg ring-1 ring-black/10 bg-white
          ${
            isEntering
              ? "animate-in fade-in placement-bottom:slide-in-from-top-1 placement-top:slide-in-from-bottom-1 ease-out duration-200"
              : ""
          }
          ${
            isExiting
              ? "animate-out fade-out placement-bottom:slide-out-to-top-1 placement-top:slide-out-to-bottom-1 ease-in duration-150"
              : ""
          }
        `}
    />
  );
}
