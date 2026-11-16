import MetricTile from "@/components/mobile/ui/MetricTile";
import { mobileMetrics } from "@/constants/mobile-dashboard";

export default function HomeStats() {
  return (
    <section aria-label="School overview" className="grid grid-cols-3 gap-2">
      {mobileMetrics.map((metric) => (
        <MetricTile key={metric.label} {...metric} />
      ))}
    </section>
  );
}
