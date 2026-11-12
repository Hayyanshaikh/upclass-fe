"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { TableColumnsType } from "antd";
import ActionButtons from "@/components/shared/ActionButtons";
import DeleteDialog from "@/components/shared/DeleteDialog";
import PageHeader from "@/components/shared/PageHeader";
import SectionDetailsDialog from "@/components/dialogs/SectionDetailsDialog";
import StatusBadge from "@/components/ui/StatusBadge";
import Table from "@/components/ui/Table";
import { sectionStatusOptions } from "@/constants/sections";
import { useTable } from "@/hooks/useTable";
import {
  useSectionsControllerFindAll,
  useSectionsControllerRemove,
} from "@/app/api/endpoints";
import type { SectionsControllerFindAllStatus } from "@/app/api/schemas";
import { exportCsv } from "@/utils/export-csv";
import type { SectionDto } from "@/app/api/schemas";
import type {
  FilterField,
  TableAction,
  TableSearch,
} from "@/types/table-toolbar";
import { useRolePermission } from "@/hooks/useRolePermission";
import { LuDownload, LuPlus } from "react-icons/lu";

export default function Sections() {
  const router = useRouter();
  const [viewingSection, setViewingSection] = useState<SectionDto | null>(null);
  const [deletingSection, setDeletingSection] = useState<SectionDto | null>(
    null,
  );

  const { canCreate, canDelete, canEdit, canView, showActions } =
    useRolePermission("sections");

  const {
    page,
    pageSize,
    offset,
    search,
    filters,
    setPage,
    setSearch,
    setFilters,
  } = useTable<{ status?: SectionsControllerFindAllStatus }>({
    pageSize: 10,
    debounceMs: 400,
  });

  const { mutateAsync: removeSection, isPending: isDeleting } =
    useSectionsControllerRemove();
  const {
    data: response,
    isFetching,
    refetch,
  } = useSectionsControllerFindAll({
    searchKey: search,
    status: filters.status,
    limit: pageSize,
    offset,
  });

  const sections = response?.data ?? [];
  const total = response?.total ?? 0;

  function downloadCsv() {
    exportCsv("sections.csv", [
      ["Section", "Status"],
      ...sections.map((section) => [section.name, section.status]),
    ]);
  }

  const columns: TableColumnsType<SectionDto> = [
    {
      title: "Section",
      dataIndex: "name",
      key: "name",
      render: (name: string) => (
        <span className="font-bold text-dark">{name}</span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (sectionStatus: SectionDto["status"]) => (
        <StatusBadge
          variant={sectionStatus === "ACTIVE" ? "success" : "neutral"}
        >
          {sectionStatus}
        </StatusBadge>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      hidden: !showActions,
      width: 160,
      render: (_, section) => (
        <ActionButtons
          name={section.name}
          onView={() => setViewingSection(section)}
          onEdit={() =>
            router.push(`/sections/edit/${encodeURIComponent(section.id)}`)
          }
          onDelete={() => setDeletingSection(section)}
          showEdit={canEdit}
          showDelete={canDelete}
          showView={canView}
        />
      ),
    },
  ];

  const filterFields: FilterField[] = [
    {
      name: "status",
      label: "Status",
      placeholder: "Any",
      options: sectionStatusOptions,
    },
  ];

  const tableSearch: TableSearch = {
    placeholder: "Section name",
    onChange: setSearch,
  };

  const actions: TableAction[] = [
    {
      label: "Export page CSV",
      icon: <LuDownload size={18} aria-hidden="true" />,
      variant: "secondary",
      onClick: downloadCsv,
      showButton: true,
      disabled: sections.length === 0,
    },
    {
      label: "Add Section",
      icon: <LuPlus size={18} aria-hidden="true" />,
      showButton: canCreate,
      onClick: () => router.push("/sections/add"),
    },
  ];

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="shrink-0">
        <PageHeader title="Sections" />
      </div>
      <Table
        columns={columns}
        data={sections}
        total={total}
        rowKey="id"
        pageSize={pageSize}
        current={page}
        onPageChange={setPage}
        loading={isFetching}
        search={tableSearch}
        filterFields={filterFields}
        filterValues={filters}
        onFilterValuesChange={setFilters}
        actions={actions}
        scrollX={800}
        className="min-h-0"
      />

      <SectionDetailsDialog
        section={viewingSection}
        onClose={() => setViewingSection(null)}
        onEdit={(section) => {
          setViewingSection(null);
          router.push(`/sections/edit/${encodeURIComponent(section.id)}`);
        }}
      />
      <DeleteDialog
        open={deletingSection !== null}
        title="Delete section?"
        message={
          deletingSection
            ? `Remove ${deletingSection.name} from the section list?`
            : "Remove this section?"
        }
        onClose={() => setDeletingSection(null)}
        confirmLoading={isDeleting}
        onConfirm={async () => {
          if (!deletingSection) return;
          try {
            await removeSection({ id: deletingSection.id });
            setDeletingSection(null);
            refetch();
          } catch {
            // Error handled by antd dialog or global error boundary
          }
        }}
      />
    </div>
  );
}
