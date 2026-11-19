import type { Metadata } from "next";
import AttendanceReport from "@/components/attendance/AttendanceReport";
import MobileStudentAttendanceReport from "@/components/mobile/attendance/MobileStudentAttendanceReport";
import PlatformSwitch from "@/components/shared/PlatformSwitch";

export const metadata: Metadata = { title: "Attendance report | UPCLASS" };

export default function AttendanceReportPage() {
  return (
    <PlatformSwitch
      desktop={<AttendanceReport />}
      mobile={<MobileStudentAttendanceReport />}
    />
  );
}
