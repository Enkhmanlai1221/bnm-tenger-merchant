import { Form } from "@/components/ui/form";

import { merchantApi } from "@/apis";
import TextareaField from "@/components/ui/form/textarea-field";
import { IBooking } from "@/interfaces/booking";
import { useLanguage } from "@/providers/language";
import { errorParse } from "@/utils/error-parse";
import { message } from "@/utils/message";
import { Button } from "@heroui/react";
import { useState } from "react";
import * as yup from "yup";

export function MerchantCancelForm({
  data,
  onSuccess,
}: {
  data: IBooking;
  onSuccess?: () => void;
}) {
  const { translate } = useLanguage();

  const formSchema = yup.object().shape({
    note: yup.string(),
  });

  const [loading, setLoading] = useState(false);

  const onSubmit = async (values: any) => {
    try {
      setLoading(true);
      await merchantApi.cancelBooking(data._id, {
        adminNote: values.note,
      });
      message.success(
        translate(
          "booking_canceled_successfully",
          "Booking canceled successfully",
        ),
      );
      onSuccess?.();
    } catch (error) {
      errorParse(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      initialValues={{
        note: "",
      }}
      onSubmit={onSubmit}
      validationSchema={formSchema}
    >
      {() => {
        return (
          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              {translate(
                "are_you_sure_you_want_to_cancel_this_booking",
                "Are you sure you want to cancel this booking?",
              )}
            </p>

            <TextareaField
              label={translate("cancellation_note", "Cancellation note")}
              name="note"
              placeholder={translate(
                "enter_cancellation_note",
                "Enter cancellation note",
              )}
            />
            <div className="flex justify-end gap-4">
              <Button type="submit" isLoading={loading} color="danger">
                {translate("cancel_booking", "Cancel booking")}
              </Button>
            </div>
          </div>
        );
      }}
    </Form>
  );
}
