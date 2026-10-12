"use client";

import type { InputProps } from "@/types/input";
import { Form, Input as AntInput } from "antd";
import { LuEye, LuEyeOff } from "react-icons/lu";

export default function Input({
  name,
  label,
  rules,
  isRequird = false,
  type = "text",
  placeholder,
  disabled = false,
  allowClear = false,
  autoComplete,
  autoCapitalize,
  spellCheck,
  className = "",
  prefix,
  ariaLabel,
  onChange,
}: InputProps) {
  const inputProps = {
    placeholder,
    disabled,
    allowClear,
    autoComplete,
    autoCapitalize,
    spellCheck,
    prefix,
    "aria-label": ariaLabel,
    className: `w-full ${className}`,
    onChange,
  };

  return (
    <Form.Item
      layout="vertical"
      name={name}
      label={label ? <span className="font-semibold">{label}</span> : undefined}
      rules={
        isRequird && !rules?.some((rule) => rule.required)
          ? [
              { required: true, message: `${label || name} is required` },
              ...(rules || []),
            ]
          : rules
      }
    >
      {type === "password" ? (
        <AntInput.Password
          {...inputProps}
          iconRender={(visible) =>
            visible ? (
              <LuEye aria-hidden="true" />
            ) : (
              <LuEyeOff aria-hidden="true" />
            )
          }
        />
      ) : (
        <AntInput {...inputProps} type={type} />
      )}
    </Form.Item>
  );
}
