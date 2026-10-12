"use client";

import { useState } from "react";
import { Form } from "antd";
import type { TableColumnsType } from "antd";
import dayjs from "dayjs";
import { classGradeOptions } from "@/constants/classes";
import AttendanceReportDialog from "@/components/dialogs/AttendanceReportDialog";
import PageHeader from "@/components/shared/PageHeader";
import Table from "@/components/ui/Table";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import SegmentedControl from "@/components/ui/SegmentedControl";
import {
  attendancePeriodOptions,
  attendanceStatusOptions,
  attendanceStudents,
} from "@/constants/attendance";
import { useAttendanceStore } from "@/stores/attendance";
import {
  attendanceDate,
  attendanceKey,
} from "@/utils/attendance";
import type {
  AttendanceFilters as FilterValues,
  AttendanceRow,
} from "@/types/attendance";

export default function StudentAttendance() {
  const [filters, setFilters] = useState<FilterValues>(() => ({
    grade: "8",
    section: "A",
    date: dayjs(attendanceDate()),
    period: "full-day",
  }));
  const [page, setPage] = useState(1);
  const [reportOpen, setReportOpen] = useState(false);
  const className = `${filters.grade}-${filters.section}`;
  const date = filters.date?.format("YYYY-MM-DD") || "";
  const key = attendanceKey(className, date, filters.period);
  const saved = useAttendanceStore((state) => state.saved[key]);
  const draft = useAttendanceStore((state) => state.drafts[key]);
  const updateEntry = useAttendanceStore((state) => state.updateEntry);
  const saveDraft = useAttendanceStore((state) => state.saveDraft);
  const entries = draft ?? saved;
  const roster = attendanceStudents.filter(
    (student) => student.className === className,
  );
  const rows: AttendanceRow[] = roster.map((student) => ({
    ...student,
    status: entries?.[student.id]?.status,
    remarks: entries?.[student.id]?.remarks || "",
  }));
  const dirty =
    JSON.stringify(draft ?? saved ?? {}) !== JSON.stringify(saved ?? {});
  const hasStudents = rows.length > 0;
  const saveDisabled = !date || !hasStudents || rows.some((row) => !row.status);
  const title = `Class ${className} · ${filters.date?.format("DD/MM/YYYY") || "Select a date"}`;
  const period =
    attendancePeriodOptions.find((option) => option.value === filters.period)
      ?.label || filters.period;
  const sections = [
    ...new Set(
      attendanceStudents
        .filter((student) => student.className.split("-")[0] === filters.grade)
        .map((student) => student.className.split("-")[1]),
    ),
  ]
    .sort()
    .map((value) => ({ label: value, value }));

  function saveAttendance() {
    if (saveDisabled) return;
    saveDraft(key);
  }

  function changeFilter(values: Partial<FilterValues>) {
    setFilters((current) => {
      const next = { ...current, ...values };
      if (values.grade) {
        const availableSections = [
          ...new Set(
            attendanceStudents
              .filter(
                (student) => student.className.split("-")[0] === values.grade,
              )
              .map((student) => student.className.split("-")[1]),
          ),
        ].sort();
        if (!availableSections.includes(next.section))
          next.section = availableSections[0] || "A";
      }
      return next;
    });
    setPage(1);
  }

  const columns: TableColumnsType<AttendanceRow> = [
    {
      title: "Roll",
      dataIndex: "roll",
      key: "roll",
      width: 90,
      render: (roll) => <span className="font-bold text-dark">{roll}</span>,
    },
    {
      title: "Student",
      key: "student",
      width: 240,
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
    {
      title: "Status",
      key: "status",
      width: 350,
      render: (_, row) => (
        <SegmentedControl
          label={`Attendance for ${row.name}`}
          value={row.status}
          options={attendanceStatusOptions}
          onChange={(status) => {
            updateEntry(key, row.id, { status });
          }}
        />
      ),
    },
    {
      title: "Remarks",
      key: "remarks",
      width: 260,
      render: (_, row) => (
        <Input
          name={["remarks", row.id]}
          placeholder="Remarks"
          ariaLabel={`Remarks for ${row.name}`}
          onChange={(event) => {
            updateEntry(key, row.id, { remarks: event.target.value });
          }}
        />
      ),
    },
  ];

  return (
    <>
      <div className="flex h-full min-h-0 flex-col overflow-hidden">
        <PageHeader
          title="Attendance"
          actions={
            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant="secondary"
                onClick={() => setReportOpen(true)}
                disabled={!date || !hasStudents}
              >
                View report
              </Button>
              <Button onClick={saveAttendance} disabled={saveDisabled}>
                Save attendance
              </Button>
            </div>
          }
        />
        <Form
          component={false}
          key={key}
          initialValues={{
            remarks: Object.fromEntries(
              rows.map((row) => [row.id, row.remarks]),
            ),
          }}
        >
          <Table
            columns={columns}
            data={rows}
            showSearch={false}
            filterFields={[
              {
                name: "grade",
                label: "Class",
                options: classGradeOptions,
                value: filters.grade,
                allowClear: false,
                onChange: (grade) => {
                  if (grade) changeFilter({ grade });
                },
              },
              {
                name: "section",
                label: "Section",
                options: sections,
                value: filters.section,
                allowClear: false,
                onChange: (section) => {
                  if (section) changeFilter({ section });
                },
              },
              {
                type: "date",
                name: "date",
                label: "Date",
                value: filters.date,
                pastOnly: true,
                onChange: (date) => changeFilter({ date }),
              },
              {
                name: "period",
                label: "Period",
                options: attendancePeriodOptions,
                value: filters.period,
                allowClear: false,
                onChange: (period) => {
                  if (period) changeFilter({ period });
                },
              },
            ]}
            current={page}
            onPageChange={setPage}
            pageSize={8}
          />
        </Form>
        <AttendanceReportDialog
          open={reportOpen}
          title={title}
          period={period}
          rows={rows}
          unsaved={dirty || !saved}
          onClose={() => setReportOpen(false)}
        />
      </div>
    </>
  );
}
