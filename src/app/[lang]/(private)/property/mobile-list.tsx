import { PropertyStatus } from "@/components/stays/stay-status";
import { MOCK_PROPERTIES } from "@/data/mock";
import { DataListData } from "@/components/ui/datalist/list";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { IProperty, PROPERTY_STATUS } from "@/interfaces/property";
import { useLanguage } from "@/providers/language";
import { Button, Input, Modal, ModalBody, ModalContent, ModalHeader, Select, SelectItem } from "@heroui/react";
import { IconCalendar, IconEdit, IconHeart, IconHome, IconMapPin, IconStarFilled, IconX } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ListingsMobileCalendar } from "./mobile-calendar";

export function PropertyMobileList() {
  const { translate, currencyRate } = useLanguage();
  const router = useRouter();
  const [action, setAction] = useState<[boolean, IProperty] | []>([]);
  const [initValue, setInitValue] = useState<IProperty | null>(null);

  const [filters, setFilters] = useState<any>({
    query: "",
    statuses: "",
    isActive: "",
    isAdminActive: "",
  });

  const [debouncedQuery] = useDebouncedValue(filters.query, 300);

  const onClick = (key: string, record: IProperty) => {
    switch (key) {
      case "detail":
        router.push(`/listings/${record?._id}`);
        break;
      case "calendar":
        setInitValue(record);
        setAction([true, record]);
        break;
    }
  }

  return (
    <>
      <DataListData
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
        name="swr.merchant.mobile.listings"
      >
        {({ data }) => (
          <div className="flex flex-col gap-y-2 my-8 pb-[34px]">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <h3 className="font-semibold text-xl">
                Гэр жагсаалт ({data.count})
              </h3>
              <Button
                as={Link}
                href="/listings/create"
                color="primary"
                variant="solid"
                className="w-full sm:w-auto"
              >
                Гэр нэмэх
              </Button>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Input
                size="sm"
                placeholder="Хайх"
                className="w-full md:max-w-64"
                value={filters.query}
                onChange={(e) =>
                  setFilters({ ...filters, query: e.target.value })
                }
              />
            </div>

            <div className="flex flex-col gap-y-2">
              {data.rows.map((i: IProperty) => (
                <div className="flex gap-3 border rounded-xl overflow-hidden bg-white shadow-sm h-28 cursor-pointer hover:bg-gray-50 transition relative" key={i._id}>
                  <div className="w-28 h-full relative flex-none">
                    <Image
                      src={i?.mainImage?.url}
                      alt={i?.mainImage?.url}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>

                  <div className="flex flex-col justify-between py-2 pr-3 flex-1 w-full">
                    <div className="flex justify-between items-center">
                      <div className="text-sm font-semibold text-gray-900 line-clamp-1">{i?.name || "-"}</div>
                      <div className="text-xs text-gray-500 whitespace-nowrap">
                        <PropertyStatus status={i.status} />
                      </div>
                    </div>

                    <div className="flex flex-col text-[11px] text-gray-600 gap-1 leading-tight">
                      <div className="flex items-center gap-1 text-gray-500">
                        <IconMapPin size={12} className="min-w-[12px]" />
                        <span className="truncate max-w-64">
                          {i?.level1?.name}, {i?.level2?.name}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex gap-3 items-center text-gray-500">
                          <div className="flex items-center gap-1 min-w-[20px]">
                            <IconHome size={12} />
                            <span>{i.quantity || 0}</span>
                          </div>
                          <div className="flex items-center gap-1 min-w-[20px]">
                            <IconHeart size={12} />
                            <span>{i.savesCount || 0}</span>
                          </div>
                          <div className="flex items-center gap-1 min-w-[20px]">
                            <IconStarFilled size={12} />
                            <span>{i.avgRate || 0}</span>
                            <span className="text-[10px] text-gray-400">({i.totalRates || 0})</span>
                          </div>
                        </div>
                        <div className="font-semibold text-primary text-xs">
                          {currencyRate(i.price)}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 items-end text-[11px] text-gray-500">
                      <button
                        onClick={() => router.push(`/listings/${i._id}`)}
                        className="flex-1 flex items-center justify-center gap-1 rounded-md border px-2 py-1 hover:bg-gray-100 dark:hover:bg-zinc-700"
                      >
                        <IconEdit size={16} />
                        Засах
                      </button>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </DataListData>

      <Modal isOpen={action[0]} size="full" hideCloseButton>
        <ModalContent>
          {() =>
            initValue && (
              <>
                <ModalHeader className="relative px-4 pt-4 pb-2 border-b border-gray-100">
                  <button
                    onClick={() => setAction([])}
                    aria-label="Хаах"
                    className="absolute right-4 top-4 p-1 rounded hover:bg-gray-100 transition"
                  >
                    <IconX size={16} className="text-gray-500" />
                  </button>
                  <div className="space-y-1 pr-10">
                    <h3 className="text-base font-semibold text-gray-900">
                      {translate("price_control", "Price control")}
                    </h3>
                    <p className="text-xs text-gray-500 font-normal">
                      <span className="inline-block bg-blue-50 text-primary font-normal px-2 py-0.5 rounded">
                        {initValue?.name}
                      </span>{' '}
                      {translate("ger_information_view", "Viewing property information")}.
                    </p>
                  </div>
                </ModalHeader>
                <ModalBody>
                  <ListingsMobileCalendar _id={initValue._id} onSuccess={() => setAction([])} />
                </ModalBody>
              </>
            )
          }
        </ModalContent>
      </Modal >
    </>
  );
}
