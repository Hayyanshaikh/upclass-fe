"use client";

import type { LayoutProps } from "@/types/layout";
import { ConfigProvider, type ThemeConfig } from "antd";

const theme: ThemeConfig = {
  token: {
    colorPrimary: "#0f5c4d",
    colorSuccess: "#0f5c4d",
    colorError: "#b3261e",
    colorWarning: "#d97706",
    colorText: "#12261f",
    colorTextSecondary: "#51655d",
    colorBorder: "#c5d1ca",
    fontFamily: "var(--font-manrope), sans-serif",
    fontSize: 14,
    borderRadius: 10,
    controlHeight: 44,
  },
  components: {
    Button: { fontWeight: 600, borderRadius: 10, primaryShadow: "none" },
    Select: {
      optionSelectedBg: "#0f5c4d",
      optionSelectedColor: "#ffffff",
    },
    Table: {
      cellFontSize: 14,
      fontWeightStrong: 600,
      headerBg: "#f3f6f3",
      headerColor: "#51655d",
      borderColor: "#e1e7e2",
      headerSplitColor: "transparent",
      cellPaddingBlock: 14,
    },
    Pagination: {
      itemSize: 44,
      itemActiveBg: "#0f5c4d",
      itemActiveColor: "#ffffff",
      itemActiveColorHover: "#ffffff",
      colorText: "#0f5c4d",
      colorBorder: "#0f5c4d",
      borderRadius: 12,
    },
  },
};

export default function AntdProvider({ children }: LayoutProps) {
  return (
    <ConfigProvider
      theme={theme}
      modal={{
        classNames: ({ props }) => ({
          container: "rounded-lg! p-6!",
          header: props.closable === false ? "mr-0! mb-2!" : "mr-8! mb-5!",
          close: "text-gray!",
          footer: props.closable === false ? "mt-4!" : "mt-5!",
        }),
      }}
      pagination={{
        className:
          "[&_.ant-pagination-item]:border-primary! [&_.ant-pagination-prev]:w-auto! [&_.ant-pagination-next]:w-auto! [&_.ant-pagination-disabled]:opacity-40",
      }}
    >
      {children}
    </ConfigProvider>
  );
}
