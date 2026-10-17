"use client";

import { Card } from "antd";
import type { SectionCardProps } from "@/types/section-card";

export default function SectionCard({
  title,
  children,
  divider = false,
  className = "",
  autoHeight = false,
  size = "md",
}: SectionCardProps) {
  return (
    <Card
      className={`${autoHeight ? "h-auto" : "h-full"} min-w-0 rounded-lg! border-border! bg-background! ${className}`}
      classNames={{ body: size === "sm" ? "p-3!" : "p-5! sm:p-6!" }}
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
