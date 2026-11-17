import MobileSection from "@/components/mobile/ui/MobileSection";
import { todayAttendance } from "@/constants/mobile-dashboard";

const ringRadius = 40;
const ringCircumference = 2 * Math.PI * ringRadius;

export default function AttendanceOverview() {
  const total =
    todayAttendance.present + todayAttendance.absent + todayAttendance.onLeave;
  const absentPercent =
    total > 0 ? (todayAttendance.absent / total) * 100 : 0;
  const leavePercent =
    total > 0 ? (todayAttendance.onLeave / total) * 100 : 0;
  const presentDash =
    (todayAttendance.percent / 100) * ringCircumference;

  return (
    <MobileSection title="Today’s attendance">
      <div className="flex items-center gap-4">
        <div
          className="relative size-24 shrink-0"
          role="img"
          aria-label={`${todayAttendance.percent}% of students present today`}
        >
          <svg viewBox="0 0 100 100" className="size-full -rotate-90">
            <circle
              cx="50"
              cy="50"
              r={ringRadius}
              fill="none"
              strokeWidth="8"
              className="stroke-border"
            />
            <circle
              cx="50"
              cy="50"
              r={ringRadius}
              fill="none"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${presentDash} ${ringCircumference}`}
              className="stroke-primary"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl leading-none font-extrabold tabular-nums text-dark">
              {todayAttendance.percent}%
            </span>
            <span className="mt-1 text-xs font-medium text-gray">Present</span>
          </div>
        </div>

        <dl className="min-w-0 flex-1 space-y-2.5">
          <div className="flex items-center gap-2">
            <span
              className="size-2 shrink-0 rounded-full bg-primary"
              aria-hidden="true"
            />
            <dt className="text-xs font-semibold text-gray">Present</dt>
            <dd className="ml-auto text-sm font-extrabold tabular-nums text-dark">
              {todayAttendance.present.toLocaleString("en-US")}
            </dd>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="size-2 shrink-0 rounded-full bg-secondary"
              aria-hidden="true"
            />
            <dt className="text-xs font-semibold text-gray">Absent</dt>
            <dd className="ml-auto text-sm font-extrabold tabular-nums text-dark">
              {todayAttendance.absent}
            </dd>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="size-2 shrink-0 rounded-full bg-light"
              aria-hidden="true"
            />
            <dt className="text-xs font-semibold text-gray">On leave</dt>
            <dd className="ml-auto text-sm font-extrabold tabular-nums text-dark">
              {todayAttendance.onLeave}
            </dd>
          </div>
        </dl>
      </div>

      <svg
        viewBox="0 0 100 6"
        preserveAspectRatio="none"
        className="mt-4 h-1.5 w-full"
        aria-hidden="true"
      >
        <rect width="100" height="6" className="fill-border" />
        <rect
          width={todayAttendance.percent}
          height="6"
          className="fill-primary"
        />
        <rect
          x={todayAttendance.percent}
          width={absentPercent}
          height="6"
          className="fill-secondary"
        />
        <rect
          x={todayAttendance.percent + absentPercent}
          width={leavePercent}
          height="6"
          className="fill-light"
        />
      </svg>
    </MobileSection>
  );
}
