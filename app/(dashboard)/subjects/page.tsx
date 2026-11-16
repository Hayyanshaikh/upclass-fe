import type { Metadata } from "next";
import PlatformSwitch from "@/components/shared/PlatformSwitch";
import Subjects from "@/components/subjects/Subjects";
import MobileSubjects from "@/components/mobile/subjects/MobileSubjects";

export const metadata: Metadata = { title: "Subjects | UPCLASS" };

export default function SubjectsPage() {
  return <PlatformSwitch desktop={<Subjects />} mobile={<MobileSubjects />} />;
}
