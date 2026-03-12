import { Form } from "@/components/ui/form";

import { orderApi } from "@/apis";
import TextareaField from "@/components/ui/form/textarea-field";
import { IBooking } from "@/interfaces/booking";
import { useLanguage } from "@/providers/language";
import { errorParse } from "@/utils/error-parse";
import { message } from "@/utils/message";
import { Button } from "@heroui/react";
import { useState } from "react";
import * as yup from "yup";
import { CancelPolicyCard } from "@/components/stays/cancel-policy-card";

export function CancelForm({
  data,
  onSuccess,
}: {
  data: IBooking;
  onSuccess?: () => void;
}) {
  const { translate, currencyRate } = useLanguage();

  const formSchema = yup.object().shape({
    note: yup.string(),
  });

  const [loading, setLoading] = useState(false);

  const onSubmit = async (values: any) => {
    try {
      setLoading(true);
      await orderApi.cancelOrder(data._id, {
        note: values.note,
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

            <div className="p-4 border border-[#ced4da] rounded-md space-y-4">
              <div className="space-y-2">
                <h1 className="text-sm font-semibold text-gray-800 leading-4">
                  {translate(
                    "cancellation_request_information",
                    "Cancellation request information",
                  )}
                </h1>
                <div className="border-t border-[#ced4da]" />
                <div className="flex flex-col">
                  <div className="flex justify-between">
                    <span className="text-md text-gray-800">
                      {translate("unit_price_of_the_booked_house", "Unit price of the booked house")} :
                    </span>
                    <span className="text-md font-medium">
                      {currencyRate(data.property.price || 0)}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-md text-gray-800">
                      {translate("booked_nights", "Booked nights")} :
                    </span>
                    <span className="text-md font-medium">
                      {data.days || 0} {translate("lower_case_day", "day")}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-md text-gray-800">
                      {translate("total_paid_amount", "Total paid amount")} :
                    </span>
                    <span className="text-md font-medium">
                      {currencyRate(data.totalAmount || 0)}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-md font-normal">
                      {translate("amount_to_be_discounted", "amount to be discounted")} :
                    </span>
                    <span className="text-md font-semibold text-green-600">
                      {currencyRate(data.discount || 0)}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-md text-gray-800">
                      {translate("refund_amount", "Refund amount")} :
                    </span>
                    <span className="text-md font-semibold text-red-600">
                      {currencyRate(data.refundAmount || 0)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {data.cancelPolicy?.cancelPolicy?._id && (
              <CancelPolicyCard data={data.cancelPolicy} />
            )}

            <TextareaField
              rows={6}
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
