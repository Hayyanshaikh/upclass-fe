"use client";

import Button from "@/components/ui/Button";
import MobileSheet from "@/components/mobile/ui/MobileSheet";

type MobileConfirmDialogProps = {
  open: boolean;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  danger?: boolean;
  confirmLoading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
};

export default function MobileConfirmDialog({
  open,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  danger = false,
  confirmLoading = false,
  onConfirm,
  onClose,
}: MobileConfirmDialogProps) {
  return (
    <MobileSheet open={open} onClose={onClose}>
      <h2 className="mt-1 text-lg font-bold text-dark">{title}</h2>
      {description && (
        <p className="mt-1 text-sm leading-5 text-gray">{description}</p>
      )}

      <div className="mt-5 flex gap-2">
        <Button fullWidth variant="secondary" onClick={onClose}>
          {cancelText}
        </Button>

        <Button
          fullWidth
          danger={danger}
          loading={confirmLoading}
          onClick={onConfirm}
        >
          {confirmText}
        </Button>
      </div>
    </MobileSheet>
  );
}
