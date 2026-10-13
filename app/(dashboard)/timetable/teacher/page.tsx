import type { Metadata } from "next";
import TeacherTimetable from "@/components/timetable/TeacherTimetable";

export const metadata: Metadata = { title: "Teacher timetable | UPCLASS" };

export default function TeacherTimetablePage() {
  return <TeacherTimetable />;
}
