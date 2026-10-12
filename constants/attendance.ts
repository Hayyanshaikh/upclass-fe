import dayjs from "dayjs";
import { classGradeOptions } from "@/constants/classes";
import type { AttendanceRow, AttendanceStatus } from "@/types/attendance";
import type { FilterField } from "@/types/table-toolbar";
import type { SegmentedOption } from "@/types/segmented-control";

export const attendanceStatusOptions: SegmentedOption<AttendanceStatus>[] = [
  { label: "Present", value: "Present", variant: "primary" },
  { label: "Absent", value: "Absent", variant: "danger" },
  { label: "Late", value: "Late", variant: "warning" },
  { label: "Leave", value: "Leave", variant: "neutral" },
];

export const attendanceSectionOptions = [
  { label: "A", value: "A" },
  { label: "B", value: "B" },
  { label: "C", value: "C" },
];

export const attendanceFilterFields: FilterField[] = [
  { name: "grade", label: "Class", options: classGradeOptions, value: "8", allowClear: false },
  { name: "section", label: "Section", options: attendanceSectionOptions, value: "A", allowClear: false },
  { type: "date", name: "date", label: "Date", value: dayjs("2026-10-12") },
  { name: "period", label: "Period", options: [
    { label: "Full day", value: "full-day" },
    { label: "Period 1", value: "period-1" },
    { label: "Period 2", value: "period-2" },
  ], value: "full-day", allowClear: false },
];

export const attendanceRows: AttendanceRow[] = [
  { id: "1012", roll: "1012", name: "Ayesha Khan", status: "Present", remarks: "" },
  { id: "1013", roll: "1013", name: "Bilal Ahmed", status: "Absent", remarks: "Sick" },
  { id: "1021", roll: "1021", name: "Hira Siddiqui", status: "Present", remarks: "" },
  { id: "1034", roll: "1034", name: "Usman Raza", status: "Late", remarks: "Bus delay" },
  { id: "1040", roll: "1040", name: "Zainab Ali", status: "Present", remarks: "" },
  { id: "1047", roll: "1047", name: "Hamza Sheikh", status: "Leave", remarks: "Family event" },
  { id: "1052", roll: "1052", name: "Maryam Tariq", status: "Present", remarks: "" },
  { id: "1058", roll: "1058", name: "Daniyal Shah", status: "Present", remarks: "" },
];
