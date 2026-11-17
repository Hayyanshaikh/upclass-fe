export type MarkAttendanceState =
  | "unchecked"
  | "checked-in"
  | "late"
  | "leave"
  | "absent"
  | "completed";

export type AttendanceDay = {
  state: MarkAttendanceState;
  checkIn?: string;
  checkOut?: string;
  lateMinutes?: number;
  leaveType?: string;
  leaveRequest?: string;
};

export type WeeklyAttendance = {
  date: string;
  day: string;
  checkIn?: string;
  status: "Present" | "Absent" | "Late" | "Leave";
};
