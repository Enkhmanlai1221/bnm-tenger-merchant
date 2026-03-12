import { StaysPreCard } from "@/components/stays/stays-pre-card";
import Table, { ColumnType } from "@/components/ui/table";
import { RowAction } from "@/components/ui/table/row-action";
import { MOCK_PROPERTIES } from "@/data/mock";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { IProperty, PROPERTY_STATUS } from "@/interfaces/property";
import { useLanguage } from "@/providers/language";
import { cn } from "@/utils";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  useDisclosure,
} from "@heroui/react";
import {
  IconBed,
  IconEdit,
  IconHeart
} from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import PriceDateView from "../listings/[id]/price-date-view";

export default function PropertyList() {
  const router = useRouter();
  const { translate } = useLanguage();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [initValue, setInitValue] = useState<IProperty | null>(null);

  const columns = useHeader({
    onClick: (key: string, record: IProperty) => {
      switch (key) {
        case "detail":
          router.push(`/listings/${record?._id}`);
          break;
        case "calendar":
          setInitValue(record);
          onOpen();
          break;
      }
    },
  });

  const [filters, setFilters] = useState<any>({
    query: "",
    statuses: "",
    isActive: "",
    isAdminActive: "",
  });

  const [debouncedQuery] = useDebouncedValue(filters.query, 300);

  return (
    <div className="pt-8 pb-16">
      <Table
        name="swr.merchant.listings"
        columns={columns}
        filters={{
          query: debouncedQuery,
          statuses: filters?.statuses
            .split(",")
            .filter((status: string) => status !== ""),
          isActive:
            filters?.isActive !== ""
              ? filters?.isActive === "active"
                ? true
                : false
              : undefined,
          isAdminActive:
            filters?.isAdminActive !== ""
              ? filters?.isAdminActive === "active"
                ? true
                : false
              : undefined,
        }}
        dataSource={MOCK_PROPERTIES}
        noDataText={
          <div className="flex flex-col items-center justify-center gap-y-4">
            <div className="text-center">
              {translate("no_data_available", "No data available")}
            </div>
            <Button
              as={Link}
              href="/listings/create"
              color="primary"
              variant="solid"
            >
              {translate("create_listing", "Create Listing")}
            </Button>
          </div>
        }
      >
        {({ data }) => (
          <div className="flex flex-col gap-y-4 mb-2">
            <div className="flex justify-between items-center">
              <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                  <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                    Гэрийн жагсаалт
                  </h1>
                  <p className="mt-1 text-sm text-slate-500">
                    Үйлчлүүлэгч нарт хүрэх гэр болон буюу бүтээгдэхүүнүүдийн жагсаалт
                  </p>
                </div>
              </div>
              <Button
                as={Link}
                href="/listings/create"
                color="primary"
                variant="solid"
              >
                Гэр нэмэх
              </Button>
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Input
                  size="md"
                  radius="lg"
                  variant="bordered"
                  placeholder={"Хайх"}
                  className="max-w-full md:max-w-64"
                  value={filters.query}
                  onChange={(e) =>
                    setFilters({ ...filters, query: e.target.value })
                  }
                />
                <Select
                  size="md"
                  radius="lg"
                  variant="bordered"
                  placeholder={"Төлөв"}
                  selectionMode="multiple"
                  className="max-w-full md:max-w-64"
                  value={filters.statuses}
                  onChange={(e) =>
                    setFilters({ ...filters, statuses: e.target.value })
                  }
                >
                  {Object.values(PROPERTY_STATUS).map((status) => (
                    <SelectItem key={status} value={status}>
                      {translate(`${status}`.toLowerCase(), status)}
                    </SelectItem>
                  ))}
                </Select>

                <Select
                  size="md"
                  radius="lg"
                  variant="bordered"
                  placeholder={"Идэвхитэй эсэх"}
                  className="max-w-full md:max-w-64"
                  value={filters.isActive}
                  onChange={(e) =>
                    setFilters({ ...filters, isActive: e.target.value })
                  }
                >
                  <SelectItem key="active">
                    Идэвхитэй
                  </SelectItem>
                  <SelectItem key="inactive">
                    Идэвхигүй
                  </SelectItem>
                </Select>

                <Select
                  size="md"
                  radius="lg"
                  variant="bordered"
                  placeholder={"Цэврэлгээ хийгдсэн эсэх"}
                  className="max-w-full md:max-w-64"
                  value={filters.isAdminActive}
                  onChange={(e) =>
                    setFilters({ ...filters, isAdminActive: e.target.value })
                  }
                >
                  <SelectItem key="active">
                    Хийгдсэн
                  </SelectItem>
                  <SelectItem key="inactive">
                    Хийгдээгүй
                  </SelectItem>
                </Select>
              </div>
            </div>
          </div>
        )}
      </Table>

      <Modal isOpen={isOpen} onClose={onClose} size="full">
        <ModalContent>
          {(onClose) =>
            initValue && (
              <>
                <ModalHeader>
                  Үнэний үнэлгээ
                </ModalHeader>
                <ModalBody>
                  <PriceDateView propertyId={initValue._id} />
                </ModalBody>
                <ModalFooter>
                  <Button color="primary" onPress={onClose}>
                    Хаах
                  </Button>
                </ModalFooter>
              </>
            )
          }
        </ModalContent>
      </Modal>
    </div>
  );
}

const useHeader = ({
  onClick,
}: {
  onClick: (key: string, record: IProperty) => void;
}): ColumnType<IProperty>[] => {
  const { translate, currencyRate } = useLanguage();
  return [
    {
      name: "name",
      title: "Нэр",
      render: (record) => {
        return <StaysPreCard payload={record} totalAmount={record.price} />;
      },
    },
    {
      name: "price",
      width: "100px",
      title: "Үнэ",
      render: (record) => (
        <span className="text-md text-black">{currencyRate(record.price)}</span>
      ),
    },
    {
      title: "",
      name: "ger_count",
      render: (record) => (
        <div className="flex flex-col">
          <div className="flex items-center gap-x-2">
            <IconBed size={22} stroke={2} />
            <span className="text-md font-semibold text-gray-900">
              {record.quantity}
            </span>
          </div>
          <div className="flex items-center gap-x-2">
            <IconHeart size={22} stroke={2} />
            <span className="text-md font-semibold text-gray-900">
              {record.savesCount}
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
            {/* {translate("merchant_side", "Merchant")} */}
            Захиалга
            <span
              className={cn(
                "text-sm font-semibold text-gray-900",
                record.isActive ? "text-green-500" : "text-red-500",
              )}
            >
              {/* {record.isActive
                ? translate("active", "Active")
                : translate("inactive", "Inactive")} */}
              {record.isActive ? "Байгаа" : "Байхгүй"}
            </span>
          </div>
          <div className="flex items-center gap-x-2">
            {/* {translate("system_side", "System")} */}
            Цэврэлгээ
            <span
              className={cn(
                "text-sm font-semibold text-gray-900",
                record.isAdminActive ? "text-green-500" : "text-red-500",
              )}
            >
              {/* {record.isAdminActive
                ? translate("active", "Active")
                : translate("inactive", "Inactive")} */}
              {record.isAdminActive ? "Хийгдсэн" : "Хийгдээгүй"}
            </span>
          </div>
        </div>
      ),
    },
    // {
    //   name: "status",
    //   width: "120px",
    //   title: translate("status", "Status"),
    //   render: (record) => <PropertyStatus status={record.status} />,
    // },
    {
      name: "bookedDate",
      width: "100px",
      title: "Үйлдэл",
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
