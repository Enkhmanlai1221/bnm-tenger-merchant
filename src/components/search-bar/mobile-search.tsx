"use client";

import { addressApi } from "@/apis";
import { useLanguage } from "@/providers/language";
import { calculateNights } from "@/utils/time-age";
import {
  Badge,
  Button,
  cn,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/react";
import {
  IconAdjustmentsHorizontal,
  IconCalendar,
  IconChevronLeft,
  IconMapPin,
  IconSearch,
  IconX,
} from "@tabler/icons-react";
import dayjs from "dayjs";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import qs from "qs";
import { useState } from "react";
import * as yup from "yup";
import { FilterForm } from "../filter/filter-form";
import { DataListData } from "../ui/datalist/list";
import { Form } from "../ui/form";
import { HeroRangeCalendar } from "../ui/widgets/hero-range-calendar";
import GuestPicker from "./guest-picker";
import { getPathnameWithoutLocale } from "@/utils";
import { IAddress } from "@/interfaces/address";

const formSchema = yup.object().shape({});

export function MobileSearchBar() {
  const { translate, lang } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();
  const pathnameWithoutLocale = getPathnameWithoutLocale(pathname);
  const searchParams = useSearchParams();
  const searchParamsObj = Object.fromEntries(searchParams.entries());
  const [selectedAddress, setSelectedAddress] = useState<IAddress | null>(null);

  const dates =
    searchParamsObj.startDate && searchParamsObj.endDate
      ? `${dayjs(searchParamsObj.startDate).format("MMM DD")} - ${dayjs(
        searchParamsObj.endDate,
      ).format("MMM DD")}`
      : null;

  const filterKeys = Object.keys(searchParamsObj).filter(
    (key) =>
      !["level1", "query", "startDate", "endDate", "personCount"].includes(key),
  );

  const searchFilterKeys = Object.keys(searchParamsObj).filter((key) =>
    ["level1", "query", "startDate", "endDate", "personCount"].includes(key),
  );

  const isStaysPage = pathnameWithoutLocale === "/stays";
  const currentPathname =
    pathname === "/stays" || pathname === "/map" ? pathname : "/stays";

  const [isFocused, setIsFocused] = useState<string | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isFilterOpen,
    onOpen: onFilterOpen,
    onClose: onFilterClose,
  } = useDisclosure();

  const onSubmit = (values: any) => {
    const urlObj = {
      // query: values.query || null,
      query: values.query || (selectedAddress ? selectedAddress.name : null),
      startDate: values.startDate || null,
      endDate: values.endDate || null,
      personCount: values.personCount || null,
      level1: values.level1 || null,
    };

    const url = qs.stringify(urlObj, {
      addQueryPrefix: true,
      skipNulls: true,
    });

    setIsFocused(null);
    onClose();
    router.push(`${currentPathname}${url}`);
  };

  return (
    <>
      <Form
        initialValues={{
          query: searchParamsObj.query || "",
          startDate: searchParamsObj.startDate || "",
          endDate: searchParamsObj.endDate || "",
          personCount: searchParamsObj.personCount || "",
          level1: searchParamsObj.level1 || "",
        }}
        onSubmit={onSubmit}
        validationSchema={formSchema}
      >
        {({ values, setFieldValue, setFieldValues, handleSubmit }) => {
          return (
            <>
              <div className="flex justify-center items-center gap-2 px-4">
                {searchParams.size > 0 || isStaysPage ? (
                  <>
                    <Button
                      isIconOnly
                      variant="light"
                      onPress={() => {
                        router.push("/");
                        setFieldValues({
                          query: "",
                          startDate: "",
                          endDate: "",
                          personCount: "",
                        });
                      }}
                    >
                      <IconChevronLeft size={32} stroke={1} />
                    </Button>
                    <button
                      type="button"
                      onClick={onOpen}
                      className="rounded-full px-4 py-2 w-full text-md font-semibold min-h-14"
                      style={{
                        boxShadow: "0 6px 20px 0 rgba(0, 0, 0, 0.1)",
                        border: "0.5px solid rgba(0, 0, 0, 0.08)",
                      }}
                    >
                      <div className="flex flex-col items-center justify-center">
                        {isStaysPage && searchFilterKeys.length === 0 ? (
                          <div className="flex flex-row gap-2 items-center justify-center">
                            <IconSearch size={18} />
                            {translate(
                              "start_your_search",
                              "Start your search",
                            )}
                          </div>
                        ) : null}
                        {(searchParams.get("level1") ||
                          searchParams.get("query")) && (
                            <div className="flex flex-row gap-1 items-center">
                              {searchParams.get("level1") ? (
                                <span className="text-sm text-black/70">
                                  {/* {
                                    addressList?.[
                                    searchParams.get("level1") || ""
                                    ]
                                  } */}
                                  {selectedAddress
                                    ? lang === "mn"
                                      ? selectedAddress.name
                                      : selectedAddress.nameEng : ""}
                                </span>
                              ) : null}
                              {searchParams.get("query") && (
                                <span className="text-base/4 text-black/70 truncate max-w-[260px]">
                                  {searchParams.get("query")}
                                </span>
                              )}
                            </div>
                          )}
                        <div className="space-x-1">
                          {dates && (
                            <span className="text-xs text-black/50">
                              {dates}
                            </span>
                          )}
                          {searchParams.get("personCount") && (
                            <span className="text-xs text-black/50">
                              {searchParams.get("personCount")} {translate("lower_case_guest", "guest")}
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                    <Badge
                      color="danger"
                      content={filterKeys.length}
                      shape="circle"
                      isInvisible={filterKeys.length === 0}
                    >
                      <Button variant="light" isIconOnly onPress={onFilterOpen}>
                        <IconAdjustmentsHorizontal size={32} stroke={1} />
                      </Button>
                    </Badge>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={onOpen}
                    className="rounded-full px-4 py-4 w-full text-md font-semibold"
                    style={{
                      boxShadow: "0 6px 20px 0 rgba(0, 0, 0, 0.1)",
                      border: "0.5px solid rgba(0, 0, 0, 0.08)",
                    }}
                  >
                    <div className="flex flex-row gap-2 items-center justify-center">
                      <IconSearch size={18} />
                      {translate("start_your_search", "Start your search")}
                    </div>
                  </button>
                )}
              </div>

              <Modal
                key={searchParams.toString()}
                scrollBehavior="outside"
                hideCloseButton
                isOpen={isOpen}
                onClose={onClose}
                size="full"
                motionProps={{
                  variants: {
                    enter: {
                      y: 0,
                      opacity: 1,
                      transition: {
                        duration: 0.3,
                        ease: "easeOut",
                      },
                    },
                    exit: {
                      y: -20,
                      opacity: 0,
                      transition: {
                        duration: 0.2,
                        ease: "easeIn",
                      },
                    },
                  },
                }}
                shouldBlockScroll={false}
                classNames={{
                  wrapper: "items-start h-auto bg-zinc-100",
                  base: "bg-transparent shadow-none my-0",
                }}
              >
                <ModalContent>
                  {(onClose) => (
                    <>
                      <ModalHeader>
                        <div className="flex flex-row gap-2 items-center justify-between w-full">
                          <span className="text-xl font-semibold">
                            {translate(
                              "search_for_places",
                              "Search for places",
                            )}
                          </span>
                          <Button isIconOnly variant="light" onPress={onClose}>
                            <IconX />
                          </Button>
                        </div>
                      </ModalHeader>
                      <ModalBody>
                        <div className="space-y-6">
                          <div
                            className="flex-1 relative col-span-6"
                            onClick={(e) => e.preventDefault()}
                          >
                            <Input
                              endContent={
                                values.level1 || values.query ? (
                                  <Button
                                    isIconOnly
                                    variant="light"
                                    type="button"
                                    onPress={() =>
                                      setFieldValues({
                                        level1: null,
                                        query: "",
                                      })
                                    }
                                  >
                                    <IconX />
                                  </Button>
                                ) : null
                              }
                              value={
                                selectedAddress
                                  ? lang === "mn"
                                    ? selectedAddress.name
                                    : selectedAddress.nameEng
                                  : values.query || ""
                              }
                              onChange={(e) => {
                                setIsFocused("where");
                                setFieldValue("query", e.target.value);
                              }}
                              onFocus={(e) => {
                                e.preventDefault();
                                setIsFocused("where");
                              }}
                              label={translate("where", "Where")}
                              placeholder={translate(
                                "search_for_places",
                                "Search for places",
                              )}
                              classNames={{
                                label: "text-lg font-semibold",
                                input: [
                                  "bg-white",
                                  "placeholder:text-black/50",
                                ],
                                inputWrapper: [
                                  "shadow-3xl",
                                  "h-20",
                                  "rounded-full",
                                  "px-8",
                                  "py-4",
                                  "shadow-none",
                                  "bg-white",
                                  "group-data-[focus=true]:bg-white",
                                  "group-data-[hover=true]:bg-zinc-100",
                                  "!cursor-text",
                                ],
                              }}
                            />
                            {isFocused === "where" && values.query && (
                              <DataListData
                                limit={6}
                                hideEmpty
                                name="swr.level12.list"
                                loadData={(filters) =>
                                  addressApi.listWithPage(filters)
                                }
                                filters={{
                                  query: values.query,
                                }}
                              >
                                {({ data }) =>
                                (
                                  <div className={cn("bg-white rounded-4xl shadow-3xl mt-4 p-4")}>
                                    <div className="grid grid-cols-1 gap-2">
                                      {data.count === 0 ? (
                                        <div className="flex flex-col items-center justify-center text-zinc-400 text-sm">
                                          <IconMapPin size={20} className="mb-1 opacity-60" />
                                          {translate("ilerts_oldsonguy", "Not found")}
                                        </div>
                                      ) :
                                        data?.rows.map((item: any) => (
                                          <button
                                            onClick={(e) => {
                                              e.preventDefault();
                                              setFieldValues({
                                                level1: item._id,
                                                query: "",
                                              });
                                              setIsFocused("when");
                                              setSelectedAddress(item);
                                            }}
                                            key={item._id}
                                            className={cn("flex flex-row gap-2 p-2 rounded-lg cursor-pointer w-full")}
                                          >
                                            <div className="flex-none">
                                              <IconMapPin size={16} stroke={1} />
                                            </div>
                                            <div className="flex flex-col flex-1">
                                              <div className="flex-1 text-left text-xs">
                                                {lang === "mn" ? item.name : item.nameEng}
                                              </div>
                                              <div className={cn("text-left text-xs text-black/50")}>
                                                {item.parent
                                                  ? `${lang === "mn" ? item.parent.name : item.parent.nameEng}`
                                                  : lang === "mn"
                                                    ? "Улс" : translate("country", "Country")}
                                              </div>
                                            </div>
                                          </button>
                                        ))}
                                    </div>
                                  </div>
                                )
                                }
                              </DataListData>
                            )}
                          </div>
                          <div className="">
                            <a
                              onClick={(e) => {
                                e.preventDefault();
                                setIsFocused("when");
                              }}
                              className={cn(
                                "flex flex-row rounded-full cursor-pointer h-20 py-4 px-8 justify-between items-center bg-white",
                              )}
                            >
                              <div className="flex flex-col h-full justify-center">
                                <div className="text-black/70 text-md/[1px] font-semibold">
                                  {translate("when", "When")}
                                </div>
                                <div className="flex flex-row gap-2 items-center">
                                  <div>
                                    {values.startDate ? (
                                      <span>
                                        {dayjs(values.startDate).format(
                                          "MMM DD",
                                        )}
                                      </span>
                                    ) : (
                                      <span className="text-black/50">
                                        {translate("add_dates", "Add dates")}
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-black/50">-</div>
                                  <div>
                                    {values.endDate ? (
                                      <span>
                                        {dayjs(values.endDate).format("MMM DD")}
                                      </span>
                                    ) : (
                                      <span className="text-black/50">
                                        {translate("add_dates", "Add dates")}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div>
                                {values.startDate || values.endDate ? (
                                  <Button
                                    isIconOnly
                                    variant="light"
                                    type="button"
                                    onPress={() =>
                                      setFieldValues({
                                        startDate: "",
                                        endDate: "",
                                      })
                                    }
                                  >
                                    <IconX />
                                  </Button>
                                ) : null}
                              </div>
                            </a>

                            <div
                              className={cn(
                                "w-full",
                                isFocused === "when" ? "visible" : "hidden",
                              )}
                            >
                              <div className="mt-4">
                                <div className="bg-white rounded-4xl shadow-3xl">
                                  <div className="flex flex-col justify-center items-center">
                                    <div className="flex flex-row gap-2 items-center justify-between w-full px-8 pt-4">
                                      <div className="flex flex-row gap-1 items-center">
                                        <IconCalendar size={18} />
                                        <div className="text-base">
                                          {values.startDate && values.endDate
                                            ? `${dayjs(values.startDate).format("MMM DD")} - ${dayjs(values.endDate).format("MMM DD")}`
                                            : translate(
                                              "select_dates",
                                              "Select dates",
                                            )
                                          }
                                        </div>
                                      </div>
                                      <div>
                                        {values.startDate && values.endDate ? (
                                          <div className="flex flex-row gap-1 items-center">
                                            <span className="text-base font-semibold">
                                              {calculateNights(
                                                values.startDate,
                                                values.endDate,
                                              )}
                                            </span>
                                            {translate("nights", "nights")}
                                          </div>
                                        ) : (
                                          ""
                                        )}
                                      </div>
                                    </div>
                                    <div className="pb-6">
                                      <HeroRangeCalendar
                                        visibleMonths={1}
                                        value={{
                                          start: values.startDate,
                                          end: values.endDate,
                                        }}
                                        onChange={(value) => {
                                          setFieldValues({
                                            endDate: value.end
                                              ? dayjs(value.end).toISOString()
                                              : "",
                                            startDate: value.start
                                              ? dayjs(value.start).toISOString()
                                              : "",
                                          });
                                        }}
                                        focused={() => {
                                          setIsFocused("who");
                                        }}
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="">
                            <div className="relative">
                              <a
                                onClick={() => setIsFocused("who")}
                                className={cn(
                                  "flex flex-row rounded-full cursor-pointer h-20 py-6 px-8 justify-between items-center bg-white",
                                )}
                              >
                                <div className="flex flex-col h-full justify-center">
                                  <div className="text-black/70 font-semibold">
                                    {translate("who", "Who")}
                                  </div>
                                  <div className="">
                                    {values.personCount ? (
                                      <span className="">
                                        {values.personCount} {translate("lower_case_guest", "guest")}
                                      </span>
                                    ) : (
                                      <span className="text-black/50">
                                        {translate("add_guests", "Add guests")}
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <div>
                                  {values.personCount ? (
                                    <Button
                                      isIconOnly
                                      variant="light"
                                      type="button"
                                      onPress={() =>
                                        setFieldValues({ personCount: "" })
                                      }
                                    >
                                      <IconX />
                                    </Button>
                                  ) : null}
                                </div>
                              </a>
                              <div
                                className={cn(
                                  "mt-4",
                                  isFocused === "who" ? "visible" : "hidden",
                                )}
                              >
                                <div className="w-full mx-auto">
                                  <div className="bg-white rounded-4xl shadow-3xl py-2 px-4">
                                    <GuestPicker
                                      value={parseInt(
                                        values.personCount || "1",
                                        10,
                                      )}
                                      onChange={(value) => {
                                        setFieldValues({
                                          personCount: value,
                                        });
                                      }}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </ModalBody>
                      <ModalFooter className="border-t border-zinc-200 bg-white">
                        <div className="flex flex-row gap-2 justify-between w-full">
                          <Button
                            variant="light"
                            onPress={() => {
                              setFieldValues({
                                query: "",
                                startDate: "",
                                endDate: "",
                                personCount: "",
                                level1: "",
                              });
                              setIsFocused(null);
                              onClose();
                              router.push(
                                `${currentPathname}${qs.stringify(
                                  {
                                    ...searchParamsObj,
                                    query: null,
                                    startDate: null,
                                    endDate: null,
                                    personCount: null,
                                    level1: null,
                                  },
                                  { addQueryPrefix: true, skipNulls: true },
                                )}`,
                              );
                            }}
                            size="lg"
                          >
                            {translate("clear_all", "Clear filter")}
                          </Button>
                          <Button
                            color="primary"
                            size="lg"
                            startContent={<IconSearch size={20} stroke={1.5} />}
                            onPress={() => {
                              handleSubmit();
                            }}
                          >
                            {translate("search", "Search")}
                          </Button>
                        </div>
                      </ModalFooter>
                    </>
                  )}
                </ModalContent>
              </Modal>
            </>
          );
        }}
      </Form>
      <Modal isOpen={isFilterOpen} onClose={onFilterClose} size="3xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 border-b border-gray-200">
                {translate("filters", "Filters")}
              </ModalHeader>
              <ModalBody>
                <FilterForm onClose={onClose} onChange={onClose} />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
