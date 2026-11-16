import MobileSection from "@/components/mobile/ui/MobileSection";
import StatusBadge from "@/components/ui/StatusBadge";
import { todayTimetable } from "@/constants/dashboard";

const statusVariants = {
  Done: "success",
  Ongoing: "warning",
  Next: "neutral",
} as const;

export default function UpcomingTimetable() {
  const upcoming = todayTimetable.filter((lesson) => lesson.status !== "Done");

  return (
    <MobileSection
      title="Upcoming timetable"
      hint={`${upcoming.length} periods left`}
    >
      <ul className="divide-y divide-border">
        {upcoming.map((lesson) => (
          <li
            key={lesson.id}
            className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
          >
            <div className="w-16 shrink-0 rounded-sm border border-border bg-foreground py-1.5 text-center">
              <time className="text-sm leading-tight font-extrabold tabular-nums text-dark">
                {lesson.time}
              </time>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-dark">
                {lesson.subject}
              </p>
              <p className="truncate text-xs text-gray">
                Class {lesson.className} · {lesson.room}
              </p>
            </div>
            <StatusBadge variant={statusVariants[lesson.status]}>
              {lesson.status}
            </StatusBadge>
          </li>
        ))}
      </ul>
    </MobileSection>
  );
}
