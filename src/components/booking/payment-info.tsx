import { IBooking } from "@/interfaces/booking";
import { useLanguage } from "@/providers/language";
import { formatDate } from "@/utils/time-age";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
} from "@heroui/react";
import { useState } from "react";
import { PriceDetailView } from "./price-detail-view";
const PaymentInfo = ({
  data,
  isActiveBook,
  onSuccess,
}: {
  data: IBooking;
  isActiveBook: boolean;
  onSuccess?: () => void;
}) => {
  const { translate, currencyRate } = useLanguage();
  const [opened, setOpened] = useState(false);
  return (
    <div className="flex flex-col gap-y-4 border rounded-2xl p-6">
      <div className="space-x-1">
        <span className="text-2xl font-medium">
          {currencyRate(data.totalAmount)}
        </span>
        <span className="text-xs text-gray-500">
          {translate("per_day", "Per day")}
        </span>
      </div>
      <div className="flex flex-col border border-gray-700 rounded-lg py-3 px-3">
        <span className="text-sm text-gray-600">
          {translate("guests", "Guests")}
        </span>
        <span className="font-semibold">{data.personCount}</span>
      </div>
      <div className="grid grid-cols-2 gap-x-4">
        <div className="flex flex-col border border-gray-700 rounded-lg py-3 px-3">
          <span className="text-sm text-gray-600">
            {translate("check_in", "Check In")}
          </span>
          <span className="font-semibold">{formatDate(data.startDate)}</span>
        </div>
        <div className="flex flex-col border border-gray-700 rounded-lg py-3 px-3">
          <span className="text-sm text-gray-600">
            {translate("check_out", "Check Out")}
          </span>
          <span className="font-semibold">{formatDate(data.endDate)}</span>
        </div>
      </div>
      <div>
        <PriceDetailView
          data={{
            price: data.property.price,
            days: data.days,
            personCount: data.personCount,
            amount: data.amount,
            discount: data.discount,
            totalAmount: data.totalAmount,
            propertyQuantity: data.propertyQuantity,
            maxPersonCount: data.property.maxPersonCount,
          }}
        />
        {isActiveBook ? (
          <div className="flex flex-col gap-y-2">
            <span className="text-sm text-gray-600">
              {translate(
                "how_to_cancel_booking",
                "Merchant can cancel booking before 2 days of check in",
              )}
            </span>
            <Button
              variant="bordered"
              color="danger"
              size="md"
              onPress={() => {
                setOpened(true);
              }}
            >
              {translate("cancel_booking", "Cancel booking")}
            </Button>
          </div>
        ) : null}
      </div>

      <Modal isOpen={opened} onOpenChange={setOpened} size="3xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 border-b border-gray-200">
                {translate("cancel_booking", "Cancel booking")}
              </ModalHeader>
              <ModalBody>
                <div className="py-4">
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export { PaymentInfo };
