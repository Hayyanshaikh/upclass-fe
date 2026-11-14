export type TeacherAttendanceReportRow = {
  teacherId: string;
  id: string;
  teacher: string;
  days: number;
  present: number;
  absent: number;
  late: number;
  leave: number;
  percent: number;
  status: "Good" | "Watch" | "Low";
};
