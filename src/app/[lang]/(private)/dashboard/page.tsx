"use client";

import { TransactionCard } from "@/components/transaction/transaction-card";
import { Container } from "@/components/ui/page-layout/container";
import { MOCK_DASHBOARD_STATS, MOCK_TRANSACTIONS } from "@/data/mock";
import { useLanguage } from "@/providers/language";
import { Card, CardBody } from "@heroui/react";
import {
  IconArrowBarToDown,
  IconArrowBarUp,
  IconChartBar,
  IconUsers,
} from "@tabler/icons-react";

function StatCard({
  title,
  value,
  hint,
  icon,
}: {
  title: string;
  value: React.ReactNode;
  hint?: string;
  icon: React.ReactNode;
}) {
  return (
    <Card
      shadow="none"
      radius="lg"
      className="border border-slate-200 bg-white/90 backdrop-blur-sm"
    >
      <CardBody className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3 sm:gap-4">
          <div className="min-w-0 flex-1">
            <div className="text-xs sm:text-sm font-medium text-slate-500">{title}</div>
            <div className="mt-2 sm:mt-3 text-xl sm:text-2xl font-semibold tracking-tight text-slate-900">
              {value}
            </div>
            {hint && <div className="mt-1.5 sm:mt-2 text-xs text-slate-500">{hint}</div>}
          </div>

          <div className="flex h-9 w-9 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl bg-slate-100 text-slate-700 ring-1 ring-slate-200">
            {icon}
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

function SummaryPill({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: React.ReactNode;
  tone?: "default" | "green" | "red" | "blue";
}) {
  const toneClass = {
    default: "bg-slate-100 text-slate-700",
    green: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100",
    red: "bg-red-50 text-red-700 ring-1 ring-red-100",
    blue: "bg-blue-50 text-blue-700 ring-1 ring-blue-100",
  }[tone];

  return (
    <div
      className={[
        "inline-flex items-center gap-1.5 sm:gap-2 rounded-full px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm",
        toneClass,
      ].join(" ")}
    >
      <span className="text-slate-500">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}

export default function DashboardPage() {
  const { currencyRate } = useLanguage();
  const data = MOCK_DASHBOARD_STATS;

  return (
    <Container>
      <div className="my-4 sm:my-6 lg:my-8 space-y-4 sm:space-y-6 lg:space-y-8 px-3 sm:px-4 lg:px-0">
        <div className="flex flex-col gap-3 sm:gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-slate-900">
              Хянах самбар
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-500">
              Орлого, захиалга болон сүүлийн гүйлгээнүүдийн ерөнхий тойм
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Яг одоо байгаа жуулчин"
            value={
              <div className="flex items-end gap-2">
                <span>{data?.currentGuests ?? "N/A"}</span>
                <span className="pb-1 text-xs font-medium text-slate-500">хүн</span>
              </div>
            }
            hint="Одоогоор байрлаж буй нийт жуулчид"
            icon={<IconUsers size={20} stroke={1.8} />}
          />

          <StatCard
            title="Маргааш ирэх жуулчин"
            value={
              <div className="flex items-end gap-2">
                <span>{data?.tomorrowArrivals ?? "N/A"}</span>
                <span className="pb-1 text-xs font-medium text-slate-500">хүн</span>
              </div>
            }
            hint="Маргааш шинээр ирэх жуулчдын тоо"
            icon={<IconArrowBarToDown size={20} stroke={1.8} />}
          />

          <StatCard
            title="Маргааш гарах жуулчин"
            value={
              <div className="flex items-end gap-2">
                <span>{data?.tomorrowDepartures ?? "N/A"}</span>
                <span className="pb-1 text-xs font-medium text-slate-500">хүн</span>
              </div>
            }
            hint="Маргааш гарах жуулчдын тоо"
            icon={<IconArrowBarUp size={20} stroke={1.8} />}
          />

          <StatCard
            title="Өдрийн дундаж дүүргэлт"
            value={
              <div className="flex items-end gap-2">
                <span>{data?.dailyOccupancy ?? "N/A"}</span>
                <span className="pb-1 text-xs font-medium text-slate-500">%</span>
              </div>
            }
            hint="Өнөөдрийн байрны дундаж дүүргэлтийн хувь"
            icon={<IconChartBar size={20} stroke={1.8} />}
          />
        </div>

        <Card
          shadow="none"
          radius="lg"
          className="border border-slate-200 bg-white/90 backdrop-blur-sm"
        >
          <CardBody className="p-4 sm:p-5 md:p-6">
            <div className="flex flex-col gap-3 sm:gap-4 border-b border-slate-100 pb-4 sm:pb-5 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="text-base sm:text-lg font-semibold text-slate-900">
                  Гүйлгээний түүх
                </div>
                <div className="mt-1 text-xs sm:text-sm text-slate-500">
                  {MOCK_TRANSACTIONS.length} гүйлгээ бүртгэгдсэн байна
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <SummaryPill
                  label="Нийт шимтгэл"
                  value={currencyRate(data.totalFee)}
                  tone="red"
                />
                <SummaryPill
                  label="Нийт орлого"
                  value={currencyRate(data.totalProfit)}
                  tone="green"
                />
                <SummaryPill
                  label="Нийт бичлэг"
                  value={MOCK_TRANSACTIONS.length}
                  tone="blue"
                />
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-3">
              {MOCK_TRANSACTIONS.map((item) => (
                <TransactionCard key={item._id} {...item} />
              ))}
            </div>
          </CardBody>
        </Card>
      </div>
    </Container>
  );
}