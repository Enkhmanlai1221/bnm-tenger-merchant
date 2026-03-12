/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { merchantApi } from "@/apis";
import {
  ITransaction,
  TRANSACTION_TYPE_LABELS,
} from "@/interfaces/transaction";
import { useLanguage } from "@/providers/language";
import { cn } from "@/utils";
import { Input } from "@heroui/react";
import { useState } from "react";
import { DataListData } from "../ui/datalist/list";
import { TransactionCard } from "./transaction-card";
import { useDebouncedValue } from "@/hooks/use-debounced-value";

export function TransactionList() {
  const { translate, currencyRate } = useLanguage();
  const [filter, setFilter] = useState<any>({
    types: [],
    query: "",
    startDate: null,
    endDate: null,
  });

  const [debouncedQuery] = useDebouncedValue(filter.query, 300);

  const allTypes = Object.keys(TRANSACTION_TYPE_LABELS);

  const isAllSelected =
    filter.types.length === allTypes.length &&
    allTypes.every((type) => filter.types.includes(type));

  return (
    <div>
      <DataListData
        pagination
        limit={14}
        loadData={(filter) => merchantApi.transactions(filter)}
        filters={{
          types: filter.types || [],
          query: debouncedQuery || undefined,
          startDate: filter.startDate ?? undefined,
          endDate: filter.endDate ?? undefined,
        }}
        name="swr.merchant.transactions.list"
      >
        {({ data }) => (
          <div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
              <Input
                size="sm"
                label={translate("search_by_code", "Search by code")}
                className="max-w-full md:max-w-64"
                value={filter.query}
                onChange={(e) =>
                  setFilter({ ...filter, query: e.target.value })
                }
              />

              <div className="flex items-center gap-x-2 flex-wrap">
                <button
                  className={cn(
                    "px-3 py-1.5 rounded-full text-sm transition-all duration-200 ease-in-out",
                    isAllSelected
                      ? "bg-primary-100 text-primary-600 font-medium"
                      : "text-gray-600 hover:bg-gray-100"
                  )}
                  onClick={() =>
                    setFilter({
                      ...filter,
                      types: isAllSelected ? [] : allTypes,
                    })
                  }
                >
                  {translate("all", "Бүгд")}
                </button>
                {Object.values(TRANSACTION_TYPE_LABELS).map((item) => (
                  <button
                    key={item.code}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-sm transition-all duration-200 ease-in-out",
                      filter.types.includes(item.code)
                        ? "bg-primary-100 text-primary-600 font-medium"
                        : "text-gray-600 hover:bg-gray-100"
                    )}
                    onClick={() =>
                      setFilter({
                        ...filter,
                        types:
                          filter.types[0] === item.code && filter.types.length === 1
                            ? []
                            : [item.code],
                      })
                    }
                  >
                    {translate(item.nameEng, item.nameEng)}
                  </button>
                ))}
              </div>
            </div>
            <div className="py-4">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  {data.count} {translate("transactions", "transactions")}
                </div>
                <div className="flex items-center gap-x-2 flex-wrap">
                  <div className="flex items-center gap-x-2">
                    <span className="text-xs text-gray-500">
                      {translate("order_amount", "Order Amount")}
                    </span>
                    <span className="text-sm">
                      {currencyRate(data.bookingAmount)}
                    </span>
                  </div>
                  <div className="flex items-center gap-x-2">
                    <span className="text-xs text-gray-500">
                      {translate("refund_amount", "Refund Amount")}
                    </span>
                    <span className="text-sm">
                      {currencyRate(data.refundAmount)}
                    </span>
                  </div>
                  <div className="flex items-center gap-x-2">
                    <span className="text-xs text-gray-500">
                      {translate("fee_amount", "Fee Amount")}
                    </span>
                    <span className="text-sm">
                      {currencyRate(data.feeAmount)}
                    </span>
                  </div>
                  <div className="flex items-center gap-x-2">
                    <span className="text-xs text-gray-500">
                      {translate("profit_amount", "Profit Amount")}
                    </span>
                    <span className="text-sm">
                      {currencyRate(data.profitAmount)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-y-2">
              {data.rows.map((item: ITransaction) => (
                <TransactionCard key={item._id} {...item} />
              ))}
            </div>
          </div>
        )}
      </DataListData>
    </div>
  );
}