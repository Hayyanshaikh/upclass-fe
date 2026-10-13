"use client";

import { Form, Input } from "antd";
import type { TextAreaProps } from "@/types/text-area";

export default function TextArea({ name, label, rows = 3, placeholder, rules }: TextAreaProps) {
  return (
    <Form.Item name={name} rules={rules} layout="vertical" label={<span className="font-semibold">{label}</span>}>
      <Input.TextArea rows={rows} placeholder={placeholder} />
    </Form.Item>
  );
}
