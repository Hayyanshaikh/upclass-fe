import type { Metadata } from "next";
import TeacherAttendanceReport from "@/components/attendance/TeacherAttendanceReport";

export const metadata: Metadata = { title: "Teacher attendance report | UPCLASS" };

export default function TeacherAttendanceReportPage() {
  return <TeacherAttendanceReport />;
}
