"use client";

import { useEffect, useMemo, useState } from "react";
import { isAxiosError } from "axios";
import { LuChevronRight, LuPlus, LuTrash2 } from "react-icons/lu";
import StatusBadge from "@/components/ui/StatusBadge";
import MobileConfirmDialog from "@/components/mobile/dialogs/MobileConfirmDialog";
import MobileFeedbackDialog from "@/components/mobile/dialogs/MobileFeedbackDialog";
import MobileTeacherForm from "@/components/mobile/forms/MobileTeacherForm";
import MobileIconButton from "@/components/mobile/ui/MobileIconButton";
import MobileList from "@/components/mobile/ui/MobileList";
import { teacherManipulator } from "@/lib/api/teachers";
import { useTable } from "@/hooks/useTable";
import { useRolePermission } from "@/hooks/useRolePermission";
import { toOptions } from "@/utils/enum-options";
import {
  useTeachersControllerFindAll,
  useTeachersControllerRemove,
} from "@/app/api/endpoints";
import {
  TeachersControllerFindAllEmploymentType,
  TeachersControllerFindAllStatus,
  type TeacherDto,
} from "@/app/api/schemas";
import type { TeacherAccount } from "@/types/teacher-management";

type Feedback = {
  tone: "success" | "error";
  message: string;
};

type TeacherFilters = {
  employmentType?: TeachersControllerFindAllEmploymentType;
  status?: TeachersControllerFindAllStatus;
};

const employmentTypeFilterOptions = toOptions(
  TeachersControllerFindAllEmploymentType,
  "hyphen",
);
const statusFilterOptions = toOptions(TeachersControllerFindAllStatus);

function getErrorMessage(error: unknown, fallback: string) {
  if (!isAxiosError(error)) {
    return error instanceof Error ? error.message : fallback;
  }

  const body = error.response?.data as
    | { message?: string; data?: { errors?: string[] } }
    | undefined;

  return body?.data?.errors?.[0] ?? body?.message ?? fallback;
}

function mergeTeachers(current: TeacherDto[], incoming: TeacherDto[]) {
  const seen = new Set(current.map((teacher) => teacher.id));
  return [
    ...current,
    ...incoming.filter((teacher) => !seen.has(teacher.id)),
  ];
}

function TeacherCardBody({ record }: { record: TeacherAccount }) {
  return (
    <div className="min-w-0 flex-1">
      <p className="truncate text-sm font-semibold text-dark">{record.name}</p>
      <p className="mt-0.5 truncate text-xs text-gray">
        {record.employeeId} · {record.employmentType}
      </p>
      <p className="mt-0.5 truncate text-xs text-gray">
        {record.phone}
        {record.email !== "—" ? ` · ${record.email}` : ""}
      </p>
      <div className="mt-2 flex flex-wrap items-center gap-1.5">
        <StatusBadge
          variant={record.isActive === "Active" ? "success" : "neutral"}
        >
          {record.isActive}
        </StatusBadge>
      </div>
    </div>
  );
}

