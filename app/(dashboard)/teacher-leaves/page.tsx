import type { Metadata } from "next";
import TeacherLeaves from "@/components/teacher-leaves/TeacherLeaves";
import MobileTeacherLeaves from "@/components/mobile/leaves/MobileTeacherLeaves";
import PlatformSwitch from "@/components/shared/PlatformSwitch";

export const metadata: Metadata = { title: "Teacher leaves | UPCLASS" };

export default function TeacherLeavesPage() {
  return (
    <PlatformSwitch
      desktop={<TeacherLeaves />}
      mobile={<MobileTeacherLeaves />}
    />
  );
}
