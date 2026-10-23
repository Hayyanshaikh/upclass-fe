"use client";

import { useState } from "react";
import PageHeader from "@/components/shared/PageHeader";
import Button from "@/components/ui/Button";
import TimetableGrid from "@/components/timetable/TimetableGrid";
import LessonCard from "@/components/timetable/LessonCard";
import AssignPeriodDialog from "@/components/dialogs/AssignPeriodDialog";
import {
  timetableFilterFields,
  timetableRows,
  timetableSubjects,
} from "@/constants/timetable";
import { useTeacherStore } from "@/stores/teachers";
import { useClassStore } from "@/stores/classes";
import { useTimetableStore } from "@/stores/timetable";
import {
  filterTimetableAssignments,
  isSameSlot,
  timetableSubjectOptions,
} from "@/utils/timetable";
import type {
  TimetableDay,
  TimetableFilters,
  TimetableRow,
  TimetableSlot,
} from "@/types/timetable";

export default function Timetable() {
  const classes = useClassStore((state) => state.records);
  const grades = [
    ...new Set(classes.map((schoolClass) => schoolClass.grade)),
  ].sort((a, b) => Number(a) - Number(b));
  const [filters, setFilters] = useState<TimetableFilters>(() => {
    const grade = grades[0] || "";
    const section =
      classes
        .filter((schoolClass) => schoolClass.grade === grade)
        .map((schoolClass) => schoolClass.section)
        .sort()[0] || "";
    return { grade, section, term: "term-1" };
  });
  const [slot, setSlot] = useState<TimetableSlot | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const teachers = useTeacherStore((state) => state.records);
  const assignments = useTimetableStore((state) => state.assignments);
  const classId =
    filters.grade && filters.section
      ? filters.grade + "-" + filters.section
      : undefined;
  const matches = filterTimetableAssignments(assignments, filters);
  const sections = [
    ...new Set(
      classes
        .filter(
          (schoolClass) =>
            !filters.grade || schoolClass.grade === filters.grade,
        )
        .map((schoolClass) => schoolClass.section),
    ),
  ].sort();
  const subjects = timetableSubjectOptions(teachers, classes, assignments);

  const fields = timetableFilterFields.map((field) => {
    if (field.type === "date") return field;
    if (field.name === "grade")
      return {
        ...field,
        value: filters.grade,
        options: grades.map((value) => ({ label: "Class " + value, value })),
        onChange: (value: string | undefined) => {
          if (!value) return;
          const grade = value;
          const matching = classes.filter(
            (schoolClass) => schoolClass.grade === grade,
          );
          const section =
            matching.map((schoolClass) => schoolClass.section).sort()[0] || "";
          setFilters({ ...filters, grade, section });
        },
      };
    if (field.name === "section")
      return {
        ...field,
        value: filters.section,
        options: sections.map((value) => ({ label: value, value })),
        onChange: (value: string | undefined) => {
          if (value) setFilters({ ...filters, section: value });
        },
      };
    if (field.name === "term")
      return {
        ...field,
        value: filters.term,
        onChange: (value: string | undefined) => {
          if (value) setFilters({ ...filters, term: value });
        },
      };
    if (field.name === "teacherId")
      return {
        ...field,
        value: filters.teacherId,
        options: teachers.map((teacher) => ({
          label: teacher.name,
          value: teacher.id,
        })),
        onChange: (value: string | undefined) =>
          setFilters({ ...filters, teacherId: value }),
      };
    return {
      ...field,
      value: filters.subject,
      options: subjects,
      onChange: (value: string | undefined) =>
        setFilters({ ...filters, subject: value }),
    };
  });

  function periodSlot(
    row: TimetableRow,
    day: TimetableDay,
    targetClass = classId,
  ): TimetableSlot | null {
    return row.type === "period" && targetClass
      ? {
          classId: targetClass,
          term: filters.term,
          periodId: row.id,
          day,
          label: row.label,
          time: row.time,
        }
      : null;
  }

  function openPeriod(nextSlot: TimetableSlot | null) {
    if (!nextSlot) return;
    setSlot(nextSlot);
    setDialogOpen(true);
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <PageHeader
        title="Timetable"
        subtitle={
          "Weekly timetable · " +
          (filters.term === "term-1" ? "Term 1" : "Term 2")
        }
        actions={
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="secondary">Print</Button>
            <Button
              disabled={!classId}
              onClick={() => {
                const first = timetableRows.find(
                  (row) => row.type === "period",
                );
                if (first) openPeriod(periodSlot(first, "monday"));
              }}
            >
              Edit timetable
            </Button>
          </div>
        }
      />
      <TimetableGrid
        rows={timetableRows}
        filterFields={fields}
        interactive
        renderLesson={(row, day) => {
          if (row.type !== "period") return null;
          const lessons = matches.filter(
            (assignment) =>
              assignment.periodId === row.id && assignment.day === day,
          );
          if (lessons.length)
            return (
              <div className="space-y-2">
                {lessons.map((assignment) => {
                  const subject = Object.values(timetableSubjects).find(
                    (record) => record.name === assignment.subject,
                  );
                  const teacher = teachers.find(
                    (record) => record.id === assignment.teacherId,
                  );
                  return (
                    <LessonCard
                      key={assignment.classId}
                      title={assignment.subject}
                      subtitle={
                        (classId ? "" : "Class " + assignment.classId + " · ") +
                        (teacher?.name || "Unassigned teacher")
                      }
                      room={assignment.room}
                      colorClass={subject?.colorClass || "bg-success/10"}
                      onClick={() =>
                        openPeriod(periodSlot(row, day, assignment.classId))
                      }
                      ariaLabel={
                        "Assign " +
                        day +
                        " " +
                        row.label +
                        " for Class " +
                        assignment.classId
                      }
                    />
                  );
                })}
              </div>
            );
          const currentSlot = periodSlot(row, day);
          const occupied =
            currentSlot &&
            assignments.some((assignment) =>
              isSameSlot(assignment, currentSlot),
            );
          const teacherBusy =
            filters.teacherId &&
            assignments.some(
              (assignment) =>
                assignment.teacherId === filters.teacherId &&
                assignment.term === filters.term &&
                assignment.periodId === row.id &&
                assignment.day === day,
            );
          if (
            (currentSlot && !occupied && !teacherBusy) ||
            (!currentSlot && filters.teacherId && !teacherBusy)
          ) {
            return (
              <LessonCard
                title="Free"
                free
                onClick={
                  currentSlot ? () => openPeriod(currentSlot) : undefined
                }
                ariaLabel={
                  currentSlot
                    ? "Assign " +
                      day +
                      " " +
                      row.label +
                      " for Class " +
                      classId
                    : undefined
                }
              />
            );
          }
          return (
            <div
              aria-label="No matching period"
              className="flex min-h-20 items-center justify-center rounded-md text-sm text-gray"
            >
              —
            </div>
          );
        }}
        beforeTable={
          <section
            aria-label="Subject legend"
            className="flex shrink-0 flex-wrap gap-2"
          >
            {Object.values(timetableSubjects).map((subject) => (
              <span
                key={subject.name}
                className={
                  "rounded-full px-3 py-1 text-xs font-semibold text-dark " +
                  subject.colorClass
                }
              >
                {subject.name}
              </span>
            ))}
          </section>
        }
      />
      <p className="mt-4 shrink-0 text-xs text-gray">
        {classId
          ? "Select a period to assign or clear it."
          : "Select a class and section to assign a free period."}{" "}
        Preview changes reset on refresh.
      </p>
      {slot && (
        <AssignPeriodDialog
          key={slot.classId + slot.term + slot.day + slot.periodId}
          slot={slot}
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          afterClose={() => setSlot(null)}
        />
      )}
    </div>
  );
}
