import SectionCard from "@/components/ui/SectionCard";
import StatusBadge from "@/components/ui/StatusBadge";
import { todayTimetable } from "@/constants/dashboard";

const statusVariants = {
  Done: "success",
  Ongoing: "warning",
  Next: "neutral",
} as const;

export default function TodayTimetable() {
  return (
    <SectionCard title="Today’s timetable" divider>
      <ul className="divide-y divide-border">
        {todayTimetable.map((lesson) => (
          <li key={lesson.id} className="flex flex-wrap items-center gap-x-4 gap-y-2 py-4 sm:flex-nowrap sm:gap-x-6">
            <time className="w-14 shrink-0 text-sm font-extrabold tabular-nums text-dark">{lesson.time}</time>
            <div className="min-w-0 flex-1">
              <p className="text-base font-bold text-dark">{lesson.subject}</p>
              <p className="text-sm text-gray">Class {lesson.className} · {lesson.room}</p>
            </div>
            <StatusBadge variant={statusVariants[lesson.status]}>{lesson.status}</StatusBadge>
          </li>
        ))}
      </ul>
    </SectionCard>
  );
}
