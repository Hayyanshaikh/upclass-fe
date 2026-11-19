import type { Metadata } from "next";
import StudentAttendance from "@/components/attendance/StudentAttendance";
import MobileStudentAttendance from "@/components/mobile/attendance/MobileStudentAttendance";
import PlatformSwitch from "@/components/shared/PlatformSwitch";

export const metadata: Metadata = { title: "Student attendance | UPCLASS" };

export default function StudentAttendancePage() {
  return (
    <PlatformSwitch
      desktop={<StudentAttendance />}
      mobile={<MobileStudentAttendance />}
    />
  );
}
