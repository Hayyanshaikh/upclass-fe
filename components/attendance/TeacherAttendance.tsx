"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { TableColumnsType } from "antd";
import type { Dayjs } from "dayjs";
import EditTeacherAttendanceDialog from "@/components/dialogs/EditTeacherAttendanceDialog";
import TeacherAttendanceAuditLogDialog from "@/components/dialogs/TeacherAttendanceAuditLogDialog";
import TeacherAttendanceDetailsDialog from "@/components/dialogs/TeacherAttendanceDetailsDialog";
import ActionButtons from "@/components/shared/ActionButtons";
import PageHeader from "@/components/shared/PageHeader";
import StatusBadge from "@/components/ui/StatusBadge";
import Table from "@/components/ui/Table";
import {
  teacherAttendanceDepartmentOptions,
  teacherAttendanceRows,
  teacherAttendanceStatusOptions,
  teacherAttendanceStatusVariants,
  teacherAttendanceSubjectOptions,
} from "@/constants/teacher-attendance";
import type { FilterField } from "@/types/table-toolbar";
import type { TeacherAttendanceAuditEntry } from "@/types/teacher-attendance-audit";
import type {
  TeacherAttendanceRow,
  TeacherAttendanceStatus,
} from "@/types/teacher-attendance";

export default function TeacherAttendance() {
  const router = useRouter();
  const [rows, setRows] = useState(teacherAttendanceRows);
  const [search, setSearch] = useState("");
  const [date, setDate] = useState<Dayjs | null>(null);
  const [department, setDepartment] = useState<string>();
  const [subject, setSubject] = useState<string>();
  const [status, setStatus] = useState<TeacherAttendanceStatus>();
  const [selected, setSelected] = useState<TeacherAttendanceRow | null>(null);
  const [editing, setEditing] = useState<TeacherAttendanceRow | null>(null);
  const [auditOpen, setAuditOpen] = useState(false);
  const [auditEntries, setAuditEntries] = useState<
    TeacherAttendanceAuditEntry[]
  >([]);

  const filteredRows = useMemo(() => {
    const query = search.trim().toLowerCase();
    return rows.filter(
      (row) =>
        (!query || `${row.id} ${row.teacher}`.toLowerCase().includes(query)) &&
        (!date || row.date === date.format("YYYY-MM-DD")) &&
        (!department || row.department === department) &&
        (!subject || row.subject === subject) &&
        (!status || row.status === status),
    );
  }, [rows, search, date, department, subject, status]);

  const filters: FilterField[] = [
    {
      type: "date",
      name: "date",
      label: "Date",
      value: date,
      onChange: setDate,
    },
    {
      name: "department",
      label: "Department",
      placeholder: "All departments",
      options: teacherAttendanceDepartmentOptions,
      value: department,
      onChange: setDepartment,
    },
    {
      name: "subject",
      label: "Subject",
      placeholder: "All subjects",
      options: teacherAttendanceSubjectOptions,
      value: subject,
      onChange: setSubject,
    },
    {
      name: "status",
      label: "Status",
      placeholder: "Any",
      options: teacherAttendanceStatusOptions,
      value: status,
      onChange: (value) =>
        setStatus(value as TeacherAttendanceStatus | undefined),
    },
  ];

  const columns: TableColumnsType<TeacherAttendanceRow> = [
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
    {
      title: "Status",
      key: "status",
      width: 150,
      render: (_, row) => (
        <StatusBadge variant={teacherAttendanceStatusVariants[row.status]}>
          {row.status === "Late" && row.lateMinutes
            ? `Late · ${row.lateMinutes} min`
            : row.status}
        </StatusBadge>
      ),
    },
    {
      title: "Check-in",
      dataIndex: "checkIn",
      key: "checkIn",
      width: 105,
      render: (value?: string) => value ?? "–",
    },
    {
      title: "Check-out",
      dataIndex: "checkOut",
      key: "checkOut",
      width: 115,
      render: (value?: string) => value ?? "–",
    },
    {
      title: "Hours",
      dataIndex: "hours",
      key: "hours",
      width: 100,
      render: (value?: string) => value ?? "–",
    },
    {
      title: "Source",
      dataIndex: "source",
      key: "source",
      width: 210,
      render: (value: string) => <span className="text-gray">{value}</span>,
    },
    {
      title: "Actions",
      key: "actions",
      width: 110,
      render: (_, row) => (
        <ActionButtons
          name={`${row.teacher}'s attendance`}
          onView={() => setSelected(row)}
          onEdit={() => setEditing(row)}
        />
      ),
    },
  ];

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <PageHeader title="Teacher attendance" />
      <Table
        columns={columns}
        data={filteredRows}
        rowKey="id"
        pageSize={8}
        search={{
          label: "Search",
          placeholder: "Teacher name or ID",
          onChange: setSearch,
        }}
        filterFields={filters}
        actions={[
          {
            label: "Audit log",
            variant: "secondary",
            onClick: () => setAuditOpen(true),
          },
          {
            label: "View report",
            onClick: () => router.push("/attendance/teachers/report"),
          },
        ]}
      />

      <TeacherAttendanceDetailsDialog
        record={selected}
        onClose={() => setSelected(null)}
      />
      <EditTeacherAttendanceDialog
        record={editing}
        onClose={() => setEditing(null)}
        onSave={(updated, reason) => {
          setRows((current) =>
            current.map((row) =>
              row.id === updated.id && row.date === updated.date
                ? updated
                : row,
            ),
          );
          if (editing)
            setAuditEntries((current) => [
              {
                id: updated.id,
                teacher: updated.teacher,
                date: updated.date,
                previousStatus: editing.status,
                status: updated.status,
                reason,
              },
              ...current,
            ]);
          setEditing(null);
        }}
      />
      <TeacherAttendanceAuditLogDialog
        open={auditOpen}
        entries={auditEntries}
        onClose={() => setAuditOpen(false)}
      />
    </div>
  );
}
