import type { ReactNode } from "react";

export interface ErrorScreenProps {
  code: number;
  title: string;
  description: string;
  icon: ReactNode;
  actionLabel: string;
  actionHref?: string;
  fallbackHref?: string;
}
