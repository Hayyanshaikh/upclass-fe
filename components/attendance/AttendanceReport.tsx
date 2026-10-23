"use client";

import type { TableColumnsType } from "antd";
import PageHeader from "@/components/shared/PageHeader";
import Button from "@/components/ui/Button";
import Table from "@/components/ui/Table";
import StatCard from "@/components/ui/StatCard";
import StatusBadge from "@/components/ui/StatusBadge";
import ProgressBar from "@/components/ui/ProgressBar";
import {
  attendanceReportFilterFields,
  attendanceReportRows,
  attendanceReportStats,
  attendanceReportVariants,
} from "@/constants/attendance-report";
import type { AttendanceReportRow } from "@/types/attendance-report";

export default function AttendanceReport() {
  const columns: TableColumnsType<AttendanceReportRow> = [
    {
      title: "Roll",
      dataIndex: "roll",
      width: 90,
      render: (roll) => <span className="font-bold text-dark">{roll}</span>,
    },
    {
      title: "Student",
      key: "student",
      width: 250,
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className="flex size-9 shrink-0 items-center justify-center rounded-full bg-success/10 font-bold text-primary"
          >
            {row.name.charAt(0)}
          </span>
          <span className="font-semibold text-dark">{row.name}</span>
        </div>
      ),
    },
    { title: "Days", dataIndex: "days", width: 80 },
    { title: "Present", dataIndex: "present", width: 90 },
    { title: "Absent", dataIndex: "absent", width: 90 },
    { title: "Late", dataIndex: "late", width: 80 },
    {
      title: "Attendance",
      key: "attendance",
      width: 240,
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <ProgressBar
              value={row.percent}
              label={row.name + " attendance"}
              variant={attendanceReportVariants[row.status]}
            />
          </div>
          <span className="w-11 shrink-0 font-bold text-dark">
            {row.percent}%
          </span>
        </div>
      ),
    },
    {
      title: "Status",
      key: "status",
      width: 110,
      render: (_, row) => (
        <StatusBadge variant={attendanceReportVariants[row.status]}>
          {row.status}
        </StatusBadge>
      ),
    },
  ];

  return (
    <div className="flex h-full min-h-0 flex-col">
      <PageHeader
        title="Attendance report"
        breadcrumbs={[
          { title: "Attendance", href: "/attendance/students" },
          { title: "Report" },
        ]}
        actions={
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="secondary">Export CSV</Button>
            <Button>Print</Button>
          </div>
        }
      />
      <Table
        columns={columns}
        data={attendanceReportRows}
        total={38}
        current={1}
        pageSize={6}
        interactive={false}
        showSearch={false}
        filterFields={attendanceReportFilterFields}
        beforeTable={
          <section
            aria-label="Monthly attendance summary"
            className="flex shrink-0 gap-3 overflow-x-auto sm:grid sm:grid-cols-4"
          >
            {attendanceReportStats.map((stat) => (
              <StatCard
                key={stat.title}
                {...stat}
                size="sm"
                className="min-w-40 flex-1 sm:min-w-0"
              />
            ))}
          </section>
        }
      />
    </div>
  );
}
