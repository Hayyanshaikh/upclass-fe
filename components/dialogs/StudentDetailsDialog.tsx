"use client";

import Dialog from "@/components/ui/Dialog";
import type { StudentDetailsDialogProps } from "@/types/student";

const feeColors = {
  Paid: "bg-[#dceee8] text-primary",
  Pending: "bg-[#fcebc6] text-[#805100]",
  Overdue: "bg-[#f8d9d7] text-danger",
};

export default function StudentDetailsDialog({ student, onClose, onEdit }: StudentDetailsDialogProps) {
  return (
    <Dialog
      open={student !== null}
      onClose={onClose}
      onConfirm={() => { if (student) onEdit?.(student); }}
      okText="Edit student"
      cancelText="Close"
      confirmDisabled={!onEdit}
      title={student && (
        <div className="flex items-center gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#dceee8] text-lg font-bold text-primary" aria-hidden="true">
            {student.name.charAt(0)}
          </span>
          <div>
            <h2 className="text-lg leading-tight font-bold text-dark">{student.name}</h2>
            <p className="mt-0.5 text-sm font-normal text-gray">Class {student.className} · Roll {student.roll}</p>
          </div>
        </div>
      )}
    >
      {student && (
        <>
          <dl className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
            <div>
              <dt className="text-xs text-gray">Date of birth</dt>
              <dd className="mt-1 text-sm font-semibold text-dark">{student.dateOfBirth || "[DD/MM/YYYY]"}</dd>
            </div>
            <div>
              <dt className="text-xs text-gray">Gender</dt>
              <dd className="mt-1 text-sm font-semibold text-dark">{student.gender || "Not provided"}</dd>
            </div>
            <div>
              <dt className="text-xs text-gray">Guardian</dt>
              <dd className="mt-1 text-sm font-semibold text-dark">{student.guardian}</dd>
            </div>
            <div>
              <dt className="text-xs text-gray">Phone</dt>
              <dd className="mt-1 text-sm font-semibold text-dark">{student.phone}</dd>
            </div>
            <div>
              <dt className="text-xs text-gray">Admission date</dt>
              <dd className="mt-1 text-sm font-semibold text-dark">{student.admissionDate || "[DD/MM/YYYY]"}</dd>
            </div>
            <div>
              <dt className="text-xs text-gray">Fee status</dt>
              <dd><span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${feeColors[student.fees]}`}>{student.fees}</span></dd>
            </div>
          </dl>
        </>
      )}
    </Dialog>
  );
}
