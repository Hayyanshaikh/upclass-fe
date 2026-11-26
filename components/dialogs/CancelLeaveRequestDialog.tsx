"use client";

import { LuX } from "react-icons/lu";
import Dialog from "@/components/ui/Dialog";
import type { LeaveRequestDto } from "@/app/api/schemas";
import {
  formatLeaveRequestDates,
  formatTeacherName,
} from "@/lib/api/leave-requests";

type CancelLeaveRequestDialogProps = {
  request: LeaveRequestDto;
  open: boolean;
  isSubmitting: boolean;
  onClose: () => void;
  onConfirm: () => void;
  afterClose?: () => void;
};

export default function CancelLeaveRequestDialog({
  request,
  open,
  isSubmitting,
  onClose,
  onConfirm,
  afterClose,
}: CancelLeaveRequestDialogProps) {
  return (
    <Dialog
      open={open}
      width={480}
      title={
        <div className="flex items-center gap-4">
          <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-secondary/20 text-warning">
            <LuX className="size-6" aria-hidden="true" />
          </span>
          <span className="text-xl font-extrabold text-dark">
            Cancel this request?
          </span>
        </div>
      }
      onClose={onClose}
      onConfirm={onConfirm}
      afterClose={afterClose}
      okText="Cancel request"
      cancelText="Keep request"
      confirmLoading={isSubmitting}
      confirmDanger
    >
      <p className="text-sm leading-relaxed text-gray">
        {formatTeacherName(request.teacher)}&apos;s{" "}
        {request.leavePolicy?.name ?? "leave"} request for{" "}
        {formatLeaveRequestDates(request.fromDate, request.toDate)} is still
        pending. If you cancel it, the request is marked as Cancelled and
        attendance stays unchanged.
      </p>
    </Dialog>
  );
}
