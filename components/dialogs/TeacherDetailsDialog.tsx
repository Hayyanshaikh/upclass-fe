"use client";

import Dialog from "@/components/ui/Dialog";
import StatusBadge from "@/components/ui/StatusBadge";
import type { TeacherDetailsDialogProps } from "@/types/teacher";

function displayEnum(value: string | null) {
  if (!value) return "—";
  const label = value.replaceAll("_", " ").toLowerCase();
  return label.charAt(0).toUpperCase() + label.slice(1);
}

export default function TeacherDetailsDialog({
  teacher,
  onClose,
  onEdit,
}: TeacherDetailsDialogProps) {
  return (
    <Dialog
      open={teacher !== null}
      title={teacher?.name ?? "Teacher details"}
      onClose={onClose}
      onConfirm={() => {
        if (teacher) onEdit(teacher);
      }}
      okText="Edit teacher"
      cancelText="Close"
    >
      {teacher && (
        <dl className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-gray">Employee ID</dt>
            <dd className="mt-1 font-semibold text-dark">{teacher.employeeId || "—"}</dd>
          </div>
          <div>
            <dt className="text-gray">Subject</dt>
            <dd className="mt-1 font-semibold text-dark">—</dd>
          </div>
          <div>
            <dt className="text-gray">Classes</dt>
            <dd className="mt-1 font-semibold text-dark">—</dd>
          </div>
          <div>
            <dt className="text-gray">Phone</dt>
            <dd className="mt-1 font-semibold text-dark">{teacher.phone || "—"}</dd>
          </div>
          <div>
            <dt className="text-gray">Employment Type</dt>
            <dd className="mt-1 font-semibold text-dark">
              {displayEnum(teacher.employmentType)}
            </dd>
          </div>
          <div>
            <dt className="text-gray">Status</dt>
            <dd className="mt-1">
              <StatusBadge
                variant={teacher.isActive === "Active" ? "success" : "neutral"}
              >
                {teacher.isActive}
              </StatusBadge>
            </dd>
          </div>
        </dl>
      )}
    </Dialog>
  );
}
