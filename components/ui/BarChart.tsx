"use client";

import SectionCard from "@/components/ui/SectionCard";
import type { BarChartProps } from "@/types/bar-chart";

export default function BarChart({
  title,
  data,
  maxValue = 100,
  valueSuffix = "%",
  className = "",
}: BarChartProps) {
  const scale = maxValue > 0 ? maxValue : 100;

  return (
    <SectionCard title={title} className={className}>
      {data.length === 0 ? (
        <p className="py-10 text-center text-sm text-gray">No data available</p>
      ) : (
        <div
          role="img"
          aria-label={`${title}: ${data.map((item) => `${item.label} ${item.value}${valueSuffix}`).join(", ")}`}
          className="grid auto-cols-fr grid-flow-col gap-4 pt-1"
        >
          {data.map((item) => {
            const height = Math.min(
              100,
              Math.max(0, (item.value / scale) * 100),
            );

            return (
              <div
                key={item.label}
                aria-hidden="true"
                title={`${item.label}: ${item.value}${valueSuffix}`}
                className="flex min-w-0 flex-col items-center gap-2"
              >
                <svg
                  viewBox="0 0 32 100"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                  className={`h-40 w-full max-w-11 sm:h-44 ${item.variant === "secondary" ? "text-secondary" : "text-primary"}`}
                >
                  <rect
                    width="32"
                    y={100 - height}
                    height={height}
                    rx="var(--radius-xs)"
                    fill="currentColor"
                  />
                  <rect
                    width="32"
                    y={100 - height / 2}
                    height={height / 2}
                    fill="currentColor"
                  />
                </svg>
                <span className="text-sm text-gray">{item.label}</span>
              </div>
            );
          })}
        </div>
      )}
    </SectionCard>
  );
}
