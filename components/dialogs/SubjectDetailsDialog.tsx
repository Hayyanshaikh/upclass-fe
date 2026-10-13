"use client";

import Dialog from "@/components/ui/Dialog";
import StatusBadge from "@/components/ui/StatusBadge";
import type { Subject } from "@/types/subject";

type SubjectDetailsDialogProps = {
  subject: Subject | null;
  onClose: () => void;
  onEdit: (subject: Subject) => void;
};

export default function SubjectDetailsDialog({ subject, onClose, onEdit }: SubjectDetailsDialogProps) {
  return (
    <Dialog
      open={subject !== null}
      title={subject && (
        <div className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className="flex size-11 shrink-0 items-center justify-center rounded-full bg-success/10 text-lg font-bold text-primary"
          >
            {subject.name.charAt(0)}
          </span>
          <div>
            <h2 className="text-lg leading-tight font-bold text-dark">{subject.name}</h2>
            <p className="mt-0.5 text-sm font-normal text-gray">Code {subject.code}</p>
          </div>
        </div>
      )}
      cancelText="Close"
      onClose={onClose}
      onConfirm={() => { if (subject) onEdit(subject); }}
      okText="Edit subject"
      confirmDisabled={!subject}
    >
      {subject && (
        <dl className="grid grid-cols-1 gap-x-6 gap-y-4 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-xs text-gray">Type</dt>
            <dd className="mt-1">
              <StatusBadge variant={subject.type === "Core" ? "success" : "warning"}>
                {subject.type}
              </StatusBadge>
            </dd>
          </div>
          <div>
            <dt className="text-xs text-gray">Status</dt>
            <dd className="mt-1">
              <StatusBadge variant={subject.status === "Active" ? "success" : "neutral"}>
                {subject.status}
              </StatusBadge>
            </dd>
          </div>
          <div>
            <dt className="text-xs text-gray">Classes</dt>
            <dd className="mt-1 font-semibold text-dark">
              {subject.classes} {subject.classes === 1 ? "class" : "classes"}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-gray">Teachers</dt>
            <dd className="mt-1 font-semibold text-dark">
              {subject.teachers
                ? `${subject.teachers} ${subject.teachers === 1 ? "teacher" : "teachers"}`
                : "Unassigned"}
            </dd>
          </div>
          {subject.hasPractical && (
            <div>
              <dt className="text-xs text-gray">Practical / lab component</dt>
              <dd className="mt-1 font-semibold text-dark">{subject.hasPractical}</dd>
            </div>
          )}
          {subject.totalMarks !== undefined && (
            <div>
              <dt className="text-xs text-gray">Default total marks</dt>
              <dd className="mt-1 font-semibold text-dark">{subject.totalMarks}</dd>
            </div>
          )}
          {subject.passingMarks !== undefined && (
            <div>
              <dt className="text-xs text-gray">Default passing marks</dt>
              <dd className="mt-1 font-semibold text-dark">{subject.passingMarks}</dd>
            </div>
          )}
        </dl>
      )}
    </Dialog>
  );
}
