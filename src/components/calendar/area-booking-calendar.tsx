import { IProperty } from "@/interfaces/property";
import dayjs from "dayjs";
import React from "react";
import type { DateRange } from "react-aria-components";
import { RangeCalendar } from "../ui/widgets/area-range-calendar";
import { Button } from "@heroui/react";

export function AreaBookingCalendar({
  data,
  onSuccess,
}: {
  data: IProperty;
  onSuccess?: () => void;
}) {
  let [range, setRange] = React.useState<DateRange | null>(null);
  return (
    <div>
      <RangeCalendar
        value={range}
        onChange={setRange}
        disabledDates={data.calendars
          .filter((item) => item.availableQuantity === 0)
          .map((item) => dayjs(item.date).format("YYYY-MM-DD"))}
      />
      <p>Start date: {range?.start.toString()}</p>
      <p>End date: {range?.end.toString()}</p>
      <Button onPress={() => setRange(null)}>Clear</Button>
    </div>
  );
}

// default value
// {
//     start: parseDate("2020-02-03") as any,
//     end: parseDate("2020-02-12") as any,
//   }
