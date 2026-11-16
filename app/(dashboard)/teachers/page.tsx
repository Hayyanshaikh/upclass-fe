import type { Metadata } from "next";
import PlatformSwitch from "@/components/shared/PlatformSwitch";
import TeachersPage from "@/components/teachers/TeachersPage";
import MobileTeachers from "@/components/mobile/teachers/MobileTeachers";

export const metadata: Metadata = { title: "Teachers | UPCLASS" };

export default function TeachersRoute() {
  return <PlatformSwitch desktop={<TeachersPage />} mobile={<MobileTeachers />} />;
}
