import type { Metadata } from "next";
import TeacherAttendanceReport from "@/components/attendance/TeacherAttendanceReport";
import MobileTeacherAttendanceReport from "@/components/mobile/attendance/MobileTeacherAttendanceReport";
import PlatformSwitch from "@/components/shared/PlatformSwitch";

export const metadata: Metadata = { title: "Teacher attendance report | UPCLASS" };

export default function TeacherAttendanceReportPage() {
  return (
    <PlatformSwitch
      desktop={<TeacherAttendanceReport />}
      mobile={<MobileTeacherAttendanceReport />}
    />
  );
}
