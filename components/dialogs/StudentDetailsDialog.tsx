"use client";

import { CreateStudentDtoGender } from "@/app/api/schemas";
import Dialog from "@/components/ui/Dialog";
import { DISPLAY_DATE } from "@/constants/date-formats";
import type { StudentDetailsDialogProps } from "@/types/student";
import { toOptions } from "@/utils/enum-options";
import dayjs from "dayjs";

const feeColors = {
  Paid: "bg-[#dceee8] text-primary",
  Pending: "bg-[#fcebc6] text-[#805100]",
  Overdue: "bg-[#f8d9d7] text-danger",
};

export default function StudentDetailsDialog({
  student,
  onClose,
  onEdit,
}: StudentDetailsDialogProps) {
  const genderOptions = toOptions(CreateStudentDtoGender);
  const genderLabel = genderOptions.find(
    (option) => option.value === student?.gender,
  )?.label;
  return (
    <Dialog
      open={student !== null}
      onClose={onClose}
      onConfirm={() => {
        if (student) onEdit?.(student);
      }}
      okText="Edit student"
      cancelText="Close"
      confirmDisabled={!onEdit}
      title={
        student && (
          <div className="flex items-center gap-3">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#dceee8] text-lg font-bold text-primary">
              {student.name?.charAt(0) || "-"}
            </span>
            <div>
              <h2 className="text-lg leading-tight font-bold text-dark">
                {student.name || "-"}
              </h2>
              <p className="mt-0.5 text-sm font-normal text-gray">
                Class {student.className || "-"} · Roll {student.roll || "-"}
              </p>
            </div>
          </div>
        )
      }
    >
      {student && (
        <dl className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs text-gray">Date of birth</dt>
            <dd className="mt-1 text-sm font-semibold text-dark">
              {student.dateOfBirth
                ? dayjs(student.dateOfBirth).format(DISPLAY_DATE)
                : "-"}
            </dd>
          </div>

          <div>
            <dt className="text-xs text-gray">Gender</dt>
            <dd className="mt-1 text-sm font-semibold text-dark">
              {genderLabel || "-"}
            </dd>
          </div>

          <div>
            <dt className="text-xs text-gray">Guardian</dt>
            <dd className="mt-1 text-sm font-semibold text-dark">
              {student.guardian || "-"}
            </dd>
          </div>

          <div>
            <dt className="text-xs text-gray">Phone</dt>
            <dd className="mt-1 text-sm font-semibold text-dark">
              {student.phone || "-"}
            </dd>
          </div>

          <div>
            <dt className="text-xs text-gray">Admission date</dt>
            <dd className="mt-1 text-sm font-semibold text-dark">
              {student.admissionDate
                ? dayjs(student.admissionDate).format(DISPLAY_DATE)
                : "-"}
            </dd>
          </div>

          <div>
            <dt className="text-xs text-gray">Fee status</dt>
            <dd>
              {student.fees ? (
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${feeColors[student.fees]}`}
                >
                  {student.fees}
                </span>
              ) : (
                <span className="text-sm font-semibold text-dark">-</span>
              )}
            </dd>
          </div>
        </dl>
      )}
    </Dialog>
  );
}
