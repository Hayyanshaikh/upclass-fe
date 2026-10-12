export type StatCardProps = {
  title: string;
  value: string | number;
  description?: string;
  variant?: "success" | "warning" | "danger";
  className?: string;
  size?: "sm" | "md";
};
