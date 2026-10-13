import type { Metadata } from "next";
import Timetable from "@/components/timetable/Timetable";

export const metadata: Metadata = { title: "Timetable | UPCLASS" };

export default function TimetablePage() {
  return <Timetable />;
}
