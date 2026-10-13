import type { IconType } from "react-icons";

export type ActionButtonsProps = {
  name?: string;
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  actions?: RecordAction[];
};
export type RecordAction = {
  label: string;
  icon: IconType;
  onClick?: () => void;
  danger?: boolean;
};
