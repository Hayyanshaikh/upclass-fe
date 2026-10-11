import type { ReactNode } from "react";

export type DeleteDialogProps = {
  open: boolean;
  title?: ReactNode;
  message?: ReactNode;
  description?: ReactNode;
  okText?: string;
  cancelText?: string;
  onClose: () => void;
  onConfirm: () => void;
  confirmLoading?: boolean;
};
