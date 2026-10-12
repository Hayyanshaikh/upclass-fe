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
}: StatCardProps) {
  return (
    <SectionCard className={className}>
      <p className="text-sm text-gray">{title}</p>
      <p className="mt-3 text-3xl leading-tight font-extrabold tracking-tight text-dark">
        {value}
      </p>
      {description && (
        <p className={`mt-2 text-sm font-semibold ${colors[variant]}`}>
          {description}
        </p>
      )}
    </SectionCard>
  );
}
