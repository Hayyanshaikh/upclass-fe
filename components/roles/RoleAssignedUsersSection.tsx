"use client";

import { useState } from "react";
import { Form } from "antd";
import { isAxiosError } from "axios";
import { LuX } from "react-icons/lu";
import {
  useRolesControllerFindAll,
  useUserControllerFindAll,
} from "@/app/api/endpoints";
import type { LoginResponseUserDto } from "@/app/api/schemas";
import Alert from "@/components/ui/Alert";
import Button from "@/components/ui/Button";
import Dialog from "@/components/ui/Dialog";
import SectionCard from "@/components/ui/SectionCard";
import Select from "@/components/ui/Select";
import type {
  RoleAssignedUsersSectionProps,
  RoleReassignmentValues,
} from "@/types/role";

export default function RoleAssignedUsersSection({
  roleId,
  roleName,
  disabled,
  isMoving,
  onMoveUser,
}: RoleAssignedUsersSectionProps) {
  const [reassignmentForm] = Form.useForm<RoleReassignmentValues>();
  const [assignmentError, setAssignmentError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<LoginResponseUserDto | null>(
    null,
  );
  const {
    data: assignedResponse,
    isLoading: isLoadingAssigned,
    error: assignedError,
    refetch: refetchAssigned,
  } = useUserControllerFindAll({ role: roleId });
  const {
    data: rolesResponse,
    isLoading: isLoadingRoles,
    error: rolesError,
    refetch: refetchRoles,
  } = useRolesControllerFindAll(undefined, {
    query: { enabled: Boolean(selectedUser) },
  });

  const assignedUsers = assignedResponse?.data ?? [];
  const roleOptions = (rolesResponse?.data ?? [])
    .filter((role) => role.id !== roleId)
    .map((role) => ({ label: role.name, value: role.id }));

  async function handleMoveUser(values: RoleReassignmentValues) {
    if (!selectedUser || isMoving || disabled) return;

    setAssignmentError(null);
    try {
      await onMoveUser(selectedUser.id, values.targetRoleId);
      setSelectedUser(null);
      void refetchAssigned();
    } catch (error) {
      const message = isAxiosError(error)
        ? (error.response?.data as { message?: string } | undefined)?.message
        : undefined;
      setAssignmentError(message ?? "Unable to change the user's role.");
    }
  }

  return (
    <>
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
                      disabled={user.isSystem || disabled || isMoving}
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
              {assignedResponse.total.toLocaleString()} {assignedResponse.total === 1 ? "user" : "users"} currently have this role.
            </p>
          </div>
        )}
      </SectionCard>

      <Dialog
        open={Boolean(selectedUser)}
        title={`Move ${selectedUser?.name ?? "user"} to another role`}
        onClose={() => setSelectedUser(null)}
        afterClose={() => reassignmentForm.resetFields()}
        onConfirm={() => reassignmentForm.submit()}
        okText="Move user"
        confirmLoading={isMoving}
        confirmDisabled={
          disabled ||
          isLoadingRoles ||
          Boolean(rolesError) ||
          roleOptions.length === 0
        }
      >
        <p className="mb-4 text-sm text-gray">
          Every user needs a role. Choose another role to remove this user from
          {` ${roleName}`}.
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
            disabled={disabled || isMoving || isLoadingRoles || Boolean(rolesError)}
            isRequird
          />
        </Form>
      </Dialog>
    </>
  );
}
