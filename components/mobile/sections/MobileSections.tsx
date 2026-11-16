"use client";

import { useEffect, useState } from "react";
import { isAxiosError } from "axios";
import { LuChevronRight, LuPlus, LuTrash2 } from "react-icons/lu";
import StatusBadge from "@/components/ui/StatusBadge";
import MobileConfirmDialog from "@/components/mobile/dialogs/MobileConfirmDialog";
import MobileFeedbackDialog from "@/components/mobile/dialogs/MobileFeedbackDialog";
import MobileSectionForm from "@/components/mobile/forms/MobileSectionForm";
import MobileIconButton from "@/components/mobile/ui/MobileIconButton";
import MobileList from "@/components/mobile/ui/MobileList";
import { sectionStatusOptions } from "@/constants/sections";
import { useTable } from "@/hooks/useTable";
import { useRolePermission } from "@/hooks/useRolePermission";
import {
  useSectionsControllerFindAll,
  useSectionsControllerRemove,
} from "@/app/api/endpoints";
import type {
  SectionDto,
  SectionsControllerFindAllStatus,
} from "@/app/api/schemas";

type Feedback = {
  tone: "success" | "error";
  message: string;
};

type SectionFilters = {
  status?: SectionsControllerFindAllStatus;
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

function mergeSections(current: SectionDto[], incoming: SectionDto[]) {
  const seen = new Set(current.map((section) => section.id));
  return [
    ...current,
    ...incoming.filter((section) => !seen.has(section.id)),
  ];
}

function SectionCardBody({ section }: { section: SectionDto }) {
  return (
    <div className="min-w-0 flex-1">
      <p className="truncate text-sm font-semibold text-dark">
        {section.name}
      </p>
      <div className="mt-2 flex flex-wrap items-center gap-1.5">
        <StatusBadge
          variant={section.status === "ACTIVE" ? "success" : "neutral"}
        >
          {section.status}
        </StatusBadge>
      </div>
    </div>
  );
}

export default function MobileSections() {
  const [formOpen, setFormOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<
    SectionDto | undefined
  >();
  const [deletingSection, setDeletingSection] = useState<SectionDto | null>(
    null,
  );
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [sectionDtos, setSectionDtos] = useState<SectionDto[]>([]);
  const [listResetSignal, setListResetSignal] = useState(0);

  const { canCreate, canDelete, canEdit } = useRolePermission("sections");

  const {
    page,
    pageSize,
    offset,
    search,
    filters,
    setPage,
    setSearch,
    setFilters,
  } = useTable<SectionFilters>({
    pageSize: 10,
    debounceMs: 400,
  });

  const {
    data: sectionsResponse,
    isFetching,
    isError,
    refetch,
  } = useSectionsControllerFindAll({
    searchKey: search,
    status: filters.status,
    limit: pageSize,
    offset,
  });

  const { mutateAsync: removeSection, isPending: isDeleting } =
    useSectionsControllerRemove();

  const responseData = sectionsResponse?.data;
  const total = sectionsResponse?.total ?? 0;
  const lastPage = Math.max(1, Math.ceil(total / pageSize));

  useEffect(() => {
    if (!responseData) return;
    setSectionDtos((previous) =>
      page === 1 ? responseData : mergeSections(previous, responseData),
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
      page > 1 || search !== "" || filters.status !== undefined;

    setSearch("");
    setFilters({ status: undefined });
    setPage(1);
    setListResetSignal((signal) => signal + 1);

    if (!hasActiveQuery) void refetch();
  }

  function openCreateForm() {
    setEditingSection(undefined);
    setFormOpen(true);
  }

  function openEditForm(section: SectionDto) {
    setEditingSection(section);
    setFormOpen(true);
  }

  function handleSaved(message: string) {
    setFormOpen(false);
    setFeedback({ tone: "success", message });
    refreshFromFirstPage();
  }

  async function handleDelete() {
    if (!deletingSection) return;

    const deletedId = deletingSection.id;

    try {
      await removeSection({ id: deletedId });
      setDeletingSection(null);
      setSectionDtos((previous) =>
        previous.filter((section) => section.id !== deletedId),
      );
      setFeedback({
        tone: "success",
        message: "Section deleted successfully.",
      });
      setFormOpen(false);
      resetListing();
    } catch (error) {
      setDeletingSection(null);
      setFeedback({
        tone: "error",
        message: getErrorMessage(error, "Unable to delete section."),
      });
    }
  }

  return (
    <div className="flex flex-col gap-4 pb-20">
      <h1 className="text-lg font-bold text-dark">Sections</h1>

      <MobileList
        items={sectionDtos}
        rowKey={(section) => section.id}
        renderItem={(section) =>
          canEdit ? (
            <button
              type="button"
              aria-label={`Edit ${section.name}`}
              onClick={() => openEditForm(section)}
              className="flex w-full items-center gap-2 rounded-lg border border-border bg-background p-4 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:bg-foreground"
            >
              <SectionCardBody section={section} />
              <LuChevronRight
                size={18}
                className="shrink-0 text-gray"
                aria-hidden="true"
              />
            </button>
          ) : (
            <div className="flex items-center gap-2 rounded-lg border border-border bg-background p-4">
              <SectionCardBody section={section} />
              {canDelete && (
                <MobileIconButton
                  variant="danger"
                  label={`Delete ${section.name}`}
                  onClick={() => setDeletingSection(section)}
                >
                  <LuTrash2 size={18} aria-hidden="true" />
                </MobileIconButton>
              )}
            </div>
          )
        }
        search={{ placeholder: "Search by section name", onChange: setSearch }}
        filters={{
          fields: [
            {
              name: "status",
              label: "Status",
              placeholder: "Any status",
              options: sectionStatusOptions,
            },
          ],
          values: filters,
          onApply: setFilters,
        }}
        loading={isFetching && sectionDtos.length === 0 && !isError}
        loadingMore={isFetching && sectionDtos.length > 0}
        error={isError && sectionDtos.length === 0}
        onRetry={() => void refetch()}
        hasMore={page < lastPage && sectionDtos.length > 0}
        onLoadMore={() => setPage(page + 1)}
        resetSignal={listResetSignal}
        emptyText="No sections found."
      />

      {canCreate && (
        <MobileIconButton
          variant="fab"
          label="Add section"
          onClick={openCreateForm}
        >
          <LuPlus size={24} aria-hidden="true" />
        </MobileIconButton>
      )}

      <MobileSectionForm
        open={formOpen}
        section={editingSection}
        onClose={() => setFormOpen(false)}
        onSaved={handleSaved}
        onDelete={
          canDelete
            ? () => {
                setDeletingSection(editingSection ?? null);
              }
            : undefined
        }
      />

      <MobileConfirmDialog
        open={deletingSection !== null}
        title="Delete section?"
        description={
          deletingSection
            ? `Remove ${deletingSection.name} from the section list?`
            : "Remove this section?"
        }
        confirmText="Delete"
        cancelText="Cancel"
        danger
        confirmLoading={isDeleting}
        onConfirm={() => void handleDelete()}
        onClose={() => setDeletingSection(null)}
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
