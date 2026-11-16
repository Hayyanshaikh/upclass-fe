"use client";

import { Drawer } from "antd";
import { LuCircleAlert, LuCircleCheck } from "react-icons/lu";
import Button from "@/components/ui/Button";
import { useSwipeToDismiss } from "@/hooks/useSwipeToDismiss";

type MobileFeedbackDialogProps = {
  open: boolean;
  tone: "success" | "error";
  message: string;
  title?: string;
  onClose: () => void;
};

export default function MobileFeedbackDialog({
  open,
  tone,
  message,
  title,
  onClose,
}: MobileFeedbackDialogProps) {
  const { triggerRef, triggerProps } = useSwipeToDismiss({
    onDismiss: onClose,
  });

  const isSuccess = tone === "success";

  return (
    <Drawer
      open={open}
      onClose={onClose}
      placement="bottom"
      size="auto"
      closable={false}
      mask={{ closable: true }}
      classNames={{
        section: "rounded-t-2xl!  shadow-xl! bg-background!",
        body: " px-4! pt-0! pb-[calc(1rem+env(safe-area-inset-bottom))]!",
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

      <div className="flex flex-col items-center text-center">
        <span
          className={`flex size-12 items-center justify-center rounded-full ${
            isSuccess ? "bg-success/10 text-success" : "bg-danger/10 text-danger"
          }`}
        >
          {isSuccess ? (
            <LuCircleCheck size={26} aria-hidden="true" />
          ) : (
            <LuCircleAlert size={26} aria-hidden="true" />
          )}
        </span>

        <h2 className="mt-3 text-lg font-bold text-dark">
          {title ?? (isSuccess ? "Success" : "Something went wrong")}
        </h2>
        <p className="mt-1 text-sm leading-5 text-gray">{message}</p>
      </div>

      <div className="mt-5">
        <Button fullWidth onClick={onClose}>
          Okay
        </Button>
      </div>
    </Drawer>
  );
}
