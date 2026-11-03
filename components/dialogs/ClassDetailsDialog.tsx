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
              Section {classRecord?.section}
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
              <dt className="text-gray">Class teacher</dt>
              <dd className="mt-1 font-semibold text-dark">
                {classRecord.teacherName}
              </dd>
            </div>
            <div>
              <dt className="text-gray">Assistant teacher</dt>
              <dd className="mt-1 font-semibold text-dark">
                {classRecord.assistantTeacherName ?? "None"}
              </dd>
            </div>
            <div>
              <dt className="text-gray">Room</dt>
              <dd className="mt-1 font-semibold text-dark">
                {classRecord.room}
              </dd>
            </div>
            <div>
              <dt className="text-gray">Capacity</dt>
              <dd className="mt-1 font-semibold text-dark">
                {classRecord.capacity}
              </dd>
            </div>
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
          <h3 className="mt-5 mb-2 text-sm font-bold text-dark">
            Subjects and teachers
          </h3>
          {classRecord.subjects.length ? (
            <ul className="max-h-60 divide-y divide-border overflow-y-auto">
              {classRecord.subjects.map((item) => (
                <li
                  key={item.id}
                  className="flex flex-wrap justify-between gap-2 py-3 text-sm"
                >
                  <div>
                    <p className="font-semibold text-dark">
                      {item.subjectName}
                    </p>
                    <p className="text-gray">{item.teacherName}</p>
                  </div>
                  <span className="text-gray">
                    {item.periodsPerWeek} periods / week
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray">No subjects assigned yet.</p>
          )}
        </>
      )}
      {!isFetching && !isError && !classRecord && (
        <p className="text-sm text-gray">Class details are unavailable.</p>
      )}
    </Dialog>
  );
}
