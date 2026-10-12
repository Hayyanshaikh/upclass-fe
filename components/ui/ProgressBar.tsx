"use client";

import { Progress } from "antd";
import type { ProgressBarProps } from "@/types/progress-bar";

const colors = {
  success: "var(--color-primary)",
  warning: "var(--color-secondary)",
  danger: "var(--color-danger)",
};

export default function ProgressBar({ value, label, variant = "success" }: ProgressBarProps) {
  const percent = Math.min(100, Math.max(0, value));

  return (
    <div role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent}>
      <Progress
        className="w-full"
        percent={percent}
        showInfo={false}
        strokeColor={colors[variant]}
        railColor="var(--color-border)"
        size="small"
      />
    </div>
  );
}
