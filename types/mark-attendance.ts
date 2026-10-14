export type MarkAttendanceState = "unchecked" | "checked-in" | "late" | "leave" | "completed";

export type AttendanceDay = {
  state: MarkAttendanceState;
  checkIn?: string;
  checkOut?: string;
  lateMinutes?: number;
  leaveType?: string;
  leaveRequest?: string;
};

export type WeeklyAttendance = {
  day: string;
  checkIn?: string;
  status: "Present" | "Late" | "Leave";
};
