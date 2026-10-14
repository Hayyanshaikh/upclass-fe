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
    Tooltip: {
      colorBgSpotlight: "var(--color-dark)",
      colorTextLightSolid: "var(--color-light)",
      fontSize: 12,
      controlHeight: 0,
      paddingSM: 8,
      paddingXS: 10,
      borderRadius: 4,
    },
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
    DatePicker: {
      cellWidth: 40,
      cellHeight: 30,
      textHeight: 36,
      withoutTimeCellHeight: 52,
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
    Popover: {
      colorBgElevated: "#12261f",
      colorText: "#fff",
    },
  },
};

export default function AntdProvider({ children }: LayoutProps) {
  return (
    <ConfigProvider
      theme={theme}
      tooltip={{
        arrow: false,
        classNames: {
          root: "filter-none!",
          container: "border border-border font-medium shadow-sm",
        },
      }}
      popover={{
        classNames: {
          root: "filter-none! text-light!",
          container:
            "shadow-xl bg-dark! text-light! font-medium py-2! rounded-sm!",
        },
      }}
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
      tabs={{
        className:
          "[&_.ant-tabs-nav]:mb-4! [&_.ant-tabs-nav-list]:gap-1! [&_.ant-tabs-tab]:m-0! [&_.ant-tabs-tab]:px-3! [&_.ant-tabs-tab]:py-2! [&_.ant-tabs-tab]:font-semibold! [&_.ant-tabs-tab-active]:rounded-t-sm! [&_.ant-tabs-tab-active]:bg-primary! [&_.ant-tabs-tab-active_.ant-tabs-tab-btn]:text-background! [&_.ant-tabs-ink-bar]:hidden!",
      }}
    >
      {children}
    </ConfigProvider>
  );
}
