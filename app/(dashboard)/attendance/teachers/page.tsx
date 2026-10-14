import type { Metadata } from "next";
import TeacherAttendance from "@/components/attendance/TeacherAttendance";

export const metadata: Metadata = { title: "Teacher attendance | UPCLASS" };

export default function TeacherAttendancePage() {
  return <TeacherAttendance />;
}
