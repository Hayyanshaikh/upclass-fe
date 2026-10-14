import type { TeacherAttendanceRow } from "@/types/teacher-attendance";

export const teacherAttendanceRows: TeacherAttendanceRow[] = [
  { id: "T-014", teacher: "Sara Malik", department: "Science & Math", subject: "Mathematics", status: "Present", checkIn: "08:02", checkOut: "15:31", hours: "7h 29m", source: "Self check-in", date: "2026-10-14" },
  { id: "T-021", teacher: "Omar Farooq", department: "Languages", subject: "English", status: "Present", checkIn: "07:58", checkOut: "15:35", hours: "7h 37m", source: "Self check-in", date: "2026-10-14" },
  { id: "T-027", teacher: "Nadia Hussain", department: "Science & Math", subject: "Science", status: "Leave", source: "Leave request (approved)", date: "2026-10-14" },
  { id: "T-032", teacher: "Kamran Yousuf", department: "Languages", subject: "Urdu", status: "Late", lateMinutes: 25, checkIn: "08:25", checkOut: "15:30", hours: "7h 05m", source: "Self check-in", date: "2026-10-14" },
  { id: "T-038", teacher: "Rabia Anwar", department: "ICT", subject: "Computer", status: "Present", checkIn: "07:55", hours: "Working", source: "Self check-in", date: "2026-10-14" },
  { id: "T-045", teacher: "Faisal Qureshi", department: "Religious Studies", subject: "Islamiyat", status: "Present", checkIn: "08:00", checkOut: "15:32", hours: "7h 32m", source: "Edited by admin", date: "2026-10-14" },
  { id: "T-051", teacher: "Mehwish Iqbal", department: "Arts", subject: "Art", status: "Absent", source: "No check-in (auto)", date: "2026-10-14" },
  { id: "T-056", teacher: "Adnan Javed", department: "Sports", subject: "Physical Ed.", status: "Present", checkIn: "07:50", checkOut: "15:40", hours: "7h 50m", source: "Self check-in", date: "2026-10-14" },
];

export const teacherAttendanceDepartmentOptions = [
  "Science & Math", "Languages", "ICT", "Religious Studies", "Arts", "Sports",
].map((value) => ({ label: value, value }));

export const teacherAttendanceSubjectOptions = [
  ...new Set(teacherAttendanceRows.map((row) => row.subject)),
].map((value) => ({ label: value, value }));

export const teacherAttendanceStatusOptions = [
  "Present", "Absent", "Late", "Leave",
].map((value) => ({ label: value, value }));

export const teacherAttendanceStatusVariants = {
  Present: "success",
  Absent: "danger",
  Late: "warning",
  Leave: "neutral",
} as const;
