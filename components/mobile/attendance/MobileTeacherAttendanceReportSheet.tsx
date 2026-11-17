"use client";

import { Progress } from "antd";
import StatusBadge from "@/components/ui/StatusBadge";
import MobileSheet from "@/components/mobile/ui/MobileSheet";
import { teacherAttendanceReportVariants } from "@/constants/teacher-attendance-report";
import type { TeacherAttendanceReportRow } from "@/types/teacher-attendance-report";

type MobileTeacherAttendanceReportSheetProps = {
  open: boolean;
  row: TeacherAttendanceReportRow | null;
  onClose: () => void;
};

const circleColors = {
  success: "var(--color-primary)",
  warning: "var(--color-secondary)",
  danger: "var(--color-danger)",
} as const;

function ReportSheetBody({ row }: { row: TeacherAttendanceReportRow }) {
  const variant = teacherAttendanceReportVariants[row.status];
  const stats = [
    { label: "Days", value: row.days },
    { label: "Present", value: row.present },
    { label: "Absent", value: row.absent },
    { label: "Late", value: row.late },
    { label: "Leave", value: row.leave },
  ];

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto pb-1">
      <div className="mt-1 flex shrink-0 items-center gap-3 border-b border-border pb-4">
        <span
          className="flex size-10 shrink-0 items-center justify-center rounded-full bg-success/10 font-bold text-primary"
          aria-hidden="true"
        >
          {row.teacher.charAt(0)}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-dark">
            {row.teacher}
          </p>
          <p className="truncate text-xs text-gray">{row.id}</p>
        </div>
        <StatusBadge variant={variant}>{row.status}</StatusBadge>
      </div>

      <div
        role="progressbar"
        aria-label={`${row.teacher} attendance`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.min(100, Math.max(0, row.percent))}
        className="mt-5 flex shrink-0 justify-center"
      >
        <Progress
          type="circle"
          percent={row.percent}
          size={112}
          strokeWidth={8}
          strokeColor={circleColors[variant]}
          railColor="var(--color-border)"
          format={() => (
            <span className="text-xl font-bold tabular-nums text-dark">
              {row.percent}%
            </span>
          )}
        />
      </div>

      <dl className="mt-5 divide-y divide-border rounded-lg border border-border">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex items-center justify-between px-4 py-2.5"
          >
            <dt className="text-sm text-gray">{stat.label}</dt>
            <dd className="text-sm font-bold tabular-nums text-dark">
              {stat.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export default function MobileTeacherAttendanceReportSheet({
  open,
  row,
  onClose,
}: MobileTeacherAttendanceReportSheetProps) {
  return (
    <MobileSheet open={open} onClose={onClose} title="Attendance details">
      {row && <ReportSheetBody row={row} />}
    </MobileSheet>
  );
}
