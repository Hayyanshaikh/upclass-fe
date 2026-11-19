"use client";

import { useEffect, useState } from "react";
import dayjs from "dayjs";
import type { Dayjs } from "dayjs";
import type { TableColumnsType } from "antd";
import PageHeader from "@/components/shared/PageHeader";
import Button from "@/components/ui/Button";
import Table from "@/components/ui/Table";
import StatCard from "@/components/ui/StatCard";
import StatusBadge from "@/components/ui/StatusBadge";
import ProgressBar from "@/components/ui/ProgressBar";
import {
  studentAttendanceControllerReport,
  useStudentAttendanceControllerReport,
} from "@/app/api/endpoints";
import type { StudentAttendanceControllerReportBand } from "@/app/api/schemas";
import { attendanceReportVariants } from "@/constants/attendance-report";
import { useClassDropdown } from "@/hooks/useClassDropdown";
import { useClassSectionDropdown } from "@/hooks/useClassSectionDropdown";
import { useTable } from "@/hooks/useTable";
import { studentAttendanceReportRowManipulator } from "@/lib/api/student-attendance";
import { exportCsv } from "@/utils/export-csv";
import type { FilterField } from "@/types/table-toolbar";
import type { StatCardProps } from "@/types/stat-card";
import type { AttendanceReportRow } from "@/types/attendance-report";

export default function AttendanceReport() {
  const [isExporting, setIsExporting] = useState(false);
  const { filters, setFilters, page, pageSize, offset, setPage } = useTable<{
    classId?: string;
    classSectionId?: string;
    month?: Dayjs | null;
    band?: StudentAttendanceControllerReportBand;
  }>({ pageSize: 6, initialFilters: { month: dayjs() } });

  const { options: classOptions } = useClassDropdown();
  const { options: sectionOptions } = useClassSectionDropdown(filters.classId);

  useEffect(() => {
    if (filters.classId || classOptions.length === 0) return;
    setFilters({ classId: classOptions[0].value });
  }, [classOptions, filters.classId, setFilters]);

  const classId = filters.classId ?? "";
  const monthValue = filters.month?.format("YYYY-MM") ?? "";

  const { data, isFetching, error, refetch } =
    useStudentAttendanceControllerReport(
      {
        month: monthValue,
        classId,
        classSectionId: filters.classSectionId,
        band: filters.band,
        limit: pageSize,
        offset,
      },
      { query: { enabled: Boolean(classId && monthValue) } },
    );

  const rows = studentAttendanceReportRowManipulator(data?.data);
  const summary = data?.summary;
  const classLabel = classOptions.find(
    (option) => option.value === classId,
  )?.label;

  const stats: StatCardProps[] = [
    {
      title: "Average attendance",
      value: `${summary?.averagePercent ?? 0}%`,
      description: classLabel,
    },
    {
      title: "Working days",
      value: summary?.workingDays ?? 0,
      description: filters.month?.format("MMMM YYYY"),
    },
    {
      title: "Below 75%",
      value: summary?.below75Count ?? 0,
      description: "Students at risk",
      variant: "danger",
    },
    {
      title: "Perfect attendance",
      value: summary?.perfectCount ?? 0,
      description: "Students",
    },
  ];

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

  const filterFields: FilterField[] = [
    {
      name: "classId",
      label: "Class",
      placeholder: "Select class",
      options: classOptions,
      allowClear: false,
      onChange: () => setFilters({ classSectionId: undefined }),
    },
    {
      name: "classSectionId",
      label: "Section",
      placeholder: "All sections",
      options: sectionOptions,
      allowClear: true,
    },
    {
      type: "month",
      name: "month",
      label: "Month",
    },
    {
      name: "band",
      label: "Show",
      value: "all",
      allowClear: false,
      options: [
        { label: "All students", value: "all" },
        { label: "Below 75%", value: "low" },
        { label: "Watch (75–89%)", value: "watch" },
        { label: "Good (90% and above)", value: "good" },
        { label: "Perfect attendance", value: "perfect" },
      ],
    },
  ];

  function exportRowsToCsv(exportRows: AttendanceReportRow[]) {
    exportCsv("attendance-report.csv", [
      [
        "Roll",
        "Student",
        "Days",
        "Present",
        "Absent",
        "Late",
        "Attendance",
        "Status",
      ],
      ...exportRows.map((row) => [
        row.roll,
        row.name,
        String(row.days),
        String(row.present),
        String(row.absent),
        String(row.late),
        `${row.percent}%`,
        row.status,
      ]),
    ]);
  }

  async function downloadCsv() {
    setIsExporting(true);
    try {
      const response = await studentAttendanceControllerReport({
        month: monthValue,
        classId,
        classSectionId: filters.classSectionId,
        band: filters.band,
        limit: 1000,
      });
      exportRowsToCsv(studentAttendanceReportRowManipulator(response.data));
    } catch {
      exportRowsToCsv(rows);
    } finally {
      setIsExporting(false);
    }
  }

  const beforeTable = (
    <>
      <section
        aria-label="Monthly attendance summary"
        className="flex shrink-0 gap-3 overflow-x-auto sm:grid sm:grid-cols-4"
      >
        {stats.map((stat) => (
          <StatCard
            key={stat.title}
            {...stat}
            size="sm"
            className="min-w-40 flex-1 sm:min-w-0"
          />
        ))}
      </section>
      {error && (
        <div
          role="alert"
          className="flex items-center gap-3 rounded-md border border-danger bg-danger/10 px-4 py-3 text-sm text-danger"
        >
          <span>Unable to load the attendance report.</span>
          <Button variant="link" onClick={() => void refetch()}>
            Retry
          </Button>
        </div>
      )}
    </>
  );

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
            <Button
              variant="secondary"
              disabled={rows.length === 0}
              loading={isExporting}
              onClick={() => void downloadCsv()}
            >
              Export CSV
            </Button>
            <Button>Print</Button>
          </div>
        }
      />
      <Table
        columns={columns}
        data={rows}
        total={data?.total ?? 0}
        loading={isFetching}
        beforeTable={beforeTable}
        rowKey="id"
        pageSize={pageSize}
        current={page}
        onPageChange={setPage}
        showSearch={false}
        filterValues={filters}
        onFilterValuesChange={setFilters}
        filterFields={filterFields}
      />
    </div>
  );
}
