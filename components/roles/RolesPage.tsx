"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { TableColumnsType } from "antd";
import { LuCopy, LuPencil, LuTrash2 } from "react-icons/lu";
import ActionButtons from "@/components/shared/ActionButtons";
import DeleteDialog from "@/components/shared/DeleteDialog";
import PageHeader from "@/components/shared/PageHeader";
import StatusBadge from "@/components/ui/StatusBadge";
import Table from "@/components/ui/Table";
import { roleTypeOptions } from "@/constants/roles";
import { useRoleStore } from "@/stores/roles";
import type { SchoolRole } from "@/types/role";

export default function RolesPage() {
  const router = useRouter();
  const roles = useRoleStore((state) => state.records);
  const duplicateRole = useRoleStore((state) => state.duplicateRole);
  const deleteRole = useRoleStore((state) => state.deleteRole);
  const [search, setSearch] = useState("");
  const [type, setType] = useState<string>();
  const [page, setPage] = useState(1);
  const [roleToDelete, setRoleToDelete] = useState<SchoolRole | null>(null);

  const filteredRoles = roles.filter(
    (role) =>
      role.name.toLowerCase().includes(search.trim().toLowerCase()) &&
      (!type || role.type === type),
  );

  const columns: TableColumnsType<SchoolRole> = [
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
      render: (description: string) => (
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
      render: (value: SchoolRole["type"]) => (
        <StatusBadge variant={value === "Custom" ? "success" : "neutral"}>
          {value}
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
          actions={[
            {
              label: `Duplicate ${role.name}`,
              icon: LuCopy,
              onClick: () => duplicateRole(role.id),
            },
            {
              label: `Edit ${role.name}`,
              icon: LuPencil,
              onClick: () =>
                router.push(`/roles/edit/${encodeURIComponent(role.id)}`),
            },
            {
              label: `Delete ${role.name}`,
              icon: LuTrash2,
              onClick: () => setRoleToDelete(role),
              danger: true,
              disabled: role.type === "System role",
            },
          ]}
        />
      ),
    },
  ];

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="shrink-0">
        <PageHeader title="Roles" />
      </div>
      <Table
        columns={columns}
        data={filteredRoles}
        pageSize={7}
        current={page}
        onPageChange={setPage}
        search={{
          placeholder: "Role name",
          onChange: setSearch,
        }}
        filterFields={[
          {
            name: "type",
            label: "Type",
            placeholder: "Any",
            options: roleTypeOptions,
            onChange: setType,
          },
        ]}
        actions={[
          { label: "Add role", onClick: () => router.push("/roles/add") },
        ]}
      />
      <DeleteDialog
        open={roleToDelete !== null}
        title="Delete custom role?"
        message={`Remove ${roleToDelete?.name ?? "this role"} from the role list?`}
        description="This changes the current preview only."
        okText="Delete role"
        onClose={() => setRoleToDelete(null)}
        onConfirm={() => {
          if (roleToDelete) deleteRole(roleToDelete.id);
          setRoleToDelete(null);
        }}
      />
    </div>
  );
}
