import type { StatusBadgeProps } from "@/types/status-badge";

const variants = {
  success: "bg-success/10 text-success",
  warning: "bg-secondary/20 text-warning",
  neutral: "bg-gray/10 text-gray",
  danger: "bg-danger/10 text-danger",
  info: "bg-info/10 text-info",
};

export default function StatusBadge({ children, variant = "neutral" }: StatusBadgeProps) {
  return (
    <span className={`inline-flex shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${variants[variant]}`}>
      {children}
    </span>
  );
}
