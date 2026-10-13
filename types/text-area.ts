import type { InputRule } from "@/types/input";

export type TextAreaProps = {
  name: string;
  label: string;
  rows?: number;
  placeholder?: string;
  rules?: InputRule[];
};
