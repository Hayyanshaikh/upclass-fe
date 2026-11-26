"use client";

import Button from "@/components/ui/Button";
import StatusBadge from "@/components/ui/StatusBadge";
import MobileLeaveRequestDetails from "@/components/mobile/leaves/MobileLeaveRequestDetails";
import MobileSheet from "@/components/mobile/ui/MobileSheet";
import { LeaveRequestDtoStatus } from "@/app/api/schemas";
import type { LeaveRequestDto } from "@/app/api/schemas";
import {
  formatLeaveRequestDates,
  leaveRequestStatusLabels,
  leaveRequestStatusVariants,
} from "@/lib/api/leave-requests";

type MobileMyLeaveRequestSheetProps = {
  open: boolean;
  request: LeaveRequestDto | null;
  canEdit: boolean;
  onClose: () => void;
  onCancelRequest: () => void;
};

export default function MobileMyLeaveRequestSheet({
  open,
  request,
  canEdit,
  onClose,
  onCancelRequest,
}: MobileMyLeaveRequestSheetProps) {
  const pending = request?.status === LeaveRequestDtoStatus.PENDING;
  const canCancel = pending && canEdit;

  return (
    <MobileSheet
      open={open}
      onClose={onClose}
      title="Leave request details"
      closeLabel="Close"
    >
      {request && (
        <div className="mt-3 flex shrink-0 items-center gap-3 border-b border-border pb-4">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-dark">
              {request.leavePolicy?.name ?? "Leave"}
            </p>
            <p className="mt-0.5 truncate text-xs text-gray">
              {formatLeaveRequestDates(request.fromDate, request.toDate)}
            </p>
          </div>
          <StatusBadge variant={leaveRequestStatusVariants[request.status]}>
            {leaveRequestStatusLabels[request.status]}
          </StatusBadge>
        </div>
      )}

      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto pt-4 pb-1">
        {request && <MobileLeaveRequestDetails request={request} />}
      </div>

      <div className="mt-3 flex shrink-0 items-center gap-2 border-t border-border pt-3">
        <Button fullWidth variant="secondary" onClick={onClose}>
          Close
        </Button>
        {canCancel && (
          <Button fullWidth danger onClick={onCancelRequest}>
            Cancel request
          </Button>
        )}
      </div>
    </MobileSheet>
  );
}
