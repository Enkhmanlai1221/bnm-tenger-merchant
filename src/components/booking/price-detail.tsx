import { orderApi } from "@/apis";
import { IDiscount } from "@/interfaces/discount";
import { useLanguage } from "@/providers/language";
import { IconExclamationCircle } from "@tabler/icons-react";
import useSWR from "swr";
import { PriceDetailView } from "./price-detail-view";

export const PriceDetail = ({
  collateral,
  propertyId,
  price,
  start,
  end,
  personCount,
  maxPersonCount,
  propertyQuantity,
  onError,
  onSuccess,
}: {
  collateral?: boolean;
  propertyId: string;
  price: number;
  start: string;
  end: string;
  personCount: number;
  maxPersonCount: number;
  propertyQuantity: number;
  onError: () => void;
  onSuccess: () => void;
}) => {
  const { translate } = useLanguage();
  const { data, error } = useSWR<{
    days: number;
    amount: number;
    discount: number;
    totalAmount: number;
    discountObj: IDiscount;
  }>(
    `/api/properties/${propertyId}.${start}.${end}.${personCount}`,
    () =>
      orderApi.priceDetail({
        property: propertyId,
        startDate: start,
        endDate: end,
        personCount: personCount,
      }),
    {
      onError: () => {
        onError();
      },
      onSuccess: () => {
        onSuccess();
      },
      revalidateOnFocus: false,
    },
  );

  if (error) {
    return (
      <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
        <div className="sm:flex sm:items-start">
          <div className="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:size-10">
            <IconExclamationCircle
              aria-hidden="true"
              className="size-6 text-red-600"
            />
          </div>
          <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
            <h3 className="text-base font-semibold text-gray-900">
              {translate(
                "reservation_unavailable_for_selected_dates",
                "Reservation Unavailable for Selected Dates",
              )}
            </h3>
            <div className="mt-2">
              <p className="text-sm text-gray-500">
                {translate(
                  "we_apologize_but_the_property_is_not_available",
                  "We apologize, but the property is not available for booking during your selected dates. Please select different dates or contact our customer support team for assistance.",
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div>
      <PriceDetailView
        collateral={collateral}
        data={{
          ...data,
          price,
          personCount,
          propertyQuantity,
          maxPersonCount,
        }}
      />
    </div>
  );
};
