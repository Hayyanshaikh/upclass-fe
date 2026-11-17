"use client";

import { useState } from "react";
import type { TableColumnsType } from "antd";
import dayjs from "dayjs";
import type { Dayjs } from "dayjs";
import PageHeader from "@/components/shared/PageHeader";
import Button from "@/components/ui/Button";
import ProgressBar from "@/components/ui/ProgressBar";
import StatusBadge from "@/components/ui/StatusBadge";
import Table from "@/components/ui/Table";
import { useTeacherAttendanceControllerReport } from "@/app/api/endpoints";
import { TeacherAttendanceControllerReportBand } from "@/app/api/schemas";
import { teacherAttendanceReportVariants } from "@/constants/teacher-attendance-report";
import { teacherAttendanceReportRowManipulator } from "@/lib/api/teacher-attendance";
import { exportCsv } from "@/utils/export-csv";
import type { TeacherAttendanceReportRow } from "@/types/teacher-attendance-report";
import type { FilterField } from "@/types/table-toolbar";

export default function TeacherAttendanceReport() {
  const [month, setMonth] = useState<Dayjs>(dayjs());
  const [band, setBand] = useState<TeacherAttendanceControllerReportBand>(
    TeacherAttendanceControllerReportBand.all,
  );

  const { data, isFetching, error, refetch } =
    useTeacherAttendanceControllerReport({
      month: month.format("YYYY-MM"),
      band,
    });
  const rows = teacherAttendanceReportRowManipulator(data?.data);

  const filters: FilterField[] = [
    {
      type: "month",
      name: "month",
      value: month,
      onChange: (value) => {
        if (value) setMonth(value);
      },
    },
    {
      name: "show",
      label: "Show",
      value: band,
      allowClear: false,
      options: [
        {
          label: "All teachers",
          value: TeacherAttendanceControllerReportBand.all,
        },
        {
          label: "Good (90% and above)",
          value: TeacherAttendanceControllerReportBand.good,
        },
        {
          label: "Watch (75–89%)",
          value: TeacherAttendanceControllerReportBand.watch,
        },
        {
          label: "Low (below 75%)",
          value: TeacherAttendanceControllerReportBand.low,
        },
        {
          label: "Perfect attendance",
          value: TeacherAttendanceControllerReportBand.perfect,
        },
      ],
      onChange: (value) =>
        setBand(
          (value as TeacherAttendanceControllerReportBand | undefined) ??
            TeacherAttendanceControllerReportBand.all,
        ),
    },
  ];

  const columns: TableColumnsType<TeacherAttendanceReportRow> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 90,
      render: (id: string) => <span className="font-bold text-dark">{id}</span>,
    },
    {
      title: "Teacher",
      key: "teacher",
      width: 230,
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <span
            className="flex size-9 shrink-0 items-center justify-center rounded-full bg-success/10 font-bold text-primary"
            aria-hidden="true"
          >
            {row.teacher.charAt(0)}
          </span>
          <span className="font-semibold text-dark">{row.teacher}</span>
        </div>
      ),
    },
    { title: "Days", dataIndex: "days", key: "days", width: 75 },
    { title: "Present", dataIndex: "present", key: "present", width: 90 },
    { title: "Absent", dataIndex: "absent", key: "absent", width: 85 },
    { title: "Late", dataIndex: "late", key: "late", width: 75 },
    { title: "Leave", dataIndex: "leave", key: "leave", width: 75 },
    {
      title: "Attendance",
      key: "attendance",
      width: 235,
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <ProgressBar
              value={row.percent}
              label={`${row.teacher} attendance`}
              variant={teacherAttendanceReportVariants[row.status]}
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
      width: 100,
      render: (_, row) => (
        <StatusBadge variant={teacherAttendanceReportVariants[row.status]}>
          {row.status}
        </StatusBadge>
      ),
    },
  ];

  function downloadCsv() {
    exportCsv(`teacher-attendance-${month.format("YYYY-MM")}.csv`, [
      [
        "ID",
        "Teacher",
        "Days",
        "Present",
        "Absent",
        "Late",
        "Leave",
        "Attendance",
        "Status",
      ],
      ...rows.map((row) => [
        row.id,
        row.teacher,
        String(row.days),
        String(row.present),
        String(row.absent),
        String(row.late),
        String(row.leave),
        `${row.percent}%`,
        row.status,
      ]),
    ]);
  }

  const beforeTable = error ? (
    <div
      role="alert"
      className="flex items-center gap-3 rounded-md border border-danger bg-danger/10 px-4 py-3 text-sm text-danger"
    >
      <span>Unable to load teacher attendance report.</span>
      <Button variant="link" onClick={() => void refetch()}>
        Retry
      </Button>
    </div>
  ) : undefined;

  return (
    <div className="flex h-full min-h-0 flex-col">
      <PageHeader
        title="Teacher attendance report"
        breadcrumbs={[
          { title: "Teacher Attendance", href: "/attendance/teachers" },
          { title: "Report" },
        ]}
        actions={
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="secondary" onClick={downloadCsv}>
              Export CSV
            </Button>
            <Button onClick={() => window.print()}>Print</Button>
          </div>
        }
      />
      <Table
        columns={columns}
        data={rows}
        rowKey="teacherId"
        pageSize={6}
        loading={isFetching}
        beforeTable={beforeTable}
        scrollX={1120}
        showSearch={false}
        filterFields={filters}
      />
    </div>
  );
}
