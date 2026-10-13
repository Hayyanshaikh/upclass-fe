import type { ReactNode } from "react";

export type TabItem = {
  key: string;
  label: string;
  children: ReactNode;
};

export type TabsProps = {
  items: TabItem[];
  activeKey?: string;
  onChange?: (key: string) => void;
  scrollable?: boolean;
};
