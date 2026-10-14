"use client";

import { DatePicker as AntDatePicker, Form } from "antd";
import dayjs from "dayjs";
import { LuCalendarDays } from "react-icons/lu";
import type { DatePickerProps } from "@/types/date-picker";

export default function DatePicker({
  name,
  label,
  isRequird = false,
  pastOnly = false,
  minDate,
  onChange,
}: DatePickerProps) {
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
        onChange={onChange}
        suffixIcon={<LuCalendarDays aria-hidden="true" />}
        className="w-full"
        format="DD/MM/YYYY"
        placeholder="dd/mm/yyyy"
        getPopupContainer={(trigger) => trigger.parentElement!}
        disabledDate={(date) =>
          (pastOnly && date.isAfter(dayjs(), "day")) ||
          Boolean(minDate && date.isBefore(minDate, "day"))
        }
      />
    </Form.Item>
  );
}
