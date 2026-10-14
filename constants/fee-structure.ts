import type { FeeStructure } from "@/types/fee-structure";
import type { FilterField } from "@/types/table-toolbar";

export const feeStructures: FeeStructure[] = [
  { id: "FS-05", grade: 5, academicYear: "2026-27", tuition: 8000, examFee: 1000, labFee: 500, sportsFee: 500, status: "Active" },
  { id: "FS-06", grade: 6, academicYear: "2026-27", tuition: 8500, examFee: 1000, labFee: 500, sportsFee: 500, status: "Active" },
  { id: "FS-07", grade: 7, academicYear: "2026-27", tuition: 9000, examFee: 1000, labFee: 500, sportsFee: 500, status: "Active" },
  { id: "FS-08", grade: 8, academicYear: "2026-27", tuition: 10500, examFee: 1000, labFee: 500, sportsFee: 500, status: "Active" },
  { id: "FS-09", grade: 9, academicYear: "2026-27", tuition: 11500, examFee: 1000, labFee: 500, sportsFee: 500, status: "Active" },
  { id: "FS-10", grade: 10, academicYear: "2026-27", tuition: 12500, examFee: 1000, labFee: 500, sportsFee: 500, status: "Active" },
  { id: "FS-01", grade: 1, academicYear: "2026-27", tuition: 6500, examFee: 1000, labFee: 500, sportsFee: 500, status: "Active" },
  { id: "FS-02", grade: 2, academicYear: "2026-27", tuition: 7000, examFee: 1000, labFee: 500, sportsFee: 500, status: "Active" },
  { id: "FS-03", grade: 3, academicYear: "2026-27", tuition: 7500, examFee: 1000, labFee: 500, sportsFee: 500, status: "Active" },
  { id: "FS-04", grade: 4, academicYear: "2026-27", tuition: 7800, examFee: 1000, labFee: 500, sportsFee: 500, status: "Active" },
];

export const feeStructureFilters: FilterField[] = [
  { name: "academicYear", label: "Academic year", value: "2026-27", allowClear: false, options: [
    { label: "[2026–27]", value: "2026-27" },
    { label: "[2025–26]", value: "2025-26" },
  ] },
  { name: "status", label: "Status", placeholder: "Any", options: [
    { label: "Active", value: "Active" },
    { label: "Inactive", value: "Inactive" },
  ] },
];
