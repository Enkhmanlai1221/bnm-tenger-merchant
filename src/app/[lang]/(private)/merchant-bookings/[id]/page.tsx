"use client";
import { merchantApi } from "@/apis";
import { BookingStatus } from "@/components/booking/booking-status";
import { PaymentInfo } from "@/components/booking/payment-info";
import { SubscriberInfo } from "@/components/booking/subscriber-info";
import { StaysPreCard } from "@/components/stays/stays-pre-card";
import { Container } from "@/components/ui/page-layout/container";
import Table, { ColumnType } from "@/components/ui/table";
import { BOOKING_STATUS, IBooking } from "@/interfaces/booking";
import { useLanguage } from "@/providers/language";
import { formatDate, formatDateTime } from "@/utils/time-age";
import { Alert } from "@heroui/react";
import { IconChevronLeft, IconHome, IconUsers } from "@tabler/icons-react";
import dayjs from "dayjs";
import Link from "next/link";
import useSWR from "swr";

export default function MerchantBookingDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { translate } = useLanguage();
  const columns = useHeader();
  const { data, mutate: mutateOrder } = useSWR(
    `swr.merchant.booking.detail.${params.id}`,
    () => merchantApi.getBooking(params.id),
    {
      revalidateOnFocus: false,
    },
  );

  if (!data)
    return (
      <div className="flex items-center justify-center h-screen">
        {translate("loading", "Loading...")}
      </div>
    );

  const isActiveBook =
    dayjs(data.endDate).subtract(2, "day").isAfter(dayjs()) &&
    data.status !== BOOKING_STATUS.CANCELED;

  return (
    <Container>
      <div className="pt-10 pb-20">
        <div className="flex items-center gap-x-3 mb-8">
          <Link
            href="/merchant-bookings"
            className="flex items-center gap-1 text-lg text-gray-500 hover:text-gray-700"
          >
            <IconChevronLeft className="size-4" />
            {translate("back_to_bookings", "Back to bookings")}
          </Link>
          <span className="text-lg font-semibold">
            {translate("booking_id", "Booking id")}: {data.code}
          </span>
        </div>
        <div className="space-y-6">
          {!isActiveBook ? (
            <div className="flex items-center justify-center w-full">
              <Alert
                description={translate("expired_booking", "Expired booking")}
                title={translate(
                  "expired_booking_description",
                  "Expired booking description",
                )}
              />
            </div>
          ) : null}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">
              {translate("booking_info", "Booking info")}
            </h3>
            <Table
              name="swr.merchant.booking.detail."
              columns={columns}
              filters={{}}
              dataSource={[data]}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-6 gap-5">
            <div className="col-span-1 md:col-span-3 space-y-3">
              <h3 className="text-lg font-semibold">
                {translate("guest_info", "Guest info")}
              </h3>
              <SubscriberInfo data={data} />
            </div>
            <div className="col-span-1 md:col-span-3 space-y-3">
              <h3 className="text-lg font-semibold">
                {translate("payment_info", "Payment info")}
              </h3>
              <PaymentInfo
                data={data}
                isActiveBook={isActiveBook}
                onSuccess={() => {
                  mutateOrder();
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}

const useHeader = (): ColumnType<IBooking>[] => {
  const { translate, currencyRate } = useLanguage();
  return [
    {
      title: translate("ger", "Ger"),
      name: "name",
      width: 270,
      render: (record) => {
        return <StaysPreCard payload={record.property} totalAmount={record.totalAmount} />;
      },
    },
    {
      title: translate("booking_code", "Booking code"),
      name: "id",
      render: (record) => (
        <div className="flex flex-col gap-y-2">
          <div className="flex flex-col md:flex-row justify-between">
            <span>{record.code}</span>
            <div className="flex flex-col text-xs">
              <span>{formatDate(record.startDate)}</span>
              <span>{formatDate(record.endDate)}</span>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between">
            <span className="text-sm font-semibold text-gray-900">
              {currencyRate(record.totalAmount)}
            </span>
            <span className="text-sm text-gray-500">
              {record.days} {translate("nights", "nights")}
            </span>
          </div>
        </div>
      ),
    },
    {
      title: "",
      name: "ger_count",
      render: (record) => (
        <div className="flex flex-col">
          <div className="flex items-center gap-x-2">
            <IconHome size={16} stroke={1} />
            <span className="text-sm font-semibold text-gray-900">
              {record.propertyQuantity}
            </span>
          </div>
          <div className="flex items-center gap-x-2">
            <IconUsers size={16} stroke={1} />
            <span className="text-sm font-semibold text-gray-900">
              {record.personCount}
            </span>
          </div>
        </div>
      ),
    },
    {
      title: translate("stay_dates", "Stay dates"),
      render: (record) => <BookingStatus status={record.status} />,
    },
    {
      title: translate("booked_time", "Booked time"),
      name: "bookedDate",
      render: (record) => formatDateTime(record.createdAt),
    },
  ];
};
