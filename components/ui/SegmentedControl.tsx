"use client";

import { useId } from "react";
import { Radio } from "antd";
import type { SegmentedControlProps } from "@/types/segmented-control";

const selectedColors = {
  primary: "border-primary! bg-primary! text-background! before:bg-primary!",
  danger: "border-danger! bg-danger! text-background! before:bg-danger!",
  warning: "border-warning! bg-warning! text-background! before:bg-warning!",
  neutral: "border-gray! bg-gray! text-background! before:bg-gray!",
};

export default function SegmentedControl<T extends string>({ label, value, options, onChange }: SegmentedControlProps<T>) {
  const name = useId();

  return (
    <Radio.Group
      name={name}
      role="radiogroup"
      aria-label={label}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="inline-flex! whitespace-nowrap"
    >
      {options.map((option) => (
        <Radio.Button
          key={option.value}
          value={option.value}
          className={`font-semibold! ${value === option.value ? selectedColors[option.variant ?? "primary"] : "border-border! text-gray!"}`}
        >
          {option.label}
        </Radio.Button>
      ))}
    </Radio.Group>
  );
}
