"use client";

import { useEffect, useMemo, useState } from "react";
import { isAxiosError } from "axios";
import { LuChevronRight, LuPlus, LuTrash2 } from "react-icons/lu";
import StatusBadge from "@/components/ui/StatusBadge";
import MobileConfirmDialog from "@/components/mobile/dialogs/MobileConfirmDialog";
import MobileFeedbackDialog from "@/components/mobile/dialogs/MobileFeedbackDialog";
import MobileStudentForm from "@/components/mobile/forms/MobileStudentForm";
import MobileIconButton from "@/components/mobile/ui/MobileIconButton";
import MobileList from "@/components/mobile/ui/MobileList";
import { useClassDropdown } from "@/hooks/useClassDropdown";
import { useTable } from "@/hooks/useTable";
import { useRolePermission } from "@/hooks/useRolePermission";
import { toOptions } from "@/utils/enum-options";
import {
  useStudentsControllerFindAll,
  useStudentsControllerRemove,
} from "@/app/api/endpoints";
import {
  StudentsControllerFindAllStatus,
  type StudentDto,
} from "@/app/api/schemas";

type Feedback = {
  tone: "success" | "error";
  message: string;
};

type StudentFilters = {
  classId?: string;
  status?: StudentsControllerFindAllStatus;
};

const statusFilterOptions = toOptions(StudentsControllerFindAllStatus);

function getErrorMessage(error: unknown, fallback: string) {
  if (!isAxiosError(error)) {
    return error instanceof Error ? error.message : fallback;
  }

  const body = error.response?.data as
    | { message?: string; data?: { errors?: string[] } }
    | undefined;

  return body?.data?.errors?.[0] ?? body?.message ?? fallback;
}

function mergeStudents(current: StudentDto[], incoming: StudentDto[]) {
  const seen = new Set(current.map((student) => student.id));
  return [
    ...current,
    ...incoming.filter((student) => !seen.has(student.id)),
  ];
}

function StudentCardBody({
  student,
  className,
}: {
  student: StudentDto;
  className: string;
}) {
  const name = `${student.firstName} ${student.lastName}`.trim();

  return (
    <div className="min-w-0 flex-1">
      <p className="truncate text-sm font-semibold text-dark">{name}</p>
      <p className="mt-0.5 truncate text-xs text-gray">
        Roll {student.roll} · Class {className}
      </p>
      <p className="mt-0.5 truncate text-xs text-gray">
        {student.guardian} · {student.phone}
      </p>
      <div className="mt-2 flex flex-wrap items-center gap-1.5">
        <StatusBadge
          variant={student.status === "ACTIVE" ? "success" : "neutral"}
        >
          {student.status === "ACTIVE" ? "Active" : "Inactive"}
        </StatusBadge>
      </div>
    </div>
  );
}

