import type { ReactNode } from "react";

export type FeedbackDialogProps = {
  open: boolean;
  title?: ReactNode;
  message: ReactNode;
  onClose: () => void;
  okText?: string;
};
