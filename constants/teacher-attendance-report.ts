import type { TeacherAttendanceReportRow } from "@/types/teacher-attendance-report";

export const teacherAttendanceReportRows: TeacherAttendanceReportRow[] = [
  { id: "T-014", teacher: "Sara Malik", department: "Science & Math", subject: "Mathematics", days: 22, present: 21, absent: 0, late: 1, leave: 0, percent: 95, status: "Good" },
  { id: "T-021", teacher: "Omar Farooq", department: "Languages", subject: "English", days: 22, present: 20, absent: 1, late: 1, leave: 0, percent: 91, status: "Good" },
  { id: "T-027", teacher: "Nadia Hussain", department: "Science & Math", subject: "Science", days: 22, present: 14, absent: 2, late: 0, leave: 6, percent: 64, status: "Low" },
  { id: "T-032", teacher: "Kamran Yousuf", department: "Languages", subject: "Urdu", days: 22, present: 18, absent: 1, late: 3, leave: 0, percent: 82, status: "Watch" },
  { id: "T-038", teacher: "Rabia Anwar", department: "ICT", subject: "Computer", days: 22, present: 22, absent: 0, late: 0, leave: 0, percent: 100, status: "Good" },
  { id: "T-051", teacher: "Mehwish Iqbal", department: "Arts", subject: "Art", days: 22, present: 16, absent: 4, late: 0, leave: 2, percent: 73, status: "Low" },
];

export const teacherAttendanceReportVariants = { Good: "success", Watch: "warning", Low: "danger" } as const;
