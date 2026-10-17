"use client";

import { Alert as AntAlert, type AlertProps as AntAlertProps } from "antd";
import type { ReactNode } from "react";

type AlertProps = {
  message: ReactNode;
  type?: NonNullable<AntAlertProps["type"]>;
  className?: string;
  role?: string;
};

export default function Alert({
  message,
  type = "info",
  className,
  role = "status",
}: AlertProps) {
  return (
    <AntAlert
      title={message}
      type={type}
      showIcon
      role={role}
      className={`mt-5! ${className}`}
    />
  );
}
