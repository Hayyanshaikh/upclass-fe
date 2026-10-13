"use client";

import type { TableColumnsType } from "antd";
import Table from "@/components/ui/Table";
import { timetableDays } from "@/constants/timetable";
import type { TeacherTimetableRow, TimetableGridProps, TimetableRow } from "@/types/timetable";

export default function TimetableGrid<T extends TimetableRow | TeacherTimetableRow>({ rows, filterFields, beforeTable, renderLesson }: TimetableGridProps<T>) {
  const columns: TableColumnsType<T> = [
    {
      title: "Time", key: "time", width: 150,
      onCell: (row) => row.type === "break"
        ? { colSpan: timetableDays.length + 1, className: "bg-foreground! text-center" }
        : { className: "px-4! py-2! align-middle" },
      render: (_, row) => row.type === "break" ? (
        <p className="text-sm font-semibold text-gray">Break · {row.time}</p>
      ) : (
        <div>
          <p className="text-sm font-bold text-dark">{row.label}</p>
          <p className="mt-0.5 whitespace-nowrap text-xs text-gray">{row.time}</p>
        </div>
      ),
    },
    ...timetableDays.map((day): TableColumnsType<T>[number] => ({
      title: <span className="block text-center">{day.label}</span>,
      key: day.key,
      width: 160,
      onCell: (row) => row.type === "break" ? { colSpan: 0 } : { className: "p-1.5! align-top" },
      render: (_, row) => row.type === "period" ? renderLesson(row, day.key) : null,
    })),
  ];

  return <Table columns={columns} data={rows} scrollX={1110} pagination={false}
    interactive={false} showSearch={false} filterFields={filterFields} beforeTable={beforeTable} />;
}
