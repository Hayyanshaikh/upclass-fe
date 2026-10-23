import type { IconType } from "react-icons";

export type ActionButtonsProps = {
  name?: string;
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  deleteDisabled?: boolean;
  deleteDisabledReason?: string;
  actions?: RecordAction[];
  showView?: boolean;
  showEdit?: boolean;
  showDelete?: boolean;
};
export type RecordAction = {
  label: string;
  icon: IconType;
  onClick?: () => void;
  danger?: boolean;
  success?: boolean;
  disabled?: boolean;
};

export type ActionButtonProps = {
  action: RecordAction;
};
