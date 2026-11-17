import type { Metadata } from "next";
import PlatformSwitch from "@/components/shared/PlatformSwitch";
import ClassesPage from "@/components/classes/ClassesPage";
import MobileClasses from "@/components/mobile/classes/MobileClasses";

export const metadata: Metadata = { title: "Classes | UPCLASS" };

export default function ClassesRoute() {
  return (
    <PlatformSwitch desktop={<ClassesPage />} mobile={<MobileClasses />} />
  );
}
