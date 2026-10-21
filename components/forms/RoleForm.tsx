"use client";

import { useEffect, useState } from "react";
import { Form } from "antd";
import { isAxiosError } from "axios";
import { useRouter } from "next/navigation";
import { LuSave, LuX } from "react-icons/lu";
import PageHeader from "@/components/shared/PageHeader";
import ErrorDialog from "@/components/shared/ErrorDialog";
import SuccessDialog from "@/components/shared/SuccessDialog";
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
import { ROUTE_NAMES } from "@/constants/routes";
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

export default function RoleForm({ role, onSaved }: RoleFormProps) {
  const router = useRouter();
  const [form] = Form.useForm<RoleFormValues>();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [successRedirect, setSuccessRedirect] = useState<string | null>(null);
  const [permissionKeys, setPermissionKeys] = useState<string[]>(
    role?.permissionKeys ?? [],
  );

  useEffect(() => {
    if (role) return;
    return () => form.resetFields();
  }, [form, role]);

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
    setSubmitSuccess(null);

    try {
      if (role) {
        const data: UpdateRoleDto = { name, description, permissionKeys };
        await updateRole({ id: role.id, data });
        await onSaved?.();
        setSubmitSuccess("Role updated successfully.");
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
        const res = await createRole({ data });
        setSuccessRedirect(
          ROUTE_NAMES.editRole.replace(":id", encodeURIComponent(res.data.id)),
        );
        setSubmitSuccess("Role added successfully.");
      }
    } catch (error) {
      const message = isAxiosError(error)
        ? (error.response?.data as { message?: string } | undefined)?.message
        : undefined;
      if (isAxiosError(error) && error.response?.status === 409) {
        setSubmitError(message ?? "A role with this name already exists.");
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
        compactMobile
        breadcrumbs={[
          { title: "Roles", href: ROUTE_NAMES.roleListing },
          { title: role ? "Edit role" : "Add role" },
        ]}
        actions={
          <div className="flex gap-2 sm:gap-3">
            <Button
              variant="secondary"
              className="size-11! p-0! sm:h-11! sm:w-auto! sm:px-4!"
              disabled={isPending || isReassigning}
              onClick={() => {
                if (!role) form.resetFields();
                router.push(ROUTE_NAMES.roleListing);
              }}
            >
              <LuX size={18} aria-hidden="true" />
              <span className="sr-only sm:not-sr-only">Cancel</span>
            </Button>
            <Button
              className="size-11! p-0! sm:h-11! sm:w-auto! sm:px-4!"
              loading={isPending}
              disabled={permissionsUnavailable || isReassigning}
              onClick={() => form.submit()}
            >
              <LuSave size={18} aria-hidden="true" />
              <span className="sr-only sm:not-sr-only">{role ? "Save role" : "Add role"}</span>
            </Button>
          </div>
        }
      />

      <ErrorDialog
        open={submitError !== null}
        message={submitError ?? ""}
        onClose={() => setSubmitError(null)}
      />
      <SuccessDialog
        open={submitSuccess !== null}
        message={submitSuccess ?? ""}
        onClose={() => {
          setSubmitSuccess(null);
          if (successRedirect) {
            router.push(successRedirect);
            setSuccessRedirect(null);
          }
        }}
      />

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
