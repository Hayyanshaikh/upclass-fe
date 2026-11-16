"use client";

import { useEffect, useMemo, useState } from "react";
import { isAxiosError } from "axios";
import { LuChevronRight, LuPlus, LuTrash2 } from "react-icons/lu";
import StatusBadge from "@/components/ui/StatusBadge";
import MobileConfirmDialog from "@/components/mobile/dialogs/MobileConfirmDialog";
import MobileFeedbackDialog from "@/components/mobile/dialogs/MobileFeedbackDialog";
import MobileClassForm from "@/components/mobile/forms/MobileClassForm";
import MobileIconButton from "@/components/mobile/ui/MobileIconButton";
import MobileList from "@/components/mobile/ui/MobileList";
import { classStatusFilterOptions } from "@/constants/classes";
import { classManipulator } from "@/lib/api/classes";
import { useTable } from "@/hooks/useTable";
import { useRolePermission } from "@/hooks/useRolePermission";
import { useTeacherDropdown } from "@/hooks/useTeacherDropdown";
import {
  useClassesControllerFindAll,
  useClassesControllerRemove,
} from "@/app/api/endpoints";
import type { ClassDto } from "@/app/api/schemas";
import type {
  ClassFilters,
  ClassRecord,
  ClassesListResponse,
} from "@/types/class-management";

type Feedback = {
  tone: "success" | "error";
  message: string;
};

function getErrorMessage(error: unknown, fallback: string) {
  if (!isAxiosError(error)) {
    return error instanceof Error ? error.message : fallback;
  }

  const body = error.response?.data as
    | { message?: string; data?: { errors?: string[] } }
    | undefined;

  return body?.data?.errors?.[0] ?? body?.message ?? fallback;
}

function mergeClasses(current: ClassDto[], incoming: ClassDto[]) {
  const seen = new Set(current.map((schoolClass) => schoolClass.id));
  return [
    ...current,
    ...incoming.filter((schoolClass) => !seen.has(schoolClass.id)),
  ];
}

function ClassCardBody({ record }: { record: ClassRecord }) {
  const sectionNames = record.sections
    .map((section) => section.section)
    .join(", ");
  const teacherNames = [
    ...new Set(record.sections.map((section) => section.teacherName)),
  ].join(", ");

  return (
    <div className="min-w-0 flex-1">
      <p className="truncate text-sm font-semibold text-dark">{record.name}</p>
      <p className="mt-0.5 truncate text-xs text-gray">
        {record.academicYear}
        {sectionNames ? ` · ${sectionNames}` : ""}
      </p>
      {teacherNames && (
        <p className="mt-0.5 truncate text-xs text-gray">{teacherNames}</p>
      )}
      <div className="mt-2 flex flex-wrap items-center gap-1.5">
        <StatusBadge
          variant={record.status === "Active" ? "success" : "neutral"}
        >
          {record.status}
        </StatusBadge>
      </div>
    </div>
  );
}

