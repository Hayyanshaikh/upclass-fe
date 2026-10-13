"use client";

import { LuEye, LuPencil, LuTrash2 } from "react-icons/lu";
import Button from "@/components/ui/Button";
import type { ActionButtonsProps, RecordAction } from "@/types/action-buttons";

export default function ActionButtons({
  name = "record",
  onView,
  onEdit,
  onDelete,
  actions,
}: ActionButtonsProps) {
  const buttonClass =
    "size-8! shrink-0 rounded-sm! p-0! text-gray! hover:bg-action-hover! focus-visible:bg-action-hover!";
  const buttons: RecordAction[] = actions ?? [
    ...(onView ? [{ label: `View ${name}`, icon: LuEye, onClick: onView }] : []),
    ...(onEdit ? [{ label: `Edit ${name}`, icon: LuPencil, onClick: onEdit }] : []),
    ...(onDelete ? [{ label: `Delete ${name}`, icon: LuTrash2, onClick: onDelete, danger: true }] : []),
  ];

  return (
    <div className="flex items-center gap-1">
      {buttons.map((action) => {
        const Icon = action.icon;
        return (
          <Button key={action.label} variant="text" danger={action.danger}
            className={`${buttonClass} ${action.danger ? "text-danger! hover:bg-danger/10!" : ""}`}
            onClick={action.onClick}>
            <Icon className={`size-4.5 ${action.danger ? "text-danger" : ""}`} aria-hidden="true" />
            <span className="sr-only">{action.label}</span>
          </Button>
        );
      })}
    </div>
  );
}
