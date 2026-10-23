import type { ReactNode } from "react";

export type ButtonProps = {
  children: ReactNode;
  variant?: "primary" | "secondary" | "link" | "text";
  type?: "button" | "submit" | "reset";
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  danger?: boolean;
  className?: string;
  ariaPressed?: boolean;
  onClick?: () => void;
};
