"use client";

import Dialog from "@/components/ui/Dialog";
import StatusBadge from "@/components/ui/StatusBadge";
import { attendanceSummary } from "@/utils/attendance";
import { exportCsv } from "@/utils/export-csv";
import type { AttendanceReportProps } from "@/types/attendance";

export default function AttendanceReportDialog({ open, title, period, rows, unsaved, onClose }: AttendanceReportProps) {
  const summary = attendanceSummary(rows);

  function downloadReport() {
    exportCsv("attendance-report.csv", [
      [title, period, unsaved ? "Includes unsaved preview changes" : "Saved preview"],
      ["Roll", "Student", "Status", "Remarks"],
      ...rows.map((row) => [row.roll, row.name, row.status || "Unmarked", row.remarks]),
    ]);
  }

  return (
    <Dialog open={open} title="Attendance report" onClose={onClose} onConfirm={downloadReport} okText="Export CSV" cancelText="Close">
      <p className="font-bold text-dark">{title}</p>
      <p className="mt-1 text-sm text-gray">{period} · {unsaved ? "Includes unsaved preview changes" : "Saved preview"}</p>
      <p className="my-4 text-sm text-gray">{summary.total} students · {summary.present} present · {summary.absent} absent · {summary.late} late · {summary.leave} leave · {summary.unmarked} unmarked</p>
      <ul className="max-h-80 divide-y divide-border overflow-y-auto">
        {rows.map((row) => (
          <li key={row.id} className="flex items-center justify-between gap-3 py-3">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-dark">{row.roll} · {row.name}</p>
              {row.remarks && <p className="mt-1 break-words text-xs text-gray">{row.remarks}</p>}
            </div>
            <StatusBadge variant={row.status === "Present" ? "success" : row.status === "Absent" ? "danger" : row.status === "Late" ? "warning" : "neutral"}>{row.status || "Unmarked"}</StatusBadge>
          </li>
        ))}
      </ul>
    </Dialog>
  );
}
