"use client";

import { useState } from "react";
import { Form } from "antd";
import { useRouter } from "next/navigation";
import { LuChevronDown, LuX } from "react-icons/lu";
import PageHeader from "@/components/shared/PageHeader";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import SectionCard from "@/components/ui/SectionCard";
import { permissionGroups, roleActions } from "@/constants/roles";
import { useRoleStore } from "@/stores/roles";
import type { RoleAction, RoleFormProps, RoleFormValues } from "@/types/role";

export default function RoleForm({ role }: RoleFormProps) {
  const router = useRouter();
  const [form] = Form.useForm<RoleFormValues>();
  const roles = useRoleStore((state) => state.records);
  const saveRole = useRoleStore((state) => state.saveRole);
  const [assignedUsers, setAssignedUsers] = useState(role?.assignedUsers ?? []);
  const [userCount, setUserCount] = useState(role?.users ?? 0);
  const [permissions, setPermissions] = useState(role?.permissions ?? {});

  function togglePermission(module: string, action: RoleAction) {
    setPermissions((current) => {
      const actions = current[module] ?? [];
      return {
        ...current,
        [module]: actions.includes(action)
          ? actions.filter((item) => item !== action)
          : [...actions, action],
      };
    });
  }

  function removeUser(name: string) {
    setAssignedUsers((current) => current.filter((user) => user !== name));
    setUserCount((current) => Math.max(0, current - 1));
  }

  function handleSubmit(values: RoleFormValues) {
    const name = role?.type === "System role" ? role.name : values.name.trim();
    if (
      roles.some(
        (record) =>
          record.id !== role?.id &&
          record.name.toLowerCase() === name.toLowerCase(),
      )
    ) {
      form.setFields([
        { name: "name", errors: ["A role with this name already exists."] },
      ]);
      return;
    }

    saveRole(
      {
        id: role?.id ?? crypto.randomUUID(),
        name,
        description: (values.description ?? "").trim(),
        type: role?.type ?? "Custom",
        users: role ? userCount : 0,
        assignedUsers: role ? assignedUsers : [],
        permissions: role ? permissions : {},
      },
      role?.id,
    );
    router.push("/roles");
  }

  const moreUsers = Math.max(0, userCount - assignedUsers.length);

  return (
    <div>
      <PageHeader
        title={role?.name ?? "Add role"}
        breadcrumbs={[
          { title: "Roles", href: "/roles" },
          { title: role ? "Edit role" : "Add role" },
        ]}
        actions={
          <div className="flex flex-wrap gap-3">
            <Button variant="secondary" onClick={() => router.push("/roles")}>
              Cancel
            </Button>
            <Button onClick={() => form.submit()}>
              {role ? "Save permissions" : "Add role"}
            </Button>
          </div>
        }
      />

      <Form
        form={form}
        layout="vertical"
        initialValues={{ name: role?.name, description: role?.description }}
        onFinish={handleSubmit}
        scrollToFirstError
        requiredMark={false}
        className="flex flex-col gap-5"
      >
        <SectionCard title="Role name" autoHeight>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Input
              name="name"
              label="Role name"
              placeholder="Enter role name"
              readOnly={role?.type === "System role"}
              isRequird
              rules={[{ whitespace: true, message: "Enter a role name." }]}
            />
            <Input
              name="description"
              label="Description"
              placeholder="Describe this role"
            />
          </div>
        </SectionCard>

        {role && (
          <>
            <SectionCard title="Assign users" autoHeight>
              <div className="flex flex-wrap gap-2">
                {assignedUsers.map((name) => (
                  <div
                    key={name}
                    className="flex items-center gap-2 rounded-full bg-success/10 py-1 pl-1! pr-2! text-xs font-semibold text-success"
                  >
                    <span
                      className="flex size-6 items-center justify-center rounded-full bg-primary text-background"
                      aria-hidden="true"
                    >
                      {name.charAt(0)}
                    </span>
                    {name}
                    <Button
                      variant="text"
                      className="h-6! w-6! rounded-full! p-0! text-primary!"
                      onClick={() => removeUser(name)}
                    >
                      <LuX size={12} aria-hidden="true" />
                      <span className="sr-only">Remove {name}</span>
                    </Button>
                  </div>
                ))}
                {moreUsers > 0 && (
                  <span className="inline-flex items-center justify-center rounded-full bg-gray/10 px-3 py-1 text-xs font-semibold text-gray">
                    +{moreUsers} more
                  </span>
                )}
              </div>
              <p className="mt-3 text-sm text-gray">
                {userCount.toLocaleString()} users currently have this role.
              </p>
            </SectionCard>

            {permissionGroups.map((group) => (
              <details
                key={group.name}
                open={group.name === "People"}
                className="group overflow-hidden rounded-lg border border-border bg-background"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-4 text-base font-extrabold text-dark focus-visible:outline-2 focus-visible:outline-primary [&::-webkit-details-marker]:hidden">
                  {group.name}
                  <LuChevronDown
                    className="transition-transform group-open:rotate-180"
                    size={18}
                    aria-hidden="true"
                  />
                </summary>
                <div className="border-t border-border px-5">
                  {group.modules.map((module) => (
                    <div
                      key={module}
                      className="flex flex-wrap items-center justify-between gap-3 border-b border-border py-3 last:border-b-0"
                    >
                      <span className="font-semibold text-dark">{module}</span>
                      <div
                        className="flex flex-wrap gap-2"
                        role="group"
                        aria-label={`${module} permissions`}
                      >
                        {roleActions.map((action) => {
                          const enabled =
                            permissions[module]?.includes(action) ?? false;
                          return (
                            <Button
                              key={action}
                              variant={enabled ? "primary" : "secondary"}
                              className="h-8! rounded-full! px-3! text-xs!"
                              onClick={() => togglePermission(module, action)}
                            >
                              {action}
                            </Button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </details>
            ))}
            <p className="text-xs text-gray">
              Select a permission to turn it on or off for this role. Green
              means on.
            </p>
          </>
        )}
      </Form>
    </div>
  );
}
