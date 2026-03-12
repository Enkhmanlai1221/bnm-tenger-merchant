"use client";

import { addressApi } from "@/apis";
import { useLanguage } from "@/providers/language";
import { useClickOutside } from "@/utils/outside-click";
import { calculateNights } from "@/utils/time-age";
import { Button, cn, Input } from "@heroui/react";
import {
  IconCalendar,
  IconMapPin,
  IconSearch,
  IconX,
} from "@tabler/icons-react";
import dayjs from "dayjs";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import qs from "qs";
import { useState } from "react";
import * as yup from "yup";
import { DataListData } from "../ui/datalist/list";
import { Form } from "../ui/form";
import { HeroRangeCalendar } from "../ui/widgets/hero-range-calendar";
import GuestPicker from "./guest-picker";
import { IAddress } from "@/interfaces/address";

const formSchema = yup.object().shape({});

export function DesktopSearchBar() {
  const { translate, lang } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchParamsObj = Object.fromEntries(searchParams.entries());
  const [selectedAddress, setSelectedAddress] = useState<IAddress | null>(null);

  const currentPathname =
    pathname === "/stays" || pathname === "/map" ? pathname : "/stays";

  const [isFocused, setIsFocused] = useState<string | null>(null);
  const ref = useClickOutside(() => setIsFocused(null));

  const onSubmit = (values: any) => {
    const urlObj = {
      query: values.query || (selectedAddress ? selectedAddress.name : null),
      startDate: values.startDate || null,
      endDate: values.endDate || null,
      personCount: values.personCount || null,
      level1: values.level1 || (selectedAddress?._id || null),
    };

    const url = qs.stringify(urlObj, { addQueryPrefix: true, skipNulls: true });
    setIsFocused(null);

    router.push(`${currentPathname}${url}`);
  };

  return (
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
      {({ values, setFieldValue, setFieldValues }) => {
        return (
          <div
            ref={ref}
            className={cn(
              "rounded-full shadow-3xl hidden lg:block",
              isFocused ? "bg-zinc-200" : "bg-white",
            )}
          >
            <div className="grid grid-cols-12 items-center gap-4 relative">
              <div className="flex-1 relative col-span-6">
                <Input
                  endContent={
                    (selectedAddress || searchParamsObj.query) && (
                      <div className="flex items-center justify-center h-full">
                        <button
                          type="button"
                          onClick={() => {
                            setIsFocused("where");
                            setSelectedAddress(null);
                            setFieldValues({
                              level1: "",
                              parent: "",
                              query: "",
                            });
                            document.querySelector<HTMLInputElement>("input[name='query']")?.focus();
                          }}
                          className="flex items-center justify-center text-gray-500 hover:text-black cursor-pointer"
                          aria-label={translate("clear_search", "Clear search")}
                        >
                          <IconX size={16} />
                        </button>
                      </div>
                    )}
                  startContent={
                    values.level1 ? (
                      <div className="flex flex-row gap-1 items-center pr-2 h-[11px]">
                        <IconMapPin size={18} />
                        <span className="text-sm truncate">
                          {lang === "mn" ? selectedAddress?.name : selectedAddress?.nameEng}
                        </span>
                      </div>
                    ) : null
                  }
                  value={values.query}
                  onChange={(e) => {
                    setIsFocused("where");
                    setFieldValue("query", e.target.value);
                  }}
                  onFocus={() => setIsFocused("where")}
                  label={translate("where", "Where")}
                  placeholder={translate("search_for_places", "Search for places")}
                  classNames={{
                    label: "text-black/50 text-sm font-semibold",
                    input: [
                      "text-sm/4",
                      "bg-transparent",
                      "placeholder:text-black/50",
                      "h-[15px]",
                    ],
                    inputWrapper: [
                      "group-data-[has-label=true]:items-start",
                      "group-data-[has-label=true]:justify-center",
                      "h-16",
                      "rounded-full",
                      "px-6",
                      "py-[14px]",
                      "shadow-none",
                      "bg-transparent",
                      "group-data-[focus=true]:bg-white",
                      "group-data-[hover=true]:bg-zinc-100",
                      "!cursor-text",
                    ],
                  }}
                />

                {isFocused === "where" && values.query && (
                  <DataListData
                    key={values.parent}
                    limit={6}
                    hideEmpty={false}
                    name="swr.all.addresses.list"
                    loadData={(filters) => addressApi.listWithPage(filters)}
                    filters={{
                      query: values.query,
                    }}
                    type="banner"
                  >
                    {({ data }) => (
                      <div
                        className={cn(
                          "absolute z-50 top-full left-0 mt-2 rounded-2xl shadow-2xl overflow-hidden bg-white",
                          data.count === 0
                            ? "w-96 h-32 flex items-center justify-center"
                            : "min-w-[300px]"
                        )}
                      >
                        {data.count === 0 ? (
                          <div className="flex flex-col items-center justify-center text-zinc-400 text-sm">
                            <IconMapPin size={20} className="mb-1 opacity-60" />
                            {translate("ilerts_oldsonguy", "Not found")}
                          </div>
                        ) : (
                          <div className="flex flex-col divide-y divide-zinc-100 overflow-y-auto">
                            {data?.rows.map((item: IAddress) => (
                              <button
                                key={item._id}
                                onClick={(e) => {
                                  e.preventDefault();
                                  setFieldValues({
                                    level1: item._id,
                                    query: "",
                                  });
                                  setIsFocused("when");
                                  setSelectedAddress(item);
                                }}
                                className={cn(
                                  "flex flex-row gap-3 px-4 py-3 text-left items-center transition-colors hover:bg-zinc-50"
                                )}
                              >
                                <div className="w-6 h-6 flex items-center justify-center rounded-full bg-zinc-100 text-primary-500 shrink-0">
                                  <IconMapPin size={16} stroke={1.4} />
                                </div>
                                <div className="flex flex-col flex-1 min-w-0">
                                  <div className="text-sm font-medium truncate">
                                    {lang === "mn" ? item.name : item.nameEng}
                                  </div>
                                  <div className="text-xs text-zinc-500 truncate">
                                    {item.parent
                                      ? `${lang === "mn" ? item.parent.name : item.parent.nameEng}`
                                      : lang === "mn"
                                        ? "Улс" : translate("country", "Country")}
                                  </div>
                                </div>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </DataListData>
                )}
              </div>
              <div className="flex-none col-span-3">
                <a
                  onClick={() => setIsFocused("when")}
                  className={cn(
                    "flex flex-row rounded-full cursor-pointer h-16 py-6 px-6 justify-between items-center",
                    isFocused === "when" ? "bg-white" : "hover:bg-zinc-100",
                  )}
                >
                  <div className="flex flex-col">
                    <div className="text-black/70 text-xs font-semibold">
                      {translate("when", "When")}
                    </div>
                    <div className="flex flex-row gap-2 items-center text-sm">
                      <div>
                        {values.startDate ? (
                          <span>
                            {dayjs(values.startDate).format("MMM DD")}
                          </span>
                        ) : (
                          <span className="text-black/50 text-sm">
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
                      <button
                        type="button"
                        onClick={() => {
                          setFieldValues({ startDate: "", endDate: "" })
                        }}
                        className="flex items-center justify-center text-gray-500 hover:text-black cursor-pointer"
                        aria-label={translate("clear_search", "Clear search")}
                      >
                        <IconX size={16} />
                      </button>
                    ) : null}
                  </div>
                </a>

                <div
                  className={cn(
                    "absolute z-30 top-full left-1/2 -translate-x-1/2 p-4",
                    isFocused === "when" ? "visible" : "hidden",
                  )}
                >
                  <div className="">
                    <div className="bg-white rounded-4xl shadow-3xl">
                      <div className="p-4 flex flex-col justify-center items-center">
                        <div className="flex flex-row gap-2 items-center justify-between w-full px-2 pb-2">
                          <div className="flex flex-row gap-1 items-center">
                            <IconCalendar size={18} />
                            <div className="text-base">
                              {values.startDate && values.endDate
                                ? `${dayjs(values.startDate).format("MMM DD")} - ${dayjs(values.endDate).format("MMM DD")}`
                                :
                                translate("select_dates", "Select dates")}
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
                        <HeroRangeCalendar
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
              <div className="flex-none col-span-3">
                <div className="relative ">
                  <a
                    onClick={() => setIsFocused("who")}
                    className={cn(
                      "flex flex-row rounded-full cursor-pointer h-16 py-6 px-6 justify-between items-center pr-36",
                      isFocused === "who" ? "bg-white" : "hover:bg-zinc-100",
                    )}
                  >
                    <div className="flex flex-col">
                      <div className="text-black/70 text-xs font-semibold">
                        {translate("who", "Who")}
                      </div>
                      <div className="text-sm">
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
                        <button
                          type="button"
                          onClick={() => {
                            setFieldValues({ personCount: "" })
                          }}
                          className="flex items-center justify-center text-gray-500 hover:text-black cursor-pointer"
                          aria-label={translate("clear_search", "Clear search")}
                        >
                          <IconX size={16} />
                        </button>
                      ) : null}
                    </div>
                  </a>
                  <div className="absolute z-10 right-4 inset-y-0 flex items-center">
                    <Button
                      isIconOnly
                      type="submit"
                      radius="full"
                      className={cn(
                        "bg-primary-500 text-white h-10 flex justify-center items-center",
                        "w-full",
                      )}
                    >
                      <div
                        className={cn(
                          "bg-primary-600 text-white h-full flex pl-4 rounded-full transition-all duration-300",
                        )}
                      >
                        <div className="flex items-center">
                          <div className="flex items-center justify-center">
                            <IconSearch />
                          </div>
                          <span
                            className={cn(
                              "transition-opacity duration-300 hidden lg:block pl-4 pr-6",
                            )}
                          >
                            {translate("search", "Search")}
                          </span>
                        </div>
                      </div>
                    </Button>
                  </div>
                  <div
                    className={cn(
                      "absolute z-50 top-full right-0 w-[calc(100%)] mt-4",
                      isFocused === "who" ? "visible" : "hidden"
                    )}
                  >
                    <div className="w-full mx-auto">
                      <div className="rounded-4xl shadow-3xl border border-gray-200 bg-white overflow-hidden py-1 px-2">
                        <GuestPicker
                          value={parseInt(values.personCount || "1", 10)}
                          onChange={(value) => {
                            setFieldValues({ personCount: value });
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div >
        );
      }}
    </Form >
  );
}