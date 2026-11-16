import MobileSection from "@/components/mobile/ui/MobileSection";
import { recentActivities } from "@/constants/mobile-dashboard";

const tones = {
  success: "bg-success/10 text-success",
  info: "bg-info/10 text-info",
  warning: "bg-secondary/20 text-warning",
};

export default function RecentActivity() {
  return (
    <MobileSection title="Recent activity" hint="Today">
      <ul className="divide-y divide-border">
        {recentActivities.map((activity) => {
          const Icon = activity.icon;

          return (
            <li
              key={activity.id}
              className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
            >
              <span
                className={`flex size-9 shrink-0 items-center justify-center rounded-sm ${tones[activity.tone]}`}
              >
                <Icon size={16} aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-dark">
                  {activity.title}
                </p>
                <p className="truncate text-xs text-gray">{activity.meta}</p>
              </div>
              <time className="shrink-0 text-xs font-medium tabular-nums text-gray">
                {activity.time}
              </time>
            </li>
          );
        })}
      </ul>
    </MobileSection>
  );
}
