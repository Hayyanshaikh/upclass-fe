"use client";

import Dialog from "@/components/ui/Dialog";
import StatusBadge from "@/components/ui/StatusBadge";
import { teacherStatusVariants } from "@/constants/teachers";
import type { TeacherDetailsDialogProps } from "@/types/teacher";

export default function TeacherDetailsDialog({
  teacher,
  onClose,
  onEdit,
}: TeacherDetailsDialogProps) {
  return (
    <Dialog
      open={teacher !== null}
      title={
        teacher && (
          <div className="mb-5 flex items-center gap-3">
            <span
              aria-hidden="true"
              className="flex size-11 shrink-0 items-center justify-center rounded-full bg-success/10 text-lg font-bold text-primary"
            >
              {teacher.name.charAt(0)}
            </span>
            <div>
              <p className="text-base font-bold text-dark">{teacher.name}</p>
              <p className="text-sm text-gray">ID {teacher.id}</p>
            </div>
          </div>
        )
      }
      onClose={onClose}
      onConfirm={() => {
        if (teacher) onEdit(teacher);
      }}
      okText="Edit teacher"
      cancelText="Close"
    >
      {teacher && (
        <>
          <dl className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-gray">Subject</dt>
              <dd className="mt-1 font-semibold text-dark">
                {teacher.subject}
              </dd>
            </div>
            <div>
              <dt className="text-gray">Classes</dt>
              <dd className="mt-1 font-semibold text-dark">
                {teacher.classes.join(", ")}
              </dd>
            </div>
            <div>
              <dt className="text-gray">Phone</dt>
              <dd className="mt-1 font-semibold text-dark">{teacher.phone}</dd>
            </div>
            <div>
              <dt className="text-gray">Employment</dt>
              <dd className="mt-1 font-semibold text-dark">
                {teacher.employment}
              </dd>
            </div>
            <div>
              <dt className="mb-1 text-gray">Status</dt>
              <dd>
                <StatusBadge variant={teacherStatusVariants[teacher.status]}>
                  {teacher.status}
                </StatusBadge>
              </dd>
            </div>
          </dl>
        </>
      )}
    </Dialog>
  );
}
