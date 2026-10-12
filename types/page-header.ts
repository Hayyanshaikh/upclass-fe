import type { ReactNode } from "react";

export type BreadcrumbItem = {
  title: string;
  href?: string;
};

export type PageHeaderProps = {
  title: string;
  breadcrumbs?: BreadcrumbItem[];
  subtitle?: string;
  actions?: ReactNode;
};
