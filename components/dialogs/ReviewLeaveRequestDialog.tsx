"use client";

import { Form } from "antd";
import Dialog from "@/components/ui/Dialog";
import Button from "@/components/ui/Button";
import Checkbox from "@/components/ui/Checkbox";
import StatusBadge from "@/components/ui/StatusBadge";
import TextArea from "@/components/ui/TextArea";
import type { LeaveRequest } from "@/types/leave-request";

type ReviewLeaveRequestDialogProps = {
  request: LeaveRequest;
  open: boolean;
  onClose: () => void;
  onApprove: () => void;
  onReject: () => void;
  onCancelRequest: () => void;
  afterClose: () => void;
};

export default function ReviewLeaveRequestDialog({
  request,
  open,
  onClose,
  onApprove,
  onReject,
  onCancelRequest,
  afterClose,
}: ReviewLeaveRequestDialogProps) {
  const pending = request.status === "Pending";

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
            <StatusBadge
              variant={
                request.status === "Pending"
                  ? "warning"
                  : request.status === "Approved"
                    ? "success"
                    : "danger"
              }
            >
              {request.status}
            </StatusBadge>
          </div>
          <p className="mt-1 text-sm font-normal text-gray">
            {request.teacherName} · {request.teacherId} · {request.subject}
          </p>
        </div>
      }
      onClose={onClose}
      onConfirm={onClose}
      afterClose={afterClose}
      cancelText="Close"
      footer={
        <div className="flex flex-wrap items-center justify-end gap-3">
          {pending && (
            <Button variant="secondary" onClick={onCancelRequest}>
              Cancel
            </Button>
          )}
          {pending && (
            <>
              <Button danger onClick={onReject}>
                Reject
              </Button>
              <Button onClick={onApprove}>Approve</Button>
            </>
          )}
        </div>
      }
    >
      <dl className="grid grid-cols-1 gap-x-8 gap-y-4 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-gray">Leave type</dt>
          <dd className="mt-1 font-bold text-dark">{request.leaveType}</dd>
        </div>
        <div>
          <dt className="text-gray">Dates</dt>
          <dd className="mt-1 font-bold text-dark">{request.dates}</dd>
        </div>
        <div>
          <dt className="text-gray">Total days</dt>
          <dd className="mt-1 font-bold text-dark">
            {request.days} {request.days === 1 ? "day" : "days"}
          </dd>
        </div>
        <div>
          <dt className="text-gray">Balance after approval</dt>
          <dd className="mt-1 font-bold text-dark">
            {request.balanceAfterApproval}
          </dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="text-gray">Reason</dt>
          <dd className="mt-1 text-dark">{request.reason}</dd>
        </div>
      </dl>

      <div className="mt-4 rounded-md bg-info/10 px-4 py-3 text-sm font-semibold text-info">
        Classes affected: {request.affectedClasses.join(", ")}. Suggested
        substitute: {request.suggestedSubstitute}.
      </div>
      <div className="mt-3 rounded-md bg-success/10 px-4 py-3 text-sm font-semibold text-success">
        On approval, attendance for these dates is set to Leave automatically
        and the teacher is notified.
      </div>
      <Form
        className="mt-4! flex flex-col gap-5"
        initialValues={{ comment: "", notifyTeacher: true }}
      >
        <TextArea name="comment" label="Comment (optional)" rows={2} />
        <Checkbox
          name="notifyTeacher"
          label="Notify teacher when this request is reviewed"
        />
      </Form>
    </Dialog>
  );
}
