"use client";

import { LuEye, LuPencil, LuTrash2 } from "react-icons/lu";
import Button from "@/components/ui/Button";
import type { ActionButtonsProps } from "@/types/action-buttons";

export default function ActionButtons({
  name = "record",
  onView,
  onEdit,
  onDelete,
}: ActionButtonsProps) {
  const buttonClass =
    "size-8! shrink-0 rounded-sm! p-0! text-gray! hover:bg-action-hover! focus-visible:bg-action-hover!";

  return (
    <div className="flex items-center gap-1">
      {onView && (
        <Button variant="text" className={buttonClass} onClick={onView}>
          <LuEye className="size-4.5" aria-hidden="true" />
          <span className="sr-only">View {name}</span>
        </Button>
      )}
      {onEdit && (
        <Button variant="text" className={buttonClass} onClick={onEdit}>
          <LuPencil className="size-4.5" aria-hidden="true" />
          <span className="sr-only">Edit {name}</span>
        </Button>
      )}
      {onDelete && (
        <Button
          variant="text"
          danger
          className={`${buttonClass} text-danger! hover:bg-danger/10!`}
          onClick={onDelete}
        >
          <LuTrash2 className="size-4.5 text-danger" aria-hidden="true" />
          <span className="sr-only">Delete {name}</span>
        </Button>
      )}
    </div>
  );
}
