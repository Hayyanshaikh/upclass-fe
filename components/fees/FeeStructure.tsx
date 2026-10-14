"use client";

import { useMemo, useState } from "react";
import type { TableColumnsType } from "antd";
import { LuEye, LuPencil, LuTrash2 } from "react-icons/lu";
import FeeStructureDetailsDialog from "@/components/dialogs/FeeStructureDetailsDialog";
import ActionButtons from "@/components/shared/ActionButtons";
import DeleteDialog from "@/components/shared/DeleteDialog";
import PageHeader from "@/components/shared/PageHeader";
import StatusBadge from "@/components/ui/StatusBadge";
import Table from "@/components/ui/Table";
import { feeStructureFilters, feeStructures } from "@/constants/fee-structure";
import type { FeeStructure as FeeStructureRecord } from "@/types/fee-structure";
import type { FilterField } from "@/types/table-toolbar";

const number = (value: number) => value.toLocaleString("en-PK");

function exportCsv(records: FeeStructureRecord[]) {
  const rows = [
    ["Class", "Academic year", "Tuition", "Exam fee", "Lab fee", "Sports fee", "Monthly total", "Status"],
    ...records.map((item) => [
      `Class ${item.grade}`, item.academicYear, item.tuition, item.examFee,
      item.labFee, item.sportsFee,
      item.tuition + item.examFee + item.labFee + item.sportsFee, item.status,
    ]),
  ];
  const csv = rows.map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(",")).join("\r\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "fee-structure-2026-27.csv";
  anchor.click();
  URL.revokeObjectURL(url);
}

export default function FeeStructure() {
  const [records, setRecords] = useState(feeStructures);
  const [search, setSearch] = useState("");
  const [academicYear, setAcademicYear] = useState("2026-27");
  const [status, setStatus] = useState<string>();
  const [selected, setSelected] = useState<FeeStructureRecord | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const filtered = useMemo(() => records.filter((item) => {
    const query = search.trim().toLowerCase();
    return (!query || `class ${item.grade}`.includes(query) || String(item.grade).includes(query))
      && (!academicYear || item.academicYear === academicYear)
      && (!status || item.status === status);
  }), [records, search, academicYear, status]);

  const filters: FilterField[] = feeStructureFilters.map((field) => {
    if (field.type === "date") return field;
    return field.name === "academicYear"
      ? { ...field, value: academicYear, onChange: (value) => setAcademicYear(value ?? "2026-27") }
      : { ...field, value: status, onChange: setStatus };
  });

  const columns: TableColumnsType<FeeStructureRecord> = [
    { title: "Class", key: "grade", width: 130, render: (_, item) => <span className="font-bold text-dark">Class {item.grade}</span> },
    { title: "Tuition", dataIndex: "tuition", key: "tuition", width: 110, render: number },
    { title: "Exam fee", dataIndex: "examFee", key: "examFee", width: 115, render: number },
    { title: "Lab fee", dataIndex: "labFee", key: "labFee", width: 110, render: number },
    { title: "Sports fee", dataIndex: "sportsFee", key: "sportsFee", width: 120, render: number },
    { title: "Monthly total", key: "monthlyTotal", width: 155,
      render: (_, item) => <span className="font-bold text-dark">Rs. {number(item.tuition + item.examFee + item.labFee + item.sportsFee)}</span> },
    { title: "Status", key: "status", width: 125,
      render: (_, item) => <StatusBadge variant={item.status === "Active" ? "success" : "neutral"}>{item.status}</StatusBadge> },
    { title: "Actions", key: "actions", width: 135,
      render: (_, item) => <ActionButtons actions={[
        { label: `View Class ${item.grade} fee structure`, icon: LuEye, onClick: () => { setSelected(item); setDetailsOpen(true); } },
        { label: `Edit Class ${item.grade} fee structure`, icon: LuPencil },
        { label: `Delete Class ${item.grade} fee structure`, icon: LuTrash2, danger: true,
          onClick: () => { setSelected(item); setDeleteOpen(true); } },
      ]} /> },
  ];

  return <div className="flex h-full min-h-0 flex-col overflow-hidden">
    <div className="shrink-0"><PageHeader title="Fee structure" /></div>
    <Table
      columns={columns}
      data={filtered}
      pageSize={6}
      search={{ label: "Search", placeholder: "Class", onChange: setSearch }}
      filterFields={filters}
      actions={[
        { label: "Export CSV", variant: "secondary", onClick: () => exportCsv(filtered) },
        { label: "Add fee structure" },
      ]}
    />
    <FeeStructureDetailsDialog
      structure={selected}
      open={detailsOpen}
      onClose={() => setDetailsOpen(false)}
      afterClose={() => setSelected(null)}
    />
    <DeleteDialog
      open={deleteOpen}
      title="Delete fee structure?"
      message={selected ? `Class ${selected.grade} fee structure will be removed from this list.` : "Delete this fee structure?"}
      description="This demo change lasts until the page is refreshed."
      onClose={() => setDeleteOpen(false)}
      onConfirm={() => {
        if (selected) setRecords((current) => current.filter((item) => item.id !== selected.id));
        setDeleteOpen(false);
      }}
      afterClose={() => setSelected(null)}
    />
  </div>;
}
