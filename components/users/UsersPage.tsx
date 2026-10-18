"use client";

import type { TableColumnsType } from "antd";
import { isAxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { flushSync } from "react-dom";
import ActionButtons from "@/components/shared/ActionButtons";
import Button from "@/components/ui/Button";
import DeleteDialog from "@/components/shared/DeleteDialog";
import PageHeader from "@/components/shared/PageHeader";
import UserDetailsDialog from "@/components/dialogs/UserDetailsDialog";
import StatusBadge from "@/components/ui/StatusBadge";
import Table from "@/components/ui/Table";
import {
  userRoleOptions,
  userStatusOptions,
  userStatusVariants,
} from "@/constants/users";
import { exportCsv } from "@/utils/export-csv";
import { useStorageStore } from "@/stores/storage";
import type { UserAccount, UserStatus } from "@/types/user-management";
import {
  useUserControllerFindAll,
  useUserControllerRemove,
} from "@/app/api/endpoints";
import { userManipulator } from "@/lib/api/users";

export default function UsersPage() {
  const router = useRouter();
  const currentUserId = useStorageStore((state) => {
    const user = state.values.user;
    return user &&
      typeof user === "object" &&
      "id" in user &&
      typeof user.id === "string"
      ? user.id
      : undefined;
  });
  const [search, setSearch] = useState("");
  const [role, setRole] = useState<string>();
  const [status, setStatus] = useState<string>();
  const [page, setPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<UserAccount | null>(null);
  const [userToDelete, setUserToDelete] = useState<UserAccount | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const { mutateAsync: removeUser, isPending: isDeleting } =
    useUserControllerRemove();

  const {
    data: users,
    isFetching,
    error,
    refetch,
  } = useUserControllerFindAll();

  const records = Array.isArray(users) ? users : users?.data;
  const isSuperAdmin = Boolean(
    currentUserId &&
    records?.some(
      (user) => user.id === currentUserId && user.role?.slug === "super_admin",
    ),
  );
  const userData = userManipulator(records);

  function downloadCsv() {
    exportCsv("users.csv", [
      ["Name", "Email", "Role", "isActive"],
      ...(userData ?? []).map((user) => [
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
      refetch();
    } catch (error) {
      const message = isAxiosError(error)
        ? (error.response?.data as { message?: string } | undefined)?.message
        : undefined;
      setDeleteError(message ?? "Unable to delete user. Please try again.");
    }
  }

  const columns: TableColumnsType<UserAccount> = [
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
          onView={() => setSelectedUser(user)}
          onEdit={() => editUser(user)}
          onDelete={() => {
            if (user.isSystem) return;
            setDeleteError(null);
            setUserToDelete(user);
          }}
          deleteDisabled={user.isSystem || isDeleting}
          deleteDisabledReason={
            user.isSystem ? "System users cannot be deleted" : undefined
          }
        />
      ),
    },
  ];

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <div className="shrink-0">
        <PageHeader title="Users" />
      </div>
      <Table
        columns={columns}
        data={userData}
        loading={isFetching}
        beforeTable={
          error ? (
            <div
              role="alert"
              className="flex items-center gap-3 rounded-md border border-danger bg-danger/10 px-4 py-3 text-sm text-danger"
            >
              <span>Unable to load users.</span>
              <Button variant="link" onClick={() => void refetch()}>
                Retry
              </Button>
            </div>
          ) : undefined
        }
        pageSize={7}
        current={page}
        onPageChange={setPage}
        search={{ placeholder: "Name or email", onChange: setSearch }}
        filterFields={[
          {
            name: "role",
            label: "Role",
            placeholder: "Any role",
            options: userRoleOptions,
            onChange: setRole,
          },
          {
            name: "status",
            label: "Status",
            placeholder: "Any status",
            options: userStatusOptions,
            onChange: setStatus,
          },
        ]}
        actions={[
          { label: "Export CSV", variant: "secondary", onClick: downloadCsv },
          ...(isSuperAdmin
            ? [{ label: "Add user", onClick: () => router.push("/users/add") }]
            : []),
        ]}
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
