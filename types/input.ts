import type { ChangeEvent, ReactNode } from "react";

export type InputRule = {
  required?: boolean;
  whitespace?: boolean;
  message?: string;
  min?: number;
  max?: number;
  pattern?: RegExp;
};

export type InputProps = {
  name: string | (string | number)[];
  label?: string;
  rules?: InputRule[];
  isRequird?: boolean;
  type?: "text" | "password" | "email" | "tel" | "url" | "number";
  placeholder?: string;
  disabled?: boolean;
  allowClear?: boolean;
  autoComplete?: string;
  autoCapitalize?: string;
  spellCheck?: boolean;
  className?: string;
  prefix?: ReactNode;
  ariaLabel?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
};
