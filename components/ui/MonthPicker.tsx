"use client";

import { DatePicker as AntDatePicker, Form } from "antd";
import { LuCalendarDays } from "react-icons/lu";
import type { MonthPickerProps } from "@/types/month-picker";

export default function MonthPicker({
  name,
  label,
  isRequird = false,
  onChange,
}: MonthPickerProps) {
  return (
    <Form.Item
      name={name}
      layout="vertical"
      label={label && <span className="font-semibold">{label}</span>}
      rules={
        isRequird ? [{ required: true, message: `${label} is required` }] : []
      }
    >
      <AntDatePicker
        picker="month"
        format="MMMM YYYY"
        allowClear={true}
        onChange={onChange}
        suffixIcon={<LuCalendarDays aria-hidden="true" />}
        className="w-full"
        placeholder="Select month"
        getPopupContainer={(trigger) => trigger.parentElement!}
      />
    </Form.Item>
  );
}
