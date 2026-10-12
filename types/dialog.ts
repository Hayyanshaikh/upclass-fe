import type { ReactNode } from "react";

export type DialogProps = {
  open: boolean;
  title: ReactNode;
  children: ReactNode;
  onConfirm: () => void;
  onClose: () => void;
  okText?: string;
  cancelText?: string;
  confirmLoading?: boolean;
  confirmDisabled?: boolean;
  width?: number;
  closable?: boolean;
  confirmDanger?: boolean;
  className?: string;
  footer?: ReactNode;
};
