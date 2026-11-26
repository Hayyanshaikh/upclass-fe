"use client";

import { useEffect } from "react";
import { Form } from "antd";
import Button from "@/components/ui/Button";
import StatusBadge from "@/components/ui/StatusBadge";
import TextArea from "@/components/ui/TextArea";
import MobileLeaveRequestDetails from "@/components/mobile/leaves/MobileLeaveRequestDetails";
import MobileSheet from "@/components/mobile/ui/MobileSheet";
import { LeaveRequestDtoStatus } from "@/app/api/schemas";
import type { LeaveRequestDto } from "@/app/api/schemas";
import {
  formatLeaveRequestDates,
  formatTeacherName,
  leaveRequestStatusLabels,
  leaveRequestStatusVariants,
} from "@/lib/api/leave-requests";

type MobileReviewLeaveRequestSheetProps = {
  open: boolean;
  request: LeaveRequestDto | null;
  balanceAfterApproval?: number | null;
  canEdit: boolean;
  isApproving: boolean;
  isSubmitting: boolean;
  onClose: () => void;
  onApprove: (comment?: string) => void;
  onReject: () => void;
  onCancelRequest: () => void;
};

export default function MobileReviewLeaveRequestSheet({
  open,
  request,
  balanceAfterApproval,
  canEdit,
  isApproving,
  isSubmitting,
  onClose,
  onApprove,
  onReject,
  onCancelRequest,
}: MobileReviewLeaveRequestSheetProps) {
  const [form] = Form.useForm<{ comment: string }>();

  useEffect(() => {
    if (!open) return;
    form.resetFields();
  }, [open, request, form]);

  const editable =
    request !== null &&
    request.status === LeaveRequestDtoStatus.PENDING &&
    canEdit;

  return (
    <MobileSheet
      open={open}
      onClose={onClose}
      title="Review leave request"
      closeLabel="Close"
    >
      {request && (
        <div className="mt-3 flex shrink-0 items-center gap-3 border-b border-border pb-4">
          <span
            aria-hidden="true"
            className="flex size-10 shrink-0 items-center justify-center rounded-full bg-success/10 font-bold text-primary"
          >
            {formatTeacherName(request.teacher).charAt(0)}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-dark">
              {formatTeacherName(request.teacher)}
            </p>
            <p className="mt-0.5 truncate text-xs text-gray">
              {request.teacher?.employeeId ?? "—"} ·{" "}
              {request.leavePolicy?.name ?? "—"}
            </p>
          </div>
          <StatusBadge variant={leaveRequestStatusVariants[request.status]}>
            {leaveRequestStatusLabels[request.status]}
          </StatusBadge>
        </div>
      )}

      <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto pt-4 pb-1">
        {request && (
          <>
            <MobileLeaveRequestDetails
              request={request}
              balanceAfterApproval={balanceAfterApproval}
            />

            {editable && (
              <p className="rounded-md bg-success/10 px-3 py-2 text-sm font-semibold text-success">
                On approval, attendance for{" "}
                {formatLeaveRequestDates(request.fromDate, request.toDate)} is
                marked as Leave automatically.
              </p>
            )}

            {editable && (
              <Form form={form} layout="vertical">
                <TextArea
                  name="comment"
                  label="Comment (optional)"
                  rows={2}
                  placeholder="e.g. Approved, please share the plan"
                />
              </Form>
            )}
          </>
        )}
      </div>

      <div className="mt-3 flex shrink-0 flex-col gap-2 border-t border-border pt-3">
        {editable ? (
          <>
            <Button
              fullWidth
              loading={isApproving}
              disabled={isSubmitting}
              onClick={() => onApprove(form.getFieldValue("comment"))}
            >
              Approve
            </Button>
            <div className="flex items-center gap-2">
              <Button
                fullWidth
                variant="secondary"
                danger
                disabled={isSubmitting}
                onClick={onReject}
              >
                Reject
              </Button>
              <Button
                fullWidth
                variant="secondary"
                disabled={isSubmitting}
                onClick={onCancelRequest}
              >
                Cancel request
              </Button>
            </div>
          </>
        ) : (
          <Button fullWidth variant="secondary" onClick={onClose}>
            Close
          </Button>
        )}
      </div>
    </MobileSheet>
  );
}
