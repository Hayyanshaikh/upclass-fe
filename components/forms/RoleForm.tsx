"use client";

import { useState } from "react";
import { Form } from "antd";
import { isAxiosError } from "axios";
import { useRouter } from "next/navigation";
import { LuChevronDown, LuX } from "react-icons/lu";
import PageHeader from "@/components/shared/PageHeader";
import Alert from "@/components/ui/Alert";
import Button from "@/components/ui/Button";
import Dialog from "@/components/ui/Dialog";
import Input from "@/components/ui/Input";
import SectionCard from "@/components/ui/SectionCard";
import Select from "@/components/ui/Select";
import {
  usePermissionsControllerFindAll,
  useRolesControllerCreate,
  useRolesControllerFindAll,
  useRolesControllerUpdate,
  useUserControllerFindAll,
  useUserControllerUpdate,
} from "@/app/api/endpoints";
import { RoleDetailDataDtoType } from "@/app/api/schemas";
import type {
  CreateRoleDto,
  LoginResponseUserDto,
  PermissionDataDto,
  UpdateRoleDto,
} from "@/app/api/schemas";
import type {
  RoleFormProps,
  RoleFormValues,
  RoleReassignmentValues,
} from "@/types/role";

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

function groupPermissions(permissions: PermissionDataDto[]) {
  const groups = new Map<string, Map<string, PermissionDataDto[]>>();

  for (const permission of permissions) {
    let modules = groups.get(permission.group);
    if (!modules) {
      modules = new Map();
      groups.set(permission.group, modules);
    }

    const actions = modules.get(permission.module) ?? [];
    actions.push(permission);
    modules.set(permission.module, actions);
  }

  return Array.from(groups, ([name, modules]) => ({
    name,
    modules: Array.from(modules, ([name, permissions]) => ({
      name,
      permissions,
    })),
  }));
}

