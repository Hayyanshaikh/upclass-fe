"use client";

import { LuCreditCard } from "react-icons/lu";
import Button from "@/components/ui/Button";
import Dialog from "@/components/ui/Dialog";
import StatusBadge from "@/components/ui/StatusBadge";
import type { FeeStructure } from "@/types/fee-structure";

type FeeStructureDetailsDialogProps = {
  structure: FeeStructure | null;
  open: boolean;
  onClose: () => void;
  afterClose?: () => void;
};

const rupees = (value: number) => `Rs. ${value.toLocaleString("en-PK")}`;

export default function FeeStructureDetailsDialog({ structure, open, onClose, afterClose }: FeeStructureDetailsDialogProps) {
  const total = structure ? structure.tuition + structure.examFee + structure.labFee + structure.sportsFee : 0;

  return <Dialog
    open={open}
    onClose={onClose}
    onConfirm={onClose}
    afterClose={afterClose}
    footer={<div className="flex justify-end"><Button variant="secondary" onClick={onClose}>Close</Button></div>}
    title={structure && <div className="flex items-center gap-3">
      <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-success/10 text-primary" aria-hidden="true"><LuCreditCard size={22} /></span>
      <div>
        <h2 className="text-lg leading-tight font-bold text-dark">Class {structure.grade}</h2>
        <p className="mt-0.5 text-sm font-normal text-gray">Academic year {structure.academicYear}</p>
      </div>
    </div>}
  >
    {structure && <dl className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
      <div><dt className="text-xs text-gray">Tuition</dt><dd className="mt-1 text-sm font-semibold text-dark">{rupees(structure.tuition)}</dd></div>
      <div><dt className="text-xs text-gray">Exam fee</dt><dd className="mt-1 text-sm font-semibold text-dark">{rupees(structure.examFee)}</dd></div>
      <div><dt className="text-xs text-gray">Lab fee</dt><dd className="mt-1 text-sm font-semibold text-dark">{rupees(structure.labFee)}</dd></div>
      <div><dt className="text-xs text-gray">Sports fee</dt><dd className="mt-1 text-sm font-semibold text-dark">{rupees(structure.sportsFee)}</dd></div>
      <div><dt className="text-xs text-gray">Monthly total</dt><dd className="mt-1 text-sm font-bold text-dark">{rupees(total)}</dd></div>
      <div><dt className="text-xs text-gray">Status</dt><dd className="mt-1"><StatusBadge variant={structure.status === "Active" ? "success" : "neutral"}>{structure.status}</StatusBadge></dd></div>
    </dl>}
  </Dialog>;
}