export default function MobileStudents() {
  const [formOpen, setFormOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<
    StudentDto | undefined
  >();
  const [deletingStudent, setDeletingStudent] = useState<StudentDto | null>(
    null,
  );
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [studentDtos, setStudentDtos] = useState<StudentDto[]>([]);
  const [listResetSignal, setListResetSignal] = useState(0);

  const { canCreate, canDelete, canEdit } = useRolePermission("students");

  const {
    page,
    pageSize,
    offset,
    search,
    filters,
    setPage,
    setSearch,
    setFilters,
  } = useTable<StudentFilters>({
    pageSize: 10,
    debounceMs: 400,
  });

  const { options: classOptions } = useClassDropdown();

  const classNames = useMemo(
    () =>
      Object.fromEntries(
        classOptions.map((option) => [option.value, option.label]),
      ),
    [classOptions],
  );

  const {
    data: studentsResponse,
    isFetching,
    isError,
    refetch,
  } = useStudentsControllerFindAll({
    searchKey: search,
    classId: filters.classId,
    status: filters.status,
    limit: pageSize,
    offset,
  });

  const { mutateAsync: removeStudent, isPending: isDeleting } =
    useStudentsControllerRemove();

  const responseData = studentsResponse?.data;
  const total = studentsResponse?.total ?? 0;
  const lastPage = Math.max(1, Math.ceil(total / pageSize));

  useEffect(() => {
    if (!responseData) return;
    setStudentDtos((previous) =>
      page === 1 ? responseData : mergeStudents(previous, responseData),
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
      filters.classId !== undefined ||
      filters.status !== undefined;

    setSearch("");
    setFilters({ classId: undefined, status: undefined });
    setPage(1);
    setListResetSignal((signal) => signal + 1);

    if (!hasActiveQuery) void refetch();
  }

  function openCreateForm() {
    setEditingStudent(undefined);
    setFormOpen(true);
  }

  function openEditForm(student: StudentDto) {
    setEditingStudent(student);
    setFormOpen(true);
  }

  function handleSaved(message: string) {
    setFormOpen(false);
    setFeedback({ tone: "success", message });
    refreshFromFirstPage();
  }

  async function handleDelete() {
    if (!deletingStudent) return;

    const deletedId = deletingStudent.id;

    try {
      await removeStudent({ id: deletedId });
      setDeletingStudent(null);
      setStudentDtos((previous) =>
        previous.filter((student) => student.id !== deletedId),
      );
      setFeedback({
        tone: "success",
        message: "Student deleted successfully.",
      });
      setFormOpen(false);
      resetListing();
    } catch (error) {
      setDeletingStudent(null);
      setFeedback({
        tone: "error",
        message: getErrorMessage(error, "Unable to delete student."),
      });
    }
  }

  return (
    <div className="flex flex-col gap-4 pb-20">
      <h1 className="text-lg font-bold text-dark">Students</h1>

      <MobileList
        items={studentDtos}
        rowKey={(student) => student.id}
        renderItem={(student) =>
          canEdit ? (
            <button
              type="button"
              aria-label={`Edit ${student.firstName} ${student.lastName}`}
              onClick={() => openEditForm(student)}
              className="flex w-full items-center gap-2 rounded-lg border border-border bg-background p-4 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:bg-foreground"
            >
              <StudentCardBody
                student={student}
                className={classNames[student.classId] ?? "—"}
              />
              <LuChevronRight
                size={18}
                className="shrink-0 text-gray"
                aria-hidden="true"
              />
            </button>
          ) : (
            <div className="flex items-center gap-2 rounded-lg border border-border bg-background p-4">
              <StudentCardBody
                student={student}
                className={classNames[student.classId] ?? "—"}
              />
              {canDelete && (
                <MobileIconButton
                  variant="danger"
                  label={`Delete ${student.firstName} ${student.lastName}`}
                  onClick={() => setDeletingStudent(student)}
                >
                  <LuTrash2 size={18} aria-hidden="true" />
                </MobileIconButton>
              )}
            </div>
          )
        }
        search={{
          placeholder: "Search by name, roll, identity or guardian",
          onChange: setSearch,
        }}
        filters={{
          fields: [
            {
              name: "classId",
              label: "Class",
              placeholder: "All classes",
              options: classOptions,
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
        loading={isFetching && studentDtos.length === 0 && !isError}
        loadingMore={isFetching && studentDtos.length > 0}
        error={isError && studentDtos.length === 0}
        onRetry={() => void refetch()}
        hasMore={page < lastPage && studentDtos.length > 0}
        onLoadMore={() => setPage(page + 1)}
        resetSignal={listResetSignal}
        emptyText="No students found."
      />

      {canCreate && (
        <MobileIconButton
          variant="fab"
          label="Add student"
          onClick={openCreateForm}
        >
          <LuPlus size={24} aria-hidden="true" />
        </MobileIconButton>
      )}

      <MobileStudentForm
        open={formOpen}
        student={editingStudent}
        onClose={() => setFormOpen(false)}
        onSaved={handleSaved}
        onDelete={
          canDelete
            ? () => {
                setDeletingStudent(editingStudent ?? null);
              }
            : undefined
        }
      />

      <MobileConfirmDialog
        open={deletingStudent !== null}
        title="Delete student?"
        description={
          deletingStudent
            ? `${deletingStudent.firstName} ${deletingStudent.lastName} (Roll ${deletingStudent.roll}) will be permanently removed.`
            : "Delete this student?"
        }
        confirmText="Delete"
        cancelText="Cancel"
        danger
        confirmLoading={isDeleting}
        onConfirm={() => void handleDelete()}
        onClose={() => setDeletingStudent(null)}
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
