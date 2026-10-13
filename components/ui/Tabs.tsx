"use client";

import { Tabs as AntTabs } from "antd";
import type { TabsProps } from "@/types/tabs";

export default function Tabs({ items, activeKey, onChange, scrollable = false }: TabsProps) {
  return (
    <AntTabs
      activeKey={activeKey}
      onChange={onChange}
      items={items}
      className={scrollable ? "h-full min-h-0 overflow-hidden [&_.ant-tabs-body-holder]:overflow-hidden" : undefined}
      classNames={scrollable ? {
        body: "h-full",
        content: "h-full overflow-y-auto overscroll-contain",
      } : undefined}
    />
  );
}
