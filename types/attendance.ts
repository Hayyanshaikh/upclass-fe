export type AttendanceStatus = "Present" | "Absent" | "Late" | "Leave";

export type AttendanceRow = {
  id: string;
  roll: string;
  name: string;
  status: AttendanceStatus;
  remarks: string;
};
