"use client";

import { LuTrash2 } from "react-icons/lu";
import Dialog from "@/components/ui/Dialog";
import type { LeaveRequest } from "@/types/leave-request";

type CancelLeaveRequestDialogProps = {
  request: LeaveRequest;
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  afterClose: () => void;
};

export default function CancelLeaveRequestDialog({ request, open, onClose, onConfirm, afterClose }: CancelLeaveRequestDialogProps) {
  return (
    <Dialog
      open={open}
      width={480}
      title={
        <div className="flex items-center gap-4">
          <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-secondary/20 text-warning">
            <LuTrash2 className="size-6" aria-hidden="true" />
          </span>
          <span className="text-xl font-extrabold text-dark">Cancel your request?</span>
        </div>
      }
      onClose={onClose}
      onConfirm={onConfirm}
      afterClose={afterClose}
      okText="Cancel request"
      cancelText="Keep request"
      confirmDanger
    >
      <p className="text-sm leading-relaxed text-gray">
        {request.leaveType} on {request.dates} is still pending. If you cancel, it will be removed and your balance stays the same.
      </p>
    </Dialog>
  );
}
