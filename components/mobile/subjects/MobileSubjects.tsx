"use client";

import { useEffect, useState } from "react";
import { isAxiosError } from "axios";
import { LuChevronRight, LuPlus, LuTrash2 } from "react-icons/lu";
import StatusBadge from "@/components/ui/StatusBadge";
import MobileConfirmDialog from "@/components/mobile/dialogs/MobileConfirmDialog";
import MobileFeedbackDialog from "@/components/mobile/dialogs/MobileFeedbackDialog";
import MobileSubjectForm from "@/components/mobile/forms/MobileSubjectForm";
import MobileIconButton from "@/components/mobile/ui/MobileIconButton";
import MobileList from "@/components/mobile/ui/MobileList";
import { subjectStatusOptions, subjectTypeOptions } from "@/constants/subjects";
import { useTable } from "@/hooks/useTable";
import { useRolePermission } from "@/hooks/useRolePermission";
import {
  useSubjectsControllerFindAll,
  useSubjectsControllerRemove,
} from "@/app/api/endpoints";
import type {
  SubjectDto,
  SubjectsControllerFindAllStatus,
  SubjectsControllerFindAllType,
} from "@/app/api/schemas";

type Feedback = {
  tone: "success" | "error";
  message: string;
};

type SubjectFilters = {
  type?: SubjectsControllerFindAllType;
  status?: SubjectsControllerFindAllStatus;
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

function subjectTypeVariant(type: SubjectDto["type"]) {
  return type === "THEORY" || type === "MIXED" ? "success" : "warning";
}

function mergeSubjects(current: SubjectDto[], incoming: SubjectDto[]) {
  const seen = new Set(current.map((subject) => subject.id));
  return [...current, ...incoming.filter((subject) => !seen.has(subject.id))];
}

function SubjectCardBody({ subject }: { subject: SubjectDto }) {
  return (
    <div className="min-w-0 flex-1 cursor-pointer">
      <p className="truncate text-sm font-semibold text-dark">{subject.name}</p>
      <p className="mt-0.5 text-xs text-gray">
        {subject.code} · {subject.defaultTotalMarks}/
        {subject.defaultPassingMarks} marks
      </p>
      <div className="mt-2 flex flex-wrap items-center gap-1.5">
        <StatusBadge
          variant={subject.status === "ACTIVE" ? "success" : "neutral"}
        >
          {subject.status}
        </StatusBadge>
        <StatusBadge variant={subjectTypeVariant(subject.type)}>
          {subject.type}
        </StatusBadge>
        {subject.hasPractical && (
          <StatusBadge variant="info">Practical</StatusBadge>
        )}
      </div>
    </div>
  );
}

export default function MobileSubjects() {
  const [formOpen, setFormOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<
    SubjectDto | undefined
  >();
  const [deletingSubject, setDeletingSubject] = useState<SubjectDto | null>(
    null,
  );
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [subjects, setSubjects] = useState<SubjectDto[]>([]);
  const [listResetSignal, setListResetSignal] = useState(0);

  const { canCreate, canDelete, canEdit } = useRolePermission("subjects");

  const {
    page,
    pageSize,
    offset,
    search,
    filters,
    setPage,
    setSearch,
    setFilters,
  } = useTable<SubjectFilters>({
    pageSize: 10,
    debounceMs: 400,
  });

  const {
    data: response,
    isFetching,
    isError,
    refetch,
  } = useSubjectsControllerFindAll({
    searchKey: search,
    type: filters.type,
    status: filters.status,
    limit: pageSize,
    offset,
  });

  const { mutateAsync: removeSubject, isPending: isDeleting } =
    useSubjectsControllerRemove();

  const responseData = response?.data;
  const total = response?.total ?? 0;
  const lastPage = Math.max(1, Math.ceil(total / pageSize));

  useEffect(() => {
    if (!responseData) return;
    setSubjects((previous) =>
      page === 1 ? responseData : mergeSubjects(previous, responseData),
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
      filters.type !== undefined ||
      filters.status !== undefined;

    setSearch("");
    setFilters({ type: undefined, status: undefined });
    setPage(1);
    setListResetSignal((signal) => signal + 1);

    if (!hasActiveQuery) void refetch();
  }

  function openCreateForm() {
    setEditingSubject(undefined);
    setFormOpen(true);
  }

  function openEditForm(subject: SubjectDto) {
    setEditingSubject(subject);
    setFormOpen(true);
  }

  function handleSaved(message: string) {
    setFormOpen(false);
    setFeedback({ tone: "success", message });
    refreshFromFirstPage();
  }

  async function handleDelete() {
    if (!deletingSubject) return;

    const deletedId = deletingSubject.id;

    try {
      await removeSubject({ id: deletedId });
      setDeletingSubject(null);
      setSubjects((previous) =>
        previous.filter((subject) => subject.id !== deletedId),
      );
      setFeedback({
        tone: "success",
        message: "Subject deleted successfully.",
      });
      setFormOpen(false);
      resetListing();
    } catch (error) {
      setDeletingSubject(null);
      setFeedback({
        tone: "error",
        message: getErrorMessage(error, "Unable to delete subject."),
      });
    }
  }

  return (
    <div className="flex flex-col gap-4 pb-20">
      <h1 className="text-lg font-bold text-dark">Subjects</h1>

      <MobileList
        items={subjects}
        rowKey={(subject) => subject.id}
        renderItem={(subject) =>
          canEdit ? (
            <button
              type="button"
              aria-label={`Edit ${subject.name}`}
              onClick={() => openEditForm(subject)}
              className="flex w-full items-center gap-2 rounded-lg border border-border bg-background p-4 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:bg-foreground"
            >
              <SubjectCardBody subject={subject} />
              <LuChevronRight
                size={18}
                className="shrink-0 text-gray"
                aria-hidden="true"
              />
            </button>
          ) : (
            <div className="flex items-center gap-2 rounded-lg border border-border bg-background p-4">
              <SubjectCardBody subject={subject} />
              {canDelete && (
                <MobileIconButton
                  variant="danger"
                  label={`Delete ${subject.name}`}
                  onClick={() => setDeletingSubject(subject)}
                >
                  <LuTrash2 size={18} aria-hidden="true" />
                </MobileIconButton>
              )}
            </div>
          )
        }
        search={{ placeholder: "Search name or code", onChange: setSearch }}
        filters={{
          fields: [
            {
              name: "type",
              label: "Type",
              placeholder: "Any type",
              options: subjectTypeOptions,
            },
            {
              name: "status",
              label: "Status",
              placeholder: "Any status",
              options: subjectStatusOptions,
            },
          ],
          values: filters,
          onApply: setFilters,
        }}
        loading={isFetching && subjects.length === 0 && !isError}
        loadingMore={isFetching && subjects.length > 0}
        error={isError && subjects.length === 0}
        onRetry={() => void refetch()}
        hasMore={page < lastPage && subjects.length > 0}
        onLoadMore={() => setPage(page + 1)}
        resetSignal={listResetSignal}
        emptyText="No subjects found."
      />

      {canCreate && (
        <MobileIconButton
          variant="fab"
          label="Add subject"
          onClick={openCreateForm}
        >
          <LuPlus size={24} aria-hidden="true" />
        </MobileIconButton>
      )}

      <MobileSubjectForm
        open={formOpen}
        subject={editingSubject}
        onClose={() => setFormOpen(false)}
        onSaved={handleSaved}
        onDelete={
          canDelete
            ? () => {
                setDeletingSubject(editingSubject ?? null);
              }
            : undefined
        }
      />

      <MobileConfirmDialog
        open={deletingSubject !== null}
        title="Delete subject?"
        description={
          deletingSubject
            ? `Remove ${deletingSubject.name} from the subject list?`
            : "Remove this subject?"
        }
        confirmText="Delete"
        cancelText="Cancel"
        danger
        confirmLoading={isDeleting}
        onConfirm={() => void handleDelete()}
        onClose={() => setDeletingSubject(null)}
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
