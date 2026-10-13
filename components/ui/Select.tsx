"use client";

import type { SelectProps } from "@/types/select";
import { Form, Select as AntSelect } from "antd";
import { LuCheck, LuChevronDown } from "react-icons/lu";

export default function Select({
  label,
  name,
  rules,
  isRequird = false,
  options,
  placeholder,
  disabled = false,
  loading = false,
  showSearch = true,
  allowClear = false,
  className = "",
  onChange,
}: SelectProps) {
  return (
    <Form.Item
      layout="vertical"
      name={name}
      label={label && <span className="font-semibold">{label}</span>}
      rules={
        isRequird && !rules?.some((rule) => rule.required)
          ? [
              { required: true, message: `${label || name} is required` },
              ...(rules || []),
            ]
          : rules
      }
    >
      <AntSelect
        suffixIcon={loading ? undefined : <LuChevronDown aria-hidden="true" />}
        menuItemSelectedIcon={<LuCheck aria-hidden="true" />}
        options={options}
        placeholder={placeholder}
        disabled={disabled}
        loading={loading}
        showSearch={showSearch}
        optionFilterProp="label"
        allowClear={allowClear}
        onChange={onChange}
        className={`w-full ${className}`}
      />
    </Form.Item>
  );
}
