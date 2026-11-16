"use client";

import { Drawer } from "antd";
import Button from "@/components/ui/Button";
import { useSwipeToDismiss } from "@/hooks/useSwipeToDismiss";

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
  const { triggerRef, triggerProps } = useSwipeToDismiss({
    onDismiss: onClose,
  });

  return (
    <Drawer
      open={open}
      onClose={onClose}
      placement="bottom"
      size="auto"
      closable={false}
      mask={{ closable: true }}
      classNames={{
        section: "rounded-t-2xl!  shadow-xl! bg-background!",
        body: " px-4! pt-0! pb-[calc(1rem+env(safe-area-inset-bottom))]!",
        wrapper: "shadow-none!",
      }}
    >
      <div
        ref={triggerRef}
        aria-hidden="true"
        className="mx-auto flex w-full touch-none justify-center py-3 select-none"
        {...triggerProps}
      >
        <span className="h-1 w-10 rounded-full bg-border" />
      </div>

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
    </Drawer>
  );
}
