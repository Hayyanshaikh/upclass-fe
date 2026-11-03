"use client";

import type { SwitchProps } from "@/types/switch";
import { Switch as AntSwitch } from "antd";

export default function Switch({
  checked,
  label,
  ariaLabel,
  disabled = false,
  loading = false,
  className = "",
  onChange,
}: SwitchProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <AntSwitch
        checked={checked}
        disabled={disabled}
        loading={loading}
        aria-label={ariaLabel ?? label}
        onChange={onChange}
      />
      {label && (
        <span className="text-sm font-semibold text-dark">{label}</span>
      )}
    </div>
  );
}
