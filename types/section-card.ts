import type { ReactNode } from "react";

export type SectionCardProps = {
  title?: string;
  children: ReactNode;
  divider?: boolean;
  className?: string;
  autoHeight?: boolean;
  size?: "sm" | "md";
};
