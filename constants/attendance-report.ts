import { classGradeOptions } from "@/constants/classes";
import { attendanceSectionOptions } from "@/constants/attendance";
import type { AttendanceReportRow } from "@/types/attendance-report";
import type { FilterField } from "@/types/table-toolbar";
import type { StatCardProps } from "@/types/stat-card";

export const attendanceReportVariants = { Good: "success", Watch: "warning", Low: "danger" } as const;

export const attendanceReportFilterFields: FilterField[] = [
  { name: "grade", label: "Class", options: classGradeOptions, value: "8", allowClear: false },
  { name: "section", label: "Section", options: attendanceSectionOptions, value: "A", allowClear: false },
  { name: "month", label: "Month", options: [
    { label: "October 2026", value: "2026-10" },
    { label: "September 2026", value: "2026-09" },
    { label: "August 2026", value: "2026-08" },
  ], value: "2026-10", allowClear: false },
  { name: "show", label: "Show", options: [
    { label: "All students", value: "all" },
    { label: "Below 75%", value: "low" },
    { label: "Watch (75–89%)", value: "watch" },
    { label: "Good (90% and above)", value: "good" },
    { label: "Perfect attendance", value: "perfect" },
  ], value: "all", allowClear: false },
];

export const attendanceReportStats: StatCardProps[] = [
  { title: "Average attendance", value: "86%", description: "Class 8-A" },
  { title: "Working days", value: 22, description: "This month" },
  { title: "Below 75%", value: 2, description: "Students at risk", variant: "danger" },
  { title: "Perfect attendance", value: 1, description: "Student" },
];

export const attendanceReportRows: AttendanceReportRow[] = [
  { id: "1012", roll: "1012", name: "Ayesha Khan", days: 22, present: 21, absent: 1, late: 0, percent: 95, status: "Good" },
  { id: "1013", roll: "1013", name: "Bilal Ahmed", days: 22, present: 17, absent: 4, late: 1, percent: 77, status: "Watch" },
  { id: "1021", roll: "1021", name: "Hira Siddiqui", days: 22, present: 22, absent: 0, late: 0, percent: 100, status: "Good" },
  { id: "1034", roll: "1034", name: "Usman Raza", days: 22, present: 15, absent: 5, late: 2, percent: 68, status: "Low" },
  { id: "1040", roll: "1040", name: "Zainab Ali", days: 22, present: 20, absent: 1, late: 1, percent: 91, status: "Good" },
  { id: "1047", roll: "1047", name: "Hamza Sheikh", days: 22, present: 18, absent: 3, late: 1, percent: 82, status: "Watch" },
];
