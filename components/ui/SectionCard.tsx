"use client";

import { Card } from "antd";
import type { SectionCardProps } from "@/types/section-card";

export default function SectionCard({
  title,
  children,
  divider = false,
  className = "",
}: SectionCardProps) {
  return (
    <Card
      className={`h-full min-w-0 rounded-lg! border-border! bg-background! ${className}`}
      classNames={{ body: "p-5! sm:p-6!" }}
    >
      {title && (
        <h2 className={`text-base font-extrabold text-dark ${divider ? "border-b border-border pb-2" : "mb-5"}`}>
          {title}
        </h2>
      )}
      {children}
    </Card>
  );
}
