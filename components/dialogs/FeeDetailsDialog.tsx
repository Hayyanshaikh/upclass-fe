"use client";

import Button from "@/components/ui/Button";
import Dialog from "@/components/ui/Dialog";
import StatusBadge from "@/components/ui/StatusBadge";
import { feeStatusVariants } from "@/constants/fees";
import type { FeeRecord } from "@/types/fee";

type FeeDetailsDialogProps = {
  fee: FeeRecord | null;
  open: boolean;
  onClose: () => void;
  afterClose?: () => void;
};

const rupees = (value: number) => `Rs. ${value.toLocaleString("en-PK")}`;

export default function FeeDetailsDialog({ fee, open, onClose, afterClose }: FeeDetailsDialogProps) {
  return <Dialog
    open={open}
    onClose={onClose}
    onConfirm={onClose}
    afterClose={afterClose}
    footer={<div className="flex justify-end"><Button variant="secondary" onClick={onClose}>Close</Button></div>}
    title={fee && <div className="flex items-center gap-3">
      <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-success/10 text-lg font-bold text-primary" aria-hidden="true">{fee.student.charAt(0)}</span>
      <div>
        <h2 className="text-lg leading-tight font-bold text-dark">{fee.student}</h2>
        <p className="mt-0.5 text-sm font-normal text-gray">Class {fee.className} · Roll {fee.roll}</p>
      </div>
    </div>}
  >
    {fee && <dl className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
      <div><dt className="text-xs text-gray">Month</dt><dd className="mt-1 text-sm font-semibold text-dark">{fee.month === "2026-10" ? "October 2026" : fee.month}</dd></div>
      <div><dt className="text-xs text-gray">Total fee</dt><dd className="mt-1 text-sm font-semibold text-dark">{rupees(fee.total)}</dd></div>
      <div><dt className="text-xs text-gray">Paid</dt><dd className="mt-1 text-sm font-semibold text-dark">{rupees(fee.paid)}</dd></div>
      <div><dt className="text-xs text-gray">Balance</dt><dd className="mt-1 text-sm font-semibold text-dark">{rupees(fee.total - fee.paid)}</dd></div>
      <div><dt className="text-xs text-gray">Status</dt><dd className="mt-1"><StatusBadge variant={feeStatusVariants[fee.status]}>{fee.status}</StatusBadge></dd></div>
    </dl>}
  </Dialog>;
}
