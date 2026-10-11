"use client";

import { Card } from "antd";
import type { StatCardProps } from "@/types/stat-card";

const colors = {
  success: "text-success",
  warning: "text-warning",
  danger: "text-danger",
};

export default function StatCard({
  title,
  value,
  description,
  variant = "success",
  className = "",
}: StatCardProps) {
  return (
    <Card
      className={`h-full rounded-lg! border-border! bg-white ${className}`}
      classNames={{ body: "p-[22px]" }}
    >
      <p className="text-base text-gray">{title}</p>
      <p className="mt-3 text-[32px] leading-tight font-extrabold tracking-tight text-dark">
        {value}
      </p>
      {description && (
        <p className={`mt-2 text-base font-semibold ${colors[variant]}`}>
          {description}
        </p>
      )}
    </Card>
  );
}
