import type { Metadata } from "next";
import PlatformSwitch from "@/components/shared/PlatformSwitch";
import Timetable from "@/components/timetable/Timetable";
import MobileTimetable from "@/components/mobile/timetable/MobileTimetable";

export const metadata: Metadata = { title: "Timetable | UPCLASS" };

export default function TimetablePage() {
  return <PlatformSwitch desktop={<Timetable />} mobile={<MobileTimetable />} />;
}
