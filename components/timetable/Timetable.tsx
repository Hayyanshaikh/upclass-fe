"use client";

import type { TableColumnsType } from "antd";
import PageHeader from "@/components/shared/PageHeader";
import Button from "@/components/ui/Button";
import Table from "@/components/ui/Table";
import LessonCard from "@/components/timetable/LessonCard";
import { timetableDays, timetableFilterFields, timetableRows, timetableSubjects } from "@/constants/timetable";
import type { TimetableRow } from "@/types/timetable";

export default function Timetable() {
  const columns: TableColumnsType<TimetableRow> = [
    {
      title: "Time",
      key: "time",
      width: 150,
      onCell: (row) => row.type === "break"
        ? { colSpan: 7, className: "bg-foreground! text-center" }
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
    ...timetableDays.map((day): TableColumnsType<TimetableRow>[number] => ({
      title: <span className="block text-center">{day.label}</span>,
      key: day.key,
      width: 160,
      onCell: (row) => row.type === "break" ? { colSpan: 0 } : { className: "p-1.5! align-top" },
      render: (_, row) => row.type === "period" ? <LessonCard subject={timetableSubjects[row.subjects[day.key]]} /> : null,
    })),
  ];

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <PageHeader
        title="Timetable"
        subtitle="Weekly class timetable · Term 1"
        actions={
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="secondary">Teacher timetable</Button>
            <Button variant="secondary">Print</Button>
            <Button>Edit timetable</Button>
          </div>
        }
      />
      <Table
        columns={columns}
        data={timetableRows}
        scrollX={1110}
        pagination={false}
        interactive={false}
        showSearch={false}
        filterFields={timetableFilterFields}
        beforeTable={
          <section aria-label="Subject legend" className="flex shrink-0 flex-wrap gap-2">
            {Object.values(timetableSubjects).map((subject) => (
              <span key={subject.name} className={`rounded-full px-3 py-1 text-xs font-semibold text-dark ${subject.colorClass}`}>
                {subject.name}
              </span>
            ))}
          </section>
        }
      />
      <p className="mt-4 shrink-0 text-xs text-gray">Weekly schedule for Class 8-A · Each period lasts 40 minutes.</p>
    </div>
  );
}
