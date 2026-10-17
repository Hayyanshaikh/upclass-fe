"use client";

import Dialog from "@/components/ui/Dialog";
import StatusBadge from "@/components/ui/StatusBadge";
import { userStatusVariants } from "@/constants/users";
import type { UserDetailsDialogProps } from "@/types/user-management";

export default function UserDetailsDialog({
  user,
  onClose,
  onEdit,
}: UserDetailsDialogProps) {
  return (
    <Dialog
      open={user !== null}
      title={user?.name ?? "User details"}
      onClose={onClose}
      onConfirm={() => {
        if (user) onEdit(user);
      }}
      okText="Edit user"
      cancelText="Close"
    >
      {user && (
        <dl className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-gray">Email</dt>
            <dd className="mt-1 font-semibold text-dark">{user.email}</dd>
          </div>
          <div>
            <dt className="text-gray">Role</dt>
            <dd className="mt-1 font-semibold text-dark">{user.role}</dd>
          </div>
          <div>
            <dt className="text-gray">Status</dt>
            <dd className="mt-1">
              <StatusBadge variant={userStatusVariants[user.status]}>
                {user.status}
              </StatusBadge>
            </dd>
          </div>
        </dl>
      )}
    </Dialog>
  );
}
