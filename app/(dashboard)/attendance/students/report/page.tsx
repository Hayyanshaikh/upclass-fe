import type { Metadata } from "next";
import AttendanceReport from "@/components/attendance/AttendanceReport";

export const metadata: Metadata = { title: "Attendance report | UPCLASS" };

export default function AttendanceReportPage() {
  return <AttendanceReport />;
}
