import { MerchantPersonalInfo } from "@/components/stays/merchant-personal-info";
import { BOOKING_STATUS, IBooking } from "@/interfaces/booking";
import { PAYMENT_STATUS } from "@/interfaces/payment";
import { useLanguage } from "@/providers/language";

export default function MerchantInfo({ data }: { data: IBooking }) {
  const { translate } = useLanguage();

  if (!data.merchant) {
    return null;
  }

  if (data.payment?.status !== PAYMENT_STATUS.PAID) {
    return (
      <div className="flex flex-col gap-4 p-4 bg-white rounded-lg">
        <p>
          {translate("your_booking_is_not_paid", "Your booking is not paid")}
        </p>
      </div>
    );
  }

  if (data.status !== BOOKING_STATUS.PAID) {
    return null;
  }

  return <MerchantPersonalInfo data={data.merchant} />;
}
