"use client";

import Dialog from "@/components/ui/Dialog";
import Button from "@/components/ui/Button";
import type { FeedbackDialogProps } from "@/types/feedback-dialog";
import { LuCircleX, LuX } from "react-icons/lu";

export default function ErrorDialog({
  open,
  title = "Error",
  message,
  onClose,
  okText = "Okay",
}: FeedbackDialogProps) {
  return (
    <Dialog
      open={open}
      title={
        <div className="mb-3 flex items-center gap-4">
          <span className="flex size-11 items-center justify-center rounded-full bg-danger/15 text-danger">
            <LuX className="size-5" aria-hidden="true" />
          </span>
          <span className="text-base font-bold text-dark">{title}</span>
        </div>
      }
      onClose={onClose}
      onConfirm={onClose}
      closable={false}
      width={400}
      footer={
        <div className="flex justify-end">
          <Button onClick={onClose}>{okText}</Button>
        </div>
      }
    >
      <p className="text-sm text-dark">{message}</p>
    </Dialog>
  );
}
