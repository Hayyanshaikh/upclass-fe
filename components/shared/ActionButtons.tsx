"use client";

import { ConfigProvider, Tooltip } from "antd";
import { useState } from "react";
import { LuEye, LuPencil, LuTrash2 } from "react-icons/lu";
import Button from "@/components/ui/Button";
import type {
  ActionButtonProps,
  ActionButtonsProps,
  RecordAction,
} from "@/types/action-buttons";

function getTooltipContainer(trigger: HTMLElement) {
  // Use the existing body to avoid a temporarily detached default portal.
  if (trigger.getRootNode() === trigger.ownerDocument) {
    return trigger.ownerDocument.body;
  }

  // Keep portals in the same tree when a trigger lives in a shadow root.
  return trigger.parentElement ?? trigger;
}

function ActionButton({ action }: ActionButtonProps) {
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const Icon = action.icon;

  return (
    <ConfigProvider
      getPopupContainer={(triggerNode) =>
        triggerNode?.parentNode as HTMLElement
      }
    >
      <Tooltip
        title={action.label}
        trigger={["hover"]}
        open={hovered || focused}
        onOpenChange={setHovered}
        getPopupContainer={(trigger) => trigger.parentElement!}
        destroyOnHidden
      >
        <span
          className="inline-flex shrink-0"
          // Dialogs restore focus during commit. Defer focus updates to avoid
          // invoking AntD's synchronous focus trigger inside React's lifecycle.
          onFocus={() => queueMicrotask(() => setFocused(true))}
          onBlur={() => queueMicrotask(() => setFocused(false))}
        >
          <Button
            variant="text"
            danger={action.danger}
            disabled={action.disabled}
            className={`size-8! shrink-0 rounded-sm! p-0! text-gray! hover:bg-action-hover! focus-visible:bg-action-hover! ${action.danger ? "text-danger! hover:bg-danger/10!" : ""} ${action.success ? "text-success! hover:bg-success/10!" : ""}`}
            onClick={() => {
              setHovered(false);
              setFocused(false);
              action.onClick?.();
            }}
          >
            <Icon
              className={`size-4.5 ${action.danger ? "text-danger" : ""} ${action.success ? "text-success" : ""}`}
              aria-hidden="true"
            />
            <span className="sr-only">{action.label}</span>
          </Button>
        </span>
      </Tooltip>
    </ConfigProvider>
  );
}

export default function ActionButtons({
  name = "record",
  onView,
  onEdit,
  onDelete,
  deleteDisabled = false,
  deleteDisabledReason,
  actions,
}: ActionButtonsProps) {
  const buttons: RecordAction[] = actions ?? [
    ...(onView
      ? [{ label: `View ${name}`, icon: LuEye, onClick: onView }]
      : []),
    ...(onEdit
      ? [{ label: `Edit ${name}`, icon: LuPencil, onClick: onEdit }]
      : []),
    ...(onDelete
      ? [
          {
            label: deleteDisabledReason ?? `Delete ${name}`,
            icon: LuTrash2,
            onClick: onDelete,
            danger: true,
            disabled: deleteDisabled,
          },
        ]
      : []),
  ];

  return (
    <div className="flex items-center gap-1">
      {buttons.map((action) => (
        <ActionButton key={action.label} action={action} />
      ))}
    </div>
  );
}