export default function RoleForm({ role }: RoleFormProps) {
  const router = useRouter();
  const [form] = Form.useForm<RoleFormValues>();
  const [reassignmentForm] = Form.useForm<RoleReassignmentValues>();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [assignmentError, setAssignmentError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<LoginResponseUserDto | null>(
    null,
  );
  const [permissionKeys, setPermissionKeys] = useState<string[]>(
    role?.permissionKeys ?? [],
  );
  const {
    data: permissionResponse,
    isLoading: isLoadingPermissions,
    error: permissionsError,
    refetch: refetchPermissions,
  } = usePermissionsControllerFindAll({ query: { enabled: Boolean(role) } });
  const {
    data: assignedResponse,
    isLoading: isLoadingAssigned,
    error: assignedError,
    refetch: refetchAssigned,
  } = useUserControllerFindAll(
    { role: role?.id },
    { query: { enabled: Boolean(role) } },
  );
  const {
    data: rolesResponse,
    isLoading: isLoadingRoles,
    error: rolesError,
    refetch: refetchRoles,
  } = useRolesControllerFindAll(undefined, {
    query: { enabled: Boolean(selectedUser) },
  });
  const { mutateAsync: createRole, isPending: isCreating } =
    useRolesControllerCreate();
  const { mutateAsync: updateRole, isPending: isUpdating } =
    useRolesControllerUpdate();
  const { mutateAsync: updateUser, isPending: isReassigning } =
    useUserControllerUpdate();
  const isPending = isCreating || isUpdating;
  const isSystemRole = role?.type === RoleDetailDataDtoType.SYSTEM_ROLE;
  const permissionGroups = groupPermissions(permissionResponse?.data ?? []);
  const assignedUsers = assignedResponse?.data ?? [];
  const roleOptions = (rolesResponse?.data ?? [])
    .filter((option) => option.id !== role?.id)
    .map((option) => ({ label: option.name, value: option.id }));
  const permissionsUnavailable =
    Boolean(role) && (isLoadingPermissions || Boolean(permissionsError));

  function togglePermission(key: string) {
    setPermissionKeys((current) =>
      current.includes(key)
        ? current.filter((permissionKey) => permissionKey !== key)
        : [...current, key],
    );
  }

  async function handleMoveUser(values: RoleReassignmentValues) {
    if (!selectedUser || isReassigning || isPending) return;

    setAssignmentError(null);
    try {
      await updateUser({
        id: selectedUser.id,
        data: { roleId: values.targetRoleId },
      });
      setSelectedUser(null);
      void refetchAssigned();
    } catch (error) {
      const message = isAxiosError(error)
        ? (error.response?.data as { message?: string } | undefined)?.message
        : undefined;
      setAssignmentError(message ?? "Unable to change the user's role.");
    }
  }

  async function handleSubmit(values: RoleFormValues) {
    if (isPending || isReassigning || permissionsUnavailable) return;

    const name = isSystemRole ? role.name : values.name.trim();
    const description = values.description?.trim() ?? "";
    setSubmitError(null);

    try {
      if (role) {
        const data: UpdateRoleDto = { name, description, permissionKeys };
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
              disabled={isPending || isReassigning}
              onClick={() => router.push("/roles")}
            >
              Cancel
            </Button>
            <Button
              loading={isPending}
              disabled={permissionsUnavailable || isReassigning}
              onClick={() => form.submit()}
            >
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

        {role && (
          <SectionCard title="Assign users" autoHeight>
            {isLoadingAssigned && (
              <p className="text-sm text-gray">Loading assigned users...</p>
            )}
            {Boolean(assignedError) && (
              <div>
                <Alert
                  type="error"
                  role="alert"
                  message="Unable to load assigned users."
                />
                <Button variant="link" onClick={() => void refetchAssigned()}>
                  Retry
                </Button>
              </div>
            )}
            {assignedResponse && (
              <div>
                {assignedUsers.length > 0 && (
                  <div className="flex max-h-56 flex-wrap gap-2 overflow-y-auto">
                    {assignedUsers.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center gap-2 rounded-full bg-success/10 py-1 pl-1 pr-2 text-xs font-semibold text-success"
                      >
                        <span
                          className="flex size-6 items-center justify-center rounded-full bg-primary text-background"
                          aria-hidden="true"
                        >
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                        {user.name}
                        <Button
                          variant="text"
                          className="h-6! w-6! rounded-full! p-0! text-primary!"
                          disabled={user.isSystem || isPending || isReassigning}
                          onClick={() => {
                            setAssignmentError(null);
                            setSelectedUser(user);
                          }}
                        >
                          <LuX size={12} aria-hidden="true" />
                          <span className="sr-only">
                            Change {user.name}&apos;s role
                          </span>
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
                <p className="mt-3 text-sm text-gray">
                  {assignedResponse.total.toLocaleString()}{" "}
                  {assignedResponse.total === 1 ? "user" : "users"} currently
                  have this role.
                </p>
              </div>
            )}
          </SectionCard>
        )}

        {role && (
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-extrabold text-dark">Permissions</h2>
            {isLoadingPermissions && (
              <p className="text-sm text-gray">Loading permissions...</p>
            )}
            {Boolean(permissionsError) && (
              <div>
                <Alert
                  type="error"
                  role="alert"
                  message="Unable to load permissions."
                />
                <Button
                  variant="link"
                  onClick={() => void refetchPermissions()}
                >
                  Retry
                </Button>
              </div>
            )}
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
                      key={module.name}
                      className="flex flex-wrap items-center justify-between gap-3 border-b border-border py-3 last:border-b-0"
                    >
                      <span className="font-semibold text-dark">
                        {module.name}
                      </span>
                      <div
                        className="flex flex-wrap gap-2"
                        role="group"
                        aria-label={`${module.name} permissions`}
                      >
                        {module.permissions.map((permission) => {
                          const enabled = permissionKeys.includes(
                            permission.key,
                          );
                          return (
                            <Button
                              key={permission.key}
                              variant={enabled ? "primary" : "secondary"}
                              className="h-8! rounded-full! px-3! text-xs!"
                              ariaPressed={enabled}
                              disabled={isPending}
                              onClick={() => togglePermission(permission.key)}
                            >
                              {permission.action}
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
              Select a permission to turn it on or off for this role. Filled
              buttons are on.
            </p>
          </div>
        )}
      </Form>

      <Dialog
        open={Boolean(selectedUser)}
        title={`Move ${selectedUser?.name ?? "user"} to another role`}
        onClose={() => setSelectedUser(null)}
        afterClose={() => reassignmentForm.resetFields()}
        onConfirm={() => reassignmentForm.submit()}
        okText="Move user"
        confirmLoading={isReassigning}
        confirmDisabled={
          isLoadingRoles || Boolean(rolesError) || roleOptions.length === 0
        }
      >
        <p className="mb-4 text-sm text-gray">
          Every user needs a role. Choose another role to remove this user from
          {` ${role?.name ?? "this role"}`}.
        </p>
        {assignmentError && (
          <Alert type="error" role="alert" message={assignmentError} />
        )}
        {Boolean(rolesError) && (
          <div>
            <Alert type="error" role="alert" message="Unable to load roles." />
            <Button variant="link" onClick={() => void refetchRoles()}>
              Retry
            </Button>
          </div>
        )}
        {!isLoadingRoles && !rolesError && roleOptions.length === 0 && (
          <p className="text-sm text-gray">No other roles are available.</p>
        )}
        <Form
          form={reassignmentForm}
          layout="vertical"
          onFinish={(values) => void handleMoveUser(values)}
        >
          <Select
            name="targetRoleId"
            label="New role"
            placeholder="Select another role"
            options={roleOptions}
            loading={isLoadingRoles}
            disabled={isReassigning || isLoadingRoles || Boolean(rolesError)}
            isRequird
          />
        </Form>
      </Dialog>
    </div>
  );
}
