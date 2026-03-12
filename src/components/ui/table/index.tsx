"use client";

import { IResult } from "@/interfaces/result";
import { Pagination, Spinner } from "@heroui/react";
import qs from "qs";
import React, { useImperativeHandle, useMemo, useState } from "react";
import useSWR from "swr";
import clsx from "clsx";

export type ColumnType<T> = {
  title?: string;
  name?: string;
  className?: string;
  style?: string;
  render?: (record: T, index: number) => JSX.Element | string | number;
  align?: "left" | "right" | "center";
  width?: string | number;
};

type Props = {
  dataSource?: any[];
  name: string;
  columns: ColumnType<any>[];
  filters?: { [key: string]: string | number | any };
  pagination?: boolean;
  limit?: number;
  noDataText?: React.ReactNode | string;
  loadData?: (filters?: {
    [key: string]: string | number | any;
  }) => Promise<IResult<any>>;
  onResult?: (result: IResult<any>) => void;
  children?: ({
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

export type ITableRef = { reload: () => void };

const getAlignClass = (align?: "left" | "right" | "center") => {
  switch (align) {
    case "center":
      return "text-center";
    case "right":
      return "text-right";
    default:
      return "text-left";
  }
};

const Table = React.forwardRef(
  (
    {
      name,
      columns = [],
      limit: defaultLimit,
      filters,
      loadData,
      onResult,
      pagination = true,
      dataSource = [],
      noDataText = "No data available",
      children,
    }: Props,
    ref: React.Ref<ITableRef>,
  ) => {
    const [page, setPage] = useState(1);
    const [limit] = useState(defaultLimit || 20);

    const initialFallback = useMemo(() => {
      if (dataSource.length > 0) {
        return {
          count: dataSource.length,
          rows: dataSource.slice(
            page === 1 ? 0 : page * limit - limit,
            page * limit,
          ),
        };
      }

      return { count: 0, rows: [] };
    }, [dataSource, limit, page]);

    const [fallback, setFallback] = useState(initialFallback);

    const { data, mutate, isLoading } = useSWR(
      loadData
        ? `table.${name}?.[${page},${limit}]?${qs.stringify(filters)}`
        : null,
      async () => {
        try {
          const res = await loadData!({
            page,
            limit: limit || 20,
            ...filters,
          });

          onResult?.(res);
          setFallback(res);
          return res;
        } catch (error) {
          console.error("Error loading table data:", error);
          return { count: 0, rows: [] };
        }
      },
      {
        fallbackData: fallback,
        revalidateOnFocus: false,
      },
    );

    useImperativeHandle(ref, () => ({
      reload() {
        return mutate();
      },
    }));

    const rows = data?.rows || [];
    const totalCount = data?.count || 0;
    const currentPage = parseInt(page.toString(), 10);

    return (
      <div className="space-y-4">
        <div>
          {children?.({
            data,
            listLoading: isLoading,
            page,
            limit,
            currentPage,
            setPage,
            listDataRef: ref,
          })}
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-0">
              <thead>
                <tr className="bg-slate-50/80">
                  {columns.map((col, index) => (
                    <th
                      key={index}
                      scope="col"
                      className={clsx(
                        "border-b border-slate-200 px-4 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500",
                        getAlignClass(col.align),
                        col.className,
                      )}
                      style={{ width: col.width || "auto" }}
                    >
                      {col.title}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={columns.length} className="px-4 py-14">
                      <div className="flex flex-col items-center justify-center gap-3 text-slate-500">
                        <Spinner size="sm" />
                        <span className="text-sm">Loading data...</span>
                      </div>
                    </td>
                  </tr>
                ) : rows.length > 0 ? (
                  rows.map((row, index) => (
                    <tr
                      key={index}
                      className="group transition-colors hover:bg-slate-50/70"
                    >
                      {columns.map((col, i) => (
                        <td
                          key={i}
                          className={clsx(
                            "border-b border-slate-100 px-4 py-4 align-middle text-sm text-slate-600 last:border-b-0",
                            getAlignClass(col.align),
                            col.className,
                          )}
                        >
                          {col.render
                            ? col.render(row, (page - 1) * limit + index + 1)
                            : row[col?.name!]}
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={columns.length} className="px-4 py-14">
                      <div className="flex flex-col items-center justify-center gap-2 text-center">
                        <div className="text-base font-medium text-slate-700">
                          {typeof noDataText === "string"
                            ? noDataText
                            : "No data available"}
                        </div>
                        {typeof noDataText !== "string" ? noDataText : null}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {pagination && totalCount > limit && (
            <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-100 px-4 py-4 sm:flex-row">
              <div className="text-sm text-slate-500">
                Showing{" "}
                <span className="font-medium text-slate-700">
                  {(page - 1) * limit + 1}
                </span>{" "}
                to{" "}
                <span className="font-medium text-slate-700">
                  {Math.min(page * limit, totalCount)}
                </span>{" "}
                of{" "}
                <span className="font-medium text-slate-700">
                  {totalCount}
                </span>{" "}
                results
              </div>

              <Pagination
                total={Math.ceil(totalCount / limit)}
                page={page}
                onChange={setPage}
                showControls
                size="sm"
                radius="full"
              />
            </div>
          )}
        </div>
      </div>
    );
  },
);

Table.displayName = "Table";

export default Table;