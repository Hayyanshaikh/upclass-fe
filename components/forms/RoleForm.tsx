"use client";

import { useState } from "react";
import { Form } from "antd";
import { isAxiosError } from "axios";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/shared/PageHeader";
import Alert from "@/components/ui/Alert";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import SectionCard from "@/components/ui/SectionCard";
import {
  useRolesControllerCreate,
  useRolesControllerUpdate,
} from "@/app/api/endpoints";
import { RoleDataDtoType } from "@/app/api/schemas";
import type { CreateRoleDto, UpdateRoleDto } from "@/app/api/schemas";
import type { RoleFormProps, RoleFormValues } from "@/types/role";

function slugFromName(name: string) {
  return name
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 80)
    .replace(/_+$/g, "");
}

export default function RoleForm({ role }: RoleFormProps) {
  const router = useRouter();
  const [form] = Form.useForm<RoleFormValues>();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { mutateAsync: createRole, isPending: isCreating } =
    useRolesControllerCreate();
  const { mutateAsync: updateRole, isPending: isUpdating } =
    useRolesControllerUpdate();
  const isPending = isCreating || isUpdating;
  const isSystemRole = role?.type === RoleDataDtoType.SYSTEM_ROLE;

  async function handleSubmit(values: RoleFormValues) {
    if (isPending) return;

    const name = isSystemRole ? role.name : values.name.trim();
    const description = values.description?.trim() ?? "";
    setSubmitError(null);

    try {
      if (role) {
        const data: UpdateRoleDto = { name, description };
        await updateRole({ id: role.id, data });
      } else {
        const slug = slugFromName(name);
        if (!slug) {
          form.setFields([
            {
              name: "name",
              errors: ["Use letters or numbers in the role name."],
            },
          ]);
          return;
        }
        const data: CreateRoleDto = { name, slug, description };
        await createRole({ data });
      }

      router.push("/roles");
    } catch (error) {
      const message = isAxiosError(error)
        ? (error.response?.data as { message?: string } | undefined)?.message
        : undefined;
      if (isAxiosError(error) && error.response?.status === 409) {
        form.setFields([
          {
            name: "name",
            errors: [message ?? "A role with this name already exists."],
          },
        ]);
        return;
      }
      setSubmitError(message ?? `Unable to ${role ? "update" : "add"} role.`);
    }
  }

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
            <Button
              variant="secondary"
              disabled={isPending}
              onClick={() => router.push("/roles")}
            >
              Cancel
            </Button>
            <Button loading={isPending} onClick={() => form.submit()}>
              {role ? "Save role" : "Add role"}
            </Button>
          </div>
        }
      />

      {submitError && <Alert type="error" role="alert" message={submitError} />}

      <Form
        form={form}
        layout="vertical"
        initialValues={{
          name: role?.name,
          description: role?.description ?? "",
        }}
        onFinish={(values) => void handleSubmit(values)}
        scrollToFirstError
        requiredMark={false}
        className="flex flex-col gap-5"
      >
        <SectionCard title="Role details" autoHeight>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Input
              name="name"
              label="Role name"
              placeholder="Enter role name"
              readOnly={isSystemRole}
              isRequird
              rules={[
                { whitespace: true, message: "Enter a role name." },
                {
                  max: 80,
                  message: "Role name must be 80 characters or less.",
                },
              ]}
            />
            <Input
              name="description"
              label="Description"
              placeholder="Describe this role"
              rules={[
                {
                  max: 500,
                  message: "Description must be 500 characters or less.",
                },
              ]}
            />
          </div>
        </SectionCard>

        {/* {role && (
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
        )} */}
      </Form>
    </div>
  );
}
