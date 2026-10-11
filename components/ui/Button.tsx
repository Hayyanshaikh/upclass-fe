"use client";

import type { ButtonProps } from "@/types/button";
import { Button as AntButton } from "antd";

export default function Button({
  children,
  variant = "primary",
  type = "button",
  fullWidth = false,
  disabled = false,
  loading = false,
  danger = false,
  className = "",
  onClick,
}: ButtonProps) {
  return (
    <AntButton
      type={variant === "secondary" ? "default" : variant}
      htmlType={type}
      block={fullWidth}
      disabled={disabled}
      loading={loading}
      danger={danger}
      className={`${variant === "link" ? "h-auto! p-0! font-semibold! text-primary!" : ""} ${className}`}
      onClick={onClick}
    >
      {children}
    </AntButton>
  );
}
