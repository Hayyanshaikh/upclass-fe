"use client";

import { Form, TimePicker as AntTimePicker } from "antd";
import { LuClock } from "react-icons/lu";
import type { TimePickerProps } from "@/types/time-picker";

export default function TimePicker({ name, label, isRequird = false }: TimePickerProps) {
  return (
    <Form.Item name={name} layout="vertical" label={<span className="font-semibold">{label}</span>}
      rules={isRequird ? [{ required: true, message: `${label} is required` }] : []}>
      <AntTimePicker className="w-full" format="HH:mm" placeholder="--:--" suffixIcon={<LuClock aria-hidden="true" />} />
    </Form.Item>
  );
}
