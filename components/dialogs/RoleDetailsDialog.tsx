"use client";

import { RoleListItemDtoType } from "@/app/api/schemas";
import Dialog from "@/components/ui/Dialog";
import StatusBadge from "@/components/ui/StatusBadge";
import { DISPLAY_DATE } from "@/constants/date-formats";
import type { RoleDetailsDialogProps } from "@/types/role";
import dayjs from "dayjs";

export default function RoleDetailsDialog({
  role,
  onClose,
  onEdit,
}: RoleDetailsDialogProps) {
  return (
    <Dialog
      open={role !== null}
      title={role?.name ?? "Role details"}
      onClose={onClose}
      onConfirm={() => {
        if (role) onEdit(role);
      }}
      okText="Edit role"
      cancelText="Close"
    >
      {role && (
        <dl className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
          <div className="sm:col-span-2">
            <dt className="text-gray">Description</dt>
            <dd className="mt-1 font-semibold text-dark">
              {role.description || "—"}
            </dd>
          </div>
          <div>
            <dt className="text-gray">Type</dt>
            <dd className="mt-1">
              <StatusBadge
                variant={
                  role.type === RoleListItemDtoType.CUSTOM
                    ? "success"
                    : "neutral"
                }
              >
                {role.type === RoleListItemDtoType.SYSTEM_ROLE
                  ? "System role"
                  : "Custom"}
              </StatusBadge>
            </dd>
          </div>
          <div>
            <dt className="text-gray">Users</dt>
            <dd className="mt-1 font-semibold text-dark">
              {role.users.toLocaleString()}
            </dd>
          </div>
          <div>
            <dt className="text-gray">Slug</dt>
            <dd className="mt-1 font-semibold text-dark">{role.slug}</dd>
          </div>
          <div>
            <dt className="text-gray">Created</dt>
            <dd className="mt-1 font-semibold text-dark">
              {dayjs(role.createdAt).format(DISPLAY_DATE)}
            </dd>
          </div>
        </dl>
      )}
    </Dialog>
  );
}
