"use client";

import { useEffect, useRef, useState } from "react";
import { Pagination, Table as AntTable } from "antd";
import type { PaginationProps } from "antd";
import type { Dayjs } from "dayjs";
import TableToolbar from "@/components/shared/TableToolbar";
import type { TablePaginationFooterProps, TableProps } from "@/types/table";
import type { FilterField, TableSearch } from "@/types/table-toolbar";

export const TableSummary = AntTable.Summary;

function getPaginationState(
  count: number,
  pageSize: number,
  current: number | undefined,
  page: number,
) {
  const lastPage = Math.max(1, Math.ceil(count / pageSize));
  const activePage = Math.min(current ?? page, lastPage);
  return { activePage, start: (activePage - 1) * pageSize };
}

function getVisibleRows<T>(
  data: T[],
  start: number,
  pageSize: number,
  pagination: boolean,
  total?: number,
) {
  return pagination && total === undefined
    ? data.slice(start, start + pageSize)
    : data;
}

function useTableBodyHeight(autoHeight: boolean) {
  const tableArea = useRef<HTMLDivElement>(null);
  const [bodyHeight, setBodyHeight] = useState(200);

  useEffect(() => {
    if (autoHeight) return;
    const area = tableArea.current;
    if (!area) return;

    function updateHeight() {
      if (!area) return;
      const header = area.querySelector(".ant-table-thead");
      const headerHeight = header?.getBoundingClientRect().height ?? 55;
      setBodyHeight(Math.max(0, area.clientHeight - headerHeight - 8));
    }

    const observer = new ResizeObserver(updateHeight);
    observer.observe(area);
    const header = area.querySelector(".ant-table-thead");
    if (header) observer.observe(header);
    updateHeight();
    return () => observer.disconnect();
  }, [autoHeight]);

  return { tableArea, bodyHeight };
}

function getToolbarSearch(
  search: TableSearch | undefined,
  onFilterChange: (callback: () => void) => void,
) {
  if (!search) return undefined;
  return {
    ...search,
    onChange: (value: string) => onFilterChange(() => search.onChange?.(value)),
  };
}

function getToolbarFilters(
  fields: FilterField[],
  onFilterChange: (callback: () => void) => void,
): FilterField[] {
  return fields.map((field) => {
    if (field.type === "date") {
      return {
        ...field,
        onChange: (value: Dayjs | null) => {
          onFilterChange(() => field.onChange?.(value));
        },
      };
    } else {
      return {
        ...field,
        onChange: (value: string | undefined) => {
          onFilterChange(() => field.onChange?.(value));
        },
      };
    }
  });
}

const renderPaginationItem: NonNullable<PaginationProps["itemRender"]> = (
  _,
  type,
  original,
) => {
  if (type === "prev" || type === "next") {
    return (
      <span className="flex h-11 items-center rounded-md border border-primary px-5 font-semibold text-primary">
        {type === "prev" ? "Previous" : "Next"}
      </span>
    );
  }
  return original;
};

function TablePaginationFooter({
  count,
  start,
  rowCount,
  activePage,
  pageSize,
  onPageChange,
}: TablePaginationFooterProps) {
  return (
    <div className="flex shrink-0 flex-wrap items-center justify-between gap-4 border-t border-border px-5 py-4">
      <p className="text-sm text-gray" aria-live="polite">
        Showing {count === 0 ? 0 : start + 1}–
        {Math.min(start + rowCount, count)} of {count.toLocaleString()}
      </p>
      <Pagination
        current={activePage}
        pageSize={pageSize}
        total={count}
        onChange={onPageChange}
        showSizeChanger={false}
        itemRender={renderPaginationItem}
      />
    </div>
  );
}

export default function Table<T extends object>({
  columns,
  data,
  rowKey = "id",
  pageSize = 10,
  current,
  total,
  loading = false,
  className = "",
  scrollX = "max-content",
  onPageChange,
  search,
  showSearch = true,
  filterFields = [],
  actions = [],
  header: cardHeader,
  beforeTable,
  interactive = true,
  pagination = true,
  autoHeight = false,
  summary,
}: TableProps<T>) {
  const [page, setPage] = useState(1);
  const { tableArea, bodyHeight } = useTableBodyHeight(autoHeight);
  const count = total ?? data.length;
  const { activePage, start } = getPaginationState(
    count,
    pageSize,
    current,
    page,
  );
  const rows = getVisibleRows(data, start, pageSize, pagination, total);
  const hasToolbar = Boolean(
    (showSearch && search) || filterFields.length || actions.length,
  );

  function changePage(nextPage: number) {
    if (!interactive) return;
    setPage(nextPage);
    onPageChange?.(nextPage);
  }

  function onFilterChange(callback: () => void) {
    changePage(1);
    if (interactive) callback();
  }

  return (
    <div className={`flex min-h-0 flex-1 flex-col gap-5 ${className}`}>
      {hasToolbar && (
        <TableToolbar
          showSearch={showSearch}
          search={getToolbarSearch(search, onFilterChange)}
          filterFields={getToolbarFilters(filterFields, onFilterChange)}
          actions={actions}
        />
      )}
      {beforeTable}
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-border bg-background">
        {cardHeader && (
          <div className="shrink-0 border-b border-border p-4">
            {cardHeader}
          </div>
        )}
        <div ref={tableArea} className="min-h-0 flex-1 overflow-hidden">
          <AntTable<T>
            className={cardHeader ? "table-with-header" : undefined}
            columns={columns}
            dataSource={rows}
            rowKey={rowKey}
            loading={loading}
            pagination={false}
            scroll={{ x: scrollX, y: autoHeight ? undefined : bodyHeight }}
            summary={summary}
          />
        </div>
        {pagination && (
          <TablePaginationFooter
            count={count}
            start={start}
            rowCount={rows.length}
            activePage={activePage}
            pageSize={pageSize}
            onPageChange={changePage}
          />
        )}
      </div>
    </div>
  );
}
