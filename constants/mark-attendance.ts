import type { AttendanceDay, MarkAttendanceState, WeeklyAttendance } from "@/types/mark-attendance";

export const shiftStart = "08:00";
export const shiftEnd = "15:30";
export const onTimeUntil = 8 * 60 + 10;

export const attendanceStates: Record<MarkAttendanceState, AttendanceDay> = {
  unchecked: { state: "unchecked" },
  "checked-in": { state: "checked-in", checkIn: "08:02" },
  late: { state: "late", checkIn: "08:25", lateMinutes: 25 },
  leave: { state: "leave", leaveType: "Medical leave", leaveRequest: "LR-[0000]" },
  completed: { state: "completed", checkIn: "08:02", checkOut: "15:31" },
};

export const weeklyAttendance: WeeklyAttendance[] = [
  { day: "Mon", checkIn: "08:01", status: "Present" },
  { day: "Tue", checkIn: "08:24", status: "Late" },
  { day: "Wed", status: "Leave" },
  { day: "Thu", checkIn: "07:58", status: "Present" },
  { day: "Fri", checkIn: "08:02", status: "Present" },
];
