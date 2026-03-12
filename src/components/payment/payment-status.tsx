import { BOOKING_STATUS } from "@/interfaces/booking";
import { PAYMENT_STATUS } from "@/interfaces/payment";
import { Chip } from "@heroui/react";
import { useLanguage } from "@/providers/language";

export const PaymentStatus = ({ status }: { status: PAYMENT_STATUS }) => {
  const { translate } = useLanguage();
  return (
    <div>
      {
        {
          [PAYMENT_STATUS.PENDING]: (
            <Chip color="warning" variant="dot">
              {translate("pending", "Pending")}
            </Chip>
          ),
          [PAYMENT_STATUS.PAID]: (
            <Chip color="success" variant="dot">
              {translate("paid", "Paid")}
            </Chip>
          ),
          [BOOKING_STATUS.CANCELED]: (
            <Chip color="danger" variant="dot">
              {translate("canceled", "Canceled")}
            </Chip>
          ),
        }[status]
      }
    </div>
  );
};
