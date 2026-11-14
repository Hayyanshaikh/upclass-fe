"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { TableColumnsType } from "antd";
import dayjs from "dayjs";
import type { Dayjs } from "dayjs";
import EditTeacherAttendanceDialog from "@/components/dialogs/EditTeacherAttendanceDialog";
import TeacherAttendanceAuditLogDialog from "@/components/dialogs/TeacherAttendanceAuditLogDialog";
import TeacherAttendanceDetailsDialog from "@/components/dialogs/TeacherAttendanceDetailsDialog";
import ActionButtons from "@/components/shared/ActionButtons";
import DeleteDialog from "@/components/shared/DeleteDialog";
import ErrorDialog from "@/components/shared/ErrorDialog";
import PageHeader from "@/components/shared/PageHeader";
import SuccessDialog from "@/components/shared/SuccessDialog";
import Button from "@/components/ui/Button";
import StatusBadge from "@/components/ui/StatusBadge";
import Table from "@/components/ui/Table";
import {
  useTeacherAttendanceControllerFindAll,
  useTeacherAttendanceControllerRemove,
} from "@/app/api/endpoints";
import { TeacherAttendanceControllerFindAllStatus } from "@/app/api/schemas";
import { DISPLAY_DATE } from "@/constants/date-formats";
import { teacherAttendanceStatusVariants } from "@/constants/teacher-attendance";
import { useRolePermission } from "@/hooks/useRolePermission";
import { useTable } from "@/hooks/useTable";
import {
  getTeacherAttendanceErrorMessage,
  teacherAttendanceRowManipulator,
} from "@/lib/api/teacher-attendance";
import type { FilterField, TableAction, TableSearch } from "@/types/table-toolbar";
import type { TeacherAttendanceAuditEntry } from "@/types/teacher-attendance-audit";
import type { TeacherAttendanceRow } from "@/types/teacher-attendance";

