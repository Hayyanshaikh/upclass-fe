"use client";

import { Form } from "antd";
import dayjs from "dayjs";
import Button from "@/components/ui/Button";
import Dialog from "@/components/ui/Dialog";
import StatusBadge from "@/components/ui/StatusBadge";
import TextArea from "@/components/ui/TextArea";
import { LeaveRequestDtoStatus } from "@/app/api/schemas";
import type { LeaveRequestDto } from "@/app/api/schemas";
import { DISPLAY_DATE } from "@/constants/date-formats";
import {
  formatLeaveRequestDates,
  formatTeacherName,
  leaveRequestDaysLabel,
  leaveRequestStatusLabels,
  leaveRequestStatusVariants,
} from "@/lib/api/leave-requests";

type ReviewLeaveRequestDialogProps = {
  request: LeaveRequestDto;
  balanceAfterApproval?: number | null;
  open: boolean;
  canEdit: boolean;
  isSubmitting: boolean;
  onClose: () => void;
  onApprove: (comment?: string) => void;
  onReject: () => void;
  onCancelRequest: () => void;
  afterClose?: () => void;
};

export default function ReviewLeaveRequestDialog({
  request,
  balanceAfterApproval,
  open,
  canEdit,
  isSubmitting,
  onClose,
  onApprove,
  onReject,
  onCancelRequest,
  afterClose,
}: ReviewLeaveRequestDialogProps) {
  const [form] = Form.useForm<{ comment: string }>();
  const pending = request.status === LeaveRequestDtoStatus.PENDING;
  const editable = pending && canEdit;
  const teacher = formatTeacherName(request.teacher);
  const dates = formatLeaveRequestDates(request.fromDate, request.toDate);

  return (
    <Dialog
      open={open}
      width={680}
      title={
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xl font-extrabold text-dark">
              Review leave request
            </span>
            <StatusBadge variant={leaveRequestStatusVariants[request.status]}>
              {leaveRequestStatusLabels[request.status]}
            </StatusBadge>
          </div>
          <p className="mt-1 text-sm font-normal text-gray">
            {teacher} · {request.teacher?.employeeId ?? "—"} ·{" "}
            {request.leavePolicy?.name ?? "—"}
          </p>
        </div>
      }
      onClose={onClose}
      onConfirm={onClose}
      afterClose={() => {
        form.resetFields();
        afterClose?.();
      }}
      footer={
        <div className="flex flex-wrap items-center justify-end gap-3">
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Close
          </Button>
          {editable && (
            <Button
              variant="secondary"
              onClick={onCancelRequest}
              disabled={isSubmitting}
            >
              Cancel request
            </Button>
          )}
          {editable && (
            <Button danger onClick={onReject} disabled={isSubmitting}>
              Reject
            </Button>
          )}
          {editable && (
            <Button
              loading={isSubmitting}
              onClick={() => onApprove(form.getFieldValue("comment"))}
            >
              Approve
            </Button>
          )}
        </div>
      }
    >
      <dl className="grid grid-cols-1 gap-x-8 gap-y-4 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-gray">Leave type</dt>
          <dd className="mt-1 font-bold text-dark">
            {request.leavePolicy?.name ?? "—"}
          </dd>
        </div>
        <div>
          <dt className="text-gray">Dates</dt>
          <dd className="mt-1 font-bold text-dark">{dates}</dd>
        </div>
        <div>
          <dt className="text-gray">Total days</dt>
          <dd className="mt-1 font-bold text-dark">
            {request.isHalfDay
              ? "Half day"
              : leaveRequestDaysLabel(request.totalDays)}
          </dd>
        </div>
        <div>
          <dt className="text-gray">Balance after approval</dt>
          <dd className="mt-1 font-bold text-dark">
            {balanceAfterApproval === null || balanceAfterApproval === undefined
              ? "—"
              : leaveRequestDaysLabel(balanceAfterApproval)}
          </dd>
        </div>
        {request.substituteTeacher && (
          <div>
            <dt className="text-gray">Suggested substitute</dt>
            <dd className="mt-1 font-bold text-dark">
              {formatTeacherName(request.substituteTeacher)}
            </dd>
          </div>
        )}
        {request.contactDuringLeave && (
          <div>
            <dt className="text-gray">Contact during leave</dt>
            <dd className="mt-1 font-bold text-dark">
              {request.contactDuringLeave}
            </dd>
          </div>
        )}
        <div className="sm:col-span-2">
          <dt className="text-gray">Reason</dt>
          <dd className="mt-1 text-dark">{request.reason}</dd>
        </div>
        {request.attachments && request.attachments.length > 0 && (
          <div className="sm:col-span-2">
            <dt className="text-gray">Attachments</dt>
            <dd className="mt-1 flex flex-wrap gap-3">
              {request.attachments.map((attachment) => (
                <a
                  key={attachment.id}
                  href={attachment.url}
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-primary underline"
                >
                  {attachment.name}
                </a>
              ))}
            </dd>
          </div>
        )}
        {request.rejectionReason && (
          <div className="sm:col-span-2">
            <dt className="text-gray">Rejection reason</dt>
            <dd className="mt-1 text-danger">{request.rejectionReason}</dd>
          </div>
        )}
        {request.reviewComment && (
          <div className="sm:col-span-2">
            <dt className="text-gray">Review comment</dt>
            <dd className="mt-1 text-dark">{request.reviewComment}</dd>
          </div>
        )}
        {request.reviewedAt && (
          <div className="sm:col-span-2">
            <dt className="text-gray">Reviewed on</dt>
            <dd className="mt-1 text-dark">
              {dayjs(request.reviewedAt).format(DISPLAY_DATE)}
            </dd>
          </div>
        )}
      </dl>

      {editable && (
        <div className="my-4 rounded-md bg-success/10 px-4 py-3 text-sm font-semibold text-success">
          On approval, attendance for {dates} is marked as Leave automatically.
        </div>
      )}

      {editable && (
        <Form
          form={form}
          className="mt-4 flex flex-col gap-5"
          initialValues={{ comment: "" }}
        >
          <TextArea name="comment" label="Comment (optional)" rows={2} />
        </Form>
      )}
    </Dialog>
  );
}
