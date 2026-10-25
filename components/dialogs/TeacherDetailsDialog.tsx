"use client";

import { useTeachersControllerFindOne } from "@/app/api/endpoints";
import Button from "@/components/ui/Button";
import Dialog from "@/components/ui/Dialog";
import StatusBadge from "@/components/ui/StatusBadge";
import type { TeacherDetailsDialogProps } from "@/types/teacher";

function displayValue(value: string | null) {
  return value || "—";
}

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
  const {
    data: response,
    isFetching,
    error,
    refetch,
  } = useTeachersControllerFindOne(teacher?.id ?? "", {
    query: { enabled: teacher !== null },
  });
  const details = response?.data;

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
      {isFetching && !details ? (
        <p role="status" className="text-sm text-gray">
          Loading teacher details...
        </p>
      ) : error ? (
        <div role="alert" className="flex items-center gap-3 text-sm text-danger">
          <span>Unable to load teacher details.</span>
          <Button variant="link" onClick={() => void refetch()}>
            Retry
          </Button>
        </div>
      ) : details ? (
        <dl className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-gray">Employee ID</dt>
            <dd className="mt-1 font-semibold text-dark">
              {displayValue(details.employeeId)}
            </dd>
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
            <dd className="mt-1 font-semibold text-dark">
              {displayValue(details.phone)}
            </dd>
          </div>
          <div>
            <dt className="text-gray">Employment Type</dt>
            <dd className="mt-1 font-semibold text-dark">
              {displayEnum(details.employmentType)}
            </dd>
          </div>
          <div>
            <dt className="text-gray">Status</dt>
            <dd className="mt-1">
              <StatusBadge
                variant={details.isActive === true ? "success" : "neutral"}
              >
                {details.isActive === null
                  ? "Unknown"
                  : details.isActive
                    ? "Active"
                    : "Inactive"}
              </StatusBadge>
            </dd>
          </div>
        </dl>
      ) : null}
    </Dialog>
  );
}