export default function MobileTeachers() {
  const [formOpen, setFormOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<
    TeacherDto | undefined
  >();
  const [deletingTeacher, setDeletingTeacher] = useState<TeacherAccount | null>(
    null,
  );
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [teacherDtos, setTeacherDtos] = useState<TeacherDto[]>([]);
  const [listResetSignal, setListResetSignal] = useState(0);

  const { canCreate, canDelete, canEdit } = useRolePermission("teachers");

  const {
    page,
    pageSize,
    offset,
    search,
    filters,
    setPage,
    setSearch,
    setFilters,
  } = useTable<TeacherFilters>({
    pageSize: 10,
    debounceMs: 400,
  });

  const {
    data: teachersResponse,
    isFetching,
    isError,
    refetch,
  } = useTeachersControllerFindAll({
    searchKey: search,
    employmentType: filters.employmentType,
    status: filters.status,
    limit: pageSize,
    offset,
  });

  const { mutateAsync: removeTeacher, isPending: isDeleting } =
    useTeachersControllerRemove();

  const responseData = teachersResponse?.data;
  const total = teachersResponse?.total ?? 0;
  const lastPage = Math.max(1, Math.ceil(total / pageSize));

  const records = useMemo(() => teacherManipulator(teacherDtos), [teacherDtos]);

  useEffect(() => {
    if (!responseData) return;
    setTeacherDtos((previous) =>
      page === 1 ? responseData : mergeTeachers(previous, responseData),
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
      filters.employmentType !== undefined ||
      filters.status !== undefined;

    setSearch("");
    setFilters({ employmentType: undefined, status: undefined });
    setPage(1);
    setListResetSignal((signal) => signal + 1);

    if (!hasActiveQuery) void refetch();
  }

  function openCreateForm() {
    setEditingTeacher(undefined);
    setFormOpen(true);
  }

  function openEditForm(record: TeacherAccount) {
    const teacher = teacherDtos.find((item) => item.id === record.id);
    if (!teacher) return;

    setEditingTeacher(teacher);
    setFormOpen(true);
  }

  function handleSaved(message: string) {
    setFormOpen(false);
    setFeedback({ tone: "success", message });
    refreshFromFirstPage();
  }

  async function handleDelete() {
    if (!deletingTeacher || deletingTeacher.isSystem) return;

    const deletedId = deletingTeacher.id;

    try {
      await removeTeacher({ id: deletedId });
      setDeletingTeacher(null);
      setTeacherDtos((previous) =>
        previous.filter((teacher) => teacher.id !== deletedId),
      );
      setFeedback({
        tone: "success",
        message: "Teacher deleted successfully.",
      });
      setFormOpen(false);
      resetListing();
    } catch (error) {
      setDeletingTeacher(null);
      setFeedback({
        tone: "error",
        message: getErrorMessage(error, "Unable to delete teacher."),
      });
    }
  }

  return (
    <div className="flex flex-col gap-4 pb-20">
      <h1 className="text-lg font-bold text-dark">Teachers</h1>

      <MobileList
        items={records}
        rowKey={(record) => record.id}
        renderItem={(record) =>
          canEdit ? (
            <button
              type="button"
              aria-label={`Edit ${record.name}`}
              onClick={() => openEditForm(record)}
              className="flex w-full items-center gap-2 rounded-lg border border-border bg-background p-4 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:bg-foreground"
            >
              <TeacherCardBody record={record} />
              <LuChevronRight
                size={18}
                className="shrink-0 text-gray"
                aria-hidden="true"
              />
            </button>
          ) : (
            <div className="flex items-center gap-2 rounded-lg border border-border bg-background p-4">
              <TeacherCardBody record={record} />
              {canDelete && (
                <MobileIconButton
                  variant="danger"
                  label={`Delete ${record.name}`}
                  onClick={() => setDeletingTeacher(record)}
                >
                  <LuTrash2 size={18} aria-hidden="true" />
                </MobileIconButton>
              )}
            </div>
          )
        }
        search={{ placeholder: "Search by name or employee ID", onChange: setSearch }}
        filters={{
          fields: [
            {
              name: "employmentType",
              label: "Employment type",
              placeholder: "Any employment",
              options: employmentTypeFilterOptions,
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
        loading={isFetching && records.length === 0 && !isError}
        loadingMore={isFetching && records.length > 0}
        error={isError && records.length === 0}
        onRetry={() => void refetch()}
        hasMore={page < lastPage && records.length > 0}
        onLoadMore={() => setPage(page + 1)}
        resetSignal={listResetSignal}
        emptyText="No teachers found."
      />

      {canCreate && (
        <MobileIconButton
          variant="fab"
          label="Add teacher"
          onClick={openCreateForm}
        >
          <LuPlus size={24} aria-hidden="true" />
        </MobileIconButton>
      )}

      <MobileTeacherForm
        open={formOpen}
        teacher={editingTeacher}
        onClose={() => setFormOpen(false)}
        onSaved={handleSaved}
        onDelete={
          canDelete
            ? () => {
                const record = records.find(
                  (item) => item.id === editingTeacher?.id,
                );
                setDeletingTeacher(record ?? null);
              }
            : undefined
        }
      />

      <MobileConfirmDialog
        open={deletingTeacher !== null}
        title="Delete teacher?"
        description={
          deletingTeacher
            ? `Delete ${deletingTeacher.name} and their linked user account? This is done only when the user has no other linked records.`
            : "Delete this teacher?"
        }
        confirmText="Delete"
        cancelText="Cancel"
        danger
        confirmLoading={isDeleting}
        onConfirm={() => void handleDelete()}
        onClose={() => setDeletingTeacher(null)}
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
