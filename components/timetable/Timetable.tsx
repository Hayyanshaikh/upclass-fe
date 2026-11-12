"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import PageHeader from "@/components/shared/PageHeader";
import Button from "@/components/ui/Button";
import Loader from "@/components/ui/Loader";
import TimetableGrid from "@/components/timetable/TimetableGrid";
import LessonCard from "@/components/timetable/LessonCard";
import AssignPeriodDialog from "@/components/dialogs/AssignPeriodDialog";
import { timetableFilterFields } from "@/constants/timetable";
import { useAcademicTermDropdown } from "@/hooks/useAcademicTermDropdown";
import { useClassDropdown } from "@/hooks/useClassDropdown";
import { useSectionDropdown } from "@/hooks/useSectionDropdown";
import { useSubjectDropdown } from "@/hooks/useSubjectDropdown";
import { useTeacherDropdown } from "@/hooks/useTeacherDropdown";
import { useTimetablePeriods } from "@/hooks/useTimetablePeriods";
import { useWorkingDays } from "@/hooks/useWorkingDays";
import { useTimetableStore } from "@/stores/timetable";
import type {
  TimetableDay,
  TimetableRow,
  TimetableSelection,
  TimetableSlot,
} from "@/types/timetable";

export default function Timetable() {
  const assignments = useTimetableStore((state) => state.assignments);
  const {
    rows: periodRows,
    isLoading: isPeriodsLoading,
    isError: isPeriodsError,
    refetch: refetchPeriods,
  } = useTimetablePeriods();
  const { options: classOptions } = useClassDropdown();
  const { options: sectionOptions } = useSectionDropdown();
  const { options: termOptions } = useAcademicTermDropdown();
  const { options: teacherOptions } = useTeacherDropdown();
  const { options: subjectOptions } = useSubjectDropdown();
  const { days, isLoading: isWorkingDaysLoading } = useWorkingDays();
  const [selection, setSelection] = useState<TimetableSelection>({
    class: "",
    section: "",
    term: "",
  });
  const [slot, setSlot] = useState<TimetableSlot | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    setSelection((previous) => {
      const className = previous.class || classOptions[0]?.value || "";
      const section = previous.section || sectionOptions[0]?.value || "";
      const term = previous.term || termOptions[0]?.value || "";
      if (
        className === previous.class &&
        section === previous.section &&
        term === previous.term
      )
        return previous;
      return { ...previous, class: className, section, term };
    });
  }, [classOptions, sectionOptions, termOptions]);

  const classLabel = classOptions.find(
    (option) => option.value === selection.class,
  )?.label;
  const sectionLabel = sectionOptions.find(
    (option) => option.value === selection.section,
  )?.label;
  const classId =
    classLabel && sectionLabel ? classLabel + "-" + sectionLabel : undefined;
  const selectedTerm = termOptions.find(
    (option) => option.value === selection.term,
  );
  const hasPeriods = periodRows.length > 0;

  const fields = useMemo(
    () =>
      timetableFilterFields.map((field) => {
        if (field.type === "date") return field;

        switch (field.name) {
          case "class":
            return {
              ...field,
              value: selection.class,
              options: classOptions,
              onChange: (value: string | undefined) => {
                if (!value) return;
                setSelection((previous) => ({ ...previous, class: value }));
              },
            };
          case "section":
            return {
              ...field,
              value: selection.section,
              options: sectionOptions,
              onChange: (value: string | undefined) => {
                if (value)
                  setSelection((previous) => ({
                    ...previous,
                    section: value,
                  }));
              },
            };
          case "term":
            return {
              ...field,
              value: selection.term,
              options: termOptions,
              onChange: (value: string | undefined) => {
                if (value)
                  setSelection((previous) => ({ ...previous, term: value }));
              },
            };
          case "teacherId":
            return {
              ...field,
              value: selection.teacherId,
              options: teacherOptions,
              onChange: (value: string | undefined) =>
                setSelection((previous) => ({
                  ...previous,
                  teacherId: value,
                })),
            };
          case "subject":
            return {
              ...field,
              value: selection.subject,
              options: subjectOptions,
              onChange: (value: string | undefined) =>
                setSelection((previous) => ({
                  ...previous,
                  subject: value,
                })),
            };
          default:
            return field;
        }
      }),
    [
      classOptions,
      sectionOptions,
      selection,
      subjectOptions,
      teacherOptions,
      termOptions,
    ],
  );

  const periodSlot = useCallback(
    (
      row: TimetableRow,
      day: TimetableDay,
      targetClass = classId,
    ): TimetableSlot | null => {
      return row.type === "period" && targetClass
        ? {
            classId: targetClass,
            term: selection.term,
            periodId: row.id,
            day,
            label: row.label,
            time: row.time,
          }
        : null;
    },
    [classId, selection.term],
  );

  const openPeriod = useCallback((nextSlot: TimetableSlot | null) => {
    if (!nextSlot) return;
    setSlot(nextSlot);
    setDialogOpen(true);
  }, []);

  const renderLesson = useCallback(
    (row: TimetableRow, day: TimetableDay) => {
      if (row.type !== "period") return null;
      const lessons = assignments.filter(
        (assignment) =>
          assignment.periodId === row.id && assignment.day === day,
      );
      if (lessons.length)
        return (
          <div className="space-y-2">
            {lessons.map((assignment) => {
              const teacher = teacherOptions.find(
                (option) => option.value === assignment.teacherId,
              );
              const subject = subjectOptions.find(
                (option) => option.value === assignment.subject,
              );
              return (
                <LessonCard
                  key={assignment.classId}
                  title={subject?.label || assignment.subject}
                  subtitle={
                    (classId ? "" : "Class " + assignment.classId + " · ") +
                    (teacher?.label || "Unassigned teacher")
                  }
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
      if (currentSlot) {
        return (
          <LessonCard
            title="Free"
            free
            onClick={() => openPeriod(currentSlot)}
            ariaLabel={
              "Assign " + day + " " + row.label + " for Class " + classId
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
    },
    [
      assignments,
      classId,
      openPeriod,
      periodSlot,
      subjectOptions,
      teacherOptions,
    ],
  );

  return (
    <div className="flex h-full min-h-0 flex-col">
      <PageHeader
        title="Timetable"
        subtitle={
          "Weekly timetable" + (selectedTerm ? " · " + selectedTerm.label : "")
        }
        actions={<Button>Print Timetable</Button>}
      />
      {isPeriodsLoading || isWorkingDaysLoading ? (
        <Loader fullscreen={false} tip="Loading timetable..." />
      ) : isPeriodsError ? (
        <div
          role="alert"
          className="flex items-center gap-3 rounded-md border border-danger bg-danger/10 px-4 py-3 text-sm text-danger"
        >
          <span>Unable to load periods.</span>
          <Button variant="link" onClick={() => void refetchPeriods()}>
            Retry
          </Button>
        </div>
      ) : !hasPeriods ? (
        <div className="flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-border bg-background p-8 text-center">
          <p className="text-sm font-semibold text-dark">
            No active periods configured.
          </p>
          <p className="mt-1 text-sm text-gray">
            Add periods in Settings → Period configuration to generate the
            timetable.
          </p>
        </div>
      ) : !days.length ? (
        <div className="flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-border bg-background p-8 text-center">
          <p className="text-sm font-semibold text-dark">
            No working days configured.
          </p>
          <p className="mt-1 text-sm text-gray">
            Select working days in Settings → School profile to generate the
            timetable.
          </p>
        </div>
      ) : (
        <>
          <TimetableGrid
            rows={periodRows}
            days={days}
            filterFields={fields}
            interactive
            renderLesson={renderLesson}
          />
          <p className="mt-4 shrink-0 text-xs text-gray">
            {classId
              ? "Select a period to assign or clear it."
              : "Select a class and section to assign a free period."}{" "}
            Preview changes reset on refresh.
          </p>
        </>
      )}
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
