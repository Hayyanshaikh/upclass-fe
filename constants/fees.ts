import { classGradeOptions } from "@/constants/classes";
import type { FeeRecord, FeeStatus } from "@/types/fee";
import type { FilterField } from "@/types/table-toolbar";

export const feeRecords: FeeRecord[] = [
  { id: "F-1012", student: "Ayesha Khan", roll: "1012", className: "8-A", month: "2026-10", total: 12500, paid: 12500, status: "Paid" },
  { id: "F-1013", student: "Bilal Ahmed", roll: "1013", className: "8-A", month: "2026-10", total: 12500, paid: 6000, status: "Partial" },
  { id: "F-1021", student: "Hira Siddiqui", roll: "1021", className: "7-B", month: "2026-10", total: 11000, paid: 11000, status: "Paid" },
  { id: "F-1034", student: "Usman Raza", roll: "1034", className: "6-A", month: "2026-10", total: 10500, paid: 0, status: "Overdue" },
  { id: "F-1040", student: "Zainab Ali", roll: "1040", className: "9-C", month: "2026-10", total: 13500, paid: 13500, status: "Paid" },
  { id: "F-1047", student: "Hamza Sheikh", roll: "1047", className: "7-A", month: "2026-10", total: 11000, paid: 0, status: "Pending" },
  { id: "F-1052", student: "Maryam Tariq", roll: "1052", className: "8-B", month: "2026-10", total: 12500, paid: 8000, status: "Partial" },
  { id: "F-1058", student: "Daniyal Shah", roll: "1058", className: "8-A", month: "2026-10", total: 12500, paid: 12500, status: "Paid" },
  { id: "F-1066", student: "Iqra Nadeem", roll: "1066", className: "7-A", month: "2026-10", total: 11000, paid: 11000, status: "Paid" },
  { id: "F-1071", student: "Saad Hussain", roll: "1071", className: "6-B", month: "2026-10", total: 10500, paid: 0, status: "Pending" },
  { id: "F-1075", student: "Fatima Noor", roll: "1075", className: "9-C", month: "2026-10", total: 13500, paid: 13500, status: "Paid" },
  { id: "F-1082", student: "Ali Hassan", roll: "1082", className: "8-B", month: "2026-10", total: 12500, paid: 4000, status: "Partial" },
];

export const feeStatusVariants: Record<FeeStatus, "success" | "warning" | "neutral" | "danger"> = {
  Paid: "success",
  Partial: "warning",
  Pending: "neutral",
  Overdue: "danger",
};

export const feeFilterFields: FilterField[] = [
  { name: "class", label: "Class", placeholder: "All classes", options: classGradeOptions },
  { name: "month", label: "Month", placeholder: "October [2026]", value: "2026-10", allowClear: false,
    options: [
      { label: "October [2026]", value: "2026-10" },
      { label: "September [2026]", value: "2026-09" },
      { label: "August [2026]", value: "2026-08" },
    ] },
  { name: "status", label: "Status", placeholder: "Any", options: [
    { label: "Paid", value: "Paid" },
    { label: "Partial", value: "Partial" },
    { label: "Pending", value: "Pending" },
    { label: "Overdue", value: "Overdue" },
  ] },
];
