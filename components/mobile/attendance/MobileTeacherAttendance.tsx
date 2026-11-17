"use client";

import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { LuChartColumn, LuChevronRight, LuTrash2 } from "react-icons/lu";
import StatusBadge from "@/components/ui/StatusBadge";
import MobileConfirmDialog from "@/components/mobile/dialogs/MobileConfirmDialog";
import MobileFeedbackDialog from "@/components/mobile/dialogs/MobileFeedbackDialog";
import MobileTeacherAttendanceForm from "@/components/mobile/forms/MobileTeacherAttendanceForm";
import MobileIconButton from "@/components/mobile/ui/MobileIconButton";
import MobileList from "@/components/mobile/ui/MobileList";
import { DISPLAY_DATE } from "@/constants/date-formats";
import { teacherAttendanceStatusVariants } from "@/constants/teacher-attendance";
import { useRolePermission } from "@/hooks/useRolePermission";
import { useTable } from "@/hooks/useTable";
import { useTeacherDropdown } from "@/hooks/useTeacherDropdown";
import {
  getTeacherAttendanceErrorMessage,
  teacherAttendanceRowManipulator,
} from "@/lib/api/teacher-attendance";
import { toOptions } from "@/utils/enum-options";
import {
  useTeacherAttendanceControllerFindAll,
  useTeacherAttendanceControllerRemove,
} from "@/app/api/endpoints";
import { TeacherAttendanceControllerFindAllStatus } from "@/app/api/schemas";
import type { TeacherAttendanceRow } from "@/types/teacher-attendance";

type Feedback = {
  tone: "success" | "error";
  message: string;
};

type AttendanceFilters = {
  teacherId?: string;
  status?: TeacherAttendanceControllerFindAllStatus;
};

const statusFilterOptions = toOptions(TeacherAttendanceControllerFindAllStatus);

function mergeRows(
  current: TeacherAttendanceRow[],
  incoming: TeacherAttendanceRow[],
) {
  const seen = new Set(current.map((row) => row.id));
  return [...current, ...incoming.filter((row) => !seen.has(row.id))];
}

function AttendanceCardBody({ record }: { record: TeacherAttendanceRow }) {
  return (
    <div className="min-w-0 flex-1">
      <div className="flex items-center justify-between gap-2">
        <p className="truncate text-sm font-semibold text-dark">
          {record.teacher}
        </p>
        <StatusBadge variant={teacherAttendanceStatusVariants[record.status]}>
          {record.status === "Late" && record.lateMinutes
            ? `Late · ${record.lateMinutes} min`
            : record.status}
        </StatusBadge>
      </div>
      <p className="mt-0.5 truncate text-xs text-gray">
        {record.employeeId} · {dayjs(record.date).format(DISPLAY_DATE)}
      </p>
      <p className="mt-0.5 truncate text-xs text-gray">
        Check-in {record.checkIn ?? "–"} · Check-out {record.checkOut ?? "–"} ·{" "}
        {record.hours ?? "–"}
      </p>
    </div>
  );
}

