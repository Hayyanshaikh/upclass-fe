import type { Metadata } from "next";
import TeacherAttendance from "@/components/attendance/TeacherAttendance";
import MobileTeacherAttendance from "@/components/mobile/attendance/MobileTeacherAttendance";
import PlatformSwitch from "@/components/shared/PlatformSwitch";

export const metadata: Metadata = { title: "Teacher attendance | UPCLASS" };

export default function TeacherAttendancePage() {
  return (
    <PlatformSwitch
      desktop={<TeacherAttendance />}
      mobile={<MobileTeacherAttendance />}
    />
  );
}
