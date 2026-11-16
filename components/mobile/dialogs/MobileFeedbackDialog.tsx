"use client";

import { LuCircleAlert, LuCircleCheck } from "react-icons/lu";
import Button from "@/components/ui/Button";
import MobileSheet from "@/components/mobile/ui/MobileSheet";

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
  const isSuccess = tone === "success";

  return (
    <MobileSheet open={open} onClose={onClose}>
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
    </MobileSheet>
  );
}
