import type { Metadata } from "next";
import StudentAttendance from "@/components/attendance/StudentAttendance";

export const metadata: Metadata = { title: "Student attendance | UPCLASS" };

export default function StudentAttendancePage() {
  return <StudentAttendance />;
}
