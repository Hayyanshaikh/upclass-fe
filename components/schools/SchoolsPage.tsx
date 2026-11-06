"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { isAxiosError } from "axios";
import type { TableColumnsType } from "antd";
import ActionButtons from "@/components/shared/ActionButtons";
import DeleteDialog from "@/components/shared/DeleteDialog";
import ErrorDialog from "@/components/shared/ErrorDialog";
import PageHeader from "@/components/shared/PageHeader";
import StatusBadge from "@/components/ui/StatusBadge";
import Table from "@/components/ui/Table";
import { useTable } from "@/hooks/useTable";
import {
  useSchoolsControllerFindAll,
  useSchoolsControllerRemove,
} from "@/app/api/endpoints";
import { exportCsv } from "@/utils/export-csv";
import type { SchoolDto } from "@/app/api/schemas";
import type {
  FilterField,
  TableAction,
  TableSearch,
} from "@/types/table-toolbar";
import { useRolePermission } from "@/hooks/useRolePermission";
import { LuDownload, LuPlus } from "react-icons/lu";
import Button from "../ui/Button";
import dayjs from "dayjs";
import { DISPLAY_DATE } from "@/constants/date-formats";

export default function SchoolsPage() {
  const router = useRouter();
  const [deletingSchool, setDeletingSchool] = useState<SchoolDto | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isDeleteErrorOpen, setIsDeleteErrorOpen] = useState(false);
  const { mutateAsync: removeSchool, isPending: isDeleting } =
    useSchoolsControllerRemove();

  const { canCreate, canDelete, canEdit, canView, showActions } =
    useRolePermission("schools");

  const {
    page,
    pageSize,
    offset,
    search,
    filters,
    setPage,
    setSearch,
    setFilters,
  } = useTable<{ status?: string }>({
    pageSize: 10,
    debounceMs: 400,
  });

  const {
    data: response,
    isFetching,
    refetch,
  } = useSchoolsControllerFindAll({
    searchKey: search,
    status: filters.status,
    limit: pageSize,
    offset,
  });

  const schools = response?.data ?? [];
  const total = response?.total ?? 0;

  function downloadCsv() {
    exportCsv("schools.csv", [
      ["School Name", "Email", "Phone", "Address", "Status", "Created At"],
      ...schools.map((school) => [
        school.name,
        school.email ?? "—",
        school.phone ?? "—",
        school.address ?? "—",
        school.isActive ? "Active" : "Inactive",
        school.createdAt
          ? new Date(school.createdAt).toLocaleDateString()
          : "—",
      ]),
    ]);
  }

  let columns: TableColumnsType<SchoolDto> = [
    {
      title: "School Name",
      dataIndex: "name",
      key: "name",
      render: (name: string) => (
        <span className="font-bold text-dark">{name}</span>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (email: string | null) =>
        email === null ? <span className="text-gray">—</span> : email,
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      render: (phone: string | null) =>
        phone === null ? <span className="text-gray">—</span> : phone,
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      render: (address: string | null) =>
        address === null ? <span className="text-gray">—</span> : address,
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      render: (value: boolean) => (
        <StatusBadge variant={value ? "success" : "neutral"}>
          {value ? "Active" : "Inactive"}
        </StatusBadge>
      ),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt: string) =>
        createdAt ? dayjs(createdAt).format(DISPLAY_DATE) : "—",
    },
    {
      title: "Actions",
      key: "actions",
      hidden: !showActions,
      width: 160,
      render: (_, school) => (
        <ActionButtons
          name={school.name}
          showView={canView}
          showEdit={canEdit}
          showDelete={canDelete}
          onView={() => {}}
          onEdit={() => router.push(`/schools/edit/${school.id}`)}
          onDelete={() => setDeletingSchool(school)}
          deleteDisabled={isDeleting}
        />
      ),
    },
  ];

  if (!showActions) {
    columns = columns?.filter((col) => col.key !== "actions");
  }

  const filterFields: FilterField[] = [
    {
      name: "status",
      label: "Status",
      placeholder: "Any status",
      options: [
        { label: "Active", value: "true" },
        { label: "Inactive", value: "false" },
      ],
    },
  ];

  const tableSearch: TableSearch = {
    placeholder: "Search by name, email, or address",
    onChange: setSearch,
  };

  const actions: TableAction[] = [
    {
      label: "Export page CSV",
      icon: <LuDownload size={18} aria-hidden="true" />,
      variant: "secondary",
      onClick: downloadCsv,
      showButton: true,
      disabled: schools.length === 0,
    },
    {
      label: "Add School",
      icon: <LuPlus size={18} aria-hidden="true" />,
      showButton: canCreate,
      onClick: () => router.push("/schools/add"),
    },
  ];

  const beforeTable =
    response === undefined && !isFetching ? (
      <div
        role="alert"
        className="flex items-center gap-3 rounded-md border border-danger bg-danger/10 px-4 py-3 text-sm text-danger"
      >
        <span>Unable to load schools.</span>
        <Button variant="link" onClick={() => void refetch()}>
          Retry
        </Button>
      </div>
    ) : undefined;

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="shrink-0">
        <PageHeader title="Schools" />
      </div>
      <Table
        columns={columns}
        data={schools}
        total={total}
        rowKey="id"
        pageSize={pageSize}
        current={page}
        onPageChange={setPage}
        loading={isFetching}
        beforeTable={beforeTable}
        search={tableSearch}
        filterFields={filterFields}
        filterValues={filters}
        onFilterValuesChange={setFilters}
        actions={actions}
        scrollX={1000}
        className="min-h-0"
      />
      <DeleteDialog
        open={deletingSchool !== null}
        title="Delete school?"
        message={
          deletingSchool
            ? `Remove ${deletingSchool.name} from the school list?`
            : "Remove this school?"
        }
        onClose={() => {
          if (!isDeleting) setDeletingSchool(null);
        }}
        confirmLoading={isDeleting}
        onConfirm={async () => {
          if (!deletingSchool) return;
          try {
            setDeleteError(null);
            await removeSchool({ id: deletingSchool.id });
            setDeletingSchool(null);
            refetch();
          } catch (error) {
            const message = isAxiosError(error)
              ? (error.response?.data as { message?: string } | undefined)
                  ?.message
              : undefined;
            setDeletingSchool(null);
            setDeleteError(
              message ?? "Unable to delete school. Please try again.",
            );
          }
        }}
        afterClose={() => {
          if (deleteError) setIsDeleteErrorOpen(true);
        }}
      />
      <ErrorDialog
        open={isDeleteErrorOpen}
        title="Unable to remove school"
        message={deleteError ?? "Unable to delete school. Please try again."}
        onClose={() => {
          setIsDeleteErrorOpen(false);
          setDeleteError(null);
        }}
      />
    </div>
  );
}
