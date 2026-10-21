"use client";

import { useState } from "react";
import { flushSync } from "react-dom";
import { isAxiosError } from "axios";
import type { TableColumnsType } from "antd";
import { useRouter } from "next/navigation";
import { LuPlus } from "react-icons/lu";
import ActionButtons from "@/components/shared/ActionButtons";
import DeleteDialog from "@/components/shared/DeleteDialog";
import ErrorDialog from "@/components/shared/ErrorDialog";
import RoleDetailsDialog from "@/components/dialogs/RoleDetailsDialog";
import PageHeader from "@/components/shared/PageHeader";
import Button from "@/components/ui/Button";
import StatusBadge from "@/components/ui/StatusBadge";
import Table from "@/components/ui/Table";
import { roleTypeOptions } from "@/constants/roles";
import { ROUTE_NAMES } from "@/constants/routes";
import { useTable } from "@/hooks/useTable";
import {
  useRolesControllerFindAll,
  useRolesControllerRemove,
} from "@/app/api/endpoints";
import { RoleListItemDtoType, type RoleListItemDto } from "@/app/api/schemas";
import type {
  FilterField,
  TableAction,
  TableSearch,
} from "@/types/table-toolbar";

export default function RolesPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<RoleListItemDto | null>(null);
  const [roleToDelete, setRoleToDelete] = useState<RoleListItemDto | null>(
    null,
  );
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isDeleteErrorOpen, setIsDeleteErrorOpen] = useState(false);
  const { mutateAsync: removeRole, isPending: isDeleting } =
    useRolesControllerRemove();
  const {
    page,
    pageSize,
    offset,
    search,
    filters,
    setPage,
    setSearch,
    setFilters,
  } = useTable<{ type?: RoleListItemDto["type"] }>({ pageSize: 7 });

  const {
    data: response,
    isFetching,
    error,
    refetch,
  } = useRolesControllerFindAll({
    limit: pageSize,
    offset,
    searchKey: search,
    type: filters.type,
  });

  const roles = response?.data ?? [];
  const total = response?.total ?? 0;

  function editRole(role: RoleListItemDto) {
    flushSync(() => setSelectedRole(null));
    router.push(
      ROUTE_NAMES.editRole.replace(":id", encodeURIComponent(role.id)),
    );
  }

  async function confirmDelete() {
    if (!roleToDelete || isDeleting) return;

    setDeleteError(null);
    try {
      await removeRole({ id: roleToDelete.id });
      setRoleToDelete(null);
      if (page > 1 && offset >= total - 1) {
        setPage(page - 1);
      } else {
        void refetch();
      }
    } catch (error) {
      const message = isAxiosError(error)
        ? (error.response?.data as { message?: string } | undefined)?.message
        : undefined;
      setRoleToDelete(null);
      setDeleteError(message ?? "Unable to delete role. Please try again.");
    }
  }

  const columns: TableColumnsType<RoleListItemDto> = [
    {
      title: "Role",
      dataIndex: "name",
      render: (name: string) => (
        <span className="font-bold text-dark">{name}</span>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      render: (description: string | null) => (
        <span className="text-gray">{description || "—"}</span>
      ),
    },
    {
      title: "Users",
      dataIndex: "users",
      render: (users: number) =>
        `${users.toLocaleString()} ${users === 1 ? "user" : "users"}`,
    },
    {
      title: "Type",
      dataIndex: "type",
      render: (type: RoleListItemDto["type"]) => (
        <StatusBadge
          variant={type === RoleListItemDtoType.CUSTOM ? "success" : "neutral"}
        >
          {type === RoleListItemDtoType.SYSTEM_ROLE ? "System role" : "Custom"}
        </StatusBadge>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 160,
      render: (_, role) => (
        <ActionButtons
          name={role.name}
          onView={() => setSelectedRole(role)}
          onEdit={() => editRole(role)}
          onDelete={() => {
            setDeleteError(null);
            setIsDeleteErrorOpen(false);
            setRoleToDelete(role);
          }}
          deleteDisabled={
            role.type === RoleListItemDtoType.SYSTEM_ROLE ||
            role.users > 0 ||
            isDeleting
          }
          deleteDisabledReason={
            role.type === RoleListItemDtoType.SYSTEM_ROLE
              ? "System roles cannot be deleted"
              : role.users > 0
                ? "Remove assigned users before deleting this role"
                : undefined
          }
        />
      ),
    },
  ];

  const filterFields: FilterField[] = [
    {
      name: "type",
      label: "Type",
      placeholder: "Any",
      options: roleTypeOptions,
    },
  ];
  const tableSearch: TableSearch = {
    placeholder: "Role name",
    onChange: setSearch,
  };
  const beforeTable = error ? (
    <div
      role="alert"
      className="flex items-center gap-3 rounded-md border border-danger bg-danger/10 px-4 py-3 text-sm text-danger"
    >
      <span>Unable to load roles.</span>
      <Button variant="link" onClick={() => void refetch()}>
        Retry
      </Button>
    </div>
  ) : undefined;

  const actions: TableAction[] = [
    {
      label: "Add role",
      icon: <LuPlus size={18} aria-hidden="true" />,
      onClick: () => router.push(ROUTE_NAMES.createRole),
    },
  ];

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="shrink-0">
        <PageHeader title="Roles" />
      </div>
      <Table
        columns={columns}
        data={roles}
        total={total}
        loading={isFetching}
        beforeTable={beforeTable}
        pageSize={pageSize}
        current={page}
        onPageChange={setPage}
        search={tableSearch}
        filterFields={filterFields}
        filterValues={filters}
        onFilterValuesChange={setFilters}
        actions={actions}
      />
      <RoleDetailsDialog
        role={selectedRole}
        onClose={() => setSelectedRole(null)}
        onEdit={editRole}
      />
      <DeleteDialog
        open={roleToDelete !== null}
        title="Delete role?"
        message={`Remove ${roleToDelete?.name ?? "this role"} from the role list?`}
        description="This permanently deletes the role."
        okText="Delete role"
        confirmLoading={isDeleting}
        onClose={() => {
          if (!isDeleting) setRoleToDelete(null);
        }}
        onConfirm={() => void confirmDelete()}
        afterClose={() => {
          if (deleteError) setIsDeleteErrorOpen(true);
        }}
      />
      <ErrorDialog
        open={isDeleteErrorOpen}
        title="Unable to delete role"
        message={deleteError ?? "Unable to delete role. Please try again."}
        onClose={() => {
          setIsDeleteErrorOpen(false);
          setDeleteError(null);
        }}
      />
    </div>
  );
}
