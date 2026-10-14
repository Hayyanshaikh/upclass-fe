"use client";

import Dialog from "@/components/ui/Dialog";
import Button from "@/components/ui/Button";
import StatusBadge from "@/components/ui/StatusBadge";
import { teacherAttendanceStatusVariants } from "@/constants/teacher-attendance";
import type { TeacherAttendanceRow } from "@/types/teacher-attendance";

type TeacherAttendanceDetailsDialogProps = {
  record: TeacherAttendanceRow | null;
  onClose: () => void;
};

export default function TeacherAttendanceDetailsDialog({
  record,
  onClose,
}: TeacherAttendanceDetailsDialogProps) {
  const date = record?.date.split("-");

  return (
    <Dialog
      open={record !== null}
      onClose={onClose}
      onConfirm={onClose}
      footer={<div className="flex justify-end"><Button variant="secondary" onClick={onClose}>Close</Button></div>}
      title={record && (
        <div className="flex items-center gap-3">
          <span
            className="flex size-11 shrink-0 items-center justify-center rounded-full bg-success/10 text-lg font-bold text-primary"
            aria-hidden="true"
          >
            {record.teacher.charAt(0)}
          </span>
          <div>
            <h2 className="text-lg leading-tight font-bold text-dark">{record.teacher}</h2>
            <p className="mt-0.5 text-sm font-normal text-gray">{record.id} · {record.subject}</p>
          </div>
        </div>
      )}
    >
      {record && (
        <dl className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs text-gray">Date</dt>
            <dd className="mt-1 text-sm font-semibold text-dark">{date?.[2]}/{date?.[1]}/{date?.[0]}</dd>
          </div>
          <div>
            <dt className="text-xs text-gray">Department</dt>
            <dd className="mt-1 text-sm font-semibold text-dark">{record.department}</dd>
          </div>
          <div>
            <dt className="text-xs text-gray">Attendance status</dt>
            <dd className="mt-1">
              <StatusBadge variant={teacherAttendanceStatusVariants[record.status]}>
                {record.status === "Late" && record.lateMinutes
                  ? `Late · ${record.lateMinutes} min`
                  : record.status}
              </StatusBadge>
            </dd>
          </div>
          <div>
            <dt className="text-xs text-gray">Source</dt>
            <dd className="mt-1 text-sm font-semibold text-dark">{record.source}</dd>
          </div>
          <div>
            <dt className="text-xs text-gray">Check-in</dt>
            <dd className="mt-1 text-sm font-semibold text-dark">{record.checkIn ?? "–"}</dd>
          </div>
          <div>
            <dt className="text-xs text-gray">Check-out</dt>
            <dd className="mt-1 text-sm font-semibold text-dark">{record.checkOut ?? "–"}</dd>
          </div>
          <div>
            <dt className="text-xs text-gray">Hours</dt>
            <dd className="mt-1 text-sm font-semibold text-dark">{record.hours ?? "–"}</dd>
          </div>
        </dl>
      )}
    </Dialog>
  );
}
