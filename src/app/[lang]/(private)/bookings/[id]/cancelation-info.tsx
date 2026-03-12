import { BOOKING_STATUS, IBooking } from "@/interfaces/booking";
import { useLanguage } from "@/providers/language";
import { IconExclamationCircle } from "@tabler/icons-react";

export function CancelationInfo({ data }: { data: IBooking }) {
  const { translate } = useLanguage();

  if (data.status === BOOKING_STATUS.CANCELED) {
    return (
      <>
        <div className="rounded-md bg-yellow-50 p-4 mt-6">
          <div className="flex">
            <div className="shrink-0">
              <IconExclamationCircle
                aria-hidden="true"
                className="size-5 text-yellow-400"
              />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                {translate(
                  "your_booking_has_been_cancelled",
                  "Your booking has been cancelled",
                )}
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  {translate(
                    "your_booking_has_been_cancelled_description",
                    "Your booking has been cancelled. Please contact support if you have any questions.",
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6">
          {data.cancelRequest?.status === "CONFIRMED" ? (
            <div className="">
              <h3 className="">
                {translate("admin_note", "Gerbook Admin note")}
              </h3>
              <p className="text-sm/6 text-gray-700">
                {data.cancelRequest.adminNote ||
                  translate("no_admin_note", "No admin note")}
              </p>
            </div>
          ) : null}
        </div>
      </>
    );
  }

  return (
    <div className="rounded-md bg-yellow-50 p-4 mt-6">
      <div className="flex">
        <div className="shrink-0">
          <IconExclamationCircle
            aria-hidden="true"
            className="size-5 text-yellow-400"
          />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-yellow-800">
            {translate(
              "your_booking_unable_to_pay",
              "Your booking is unable to pay",
            )}
          </h3>
          <div className="mt-2 text-sm text-yellow-700">
            <p>
              {translate(
                "your_booking_unable_to_pay_description",
                "Your booking is unable to pay. Please contact support if you have any questions.",
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
