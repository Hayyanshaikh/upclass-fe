"use client";

import type { TableColumnsType } from "antd";
import { isAxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { flushSync } from "react-dom";
import ActionButtons from "@/components/shared/ActionButtons";
import Button from "@/components/ui/Button";
import DeleteDialog from "@/components/shared/DeleteDialog";
import PageHeader from "@/components/shared/PageHeader";
import UserDetailsDialog from "@/components/dialogs/UserDetailsDialog";
import StatusBadge from "@/components/ui/StatusBadge";
import Table from "@/components/ui/Table";
import { userStatusVariants } from "@/constants/users";
import { exportCsv } from "@/utils/export-csv";
import type { UserAccount, UserStatus } from "@/types/user-management";
import {
  useUserControllerFindAll,
  useUserControllerRemove,
} from "@/app/api/endpoints";
import { userManipulator } from "@/lib/api/users";
import { useIsSuperAdmin } from "@/hooks/useIsSuperAdmin";
import { useRoleDropdown } from "@/hooks/useRoleDropdown";
import { useTable } from "@/hooks/useTable";
import type {
  FilterField,
  TableAction,
  TableSearch,
} from "@/types/table-toolbar";
import { useRolePermission } from "@/hooks/useRolePermission";

export default function UsersPage() {
  const router = useRouter();
  const { options: roleOptions, isError: rolesError } = useRoleDropdown();
  const { isSuperAdmin } = useIsSuperAdmin();
  const [selectedUser, setSelectedUser] = useState<UserAccount | null>(null);
  const [userToDelete, setUserToDelete] = useState<UserAccount | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const { mutateAsync: removeUser, isPending: isDeleting } =
    useUserControllerRemove();

  const { canCreate, canDelete, canEdit, canView, showActions } =
    useRolePermission("users");

  const {
    page,
    pageSize,
    offset,
    search,
    filters,
    setPage,
    setFilters,
    setSearch,
  } = useTable();

  const {
    data: users,
    isFetching,
    error,
    refetch,
  } = useUserControllerFindAll({
    limit: pageSize,
    offset,
    searchKey: search,
    role: filters.role,
  });

  const total = users?.total ?? 0;
  const userData = userManipulator(users?.data);

  function downloadCsv() {
    exportCsv("users-page.csv", [
      ["Name", "Email", "Role", "isActive"],
      ...userData.map((user) => [
        user.name,
        user.email,
        user.role,
        String(user.isActive),
      ]),
    ]);
  }

  function editUser(user: UserAccount) {
    flushSync(() => setSelectedUser(null));
    router.push(`/users/edit/${encodeURIComponent(user.id)}`);
  }

  async function confirmDelete() {
    if (!userToDelete || userToDelete.isSystem || isDeleting) return;

    const id = userToDelete.id;
    setDeleteError(null);

    try {
      await removeUser({ id });
      setUserToDelete(null);
      if (page > 1 && offset >= total - 1) {
        setPage(page - 1);
      } else {
        void refetch();
      }
    } catch (error) {
      const message = isAxiosError(error)
        ? (error.response?.data as { message?: string } | undefined)?.message
        : undefined;
      setDeleteError(message ?? "Unable to delete user. Please try again.");
    }
  }

  let columns: TableColumnsType<UserAccount> = [
    {
      title: "Name",
      dataIndex: "name",
      render: (name: string) => (
        <span className="font-bold text-dark">{name}</span>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      render: (email: string) =>
        email === "—" ? <span className="text-gray">—</span> : email,
    },
    {
      title: "Role",
      dataIndex: "role",
      render: (value: string) => <StatusBadge>{value}</StatusBadge>,
    },
    {
      title: "Status",
      dataIndex: "isActive",
      render: (value: UserStatus) => (
        <StatusBadge variant={userStatusVariants[value]}>{value}</StatusBadge>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 160,
      render: (_, user) => (
        <ActionButtons
          name={user.name}
          showView={canView}
          showEdit={canEdit}
          showDelete={canDelete}
          // onView={() => setSelectedUser(user)}
          // onEdit={() => editUser(user)}
          // onDelete={() => {
          //   if (user.isSystem) return;
          //   setDeleteError(null);
          //   setUserToDelete(user);
          // }}
          deleteDisabled={user.isSystem || isDeleting}
          deleteDisabledReason={
            user.isSystem ? "System users cannot be deleted" : undefined
          }
        />
      ),
    },
  ];

  if (!showActions) {
    columns = columns?.filter((col) => col.key !== "actions");
  }

  const filterFields: FilterField[] = [
    {
      name: "role",
      label: "Role",
      placeholder: "Any role",
      options: roleOptions,
    },
  ];

  const tableSearch: TableSearch = {
    placeholder: "Search by Name",
    onChange: setSearch,
  };

  const actions: TableAction[] = [
    {
      label: "Export page CSV",
      variant: "secondary",
      onClick: downloadCsv,
      showButton: true,
      disabled: userData.length === 0,
    },
    {
      label: "Add user",
      showButton: canCreate,
      onClick: () => router.push("/users/add"),
    },
  ];

  const beforeTable =
    error || rolesError ? (
      <div
        role="alert"
        className="flex items-center gap-3 rounded-md border border-danger bg-danger/10 px-4 py-3 text-sm text-danger"
      >
        <span>
          {error ? "Unable to load users." : "Unable to load role options."}
        </span>
        {Boolean(error) && (
          <Button variant="link" onClick={() => void refetch()}>
            Retry
          </Button>
        )}
      </div>
    ) : undefined;

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="shrink-0">
        <PageHeader title="Users" />
      </div>
      <Table
        columns={columns}
        data={userData}
        total={total}
        loading={isFetching}
        beforeTable={beforeTable}
        pageSize={pageSize}
        current={page}
        search={tableSearch}
        onPageChange={setPage}
        filterValues={filters}
        onFilterValuesChange={setFilters}
        filterFields={filterFields}
        actions={actions}
      />
      <UserDetailsDialog
        user={selectedUser}
        onClose={() => setSelectedUser(null)}
        onEdit={editUser}
      />
      <DeleteDialog
        open={userToDelete !== null}
        title="Remove user?"
        message={`Remove ${userToDelete?.name ?? "this user"} from the user list?`}
        description={
          deleteError ? (
            <span role="alert" className="text-danger">
              {deleteError}
            </span>
          ) : (
            "This permanently deletes the user account."
          )
        }
        okText="Remove user"
        confirmLoading={isDeleting}
        onClose={() => {
          if (!isDeleting) setUserToDelete(null);
        }}
        onConfirm={() => void confirmDelete()}
      />
    </div>
  );
}
