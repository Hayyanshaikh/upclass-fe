"use client";

import { useState } from "react";
import { Form, message } from "antd";
import type { TableColumnsType } from "antd";
import { useRouter } from "next/navigation";
import { LuUsersRound } from "react-icons/lu";
import ActionButtons from "@/components/shared/ActionButtons";
import SectionTitle from "@/components/settings/SectionTitle";
import Button from "@/components/ui/Button";
import Dialog from "@/components/ui/Dialog";
import Input from "@/components/ui/Input";
import SectionCard from "@/components/ui/SectionCard";
import Select from "@/components/ui/Select";
import StatusBadge from "@/components/ui/StatusBadge";
import Table from "@/components/ui/Table";
import { settingsUsers } from "@/constants/settings";
import { useRolesUsersSettings } from "@/hooks/useRolesUsersSettings";
import { useIsSuperAdmin } from "@/hooks/useIsSuperAdmin";
import type { SettingsTabProps, SettingsUser } from "@/types/settings";

export default function RolesUsersTab({
  registerTab,
  schoolId,
}: SettingsTabProps) {
  const router = useRouter();
  const { isSuperAdmin } = useIsSuperAdmin();
  const [form] = Form.useForm();
  const [dialogForm] = Form.useForm();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [users, setUsers] = useState(settingsUsers);
  const { data } = useRolesUsersSettings({
    form,
    registerTab,
    schoolId,
    data: users,
    setData: setUsers,
  });

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
          onEdit={() => openDialog(user)}
          onDelete={() => onRemove(user.id)}
        />
      ),
    },
  ];

  function openDialog(user?: SettingsUser) {
    dialogForm.resetFields();
    setEditingUser(user?.id ?? null);
    if (user) dialogForm.setFieldsValue(user);
    setDialogOpen(true);
  }

  function submitDialog() {
    dialogForm
      .validateFields()
      .then((values) => {
        const id = editingUser ?? crypto.randomUUID();
        const record: SettingsUser = {
          id,
          name: String(values.name).trim(),
          role: String(values.role),
          email: String(values.email).trim(),
          status: "Active",
        };
        setUsers((current) =>
          editingUser
            ? current.map((user) => (user.id === editingUser ? record : user))
            : [...current, record],
        );
        setDialogOpen(false);
        message.info(
          "Change added locally. Use Save settings to keep it in this browser.",
        );
      })
      .catch(() => undefined);
  }

  function onRemove(id: string) {
    setUsers((current) => current.filter((user) => user.id !== id));
  }

  return (
    <>
      <Form form={form} layout="vertical">
        <SectionCard className="h-auto! min-h-full">
          <SectionTitle
            icon={LuUsersRound}
            action={
              isSuperAdmin ? (
                <Button onClick={() => router.push("/users/add")}>Add user</Button>
              ) : undefined
            }
          >
            Roles & users
          </SectionTitle>
          <Table columns={columns} data={data} pagination={false} autoHeight />
          <p className="mt-4 text-sm text-gray">
            Roles control which modules a user can see — see the permission matrix
            in the documentation.
          </p>
        </SectionCard>
      </Form>
      <Dialog
        open={dialogOpen}
        title={editingUser ? "Edit user" : "Add user"}
        okText={editingUser ? "Add" : "Add user"}
        onClose={() => setDialogOpen(false)}
        onConfirm={submitDialog}
      >
        <Form form={dialogForm} layout="vertical" className="space-y-4">
          <Input name="name" label="Name" isRequird />
          <Input name="email" label="Email" type="email" isRequird />
          <Select
            name="role"
            label="Role"
            isRequird
            options={["Super admin", "Teacher", "Staff", "Viewer"].map(
              (role) => ({ label: role, value: role }),
            )}
          />
        </Form>
      </Dialog>
    </>
  );
}
