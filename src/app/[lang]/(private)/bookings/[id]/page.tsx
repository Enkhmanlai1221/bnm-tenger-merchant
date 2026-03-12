"use client";

import { BookingStatus } from "@/components/booking/booking-status";
import { CancelationPolicy } from "@/components/stays/cancelation";
import { useMediaQuery } from "@/hooks/use-media-query";
import { BOOKING_STATUS } from "@/interfaces/booking";
import { useLanguage } from "@/providers/language";
import { formatDate, formatDateTime } from "@/utils/time-age";
import {
  IconCalendar,
  IconChevronLeft,
  IconClock,
  IconHome,
  IconTicket,
  IconUsers
} from "@tabler/icons-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { OrderCountdown } from "./order-count-down";

function SectionCard({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white">
      <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4 sm:px-6">
        {icon && (
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
            {icon}
          </div>
        )}
        <h2 className="text-base font-semibold text-slate-900 sm:text-lg">
          {title}
        </h2>
      </div>
      <div className="p-5 sm:p-6">{children}</div>
    </section>
  );
}

function InfoRow({
  label,
  value,
  strong,
}: {
  label: string;
  value: React.ReactNode;
  strong?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <dt className="text-sm text-slate-500">{label}</dt>
      <dd
        className={[
          "text-right text-sm",
          strong ? "font-semibold text-slate-900" : "text-slate-700",
        ].join(" ")}
      >
        {value}
      </dd>
    </div>
  );
}

