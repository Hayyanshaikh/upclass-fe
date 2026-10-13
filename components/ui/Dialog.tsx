"use client";

import { Modal } from "antd";
import { LuX } from "react-icons/lu";
import Button from "@/components/ui/Button";
import type { DialogProps } from "@/types/dialog";

export default function Dialog({
  open,
  title,
  children,
  onConfirm,
  onClose,
  afterClose,
  okText = "Ok",
  cancelText = "Cancel",
  confirmLoading = false,
  confirmDisabled = false,
  width = 520,
  closable = true,
  confirmDanger = false,
  className = "",
  footer,
}: DialogProps) {
  return (
    <Modal
      open={open}
      title={title}
      onCancel={onClose}
      afterClose={afterClose}
      centered
      destroyOnHidden
      width={width}
      closable={closable}
      className={className}
      closeIcon={<LuX size={20} aria-hidden="true" />}
      footer={
        footer !== undefined ? footer : (
          <div className="flex flex-wrap justify-end gap-3">
            <Button variant="secondary" onClick={onClose}>
              {cancelText}
            </Button>
            <Button
              onClick={onConfirm}
              loading={confirmLoading}
              disabled={confirmDisabled}
              danger={confirmDanger}
            >
              {okText}
            </Button>
          </div>
        )
      }
    >
      {children}
    </Modal>
  );
}
