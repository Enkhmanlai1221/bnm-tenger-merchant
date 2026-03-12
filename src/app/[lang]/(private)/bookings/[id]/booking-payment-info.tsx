"use client";

import { BOOKING_STATUS, IBooking } from "@/interfaces/booking";
import { useLanguage } from "@/providers/language";
import { PayForm } from "./pay-form";
import { PaymentCheck } from "@/components/payment/payment-check";
import dayjs from "dayjs";
import { useState } from "react";
import { CancelationInfo } from "./cancelation-info";
import { Modal, ModalHeader, ModalContent, ModalBody } from "@heroui/react";
import { CancelForm } from "./cancel-form";

export function BookingPaymentInfo({
  data,
  onSuccess,
}: {
  data: IBooking;
  onSuccess?: () => void;
}) {
  const { translate } = useLanguage();

  const [opened, setOpened] = useState(false);
  const [methodChange, setMethodChange] = useState(true);

  const unableToPay =
    data.status === BOOKING_STATUS.CANCELED ||
    (dayjs(data.deadline).isBefore(dayjs()) &&
      data.status !== BOOKING_STATUS.PAID);

  if (unableToPay) {
    return <CancelationInfo data={data} />;
  }

  return (
    <div>
      {methodChange && data.status === BOOKING_STATUS.PENDING ? (
        <PayForm
          data={data}
          onSuccess={onSuccess}
          onCancel={() => setOpened(true)}
          setMethodChange={setMethodChange}
        />
      ) : (
        <PaymentCheck
          data={data}
          onSuccess={() => {
            setOpened(false);
            onSuccess?.();
          }}
          onCancel={() => {
            setOpened(true);
          }}
          setMethodChange={setMethodChange}
        />
      )}
      <Modal isOpen={opened} onOpenChange={setOpened} size="3xl">
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1 border-b border-gray-200">
                {translate("cancel_booking", "Cancel booking")}
              </ModalHeader>
              <ModalBody>
                <div className="py-4">
                  <CancelForm
                    data={data}
                    onSuccess={() => {
                      onSuccess?.();
                      setOpened(false);
                    }}
                  />
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
