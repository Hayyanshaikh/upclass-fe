"use client";

import { useRouter } from "next/navigation";
import PageHeader from "@/components/shared/PageHeader";
import Button from "@/components/ui/Button";
import TimetableGrid from "@/components/timetable/TimetableGrid";
import LessonCard from "@/components/timetable/LessonCard";
import { timetableFilterFields, timetableRows, timetableSubjects } from "@/constants/timetable";

export default function Timetable() {
  const router = useRouter();

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <PageHeader
        title="Timetable"
        subtitle="Weekly class timetable · Term 1"
        actions={
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="secondary" onClick={() => router.push("/timetable/teacher")}>Teacher timetable</Button>
            <Button variant="secondary">Print</Button>
            <Button>Edit timetable</Button>
          </div>
        }
      />
      <TimetableGrid
        rows={timetableRows}
        filterFields={timetableFilterFields}
        renderLesson={(row, day) => {
          if (row.type !== "period") return null;
          const subject = timetableSubjects[row.subjects[day]];
          return <LessonCard title={subject.name} subtitle={subject.teacher} room={subject.room} colorClass={subject.colorClass} />;
        }}
        beforeTable={
          <section aria-label="Subject legend" className="flex shrink-0 flex-wrap gap-2">
            {Object.values(timetableSubjects).map((subject) => (
              <span key={subject.name} className={`rounded-full px-3 py-1 text-xs font-semibold text-dark ${subject.colorClass}`}>
                {subject.name}
              </span>
            ))}
          </section>
        }
      />
      <p className="mt-4 shrink-0 text-xs text-gray">Weekly schedule for Class 8-A · Each period lasts 40 minutes.</p>
    </div>
  );
}
