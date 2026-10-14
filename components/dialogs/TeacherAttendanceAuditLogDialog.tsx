"use client";

import Dialog from "@/components/ui/Dialog";
import Button from "@/components/ui/Button";
import type { TeacherAttendanceAuditEntry } from "@/types/teacher-attendance-audit";

type TeacherAttendanceAuditLogDialogProps = {
  open: boolean;
  entries: TeacherAttendanceAuditEntry[];
  onClose: () => void;
};

export default function TeacherAttendanceAuditLogDialog({ open, entries, onClose }: TeacherAttendanceAuditLogDialogProps) {
  return <Dialog open={open} title="Attendance audit log" onClose={onClose} onConfirm={onClose}
    footer={<div className="flex justify-end"><Button variant="secondary" onClick={onClose}>Close</Button></div>}>
    {entries.length === 0 ? <p className="text-sm text-gray">No attendance changes have been made in this session.</p> :
      <ul className="max-h-96 space-y-3 overflow-y-auto">
        {entries.map((entry, index) => <li key={`${entry.id}-${index}`} className="rounded-lg border border-border p-4">
          <p className="font-semibold text-dark">{entry.teacher} <span className="font-normal text-gray">· {entry.id} · {entry.date}</span></p>
          <p className="mt-1 text-sm text-gray">{entry.previousStatus} → {entry.status}</p>
          <p className="mt-2 text-sm text-dark">Reason: {entry.reason}</p>
        </li>)}
      </ul>}
  </Dialog>;
}