export default function BookingPage({ params }: { params: { id: string } }) {
  const { translate, currencyRate } = useLanguage();
  const searchParams = useSearchParams();
  const isMobile = useMediaQuery("(max-width: 768px)");

  const mutateOrder = () => { };

  const data = {
    _id: params.id || "booking_001",
    code: "BNM-2026-0001",
    days: 3,
    amount: 450000,
    totalAmount: 420000,
    discount: 30000,
    discountObj: {
      _id: "discount_001",
      name: "Spring Promo",
      value: 30000,
      type: "fixed",
      code: "SPRING30",
    },
    status: BOOKING_STATUS.PAID,
    statusDate: "2026-03-12T09:30:00.000Z",
    startDate: "2026-04-01T00:00:00.000Z",
    endDate: "2026-04-04T00:00:00.000Z",
    deadline: "2026-03-15T12:00:00.000Z",
    propertyQuantity: 2,
    personCount: 4,
    search: "Terelj",
    createdAt: "2026-03-10T08:20:00.000Z",
    updatedAt: "2026-03-12T09:30:00.000Z",
    refundFee: 15000,
    refundAmount: 405000,

    property: {
      _id: "property_001",
      name: "Terelj Mountain Camp",
      description:
        "Beautiful camp near Terelj with mountain view, traditional gers and peaceful nature.",
      price: 150000,
      image:
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop",
      maxPersonCount: 2,
      cancelPolicies: [
        {
          day: 7,
          percent: 0,
          description: "7 хоногоос өмнө цуцалбал шимтгэлгүй",
        },
        {
          day: 3,
          percent: 20,
          description: "3 хоногийн өмнө цуцалбал 20% шимтгэлтэй",
        },
        {
          day: 1,
          percent: 50,
          description: "1 хоногийн өмнө цуцалбал 50% шимтгэлтэй",
        },
      ],
    },

    user: {
      _id: "user_001",
      firstName: "Anar",
      lastName: "Batsaikhan",
      email: "anar@example.com",
      phoneNumber: "+976 99112233",
    },

    merchant: {
      _id: "merchant_001",
      businessName: "Brave New Mongolia Camp",
      name: "BNM Camp",
      phoneNumber: "+976 88112233",
      email: "info@bnm.mn",
      address: "Terelj, Ulaanbaatar, Mongolia",
    },

    payment: {
      _id: "payment_001",
      status: "paid",
      method: "qpay",
      amount: 420000,
      paidAt: "2026-03-12T09:25:00.000Z",
    },

    review: {
      _id: "review_001",
      rate: 5,
      text: "Amazing stay. Clean ger, nice staff and beautiful landscape.",
      createdAt: "2026-03-13T10:00:00.000Z",
    },

    cancelRequest: null,

    cancelPolicy: {
      description: "Cancellation is subject to merchant policy.",
    },
  };

  const isThankYou =
    searchParams.get("thank") === "true" && data.status === BOOKING_STATUS.PAID;

  return (
    <main className="min-h-screen bg-slate-50 px-4 pb-24 pt-6 sm:px-6 sm:pt-10 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {isThankYou ? (
          <div className="mb-8 overflow-hidden rounded-3xl border border-primary-100 bg-gradient-to-br from-primary-50 to-white p-6 sm:p-8">
            <h1 className="text-sm font-semibold uppercase tracking-wide text-primary-600">
              Баярлалаа
            </h1>
            <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Танд баярлалаа
            </p>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
              Таашаалын код: {data.code}
            </p>
          </div>
        ) : (
          <div className="mb-6">
            <Link
              href="/bookings"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              <IconChevronLeft className="size-4" />
              Буцах
            </Link>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.4fr_0.9fr]">
          <div className="space-y-6">
            <SectionCard
              title="Захиалгын мэдээлэл"
              icon={<IconHome size={20} stroke={1.8} />}
            >
              <div className="grid grid-cols-1">
                <div className="rounded-2xl bg-slate-50 p-4 sm:p-5">
                  <dl className="divide-y divide-slate-200">
                    <InfoRow
                      label={"Огноо"}
                      value={
                        <div className="flex flex-col items-center gap-2">
                          <p>{formatDate(data.startDate)}</p>
                          <p>{formatDate(data.endDate)}</p>
                        </div>}

                      strong
                    />
                    <InfoRow
                      label={"Хоног"}
                      value={
                        <div className="flex flex-col items-center gap-2">
                          <p>{data.days}</p>
                        </div>}
                    />
                    <InfoRow
                      label={"Зочид"}
                      value={`${data.personCount}`}
                    />
                    <InfoRow
                      label={"Гэр"}
                      value={`${data.propertyQuantity}`}
                    />
                    <InfoRow
                      label={"Үүссэн"}
                      value={formatDateTime(data.createdAt)}
                    />
                    <InfoRow
                      label={"Үнэ"}
                      value={currencyRate(data.property.price)}
                      strong
                    />
                  </dl>
                </div>
              </div>
            </SectionCard>

            <SectionCard
              title={"Цуцлах журам"}
              icon={<IconCalendar size={20} stroke={1.8} />}
            >
              <CancelationPolicy data={data.property.cancelPolicies as any} />
            </SectionCard>
          </div>

          <div className="space-y-6">
            <section className="sticky top-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Захиалгын код
                  </p>
                  <p className="mt-2 text-xl font-bold text-primary-600">
                    #{data.code}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-100 p-3 text-slate-700">
                  <IconTicket size={20} stroke={1.8} />
                </div>
              </div>

              <div className="mt-5 space-y-4">
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    Захиалгын төлөв
                  </p>

                  <div className="mt-2">
                    {data.status === BOOKING_STATUS.PENDING ? (
                      <div className="flex items-center gap-2 text-sm font-semibold text-primary-600">
                        <IconClock size={16} />
                        <OrderCountdown
                          orderTime={data.deadline}
                          onComplete={mutateOrder}
                        />
                      </div>
                    ) : (
                      <BookingStatus status={data.status} />
                    )}
                  </div>
                </div>
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    Захиалгын хураангуй
                  </p>

                  <dl className="mt-3 space-y-3">
                    <div className="flex items-center justify-between gap-3 text-sm">
                      <dt className="flex items-center gap-2 text-slate-500">
                        <IconCalendar size={15} />
                        Огноо
                      </dt>
                      <dd className="text-right font-medium text-slate-900">
                        {formatDate(data.startDate)} → {formatDate(data.endDate)}
                      </dd>
                    </div>

                    <div className="flex items-center justify-between gap-3 text-sm">
                      <dt className="flex items-center gap-2 text-slate-500">
                        <IconUsers size={15} />
                        Зочид
                      </dt>
                      <dd className="font-medium text-slate-900">
                        {data.personCount}
                      </dd>
                    </div>

                    <div className="flex items-center justify-between gap-3 text-sm">
                      <dt className="flex items-center gap-2 text-slate-500">
                        <IconHome size={15} />
                        Гэр
                      </dt>
                      <dd className="font-medium text-slate-900">
                        {data.propertyQuantity}
                      </dd>
                    </div>

                    <div className="border-t border-slate-200 pt-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-500">
                          Нийт үнэ
                        </span>
                        <span className="text-lg font-bold text-slate-900">
                          {currencyRate(data.totalAmount)}
                        </span>
                      </div>
                    </div>
                  </dl>
                </div>

                {isMobile && (
                  <div className="rounded-2xl border border-dashed border-slate-200 p-4 text-xs leading-5 text-slate-500">
                    {translate(
                      "booking_help_text",
                      "Please review your booking details, payment, and cancellation terms carefully."
                    )}
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}