import type {
  AttendanceDay,
  MarkAttendanceState,
  WeeklyAttendance,
} from "@/types/mark-attendance";

export const shiftStart = "08:00";
export const shiftEnd = "15:30";
export const onTimeUntil = 8 * 60 + 10;

export const attendanceStates: Record<MarkAttendanceState, AttendanceDay> = {
  unchecked: { state: "unchecked" },
  "checked-in": { state: "checked-in", checkIn: "08:02" },
  late: { state: "late", checkIn: "08:25", lateMinutes: 25 },
  leave: { state: "leave", leaveType: "Medical leave", leaveRequest: "LR-[0000]" },
  absent: { state: "absent" },
  completed: { state: "completed", checkIn: "08:02", checkOut: "15:31" },
};

export const weeklyAttendance: WeeklyAttendance[] = [
  { date: "2026-11-16", day: "Mon", checkIn: "08:01", status: "Present" },
  { date: "2026-11-17", day: "Tue", checkIn: "08:24", status: "Late" },
  { date: "2026-11-18", day: "Wed", status: "Leave" },
  { date: "2026-11-19", day: "Thu", checkIn: "07:58", status: "Present" },
  { date: "2026-11-20", day: "Fri", checkIn: "08:02", status: "Present" },
];

export const weeklyStatusVariants: Record<
  WeeklyAttendance["status"],
  "success" | "danger" | "warning" | "neutral"
> = {
  Present: "success",
  Absent: "danger",
  Late: "warning",
  Leave: "neutral",
};
