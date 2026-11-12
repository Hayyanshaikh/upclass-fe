"use client";

import { memo, useMemo } from "react";
import type { TableColumnsType } from "antd";
import Table from "@/components/ui/Table";
import type { TimetableGridProps, TimetableRow } from "@/types/timetable";

function TimetableGrid({
  rows,
  days,
  filterFields,
  beforeTable,
  renderLesson,
  interactive = false,
  loading = false,
}: TimetableGridProps) {
  const columns = useMemo<TableColumnsType<TimetableRow>>(
    () => [
      {
        title: "Time",
        key: "time",
        width: 150,
        onCell: (row) =>
          row.type === "break"
            ? {
                colSpan: days.length + 1,
                className: "bg-foreground! text-center",
              }
            : { className: "px-4! py-2! align-middle" },
        render: (_, row) =>
          row.type === "break" ? (
            <p className="text-sm font-semibold text-gray">
              Break · {row.time}
            </p>
          ) : (
            <div>
              <p className="text-sm font-bold text-dark">{row.label}</p>
              <p className="mt-0.5 whitespace-nowrap text-xs text-gray">
                {row.time}
              </p>
            </div>
          ),
      },
      ...days.map(
        (day): TableColumnsType<TimetableRow>[number] => ({
          title: <span className="block text-center">{day.label}</span>,
          key: day.key,
          width: 160,
          onCell: (row) =>
            row.type === "break" ? { colSpan: 0 } : { className: "p-1.5! align-top" },
          render: (_, row) =>
            row.type === "period" ? renderLesson(row, day.key) : null,
        }),
      ),
    ],
    [days, renderLesson],
  );

  return (
    <Table
      columns={columns}
      data={rows}
      scrollX={150 + days.length * 160}
      pagination={false}
      interactive={interactive}
      loading={loading}
      showSearch={false}
      filterFields={filterFields}
      beforeTable={beforeTable}
    />
  );
}

export default memo(TimetableGrid);
