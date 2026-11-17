import type { MobileMetric } from "@/types/mobile-dashboard";

const tones = {
  primary: "bg-primary/10 text-primary",
  info: "bg-info/10 text-info",
  success: "bg-success/10 text-success",
  warning: "bg-secondary/20 text-warning",
};

export default function MetricTile({
  label,
  value,
  icon: Icon,
  tone,
}: MobileMetric) {
  return (
    <div className="min-w-0 rounded-lg border border-border bg-background p-3">
      <span
        className={`mb-2 flex size-7 items-center justify-center rounded-sm ${tones[tone]}`}
      >
        <Icon size={15} aria-hidden="true" />
      </span>
      <p className="text-lg leading-tight font-extrabold tabular-nums text-dark">
        {value}
      </p>
      <p className="mt-0.5 text-xs leading-4 font-semibold text-gray">
        {label}
      </p>
    </div>
  );
}
