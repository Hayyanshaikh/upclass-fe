import type { IconType } from "react-icons";

export type NavItem = {
  label: string;
  href: string;
  icon: IconType;
  group?: string;
  badge?: number;
  featured?: boolean;
  permission: string;
};
