import type { AttendanceStatus } from "@/types/attendance";
import type { SegmentedOption } from "@/types/segmented-control";

export const attendanceStatusOptions: SegmentedOption<AttendanceStatus>[] = [
  { label: "Present", value: "Present", variant: "primary" },
  { label: "Absent", value: "Absent", variant: "danger" },
  { label: "Late", value: "Late", variant: "warning" },
  { label: "Leave", value: "Leave", variant: "neutral" },
];
