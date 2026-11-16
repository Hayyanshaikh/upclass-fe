import type { Metadata } from "next";
import PlatformSwitch from "@/components/shared/PlatformSwitch";
import StudentsPage from "@/components/students/StudentsPage";
import MobileStudents from "@/components/mobile/students/MobileStudents";

export const metadata: Metadata = { title: "Students | UPCLASS" };

export default function StudentsRoute() {
  return <PlatformSwitch desktop={<StudentsPage />} mobile={<MobileStudents />} />;
}
