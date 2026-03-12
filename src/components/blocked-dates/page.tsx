import * as yup from "yup";
import { Form } from "../ui/form";
import { useLanguage } from "@/providers/language";
import { Button } from "@heroui/react";
import { useState } from "react";
import { IProperty, IPropertyCalendar } from "@/interfaces/property";
import { TextField } from "../ui/form/text-field";
import dayjs from "dayjs";
import { CalendarDate } from "@internationalized/date";
import { BlockDatePickerField } from "../ui/form/block-date-picker-field";
import { message } from "@/utils/message";
import { ErrorMessage } from "@/utils/http/http-handler";
import { merchantApi } from "@/apis";

interface Props {
  item: IProperty;
  onSuccess: () => void;
  onCancel: () => void;
}

export function BlockedDates({ item, onSuccess, onCancel }: Props) {
  const { translate } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);

  const basePrice = item.price;

  const mappedPropertyCalendar = item.calendars.reduce(
    (acc, curr) => {
      acc[dayjs(curr.date).format("YYYY-MM-DD")] = {
        ...curr,
        blocked:
          item.blockedDates.find((bd) => bd.date === curr.date)
            ?.quantity || 0,
      };
      return acc;
    },
    {} as Record<string, IPropertyCalendar & { blocked: number }>,
  );

  const formSchema = yup.object().shape({
    startDate: yup
      .string()
      .required(translate("this_field_is_required", "This field is required")),
    endDate: yup
      .string()
      .required(translate("this_field_is_required", "This field is required")),
    blockedQuantity: yup
      .string()
      .required(translate("this_field_is_required", "This field is required")),
  });

  const onSubmit = async (values: any) => {
    setIsLoading(true);
    const start = new Date(values?.startDate);
    const end = new Date(values?.endDate);
    const blockedQuantity = values?.blockedQuantity ? Number(values.blockedQuantity) : null;

    const dates: {
      date: string;
      price: number | null;
      blockedQuantity: number | null;
    }[] = [];

    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dateKey = dayjs(d).format("YYYY-MM-DD");
      const mappedDay = mappedPropertyCalendar[dateKey];

      dates.push({
        date: d.toISOString(),
        price: mappedDay?.price ?? basePrice,
        blockedQuantity: blockedQuantity ?? null,
      });
    }

    try {
      await merchantApi.propertyDates(item?._id, { dates });
      message.success("Амжилттай хадгаллаа");
      onSuccess?.();
    } catch (err) {
      message.error((err as ErrorMessage).message);
    }
    setIsLoading(false);
  };

  const today = () => {
    const now = new Date();
    return new CalendarDate(now.getFullYear(), now.getMonth() + 1, now.getDate());
  };

  const addDays = (date: CalendarDate, days: number) => {
    return date.add({ days });
  };

  return (
    <Form
      initialValues={{
        startDate: "",
        endDate: "",
        blockedQuantity: "",
      }}
      validationSchema={formSchema}
      onSubmit={onSubmit}
    >
      {() => {
        return (
          <div className="flex flex-col gap-y-4">
            <div className="flex flex-col lg:flex-row w-full gap-2">
              <BlockDatePickerField
                name="startDate"
                label={translate("start_date", "Start date")}
                minValue={today()}
                maxValue={addDays(today(), 90)}
                isRequired
              />
              <BlockDatePickerField
                name="endDate"
                label={translate("end_date", "End date")}
                minValue={today()}
                maxValue={addDays(today(), 90)}
                isRequired
              />
            </div>
            <div className="w-full p-2 bg-red-50 border border-red-200 rounded">
              <span className="text-xs text-red-600">
                {translate("block_booking_between", "You can block bookings for any date between")} {`${today().toString()} `} {translate("and", "and")} {`${addDays(today(), 90).toString()} `}
              </span>
            </div>

            <div className="flex flex-col lg:flex-row w-full">
              <TextField
                type="number"
                label={translate("number_of_houses_you_can_block", "Number of houses you can block")}
                name="blockedQuantity"
                placeholder="0"
                min={0}
                isRequired
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="ghost" onPress={onCancel}>
                {translate("back", "Back")}
              </Button>
              <Button color="primary" type="submit" isLoading={isLoading}>
                {translate("save", "Save")}
              </Button>
            </div>
          </div>
        );
      }}
    </Form>
  );
}