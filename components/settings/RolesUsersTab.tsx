"use client";

import type { TableColumnsType } from "antd";
import { LuUsersRound } from "react-icons/lu";
import ActionButtons from "@/components/shared/ActionButtons";
import SectionTitle from "@/components/settings/SectionTitle";
import Button from "@/components/ui/Button";
import SectionCard from "@/components/ui/SectionCard";
import StatusBadge from "@/components/ui/StatusBadge";
import Table from "@/components/ui/Table";
import type { RolesUsersTabProps, SettingsUser } from "@/types/settings";

export default function RolesUsersTab({
  users,
  onAdd,
  canAdd,
  onEdit,
  onRemove,
}: RolesUsersTabProps) {
  const columns: TableColumnsType<SettingsUser> = [
    {
      title: "Name",
      dataIndex: "name",
      render: (value: string) => <span className="font-semibold">{value}</span>,
    },
    {
      title: "Role",
      dataIndex: "role",
      render: (value: string) => <StatusBadge>{value}</StatusBadge>,
    },
    { title: "Email", dataIndex: "email" },
    {
      title: "Status",
      dataIndex: "status",
      render: (value: SettingsUser["status"]) => (
        <StatusBadge variant={value === "Active" ? "success" : "warning"}>
          {value}
        </StatusBadge>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, user) => (
        <ActionButtons
          name={user.name}
          onEdit={() => onEdit(user)}
          onDelete={() => onRemove(user.id)}
        />
      ),
    },
  ];

  return (
    <SectionCard className="h-auto! min-h-full">
      <SectionTitle
        icon={LuUsersRound}
        action={canAdd ? <Button onClick={onAdd}>Add user</Button> : undefined}
      >
        Roles & users
      </SectionTitle>
      <Table columns={columns} data={users} pagination={false} autoHeight />
      <p className="mt-4 text-sm text-gray">
        Roles control which modules a user can see — see the permission matrix
        in the documentation.
      </p>
    </SectionCard>
  );
}