export default function MobileClasses() {
  const [formOpen, setFormOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassDto | undefined>();
  const [deletingClass, setDeletingClass] = useState<ClassRecord | null>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [classDtos, setClassDtos] = useState<ClassDto[]>([]);
  const [listResetSignal, setListResetSignal] = useState(0);

  const { canCreate, canDelete, canEdit } = useRolePermission("classes");

  const {
    page,
    pageSize,
    offset,
    search,
    filters,
    setPage,
    setSearch,
    setFilters,
  } = useTable<ClassFilters>({
    pageSize: 10,
    debounceMs: 400,
  });

  const { options: teacherOptions } = useTeacherDropdown();

  const teacherNames = useMemo(
    () =>
      Object.fromEntries(
        teacherOptions.map((teacher) => [teacher.value, teacher.label]),
      ),
    [teacherOptions],
  );

  const {
    data: classesResponse,
    isFetching,
    isError,
    refetch,
  } = useClassesControllerFindAll<ClassesListResponse>({
    searchKey: search,
    teacher: filters.teacher,
    status: filters.status,
    limit: pageSize,
    offset,
  });

  const { mutateAsync: removeClass, isPending: isDeleting } =
    useClassesControllerRemove();

  const responseData = classesResponse?.data;
  const total = classesResponse?.total ?? 0;
  const lastPage = Math.max(1, Math.ceil(total / pageSize));

  const records = useMemo(
    () => classManipulator(classDtos, teacherNames),
    [classDtos, teacherNames],
  );

  useEffect(() => {
    if (!responseData) return;
    setClassDtos((previous) =>
      page === 1 ? responseData : mergeClasses(previous, responseData),
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
      filters.teacher !== undefined ||
      filters.status !== undefined;

    setSearch("");
    setFilters({ teacher: undefined, status: undefined });
    setPage(1);
    setListResetSignal((signal) => signal + 1);

    if (!hasActiveQuery) void refetch();
  }

  function openCreateForm() {
    setEditingClass(undefined);
    setFormOpen(true);
  }

  function openEditForm(record: ClassRecord) {
    const schoolClass = classDtos.find((item) => item.id === record.id);
    if (!schoolClass) return;

    setEditingClass(schoolClass);
    setFormOpen(true);
  }

  function handleSaved(message: string) {
    setFormOpen(false);
    setFeedback({ tone: "success", message });
    refreshFromFirstPage();
  }

  async function handleDelete() {
    if (!deletingClass) return;

    const deletedId = deletingClass.id;

    try {
      await removeClass({ id: deletedId });
      setDeletingClass(null);
      setClassDtos((previous) =>
        previous.filter((schoolClass) => schoolClass.id !== deletedId),
      );
      setFeedback({
        tone: "success",
        message: "Class deleted successfully.",
      });
      setFormOpen(false);
      resetListing();
    } catch (error) {
      setDeletingClass(null);
      setFeedback({
        tone: "error",
        message: getErrorMessage(error, "Unable to delete class."),
      });
    }
  }

  return (
    <div className="flex flex-col gap-4 pb-20">
      <h1 className="text-lg font-bold text-dark">Classes</h1>

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
              <ClassCardBody record={record} />
              <LuChevronRight
                size={18}
                className="shrink-0 text-gray"
                aria-hidden="true"
              />
            </button>
          ) : (
            <div className="flex items-center gap-2 rounded-lg border border-border bg-background p-4">
              <ClassCardBody record={record} />
              {canDelete && (
                <MobileIconButton
                  variant="danger"
                  label={`Delete ${record.name}`}
                  onClick={() => setDeletingClass(record)}
                >
                  <LuTrash2 size={18} aria-hidden="true" />
                </MobileIconButton>
              )}
            </div>
          )
        }
        search={{
          placeholder: "Search by class, section, room, or teacher",
          onChange: setSearch,
        }}
        filters={{
          fields: [
            {
              name: "teacher",
              label: "Class Teacher",
              placeholder: "Any teacher",
              options: teacherOptions,
            },
            {
              name: "status",
              label: "Status",
              placeholder: "Any status",
              options: classStatusFilterOptions,
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
        emptyText="No classes found."
      />

      {canCreate && (
        <MobileIconButton
          variant="fab"
          label="Add class"
          onClick={openCreateForm}
        >
          <LuPlus size={24} aria-hidden="true" />
        </MobileIconButton>
      )}

      <MobileClassForm
        open={formOpen}
        schoolClass={editingClass}
        onClose={() => setFormOpen(false)}
        onSaved={handleSaved}
        onDelete={
          canDelete
            ? () => {
                const record = records.find(
                  (item) => item.id === editingClass?.id,
                );
                setDeletingClass(record ?? null);
              }
            : undefined
        }
      />

      <MobileConfirmDialog
        open={deletingClass !== null}
        title="Delete class?"
        description={
          deletingClass
            ? `Delete Class ${deletingClass.label}?`
            : "Delete this class?"
        }
        confirmText="Delete"
        cancelText="Cancel"
        danger
        confirmLoading={isDeleting}
        onConfirm={() => void handleDelete()}
        onClose={() => setDeletingClass(null)}
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
