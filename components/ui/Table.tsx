"use client";

import { useEffect, useRef, useState } from "react";
import { Pagination, Table as AntTable } from "antd";
import type { TableProps } from "@/types/table";
import type { FilterField } from "@/types/table-toolbar";
import type { Dayjs } from "dayjs";
import TableToolbar from "@/components/shared/TableToolbar";

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
}: TableProps<T>) {
  const [page, setPage] = useState(1);
  const tableArea = useRef<HTMLDivElement>(null);
  const [bodyHeight, setBodyHeight] = useState(200);
  const count = total ?? data.length;
  const lastPage = Math.max(1, Math.ceil(count / pageSize));
  const activePage = Math.min(current ?? page, lastPage);
  const start = (activePage - 1) * pageSize;
  const rows = pagination && total === undefined ? data.slice(start, start + pageSize) : data;

  useEffect(() => {
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
  }, []);

  function changePage(nextPage: number) {
    if (!interactive) return;
    setPage(nextPage);
    onPageChange?.(nextPage);
  }

  return (
    <div className={`flex min-h-0 flex-1 flex-col gap-5 ${className}`}>
      {((showSearch && search) || filterFields.length > 0 || actions.length > 0) && (
        <TableToolbar
          showSearch={showSearch}
          search={search && { ...search, onChange: (value) => { changePage(1); search.onChange(value); } }}
          filterFields={filterFields.map<FilterField>((field) => field.type === "date"
            ? { ...field, onChange: (value: Dayjs | null) => { changePage(1); if (interactive) field.onChange?.(value); } }
            : { ...field, onChange: (value: string | undefined) => { changePage(1); if (interactive) field.onChange?.(value); } })}
          actions={actions}
        />
      )}
      {beforeTable}
    <div
      className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-border bg-background"
    >
      {cardHeader && (
        <div className="shrink-0 border-b border-border p-4">{cardHeader}</div>
      )}
      <div ref={tableArea} className="min-h-0 flex-1 overflow-hidden">
      <AntTable<T>
        columns={columns}
        dataSource={rows}
        rowKey={rowKey}
        loading={loading}
        pagination={false}
        scroll={{ x: scrollX, y: bodyHeight }}
      />
      </div>
      {pagination && <div className="flex shrink-0 flex-wrap items-center justify-between gap-4 border-t border-border px-5 py-4">
        <p className="text-sm text-gray" aria-live="polite">
          Showing {count === 0 ? 0 : start + 1}–
          {Math.min(start + rows.length, count)} of {count.toLocaleString()}
        </p>
        <Pagination
          current={activePage}
          pageSize={pageSize}
          total={count}
          onChange={changePage}
          showSizeChanger={false}
          itemRender={(_, type, original) => {
            if (type === "prev" || type === "next") {
              return (
                <span className="flex h-11 items-center rounded-md border border-primary px-5 font-semibold text-primary">
                  {type === "prev" ? "Previous" : "Next"}
                </span>
              );
            }
            return original;
          }}
        />
      </div>}
    </div>
    </div>
  );
}
