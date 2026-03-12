"use client";

import { merchantApi } from "@/apis";
import { BookingStatus } from "@/components/booking/booking-status";
import { StaysPreCard } from "@/components/stays/stays-pre-card";
import { Container } from "@/components/ui/page-layout/container";
import Table, { ColumnType } from "@/components/ui/table";
import { RowAction } from "@/components/ui/table/row-action";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { BOOKING_STATUS, IBooking } from "@/interfaces/booking";
import { useLanguage } from "@/providers/language";
import { formatDate, formatDateTime } from "@/utils/time-age";
import {
  Button,
  DateRangePicker,
  Input,
  Select,
  SelectItem,
} from "@heroui/react";
import { IconEdit, IconHome, IconUsers, IconX } from "@tabler/icons-react";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function MerchantBookingsPage() {
  const { translate } = useLanguage();
  const router = useRouter();
  const columns = useHeader({
    onClick: (key: string, record: IBooking) => {
      switch (key) {
        case "detail":
          router.push(`/merchant-bookings/${record?._id}`);
          break;
      }
    },
  });

  const [filters, setFilters] = useState<any>({
    query: "",
    status: BOOKING_STATUS.PAID,
    dateRange: null,
    isArchived: "active",
  });

  const [debouncedQuery] = useDebouncedValue(filters.query, 300);

  return (
    <Container>
      <div className="pt-8 pb-16">
        <Table
          name="swr.merchant.bookings"
          columns={columns}
          filters={{
            isArchived: filters.isArchived === "archived" ? true : false,
            query: debouncedQuery,
            status: filters.status !== "" ? filters.status : undefined,
            startDate:
              filters.dateRange && filters.dateRange.start !== ""
                ? dayjs(filters.dateRange.start.toString())
                  .startOf("day")
                  .toISOString()
                : undefined,
            endDate:
              filters.dateRange && filters.dateRange.end !== ""
                ? dayjs(filters.dateRange.end.toString())
                  .endOf("day")
                  .toISOString()
                : undefined,
          }}
          loadData={(filters) => merchantApi.bookinglistings(filters)}
          noDataText={
            <div className="flex flex-col items-center justify-center gap-y-4">
              <div className="text-center">
                {translate("no_data_available", "No data available")}
              </div>
            </div>
          }
        >
          {({ data }) => (
            <div className="flex flex-col gap-y-4 mb-8">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-xl">
                  {translate("your_bookings", "Your Bookings")} ({data.count})
                </h3>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant={
                      filters.isArchived === "active" ? "solid" : "bordered"
                    }
                    onPress={() =>
                      setFilters({ ...filters, isArchived: "active" })
                    }
                  >
                    {translate("active", "Active")}
                  </Button>
                  <Button
                    size="sm"
                    variant={
                      filters.isArchived === "archived" ? "solid" : "bordered"
                    }
                    onPress={() =>
                      setFilters({ ...filters, isArchived: "archived" })
                    }
                  >
                    {translate("archived", "Archived")}
                  </Button>
                </div>
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <Input
                    size="md"
                    radius="md"
                    variant="bordered"
                    placeholder={translate("search", "Search")}
                    className="max-w-full md:max-w-64"
                    value={filters.query}
                    onChange={(e) =>
                      setFilters({ ...filters, query: e.target.value })
                    }
                  />
                  <Select
                    size="md"
                    radius="md"
                    variant="bordered"
                    defaultSelectedKeys={[filters.status]}
                    placeholder={translate("status", "Status")}
                    className="max-w-full md:max-w-64"
                    value={filters.status}
                    onChange={(e) =>
                      setFilters({ ...filters, status: e.target.value })
                    }
                  >
                    {Object.values(BOOKING_STATUS).map((status) => (
                      <SelectItem key={status} value={status}>
                        {translate(`booking_status_label.${status}`, status)}
                      </SelectItem>
                    ))}
                  </Select>

                  <DateRangePicker
                    size="md"
                    radius="md"
                    variant="bordered"
                    className="max-w-full md:max-w-64"
                    // label={translate("date_range", "Date range")}
                    value={filters.dateRange}
                    onChange={(value) =>
                      setFilters({ ...filters, dateRange: value })
                    }
                    granularity="day"
                    endContent={
                      filters.dateRange && (
                        <Button
                          isIconOnly
                          variant="flat"
                          onPress={() =>
                            setFilters({ ...filters, dateRange: null })
                          }
                        >
                          <IconX size={16} />
                        </Button>
                      )
                    }
                  />
                </div>
              </div>
            </div>
          )}
        </Table>
      </div>
    </Container>
  );
}

const useHeader = ({
  onClick,
}: {
  onClick: (key: string, record: IBooking) => void;
}): ColumnType<IBooking>[] => {
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
    {
      name: translate("action", "Action"),
      width: "100px",
      render: (record) => (
        <RowAction
          onClick={(key) => onClick(key, record)}
          extra={{
            detail: (
              <button className="p-2 rounded-2xl hover:bg-gray-100">
                <IconEdit />
              </button>
            ),
          }}
        />
      ),
    },
  ];
};
