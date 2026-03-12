"use client";

import { BookingStatus, statusLabels } from "@/components/booking/booking-status";
import { StaysPreCard } from "@/components/stays/stays-pre-card";
import { Container } from "@/components/ui/page-layout/container";
import Table, { ColumnType } from "@/components/ui/table";
import { RowAction } from "@/components/ui/table/row-action";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { BOOKING_STATUS, IBooking } from "@/interfaces/booking";
import { useLanguage } from "@/providers/language";
import { formatDateTime } from "@/utils/time-age";
import {
  Button,
  DateRangePicker,
  Input
} from "@heroui/react";
import { IconCheck, IconEye, IconX } from "@tabler/icons-react";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useState } from "react";

const mockBookings: any[] = [
  {
    _id: "booking_001",
    id: "booking_001",
    code: "BNM-240001",
    startDate: "2026-03-15T00:00:00.000Z",
    endDate: "2026-03-17T00:00:00.000Z",
    totalAmount: 420000,
    days: 2,
    propertyQuantity: 1,
    personCount: 2,
    status: BOOKING_STATUS.CONFIRMED,
    createdAt: "2026-03-10T09:20:00.000Z",
    property: {
      _id: "property_001",
      name: "Цомцог гэр 4 ортой",
      mainImage: {
        _id: "img_001",
        url: "/camp/img.png",
      },
      location: "Umnugovi, Dalanzadgad",
      rating: 4.8,
    },
  },
  {
    _id: "booking_002",
    id: "booking_002",
    code: "BNM-240002",
    startDate: "2026-04-02T00:00:00.000Z",
    endDate: "2026-04-05T00:00:00.000Z",
    totalAmount: 960000,
    days: 3,
    propertyQuantity: 2,
    personCount: 5,
    status: BOOKING_STATUS.PENDING,
    createdAt: "2026-03-11T13:45:00.000Z",
    property: {
      _id: "property_002",
      name: "Шовгор гэр 2 ортой",
      mainImage: {
        _id: "img_002",
        url: "/camp/img2.png",
      },
      location: "Terelj, Ulaanbaatar",
      rating: 4.6,
    },
  },
  {
    _id: "booking_003",
    id: "booking_003",
    code: "BNM-240003",
    startDate: "2026-05-11T00:00:00.000Z",
    endDate: "2026-05-12T00:00:00.000Z",
    totalAmount: 250000,
    days: 1,
    propertyQuantity: 1,
    personCount: 2,
    status: BOOKING_STATUS.CANCELLED,
    createdAt: "2026-03-08T16:10:00.000Z",
    property: {
      _id: "property_003",
      name: "Шавар байшин",
      mainImage: {
        _id: "img_003",
        url: "/camp/img3.png",
      },
      location: "Uvurkhangai, Kharkhorin",
      rating: 4.4,
    },
  },
  {
    _id: "booking_004",
    id: "booking_004",
    code: "BNM-240004",
    startDate: "2026-06-20T00:00:00.000Z",
    endDate: "2026-06-24T00:00:00.000Z",
    totalAmount: 1450000,
    days: 4,
    propertyQuantity: 2,
    personCount: 4,
    status: BOOKING_STATUS.COMPLETED,
    createdAt: "2026-03-01T11:30:00.000Z",
    property: {
      _id: "property_004",
      name: "Хүвсгүл гэр 2 ортой",
      mainImage: {
        _id: "img_004",
        url: "/camp/img3.png",
      },
      location: "Khuvsgul, Khatgal",
      rating: 4.9,
    },
  },
  {
    _id: "booking_005",
    id: "booking_005",
    code: "BNM-240005",
    startDate: "2026-07-08T00:00:00.000Z",
    endDate: "2026-07-10T00:00:00.000Z",
    totalAmount: 680000,
    days: 2,
    propertyQuantity: 1,
    personCount: 3,
    status: BOOKING_STATUS.CONFIRMED,
    createdAt: "2026-03-12T08:10:00.000Z",
    property: {
      _id: "property_005",
      name: "Орхоны нутаг гэр 2 ортой",
      mainImage: {
        _id: "img_005",
        url: "/camp/img3.png",
      },
      location: "Uvurkhangai, Orkhon Valley",
      rating: 4.7,
    },
  },
];

const mockLoadBookings = async (filters: any) => {
  let rows = [...mockBookings];

  if (filters?.query) {
    const query = String(filters.query).toLowerCase();
    rows = rows.filter(
      (item) =>
        item.code?.toLowerCase().includes(query) ||
        item.property?.name?.toLowerCase().includes(query) ||
        item.property?.location?.toLowerCase().includes(query)
    );
  }

  if (filters?.status) {
    rows = rows.filter((item) => item.status === filters.status);
  }

  if (filters?.startDate) {
    rows = rows.filter(
      (item) => dayjs(item.startDate).isAfter(dayjs(filters.startDate))
    );
  }

  if (filters?.endDate) {
    rows = rows.filter(
      (item) => dayjs(item.endDate).isBefore(dayjs(filters.endDate))
    );
  }

  return {
    rows,
    count: rows.length,
  };
};

