"use client";

import qs from "qs";
import useSWR from "swr";
import React, { useEffect, useImperativeHandle } from "react";
import { Pagination } from "@heroui/react";
import { useLanguage } from "@/providers/language";

export type IListDataRef = { reload: () => void };

type Props = {
  hideEmpty?: boolean;
  renderEmpty?: (isLoading: boolean) => React.ReactNode;
  name: string;
  filters?: { [key: string]: string | number | any };
  onLoaded?: (data: any) => void;
  pagination?: boolean;
  dataSource?: any[];
  loadData?: (filter?: any) => Promise<any>;
  limit?: number;
  onResult?: any;
  type?: any;
  children: ({
    data,
    listLoading,
    page,
    limit,
    currentPage,
    setPage,
    listDataRef,
  }: {
    data: any;
    listLoading: boolean;
    page: number;
    limit: number;
    currentPage: number;
    setPage: React.Dispatch<React.SetStateAction<number>>;
    listDataRef: any;
  }) => React.ReactNode;
};

function ListFn(
  {
    hideEmpty = false,
    renderEmpty,
    name,
    filters = {},
    onLoaded,
    dataSource = [],
    loadData,
    limit: defaultLimit,
    children,
    pagination = false,
    onResult,
    type,
  }: Props,
  ref: React.Ref<IListDataRef>,
) {
  const { translate } = useLanguage();
  const listDataRef = React.useRef<HTMLTableElement>(null);
  const [page, setPage] = React.useState(1);
  const [fallbackData, setFallbackData] = React.useState<{
    count: number;
    rows: any[];
  }>({
    rows: dataSource,
    count: dataSource.length,
  });
  const filterString = qs.stringify(filters);

  const [limit] = React.useState(defaultLimit || 20);

  const { data, mutate, isLoading } = useSWR(
    loadData
      ? `datalist.${name}?.[${page}, ${limit}]?${qs.stringify(filters)}`
      : null,
    async () => {
      const res = await loadData?.({
        page,
        limit: limit || 20,
        ...filters,
      } as any);

      onLoaded?.(res);
      setFallbackData(res);

      return res;
    },
    {
      fallbackData: { count: fallbackData.count, rows: fallbackData.rows },
      revalidateOnFocus: false,
    },
  );

  const currentPage = parseInt(page.toString(), 10);

  useEffect(() => {
    setPage(1);
  }, [filterString]);

  useImperativeHandle(ref, () => ({
    filter() {
      return {
        filter: filters,
        offset: { page, limit },
      };
    },
    reload() {
      return mutate();
    },
  }));

  return (
    <div>
      {children({
        data,
        listLoading: isLoading,
        page,
        limit,
        currentPage,
        setPage,
        listDataRef,
      })}
      {data?.rows?.length > 0 && onResult && onResult(data)}
      {data.rows.length <= 0 &&
        !hideEmpty &&
        (renderEmpty ? (
          renderEmpty(isLoading)
        ) : !isLoading ? (
          <>
            {type !== "banner" &&
              <div className="flex justify-center items-center h-300">
                <span className="text-dimmed text-md text-center">
                  {translate("no_data", "No data")}
                </span>
              </div>
            }
          </>
        ) : null)}
      {pagination && data?.count ? (
        <div className="my-4 flex justify-center">
          {data.count > limit ? (
            <Pagination
              total={Math.ceil(data.count / limit)}
              page={page}
              onChange={setPage}
            />
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

ListFn.displayName = "DataListData";

export const DataListData = React.forwardRef(ListFn);
