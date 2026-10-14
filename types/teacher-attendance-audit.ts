export type TeacherAttendanceAuditEntry = {
  id: string;
  teacher: string;
  date: string;
  previousStatus: string;
  status: string;
  reason: string;
};
