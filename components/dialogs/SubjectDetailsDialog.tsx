"use client";

import Dialog from "@/components/ui/Dialog";
import StatusBadge from "@/components/ui/StatusBadge";
import { useRolePermission } from "@/hooks/useRolePermission";
import type { Subject } from "@/types/subject";

type SubjectDetailsDialogProps = {
  subject: Subject | null;
  onClose: () => void;
  onEdit: (subject: Subject) => void;
};

export default function SubjectDetailsDialog({
  subject,
  onClose,
  onEdit,
}: SubjectDetailsDialogProps) {
  const { canEdit } = useRolePermission("subjects");
  return (
    <Dialog
      open={subject !== null}
      title={
        subject && (
          <div className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className="flex size-11 shrink-0 items-center justify-center rounded-full bg-success/10 text-lg font-bold text-primary"
            >
              {subject.name.charAt(0)}
            </span>
            <div>
              <h2 className="text-lg leading-tight font-bold text-dark">
                {subject.name}
              </h2>
              <p className="mt-0.5 text-sm font-normal text-gray">
                Code {subject.code}
              </p>
            </div>
          </div>
        )
      }
      cancelText="Close"
      onClose={onClose}
      onConfirm={() => {
        if (subject) onEdit(subject);
      }}
      okText="Edit subject"
      showPrimaryBtn={canEdit}
      confirmDisabled={!subject}
    >
      {subject && (
        <dl className="grid grid-cols-1 gap-x-6 gap-y-4 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-xs text-gray">Type</dt>
            <dd className="mt-1">
              <StatusBadge
                variant={
                  subject.type === "THEORY" || subject.type === "MIXED"
                    ? "success"
                    : "warning"
                }
              >
                {subject.type}
              </StatusBadge>
            </dd>
          </div>
          <div>
            <dt className="text-xs text-gray">Status</dt>
            <dd className="mt-1">
              <StatusBadge
                variant={subject.status === "ACTIVE" ? "success" : "neutral"}
              >
                {subject.status}
              </StatusBadge>
            </dd>
          </div>
          <div>
            <dt className="text-xs text-gray">Classes</dt>
            <dd className="mt-1 font-semibold text-dark">
              {subject.classes ?? 0}{" "}
              {subject.classes === 1 ? "class" : "classes"}
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
          <div>
            <dt className="text-xs text-gray">Has practical / lab</dt>
            <dd className="mt-1 font-semibold text-dark">
              {subject.hasPractical ? "Yes" : "No"}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-gray">Default total marks</dt>
            <dd className="mt-1 font-semibold text-dark">
              {subject.defaultTotalMarks}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-gray">Default passing marks</dt>
            <dd className="mt-1 font-semibold text-dark">
              {subject.defaultPassingMarks}
            </dd>
          </div>
        </dl>
      )}
    </Dialog>
  );
}
