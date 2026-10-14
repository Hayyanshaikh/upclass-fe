export type TeacherAttendanceReportRow = {
  id: string;
  teacher: string;
  department: string;
  subject: string;
  days: number;
  present: number;
  absent: number;
  late: number;
  leave: number;
  percent: number;
  status: "Good" | "Watch" | "Low";
};
