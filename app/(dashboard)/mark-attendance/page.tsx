import type { Metadata } from "next";
import MarkAttendance from "@/components/attendance/MarkAttendance";
import MobileMarkAttendance from "@/components/mobile/attendance/MobileMarkAttendance";
import PlatformSwitch from "@/components/shared/PlatformSwitch";

export const metadata: Metadata = { title: "Mark attendance | UPCLASS" };

export default function MarkAttendancePage() {
  return (
    <PlatformSwitch
      desktop={<MarkAttendance />}
      mobile={<MobileMarkAttendance />}
    />
  );
}
