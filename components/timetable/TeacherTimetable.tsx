"use client";

import { useRouter } from "next/navigation";
import PageHeader from "@/components/shared/PageHeader";
import Button from "@/components/ui/Button";
import LessonCard from "@/components/timetable/LessonCard";
import TimetableGrid from "@/components/timetable/TimetableGrid";
import { teacherTimetableFilterFields, teacherTimetableRows } from "@/constants/teacher-timetable";
import { timetableSubjects } from "@/constants/timetable";

export default function TeacherTimetable() {
  const router = useRouter();
  const subject = timetableSubjects.mathematics;

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <PageHeader
        title="Teacher timetable"
        subtitle="Sara Malik · T-014 · Mathematics"
        breadcrumbs={[{ title: "Timetable", href: "/timetable" }, { title: "Teacher" }]}
        actions={
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="secondary" onClick={() => router.push("/timetable")}>Class timetable</Button>
            <Button>Print</Button>
          </div>
        }
      />
      <TimetableGrid
        rows={teacherTimetableRows}
        filterFields={teacherTimetableFilterFields}
        renderLesson={(row, day) => {
          if (row.type !== "period") return null;
          const lesson = row.lessons[day];
          return lesson
            ? <LessonCard title={lesson.className} subtitle={subject.name} room={lesson.room} colorClass={subject.colorClass} />
            : <LessonCard title="Free" free />;
        }}
      />
    </div>
  );
}
