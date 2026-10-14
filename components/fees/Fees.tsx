"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { TableColumnsType } from "antd";
import { LuCreditCard, LuEye, LuPrinter } from "react-icons/lu";
import FeeDetailsDialog from "@/components/dialogs/FeeDetailsDialog";
import ActionButtons from "@/components/shared/ActionButtons";
import PageHeader from "@/components/shared/PageHeader";
import StatusBadge from "@/components/ui/StatusBadge";
import Table from "@/components/ui/Table";
import {
  feeFilterFields,
  feeRecords,
  feeStatusVariants,
} from "@/constants/fees";
import type { FeeRecord, FeeStatus } from "@/types/fee";
import type { FilterField } from "@/types/table-toolbar";

const formatRupees = (amount: number) =>
  `Rs. ${amount.toLocaleString("en-PK")}`;
const monthLabel = (month: string) =>
  month === "2026-10" ? "Oct [2026]" : month;

function downloadCsv(records: FeeRecord[]) {
  const rows = [
    ["Student", "Roll", "Class", "Month", "Total", "Paid", "Balance", "Status"],
    ...records.map((record) => [
      record.student,
      record.roll,
      record.className,
      record.month,
      record.total,
      record.paid,
      record.total - record.paid,
      record.status,
    ]),
  ];
  const csv = rows
    .map((row) =>
      row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(","),
    )
    .join("\r\n");
  const url = URL.createObjectURL(
    new Blob([csv], { type: "text/csv;charset=utf-8" }),
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = "fees-october-2026.csv";
  link.click();
  URL.revokeObjectURL(url);
}

export default function Fees() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState<string>();
  const [monthFilter, setMonthFilter] = useState("2026-10");
  const [statusFilter, setStatusFilter] = useState<FeeStatus>();
  const [selectedFee, setSelectedFee] = useState<FeeRecord | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const filteredFees = useMemo(
    () =>
      feeRecords.filter((fee) => {
        const term = search.trim().toLowerCase();
        return (
          (!term ||
            fee.student.toLowerCase().includes(term) ||
            fee.roll.includes(term)) &&
          (!classFilter || fee.className.split("-")[0] === classFilter) &&
          (!monthFilter || fee.month === monthFilter) &&
          (!statusFilter || fee.status === statusFilter)
        );
      }),
    [search, classFilter, monthFilter, statusFilter],
  );

  const filters: FilterField[] = feeFilterFields.map((field) => {
    if (field.type === "date") return field;
    if (field.name === "class")
      return { ...field, value: classFilter, onChange: setClassFilter };
    if (field.name === "month")
      return {
        ...field,
        value: monthFilter,
        onChange: (value) => setMonthFilter(value ?? "2026-10"),
      };
    return {
      ...field,
      value: statusFilter,
      onChange: (value) => setStatusFilter(value as FeeStatus | undefined),
    };
  });

  const columns: TableColumnsType<FeeRecord> = [
    {
      title: "Student",
      key: "student",
      width: 220,
      render: (_, fee) => (
        <div className="flex items-center gap-3">
          <span
            className="flex size-10 shrink-0 items-center justify-center rounded-full bg-success/10 font-bold text-primary"
            aria-hidden="true"
          >
            {fee.student.charAt(0)}
          </span>
          <div className="min-w-0">
            <p className="font-bold text-dark">{fee.student}</p>
            <p className="text-sm text-gray">Roll {fee.roll}</p>
          </div>
        </div>
      ),
    },
    { title: "Class", dataIndex: "className", key: "className", width: 80 },
    {
      title: "Month",
      key: "month",
      width: 125,
      render: (_, fee) => monthLabel(fee.month),
    },
    {
      title: "Total",
      key: "total",
      width: 125,
      render: (_, fee) => formatRupees(fee.total),
    },
    {
      title: "Paid",
      key: "paid",
      width: 125,
      render: (_, fee) => formatRupees(fee.paid),
    },
    {
      title: "Balance",
      key: "balance",
      width: 125,
      render: (_, fee) => (
        <span className="font-bold text-dark">
          {formatRupees(fee.total - fee.paid)}
        </span>
      ),
    },
    {
      title: "Status",
      key: "status",
      width: 125,
      render: (_, fee) => (
        <StatusBadge variant={feeStatusVariants[fee.status]}>
          {fee.status}
        </StatusBadge>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 135,
      render: (_, fee) => (
        <ActionButtons
          actions={[
            {
              label: `View ${fee.student}'s fee`,
              icon: LuEye,
              onClick: () => {
                setSelectedFee(fee);
                setDetailsOpen(true);
              },
            },
            {
              label: `Collect fee from ${fee.student}`,
              icon: LuCreditCard,
              disabled: fee.status === "Paid",
              onClick: () =>
                router.push(
                  `/fees/collect?student=${encodeURIComponent(fee.roll)}`,
                ),
            },
            {
              label: `Print fee page for ${fee.student}`,
              icon: LuPrinter,
              disabled: fee.paid === 0,
              onClick: () => router.push(`/fees/receipt?student=${encodeURIComponent(fee.roll)}&amount=${fee.paid}`),
            },
          ]}
        />
      ),
    },
  ];

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <div className="shrink-0">
        <PageHeader title="Fees" />
      </div>
      <Table
        columns={columns}
        data={filteredFees}
        pageSize={6}
        search={{
          label: "Search",
          placeholder: "Student name or roll no.",
          onChange: setSearch,
        }}
        filterFields={filters}
        actions={[
          {
            label: "Export CSV",
            variant: "secondary",
            onClick: () => downloadCsv(filteredFees),
          },
          { label: "Collect fee", onClick: () => router.push("/fees/collect") },
        ]}
      />
      <FeeDetailsDialog
        fee={selectedFee}
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        onCollect={() => {
          if (selectedFee) {
            setDetailsOpen(false);
            router.push(
              `/fees/collect?student=${encodeURIComponent(selectedFee.roll)}`,
            );
          }
        }}
        onPrintReceipt={() => {
          if (selectedFee) {
            setDetailsOpen(false);
            router.push(`/fees/receipt?student=${encodeURIComponent(selectedFee.roll)}&amount=${selectedFee.paid}`);
          }
        }}
        afterClose={() => setSelectedFee(null)}
      />
    </div>
  );
}
