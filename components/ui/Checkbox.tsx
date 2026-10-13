"use client";

import type { CheckboxProps } from "@/types/checkbox";
import { Checkbox as AntCheckbox, Form } from "antd";

export default function Checkbox({
  name,
  label,
  ariaLabel,
  disabled = false,
  className = "",
  onChange,
}: CheckboxProps) {
  return (
    <Form.Item name={name} valuePropName="checked" noStyle>
      <AntCheckbox
        aria-label={ariaLabel}
        disabled={disabled}
        className={className}
        onChange={(event) => onChange?.(event.target.checked)}
      >
        {label}
      </AntCheckbox>
    </Form.Item>
  );
}
