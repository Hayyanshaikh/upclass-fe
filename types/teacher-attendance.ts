export type TeacherAttendanceStatus = "Present" | "Absent" | "Late" | "Leave";

export type TeacherAttendanceRow = {
  id: string;
  teacher: string;
  department: string;
  subject: string;
  status: TeacherAttendanceStatus;
  lateMinutes?: number;
  checkIn?: string;
  checkOut?: string;
  hours?: string;
  source: string;
  date: string;
  absenceType?: string;
  leaveType?: string;
};
