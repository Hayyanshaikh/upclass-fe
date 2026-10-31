"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { TableColumnsType } from "antd";
import ActionButtons from "@/components/shared/ActionButtons";
import DeleteDialog from "@/components/shared/DeleteDialog";
import PageHeader from "@/components/shared/PageHeader";
import SubjectDetailsDialog from "@/components/dialogs/SubjectDetailsDialog";
import StatusBadge from "@/components/ui/StatusBadge";
import Table from "@/components/ui/Table";
import { subjectStatusOptions, subjectTypeOptions } from "@/constants/subjects";
import { useTable } from "@/hooks/useTable";
import {
  useSubjectsControllerFindAll,
  useSubjectsControllerRemove,
} from "@/app/api/endpoints";
import { exportCsv } from "@/utils/export-csv";
import type { SubjectDto } from "@/app/api/schemas";
import type { FilterField, TableSearch } from "@/types/table-toolbar";

export default function Subjects() {
  const router = useRouter();
  const [viewingSubject, setViewingSubject] = useState<SubjectDto | null>(null);
  const [deletingSubject, setDeletingSubject] = useState<SubjectDto | null>(
    null,
  );
  const {
    page,
    pageSize,
    offset,
    search,
    filters,
    setPage,
    setSearch,
    setFilters,
  } = useTable<{ type?: string; status?: string }>({
    pageSize: 10,
    debounceMs: 400,
  });

  const { mutateAsync: removeSubject, isPending: isDeleting } =
    useSubjectsControllerRemove();
  const {
    data: response,
    isFetching,
    refetch,
  } = useSubjectsControllerFindAll({
    searchKey: search,
    type: filters.type,
    status: filters.status,
    limit: pageSize,
    offset,
  });

  const subjects = response?.data ?? [];
  const total = response?.total ?? 0;

  function downloadCsv() {
    exportCsv("subjects.csv", [
      ["Subject", "Code", "Type", "Status"],
      ...subjects.map((subject) => [
        subject.name,
        subject.code,
        subject.type,
        subject.status,
      ]),
    ]);
  }

  const columns: TableColumnsType<SubjectDto> = [
    {
      title: "Subject",
      dataIndex: "name",
      key: "name",
      render: (name: string) => (
        <span className="font-bold text-dark">{name}</span>
      ),
    },
    { title: "Code", dataIndex: "code", key: "code" },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (subjectType: SubjectDto["type"]) => (
        <StatusBadge
          variant={
            subjectType === "THEORY" || subjectType === "MIXED"
              ? "success"
              : "warning"
          }
        >
          {subjectType}
        </StatusBadge>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (subjectStatus: SubjectDto["status"]) => (
        <StatusBadge
          variant={subjectStatus === "ACTIVE" ? "success" : "neutral"}
        >
          {subjectStatus}
        </StatusBadge>
      ),
    },
    {
      title: "Actions",
      key: "actions",

      width: 160,
      render: (_, subject) => (
        <ActionButtons
          name={subject.name}
          onView={() => setViewingSubject(subject)}
          onEdit={() =>
            router.push(`/subjects/edit/${encodeURIComponent(subject.id)}`)
          }
          onDelete={() => setDeletingSubject(subject)}
        />
      ),
    },
  ];

  const filterFields: FilterField[] = [
    {
      name: "type",
      label: "Type",
      placeholder: "Any",
      options: subjectTypeOptions,
    },
    {
      name: "status",
      label: "Status",
      placeholder: "Any",
      options: subjectStatusOptions,
    },
  ];

  const tableSearch: TableSearch = {
    placeholder: "Subject name or code",
    onChange: setSearch,
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="shrink-0">
        <PageHeader title="Subjects" />
      </div>
      <Table
        columns={columns}
        data={subjects}
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
        actions={[
          { label: "Export CSV", variant: "secondary", onClick: downloadCsv },
          { label: "Add subject", onClick: () => router.push("/subjects/add") },
        ]}
        scrollX={1000}
        className="min-h-0"
      />

      <SubjectDetailsDialog
        subject={viewingSubject}
        onClose={() => setViewingSubject(null)}
        onEdit={(subject) => {
          setViewingSubject(null);
          router.push(`/subjects/edit/${encodeURIComponent(subject.id)}`);
        }}
      />
      <DeleteDialog
        open={deletingSubject !== null}
        title="Delete subject?"
        message={
          deletingSubject
            ? `Remove ${deletingSubject.name} from the subject list?`
            : "Remove this subject?"
        }
        onClose={() => setDeletingSubject(null)}
        confirmLoading={isDeleting}
        onConfirm={async () => {
          if (!deletingSubject) return;
          try {
            await removeSubject({ id: deletingSubject.id });
            setDeletingSubject(null);
            refetch();
          } catch {
            // Error handled by antd dialog or global error boundary
          }
        }}
      />
    </div>
  );
}
