"use client";

import { useMemo, useState } from "react";
import type { TableColumnsType } from "antd";
import PageHeader from "@/components/shared/PageHeader";
import Button from "@/components/ui/Button";
import ProgressBar from "@/components/ui/ProgressBar";
import StatCard from "@/components/ui/StatCard";
import StatusBadge from "@/components/ui/StatusBadge";
import Table from "@/components/ui/Table";
import {
  teacherAttendanceDepartmentOptions,
  teacherAttendanceSubjectOptions,
} from "@/constants/teacher-attendance";
import {
  teacherAttendanceReportRows,
  teacherAttendanceReportVariants,
} from "@/constants/teacher-attendance-report";
import type { TeacherAttendanceReportRow } from "@/types/teacher-attendance-report";
import type { FilterField } from "@/types/table-toolbar";

export default function TeacherAttendanceReport() {
  const [month, setMonth] = useState("2026-10");
  const [department, setDepartment] = useState<string>();
  const [subject, setSubject] = useState<string>();
  const [show, setShow] = useState("all");

  const rows = useMemo(
    () =>
      teacherAttendanceReportRows.filter(
        (row) =>
          month === "2026-10" &&
          (!department || row.department === department) &&
          (!subject || row.subject === subject) &&
          (show === "all" ||
            show === row.status.toLowerCase() ||
            (show === "perfect" && row.percent === 100)),
      ),
    [month, department, subject, show],
  );
  const filters: FilterField[] = [
    {
      name: "month",
      label: "Month",
      value: month,
      allowClear: false,
      options: [
        { label: "October [2026]", value: "2026-10" },
        { label: "September [2026]", value: "2026-09" },
        { label: "August [2026]", value: "2026-08" },
      ],
      onChange: (value) => setMonth(value ?? "2026-10"),
    },
    {
      name: "department",
      label: "Department",
      placeholder: "All departments",
      value: department,
      options: teacherAttendanceDepartmentOptions,
      onChange: setDepartment,
    },
    {
      name: "subject",
      label: "Subject",
      placeholder: "All subjects",
      value: subject,
      options: teacherAttendanceSubjectOptions,
      onChange: setSubject,
    },
    {
      name: "show",
      label: "Show",
      value: show,
      allowClear: false,
      options: [
        { label: "All teachers", value: "all" },
        { label: "Good (90% and above)", value: "good" },
        { label: "Watch (75–89%)", value: "watch" },
        { label: "Low (below 75%)", value: "low" },
        { label: "Perfect attendance", value: "perfect" },
      ],
      onChange: (value) => setShow(value ?? "all"),
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

  function exportCsv() {
    const headings = [
      "ID",
      "Teacher",
      "Department",
      "Subject",
      "Days",
      "Present",
      "Absent",
      "Late",
      "Leave",
      "Attendance",
      "Status",
    ];
    const values = rows.map((row) => [
      row.id,
      row.teacher,
      row.department,
      row.subject,
      row.days,
      row.present,
      row.absent,
      row.late,
      row.leave,
      `${row.percent}%`,
      row.status,
    ]);
    const csv = [headings, ...values]
      .map((line) =>
        line.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(","),
      )
      .join("\r\n");
    const url = URL.createObjectURL(
      new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8" }),
    );
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `teacher-attendance-${month}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

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
            <Button variant="secondary" onClick={exportCsv}>
              Export CSV
            </Button>
            <Button onClick={() => window.print()}>Print</Button>
          </div>
        }
      />
      <Table
        columns={columns}
        data={rows}
        rowKey="id"
        pageSize={6}
        scrollX={1120}
        showSearch={false}
        filterFields={filters}
      />
    </div>
  );
}
