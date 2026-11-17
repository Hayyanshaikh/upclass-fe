export type TeacherAttendanceStatus = "Present" | "Absent" | "Late" | "Leave";

export type TeacherAttendanceRow = {
  id: string;
  teacherId: string;
  employeeId: string;
  teacher: string;
  status: TeacherAttendanceStatus;
  lateMinutes?: number;
  checkIn?: string;
  checkOut?: string;
  hours?: string;
  source: string;
  date: string;
  remarks?: string;
};
