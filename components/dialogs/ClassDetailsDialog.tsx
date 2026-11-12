"use client";

import Button from "@/components/ui/Button";
import Dialog from "@/components/ui/Dialog";
import StatusBadge from "@/components/ui/StatusBadge";
import { useClassesControllerFindOne } from "@/app/api/endpoints";
import { classManipulator } from "@/lib/api/classes";
import type { ClassDetailsDialogProps } from "@/types/class-management";

export default function ClassDetailsDialog({
  classId,
  teacherNames,
  onClose,
  onEdit,
}: ClassDetailsDialogProps) {
  const {
    data: response,
    isFetching,
    isError,
    refetch,
  } = useClassesControllerFindOne(classId ?? "", {
    query: { enabled: classId !== null },
  });

  const classRecord = response?.data
    ? classManipulator([response.data], teacherNames)[0]
    : null;

  return (
    <Dialog
      open={classId !== null}
      title={
        <div className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className="flex size-11 shrink-0 items-center justify-center rounded-full bg-success/10 text-lg font-bold text-primary"
          >
            {classRecord?.name.charAt(0)}
          </span>
          <div>
            <h2 className="text-lg leading-tight font-bold text-dark">
              {classRecord?.name}
            </h2>
            <p className="mt-0.5 text-sm font-normal text-gray">
              {classRecord?.sections.length
                ? `Sections ${classRecord.sections
                    .map((section) => section.section)
                    .join(", ")}`
                : "No sections"}
            </p>
          </div>
        </div>
      }
      onClose={onClose}
      onConfirm={() => {
        if (classRecord) onEdit(classRecord);
      }}
      okText="Edit class"
      cancelText="Close"
      confirmDisabled={!classRecord}
    >
      {isFetching && (
        <p role="status" className="text-sm text-gray">
          Loading class details...
        </p>
      )}
      {isError && (
        <div
          role="alert"
          className="flex items-center gap-3 rounded-md border border-danger bg-danger/10 px-4 py-3 text-sm text-danger"
        >
          <span>Unable to load class details.</span>
          <Button variant="link" onClick={() => void refetch()}>
            Retry
          </Button>
        </div>
      )}
      {!isFetching && !isError && classRecord && (
        <>
          <dl className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-gray">Academic year</dt>
              <dd className="mt-1 font-semibold text-dark">
                {classRecord.academicYear}
              </dd>
            </div>
            <div>
              <dt className="text-gray">Status</dt>
              <dd className="mt-1">
                <StatusBadge
                  variant={
                    classRecord.status === "Active" ? "success" : "neutral"
                  }
                >
                  {classRecord.status}
                </StatusBadge>
              </dd>
            </div>
          </dl>
          <div className="mt-4 space-y-3">
            {classRecord.sections.map((section) => (
              <div
                key={section.id}
                className="rounded-sm border border-border p-3 text-sm"
              >
                <p className="font-semibold text-dark">
                  Section {section.section}
                </p>
                <dl className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
                  <div>
                    <dt className="text-gray">Class teacher</dt>
                    <dd className="mt-1 font-semibold text-dark">
                      {section.teacherName}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-gray">Classroom</dt>
                    <dd className="mt-1 font-semibold text-dark">
                      {section.room ?? "—"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-gray">Student capacity</dt>
                    <dd className="mt-1 font-semibold text-dark">
                      {section.capacity ?? "—"}
                    </dd>
                  </div>
                </dl>
              </div>
            ))}
          </div>
        </>
      )}
      {!isFetching && !isError && !classRecord && (
        <p className="text-sm text-gray">Class details are unavailable.</p>
      )}
    </Dialog>
  );
}