export default function BookingsPage() {
  const { translate } = useLanguage();
  const router = useRouter();
  const columns = useHeader({
    onClick: (key, record) => {
      switch (key) {
        case "detail":
          router.push(`/bookings/${record._id}`);
          break;
      }
    },
  });

  const [filters, setFilters] = useState<any>({
    query: "",
    status: "ALL",
    dateRange: null,
  });

  const [debouncedQuery] = useDebouncedValue(filters.query, 300);

  const statusOptions = [
    { value: "ALL", label: translate("all", "ALL") },
    ...Object.values(BOOKING_STATUS).map((status) => ({
      value: status,
      label: statusLabels[status],
    })),
  ];

  return (
    <Container className="py-6">
      <Table
        name="table.bookings.list"
        columns={columns}
        filters={{
          query: debouncedQuery,
          status:
            filters.status !== "ALL" && filters.status !== ""
              ? filters.status
              : undefined,
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
        loadData={mockLoadBookings}
        noDataText={
          <div className="flex flex-col items-center justify-center gap-y-4">
            <div className="text-center">
              {translate("no_data_available", "No data available")}
            </div>
          </div>
        }
      >
        {({ data }) => (
          <div className="mb-2 flex flex-col gap-y-4">
            <div className="flex justify-between items-center">
              <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                  <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                    Захиалгын жагсаалт
                  </h1>
                  <p className="mt-1 text-sm text-slate-500">
                    Нийт захиалгын жагсаалт
                  </p>
                </div>
              </div>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Input
                  size="md"
                  radius="md"
                  variant="bordered"
                  value={filters.query}
                  placeholder="Хайх"
                  className="max-w-full md:max-w-xs"
                  onChange={(e) =>
                    setFilters({ ...filters, query: e.target.value })
                  }
                />
                <DateRangePicker
                  size="md"
                  radius="md"
                  variant="bordered"
                  onChange={(value) =>
                    setFilters({ ...filters, dateRange: value })
                  }
                  className="max-w-full md:max-w-xs"
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
    </Container>
  );
}

const useHeader = ({
  onClick,
}: {
  onClick: (key: string, record: any) => void;
}): ColumnType<any>[] => {
  const { translate, currencyRate } = useLanguage();

  return [
    {
      title: "#",
      name: "name",
      width: 270,
      render: (record, index) => <span>{index}</span>,
    },
    {
      name: "Үйлдэл",
      title: "Үйлдэл",
      render: (record) => (
        <RowAction
          onClick={(key) => onClick(key, record)}
          extra={{
            detail: (
              <button className="p-2 rounded-xl hover:bg-gray-100 bg-gray-100" >
                <IconEye size={20} />
              </button >
            ),
            // cancelled: (
            //   <button className="p-2 rounded-xl hover:bg-gray-100 bg-red-100">
            //     <IconX color="red" size={20} />
            //   </button>
            // ),
            // confirm: (
            //   <button className="p-2 rounded-xl hover:bg-gray-100 bg-green-100">
            //     <IconCheck color="green" size={20} />
            //   </button>
            // ),
          }}
        />
      ),
    },
    {
      title: "Нэр",
      name: "name",
      width: 270,
      render: (record) => {
        return <StaysPreCard payload={record.property} totalAmount={record.totalAmount} />;
      },
    },
    {
      title: "Захиалгын дугаар",
      name: "id",
      render: (record) => (
        <div className="flex flex-col gap-y-1 min-w-36">
          <div className="flex flex-col justify-between md:flex-row">
            <span className="text-sm text-gray-900">{record.code}</span>
          </div>
          <div className="flex flex-col justify-between md:flex-row">
            <span className="text-sm text-gray-900">
              {record.days} Хоног
            </span>

          </div>
        </div>
      ),
    },
    {
      title: "Зочид",
      name: "ger_count",
      render: (record) => (
        <div className="flex flex-col">
          <div className="flex items-center gap-x-2">
            <span className="text-sm text-gray-900">
              {record.personCount} Хүн
            </span>
          </div>
        </div>
      ),
    },
    {
      title: "Төлөв",
      render: (record) => <BookingStatus status={record.status} />,
    },
    {
      title: "Огноо",
      name: "bookedDate",
      render: (record) =>
        <div className="flex flex-row min-w-96 gap-1">
          <div className="flex flex-col gap-1 border border-gray-100 p-2">
            <p className="text-xs text-gray">Орох өдөр</p>
            <p className="text-sm text-gray-900 no-wrap">{formatDateTime(record.startDate)}</p>
          </div>
          <div className="flex flex-col gap-1 border border-gray-100 p-2">
            <p className="text-xs text-gray">Гарах өдөр</p>
            <p>{formatDateTime(record.endDate)}</p>
          </div>
          <div className="flex flex-col gap-1 border border-gray-100 p-2">
            <p className="text-xs text-gray">Захиалсан</p>
            <p>{formatDateTime(record.createdAt)}</p>
          </div>
        </div>
    },
  ];
};