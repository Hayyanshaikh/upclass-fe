"use client";

import { Progress } from "antd";
import type { ProgressBarProps } from "@/types/progress-bar";

export default function ProgressBar({ value, label }: ProgressBarProps) {
  const percent = Math.min(100, Math.max(0, value));

  return (
    <div role="progressbar">
      <Progress
        className="w-full"
        percent={percent}
        showInfo={false}
        strokeColor="var(--color-primary)"
        railColor="var(--color-border)"
        strokeWidth={12}
      />
    </div>
  );
}
