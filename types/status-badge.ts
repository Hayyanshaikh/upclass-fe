import type { ReactNode } from "react";

export type StatusBadgeProps = {
  children: ReactNode;
  variant?: "success" | "warning" | "neutral" | "danger" | "info";
};