export default function MobileTeacherAttendance() {
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<TeacherAttendanceRow | null>(null);
  const [deleting, setDeleting] = useState<TeacherAttendanceRow | null>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [rows, setRows] = useState<TeacherAttendanceRow[]>([]);
  const [listResetSignal, setListResetSignal] = useState(0);

  const { canDelete, canEdit } = useRolePermission("teacher_attendance");

  const {
    page,
    pageSize,
    offset,
    search,
    filters,
    setPage,
    setSearch,
    setFilters,
  } = useTable<AttendanceFilters>({ pageSize: 10, debounceMs: 400 });

  const { options: teacherOptions } = useTeacherDropdown();

  const { data, isFetching, isError, refetch } =
    useTeacherAttendanceControllerFindAll({
      searchKey: search,
      teacherId: filters.teacherId,
      status: filters.status,
      limit: pageSize,
      offset,
    });

  const { mutateAsync: removeRecord, isPending: isDeleting } =
    useTeacherAttendanceControllerRemove();

  const responseData = data?.data;
  const total = data?.total ?? 0;
  const lastPage = Math.max(1, Math.ceil(total / pageSize));

  useEffect(() => {
    if (!responseData) return;
    const incoming = teacherAttendanceRowManipulator(responseData);
    setRows((previous) =>
      page === 1 ? incoming : mergeRows(previous, incoming),
    );
  }, [responseData, page]);

  function refreshFromFirstPage() {
    if (page > 1) {
      setPage(1);
      return;
    }
    void refetch();
  }

  function resetListing() {
    const hasActiveQuery =
      page > 1 ||
      search !== "" ||
      filters.teacherId !== undefined ||
      filters.status !== undefined;

    setSearch("");
    setFilters({ teacherId: undefined, status: undefined });
    setPage(1);
    setListResetSignal((signal) => signal + 1);

    if (!hasActiveQuery) void refetch();
  }

  function openEditForm(record: TeacherAttendanceRow) {
    setEditing(record);
    setFormOpen(true);
  }

  function handleSaved(message: string) {
    setFormOpen(false);
    setFeedback({ tone: "success", message });
    refreshFromFirstPage();
  }

  async function handleDelete() {
    if (!deleting) return;

    const deletedId = deleting.id;

    try {
      const response = await removeRecord({ id: deletedId });
      setDeleting(null);
      setRows((previous) => previous.filter((row) => row.id !== deletedId));
      setFeedback({ tone: "success", message: response.message });
      setFormOpen(false);
      resetListing();
    } catch (error) {
      setDeleting(null);
      setFeedback({
        tone: "error",
        message: getTeacherAttendanceErrorMessage(
          error,
          "Unable to delete attendance.",
        ),
      });
    }
  }

  return (
    <div className="flex flex-col gap-4 pb-20">
      <h1 className="text-lg font-bold text-dark">Teacher attendance</h1>

      <MobileList
        items={rows}
        rowKey={(record) => record.id}
        renderItem={(record) =>
          canEdit ? (
            <button
              type="button"
              aria-label={`Edit ${record.teacher}'s attendance`}
              onClick={() => openEditForm(record)}
              className="flex w-full items-center gap-2 rounded-lg border border-border bg-background p-4 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:bg-foreground"
            >
              <AttendanceCardBody record={record} />
              <LuChevronRight
                size={18}
                className="shrink-0 text-gray"
                aria-hidden="true"
              />
            </button>
          ) : (
            <div className="flex items-center gap-2 rounded-lg border border-border bg-background p-4">
              <AttendanceCardBody record={record} />
              {canDelete && (
                <MobileIconButton
                  variant="danger"
                  label={`Delete ${record.teacher}'s attendance`}
                  onClick={() => setDeleting(record)}
                >
                  <LuTrash2 size={18} aria-hidden="true" />
                </MobileIconButton>
              )}
            </div>
          )
        }
        search={{
          placeholder: "Search by teacher name or employee ID",
          onChange: setSearch,
        }}
        filters={{
          fields: [
            {
              name: "teacherId",
              label: "Teacher",
              placeholder: "All teachers",
              options: teacherOptions,
            },
            {
              name: "status",
              label: "Status",
              placeholder: "Any status",
              options: statusFilterOptions,
            },
          ],
          values: filters,
          onApply: setFilters,
        }}
        loading={isFetching && rows.length === 0 && !isError}
        loadingMore={isFetching && rows.length > 0}
        error={isError && rows.length === 0}
        onRetry={() => void refetch()}
        hasMore={page < lastPage && rows.length > 0}
        onLoadMore={() => setPage(page + 1)}
        resetSignal={listResetSignal}
        emptyText="No teacher attendance found."
      />

      <MobileIconButton
        variant="fab"
        href="/attendance/teachers/report"
        label="View attendance report"
      >
        <LuChartColumn size={24} aria-hidden="true" />
      </MobileIconButton>

      <MobileTeacherAttendanceForm
        open={formOpen}
        record={editing}
        onClose={() => setFormOpen(false)}
        onSaved={handleSaved}
        onDelete={
          canDelete
            ? () => {
                const record = rows.find((row) => row.id === editing?.id);
                setDeleting(record ?? null);
              }
            : undefined
        }
      />

      <MobileConfirmDialog
        open={deleting !== null}
        title="Delete attendance record?"
        description={
          deleting
            ? `Delete ${deleting.teacher}'s attendance for ${dayjs(deleting.date).format(DISPLAY_DATE)}? This permanently removes the record.`
            : "Delete this attendance record?"
        }
        confirmText="Delete"
        cancelText="Cancel"
        danger
        confirmLoading={isDeleting}
        onConfirm={() => void handleDelete()}
        onClose={() => {
          if (!isDeleting) setDeleting(null);
        }}
      />

      <MobileFeedbackDialog
        open={feedback !== null}
        tone={feedback?.tone ?? "success"}
        message={feedback?.message ?? ""}
        onClose={() => setFeedback(null)}
      />
    </div>
  );
}
