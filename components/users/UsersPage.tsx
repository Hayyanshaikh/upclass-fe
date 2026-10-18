"use client";

import type { TableColumnsType } from "antd";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { flushSync } from "react-dom";
import ActionButtons from "@/components/shared/ActionButtons";
import Button from "@/components/ui/Button";
import DeleteDialog from "@/components/shared/DeleteDialog";
import PageHeader from "@/components/shared/PageHeader";
import UserDetailsDialog from "@/components/dialogs/UserDetailsDialog";
import StatCard from "@/components/ui/StatCard";
import StatusBadge from "@/components/ui/StatusBadge";
import Table from "@/components/ui/Table";
import {
  userRoleOptions,
  userStatusOptions,
  userStatusVariants,
} from "@/constants/users";
import { exportCsv } from "@/utils/export-csv";
import { useUserStore } from "@/stores/users";
import type { UserAccount, UserStatus } from "@/types/user-management";
import { useUserControllerFindAll } from "@/app/api/endpoints";
import { useIsSuperAdmin } from "@/hooks/useIsSuperAdmin";
import { userManipulator } from "@/lib/api/users";

export default function UsersPage() {
  const router = useRouter();
  const { isSuperAdmin } = useIsSuperAdmin();
  const deleteUser = useUserStore((state) => state.deleteUser);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState<string>();
  const [status, setStatus] = useState<string>();
  const [page, setPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<UserAccount | null>(null);
  const [userToDelete, setUserToDelete] = useState<UserAccount | null>(null);

  const {
    data: users,
    isFetching,
    error,
    refetch,
  } = useUserControllerFindAll();

  const records = Array.isArray(users) ? users : users?.data;
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
          onDelete={() => setUserToDelete(user)}
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
        description="This only removes the account from this frontend preview."
        okText="Remove user"
        onClose={() => setUserToDelete(null)}
        onConfirm={() => {
          if (userToDelete) deleteUser(userToDelete.id);
          setUserToDelete(null);
        }}
      />
    </div>
  );
}
