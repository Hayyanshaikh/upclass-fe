"use client";

import { useEffect, useRef, useState } from "react";
import { Pagination, Table as AntTable } from "antd";
import type { PaginationProps } from "antd";
import type { Dayjs } from "dayjs";
import Button from "@/components/ui/Button";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import TableToolbar from "@/components/shared/TableToolbar";
import type { TablePaginationFooterProps, TableProps } from "@/types/table";

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

function useTableBodyHeight(autoHeight: boolean, rowCount: number) {
  const tableArea = useRef<HTMLDivElement>(null);
  const [bodyHeight, setBodyHeight] = useState(200);
  const [needsVerticalScroll, setNeedsVerticalScroll] = useState(false);

  useEffect(() => {
    if (autoHeight) return;
    const area = tableArea.current;
    if (!area) return;

    function updateHeight() {
      if (!area) return;
      const header = area.querySelector(".ant-table-thead");
      const headerHeight = header?.getBoundingClientRect().height ?? 55;
      const availableHeight = Math.max(0, area.clientHeight - headerHeight - 8);
      const contentHeight =
        area.querySelector(".ant-table-tbody")?.getBoundingClientRect()
          .height ?? 0;
      setBodyHeight(availableHeight);
      setNeedsVerticalScroll(contentHeight > availableHeight + 1);
    }

    const observer = new ResizeObserver(updateHeight);
    observer.observe(area);
    for (const selector of [".ant-table-thead", ".ant-table-tbody"]) {
      const element = area.querySelector(selector);
      if (element) observer.observe(element);
    }
    updateHeight();
    return () => observer.disconnect();
  }, [autoHeight, rowCount, needsVerticalScroll]);

  return { tableArea, bodyHeight, needsVerticalScroll };
}

const renderPaginationItem: NonNullable<PaginationProps["itemRender"]> = (
  _,
  type,
  original,
) => {
  if (type === "prev" || type === "next") {
    return (
      <Button
        variant="secondary"
        className="h-11 gap-2 border-primary px-3! font-semibold text-primary"
      >
        {type === "prev" ? (
          <>
            <LuChevronLeft size={20} aria-hidden="true" />
          </>
        ) : (
          <>
            <LuChevronRight size={20} aria-hidden="true" />
          </>
        )}
      </Button>
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

export default function Table<
  T extends object,
  TFilters extends object = Record<string, unknown>,
>({
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
  searchValue,
  showSearch = true,
  filterFields = [],
  filterValues,
  onFilterValuesChange,
  actions = [],
  header: cardHeader,
  beforeTable,
  interactive = true,
  pagination = true,
  autoHeight = false,
  summary,
}: TableProps<T, TFilters>) {
  const [page, setPage] = useState(1);
  const count = total ?? data.length;
  const { activePage, start } = getPaginationState(
    count,
    pageSize,
    current,
    page,
  );
  const rows = getVisibleRows(data, start, pageSize, pagination, total);
  const { tableArea, bodyHeight, needsVerticalScroll } = useTableBodyHeight(
    autoHeight,
    rows.length,
  );
  const visibleActions = actions.filter(
    (action) => action.showButton !== false,
  );
  const hasToolbar = Boolean(
    (showSearch && search) || filterFields.length || visibleActions.length,
  );

  function changePage(nextPage: number) {
    if (!interactive) return;
    if (current === undefined) setPage(nextPage);
    onPageChange?.(nextPage);
  }

  function handleToolbarValuesChange(changedValues: Record<string, unknown>) {
    if (!interactive) return;
    changePage(1);
    if ("search" in changedValues) {
      search?.onChange?.(String(changedValues.search ?? ""));
    }

    const filterChanges = Object.fromEntries(
      Object.entries(changedValues).filter(([name]) => name !== "search"),
    );
    if (Object.keys(filterChanges).length === 0) return;

    onFilterValuesChange?.(filterChanges as Partial<TFilters>);
    for (const [name, value] of Object.entries(filterChanges)) {
      const field = filterFields.find((item) => item.name === name);
      if (field?.type === "date") {
        field.onChange?.(value as Dayjs | null);
      } else {
        field?.onChange?.(value as string | undefined);
      }
    }
  }

  return (
    <div className={`flex min-h-0 flex-1 flex-col gap-5 ${className}`}>
      {hasToolbar && (
        <TableToolbar
          showSearch={showSearch}
          search={search}
          searchValue={searchValue}
          filterFields={filterFields}
          filterValues={filterValues}
          onValuesChange={handleToolbarValuesChange}
          actions={visibleActions}
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
            scroll={{
              x: scrollX,
              y: autoHeight || !needsVerticalScroll ? undefined : bodyHeight,
            }}
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
