export type AttendanceReportStatus = "Good" | "Watch" | "Low";

export type AttendanceReportRow = {
  id: string;
  roll: string;
  name: string;
  days: number;
  present: number;
  absent: number;
  late: number;
  percent: number;
  status: AttendanceReportStatus;
};
