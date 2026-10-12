"use client";

import SectionCard from "@/components/ui/SectionCard";
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
  size = "md",
}: StatCardProps) {
  const small = size === "sm";
  return (
    <SectionCard className={className} size={size}>
      <div className={small ? "flex items-center justify-between gap-3" : ""}>
        <p className={`${small ? "text-xs" : "text-sm"} text-gray`}>{title}</p>
        <p className={`${small ? "shrink-0 text-xl" : "mt-3 text-3xl"} leading-tight font-extrabold tracking-tight text-dark`}>
          {value}
        </p>
      </div>
      {description && (
        <p className={`${small ? "mt-1 text-xs" : "mt-2 text-sm"} font-semibold ${colors[variant]}`}>
          {description}
        </p>
      )}
    </SectionCard>
  );
}
