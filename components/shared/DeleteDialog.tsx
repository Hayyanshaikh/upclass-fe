"use client";

import Dialog from "@/components/ui/Dialog";
import { LuTrash2 } from "react-icons/lu";
import type { DeleteDialogProps } from "@/types/delete-dialog";

export default function DeleteDialog({
  open,
  title = "Delete record?",
  message = "Are you sure you want to delete this record?",
  description,
  okText = "Delete",
  cancelText = "Cancel",
  onClose,
  onConfirm,
  confirmLoading = false,
  afterClose,
}: DeleteDialogProps) {
  return (
    <Dialog
      open={open}
      title={
        <div className="flex items-center gap-4 mb-3">
          <span className="flex size-11 items-center justify-center rounded-full bg-danger/15 text-danger">
            <LuTrash2 className="size-5" aria-hidden="true" />
          </span>
          <span className="text-base font-bold text-dark">{title}</span>
        </div>
      }
      onClose={onClose}
      onConfirm={onConfirm}
      okText={okText}
      cancelText={cancelText}
      confirmLoading={confirmLoading}
      afterClose={afterClose}
      confirmDanger
      closable={false}
      width={400}
    >
      <p className="text-sm text-dark">{message}</p>
      {description && <p className="mt-2 text-sm text-gray">{description}</p>}
    </Dialog>
  );
}