export default function TeacherAttendance() {
  const router = useRouter();
  const { canDelete, canEdit, canView } =
    useRolePermission("teacher_attendance");
  const [selected, setSelected] = useState<TeacherAttendanceRow | null>(null);
  const [editing, setEditing] = useState<TeacherAttendanceRow | null>(null);
  const [deleting, setDeleting] = useState<TeacherAttendanceRow | null>(null);
  const [deleteSuccess, setDeleteSuccess] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [auditOpen, setAuditOpen] = useState(false);
  const [auditEntries, setAuditEntries] = useState<
    TeacherAttendanceAuditEntry[]
  >([]);

  const { mutateAsync: removeAttendance, isPending: isDeleting } =
    useTeacherAttendanceControllerRemove();

  const {
    page,
    pageSize,
    offset,
    search,
    filters,
    setPage,
    setFilters,
    setSearch,
  } = useTable<{
    date?: Dayjs | null;
    status?: TeacherAttendanceControllerFindAllStatus;
  }>({ pageSize: 8 });

  const { data, isFetching, error, refetch } =
    useTeacherAttendanceControllerFindAll({
      limit: pageSize,
      offset,
      searchKey: search,
      date: filters.date?.format("YYYY-MM-DD"),
      status: filters.status,
    });

  const total = data?.total ?? 0;
  const rows = teacherAttendanceRowManipulator(data?.data);

  async function confirmDelete() {
    if (!deleting || isDeleting) return;

    const { id, teacher, date } = deleting;

    try {
      await removeAttendance({ id });
      setDeleting(null);
      setDeleteSuccess(
        `${teacher}'s attendance for ${date.split("-").reverse().join("/")} was deleted.`,
      );

      if (page > 1 && offset >= total - 1) {
        setPage(page - 1);
      } else {
        void refetch();
      }
    } catch (error) {
      setDeleting(null);
      setDeleteError(
        getTeacherAttendanceErrorMessage(
          error,
          "Unable to delete attendance record. Please try again.",
        ),
      );
    }
  }

  const filterFields: FilterField[] = [
    {
      type: "date",
      name: "date",
      label: "Date",
    },
    {
      name: "status",
      label: "Status",
      placeholder: "Any status",
      options: [
        {
          label: "Present",
          value: TeacherAttendanceControllerFindAllStatus.PRESENT,
        },
        {
          label: "Absent",
          value: TeacherAttendanceControllerFindAllStatus.ABSENT,
        },
        {
          label: "Late",
          value: TeacherAttendanceControllerFindAllStatus.LATE,
        },
        {
          label: "Leave",
          value: TeacherAttendanceControllerFindAllStatus.LEAVE,
        },
      ],
    },
  ];

  let columns: TableColumnsType<TeacherAttendanceRow> = [
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
          <div>
            <span className="font-semibold text-dark">{row.teacher}</span>
            <p className="text-xs text-gray">{row.employeeId}</p>
          </div>
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
      title: "Date",
      dataIndex: "date",
      key: "date",
      width: 110,
      render: (value: string) => dayjs(value).format(DISPLAY_DATE),
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
          showView={canView}
          showEdit={canEdit}
          showDelete={canDelete}
          onView={() => setSelected(row)}
          onEdit={() => setEditing(row)}
          onDelete={() => setDeleting(row)}
        />
      ),
    },
  ];

  if (!canView && !canEdit && !canDelete) {
    columns = columns.filter((column) => column.key !== "actions");
  }

  const tableSearch: TableSearch = {
    placeholder: "Teacher name or employee ID",
    onChange: setSearch,
  };

  const actions: TableAction[] = [
    {
      label: "Audit log",
      variant: "secondary",
      onClick: () => setAuditOpen(true),
    },
    {
      label: "View report",
      onClick: () => router.push("/attendance/teachers/report"),
    },
  ];

  const beforeTable = error ? (
    <div
      role="alert"
      className="flex items-center gap-3 rounded-md border border-danger bg-danger/10 px-4 py-3 text-sm text-danger"
    >
      <span>Unable to load teacher attendance.</span>
      <Button variant="link" onClick={() => void refetch()}>
        Retry
      </Button>
    </div>
  ) : undefined;

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="shrink-0">
        <PageHeader title="Teacher attendance" />
      </div>
      <Table
        columns={columns}
        data={rows}
        total={total}
        loading={isFetching}
        beforeTable={beforeTable}
        rowKey="id"
        pageSize={pageSize}
        current={page}
        search={tableSearch}
        onPageChange={setPage}
        filterValues={filters}
        onFilterValuesChange={setFilters}
        filterFields={filterFields}
        actions={actions}
      />

      <TeacherAttendanceDetailsDialog
        record={selected}
        onClose={() => setSelected(null)}
      />
      <EditTeacherAttendanceDialog
        record={editing}
        onClose={() => setEditing(null)}
        onSaved={(updated, reason) => {
          if (editing) {
            const previousStatus = editing.status;
            setAuditEntries((current) => [
              {
                id: updated.id,
                teacher: updated.teacher,
                date: updated.date,
                previousStatus,
                status: updated.status,
                reason: reason || "–",
              },
              ...current,
            ]);
          }
          void refetch();
        }}
      />
      <TeacherAttendanceAuditLogDialog
        open={auditOpen}
        entries={auditEntries}
        onClose={() => setAuditOpen(false)}
      />
      <DeleteDialog
        open={deleting !== null}
        title="Delete attendance record?"
        message={
          deleting
            ? `Delete ${deleting.teacher}'s attendance for ${deleting.date.split("-").reverse().join("/")}?`
            : "Delete this attendance record?"
        }
        description="This permanently removes the record. The report and the teacher's weekly attendance will be updated."
        okText="Yes, delete"
        cancelText="No, keep it"
        confirmLoading={isDeleting}
        onClose={() => {
          if (!isDeleting) setDeleting(null);
        }}
        onConfirm={() => void confirmDelete()}
      />
      <SuccessDialog
        open={deleteSuccess !== null}
        title="Attendance deleted"
        message={deleteSuccess ?? ""}
        onClose={() => setDeleteSuccess(null)}
      />
      <ErrorDialog
        open={deleteError !== null}
        title="Unable to delete attendance"
        message={deleteError ?? ""}
        onClose={() => setDeleteError(null)}
      />
    </div>
  );
}
