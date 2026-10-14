"use client";

import { LuPrinter, LuTrash2 } from "react-icons/lu";
import Dialog from "@/components/ui/Dialog";
import StatusBadge from "@/components/ui/StatusBadge";
import { feeStructures } from "@/constants/fee-structure";
import { feeStatusVariants } from "@/constants/fees";
import type { FeeRecord } from "@/types/fee";

type FeeDetailsDialogProps = {
  fee: FeeRecord | null;
  open: boolean;
  onClose: () => void;
  onCollect: () => void;
  afterClose?: () => void;
};

const rupees = (value: number) => `Rs. ${value.toLocaleString("en-PK")}`;
const monthNames = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function formatMonth(value: string) {
  const [year, month] = value.split("-");
  const label = monthNames[Number(month) - 1];
  return label ? `${label} [${year}]` : value;
}

export default function FeeDetailsDialog({
  fee,
  open,
  onClose,
  onCollect,
  afterClose,
}: FeeDetailsDialogProps) {
  const grade = Number(fee?.className.split("-")[0]);
  const structure = feeStructures.find((item) => item.grade === grade);
  const heads = structure?.feeHeads?.length
    ? structure.feeHeads
    : structure
      ? [
          { name: "Tuition fee", amount: structure.tuition },
          { name: "Exam fee", amount: structure.examFee },
          { name: "Lab fee", amount: structure.labFee },
          { name: "Sports fee", amount: structure.sportsFee },
        ]
      : [];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      onConfirm={onCollect}
      afterClose={afterClose}
      width={620}
      okText="Collect fee"
      cancelText="Close"
      confirmDisabled={!fee || fee.status === "Paid"}
      title={
        fee && (
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-bold text-dark">Fee details</h2>
              <StatusBadge variant={feeStatusVariants[fee.status]}>
                {fee.status}
              </StatusBadge>
            </div>
            <p className="mt-1 text-sm font-normal text-gray">
              {fee.student} · Class {fee.className} · {formatMonth(fee.month)}
            </p>
          </div>
        )
      }
    >
      {fee && (
        <div className="text-sm text-gray">
          <dl>
            {heads.map((head, index) => (
              <div
                key={`${head.name}-${index}`}
                className="flex items-center justify-between gap-4 border-t border-border py-2"
              >
                <dt>{head.name}</dt>
                <dd>{rupees(head.amount)}</dd>
              </div>
            ))}
            <div className="flex items-center justify-between gap-4 border-t border-border py-2 font-bold text-dark">
              <dt>Total</dt>
              <dd>{rupees(fee.total)}</dd>
            </div>
            <div className="flex items-center justify-between gap-4 border-t border-border py-2">
              <dt>Paid</dt>
              <dd>{rupees(fee.paid)}</dd>
            </div>
            <div className="flex items-center justify-between gap-4 border-t border-border py-2 font-bold text-dark">
              <dt>Balance</dt>
              <dd>{rupees(fee.total - fee.paid)}</dd>
            </div>
          </dl>

          <div className="mt-4">
            <p className="mb-2 text-gray">Payments</p>
            {fee.paid > 0 ? (
              <div className="flex items-center justify-between gap-3 rounded-lg bg-foreground px-3 py-3">
                <div>
                  <p><span className="font-bold text-dark">{rupees(fee.paid)}</span> · Cash · [DD/MM/YYYY]</p>
                  <p className="text-gray">Receipt FR-[0001]</p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <span className="p-2 text-gray" role="img" aria-label="Print receipt">
                    <LuPrinter size={18} aria-hidden="true" />
                  </span>
                  <span className="p-2 text-danger" role="img" aria-label="Delete payment">
                    <LuTrash2 size={18} aria-hidden="true" />
                  </span>
                </div>
              </div>
            ) : (
              <p className="rounded-lg bg-foreground px-3 py-3">No payments yet.</p>
            )}
          </div>
        </div>
      )}
    </Dialog>
  );
}
