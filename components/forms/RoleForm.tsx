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
import RoleAssignedUsersSection from "@/components/roles/RoleAssignedUsersSection";
import RolePermissionsSection from "@/components/roles/RolePermissionsSection";
import {
  usePermissionsControllerFindAll,
  useRolesControllerCreate,
  useRolesControllerUpdate,
  useUserControllerUpdate,
} from "@/app/api/endpoints";
import { RoleDetailDataDtoType } from "@/app/api/schemas";
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
  const [permissionKeys, setPermissionKeys] = useState<string[]>(
    role?.permissionKeys ?? [],
  );

  const {
    data: permissionResponse,
    isLoading: isLoadingPermissions,
    error: permissionsError,
    refetch: refetchPermissions,
  } = usePermissionsControllerFindAll({ query: { enabled: Boolean(role) } });
  const { mutateAsync: createRole, isPending: isCreating } =
    useRolesControllerCreate();
  const { mutateAsync: updateRole, isPending: isUpdating } =
    useRolesControllerUpdate();
  const { mutateAsync: updateUser, isPending: isReassigning } =
    useUserControllerUpdate();
  const isPending = isCreating || isUpdating;
  const isSystemRole = role?.type === RoleDetailDataDtoType.SYSTEM_ROLE;
  const permissionsUnavailable =
    Boolean(role) && (isLoadingPermissions || Boolean(permissionsError));

  async function moveUser(userId: string, targetRoleId: string) {
    await updateUser({ id: userId, data: { roleId: targetRoleId } });
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

      // router.push("/roles");
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
          <RoleAssignedUsersSection
            roleId={role.id}
            roleName={role.name}
            disabled={isPending}
            isMoving={isReassigning}
            onMoveUser={moveUser}
          />
        )}

        {role && (
          <RolePermissionsSection
            permissions={permissionResponse?.data ?? []}
            permissionKeys={permissionKeys}
            onPermissionKeysChange={setPermissionKeys}
            isLoading={isLoadingPermissions}
            error={permissionsError}
            onRetry={() => void refetchPermissions()}
            disabled={isPending}
          />
        )}
      </Form>

    </div>
  );
}
