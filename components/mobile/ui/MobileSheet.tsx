"use client";

import type { ReactNode } from "react";
import { Drawer } from "antd";
import { LuX } from "react-icons/lu";
import IconButton from "@/components/mobile/ui/MobileIconButton";
import { useSwipeToDismiss } from "@/hooks/useSwipeToDismiss";

type MobileSheetProps = {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  closeLabel?: string;
  forceRender?: boolean;
  children: ReactNode;
};

export default function MobileSheet({
  open,
  onClose,
  title,
  closeLabel = "Close",
  forceRender = false,
  children,
}: MobileSheetProps) {
  const { triggerRef, triggerProps } = useSwipeToDismiss({
    onDismiss: onClose,
  });

  return (
    <Drawer
      open={open}
      onClose={onClose}
      placement="bottom"
      size="auto"
      forceRender={forceRender}
      closable={false}
      mask={{ closable: true }}
      classNames={{
        section: "rounded-t-2xl! shadow-xl! bg-background!",
        body: "flex! max-h-[85dvh]! flex-col! overflow-hidden! px-4! pt-0! pb-[calc(1rem+env(safe-area-inset-bottom))]!",
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

      {title !== undefined && (
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-dark">{title}</h2>
          <IconButton variant="ghost" label={closeLabel} onClick={onClose}>
            <LuX size={20} aria-hidden="true" />
          </IconButton>
        </div>
      )}

      {children}
    </Drawer>
  );
}
