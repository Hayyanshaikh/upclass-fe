import type { Metadata } from "next";
import MarkAttendance from "@/components/attendance/MarkAttendance";

export const metadata: Metadata = { title: "Mark attendance | UPCLASS" };

export default function MarkAttendancePage() {
  return <MarkAttendance />;
}
