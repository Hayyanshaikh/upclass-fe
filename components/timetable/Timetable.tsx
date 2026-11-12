"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  LuCalendarCheck2,
  LuCalendarX2,
  LuSettings,
} from "react-icons/lu";
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
import { useTimetableAssignments } from "@/hooks/useTimetableAssignments";
import { useTimetableClassSections } from "@/hooks/useTimetableClassSections";
import { useTimetablePeriods } from "@/hooks/useTimetablePeriods";
import { useWorkingDays } from "@/hooks/useWorkingDays";
import { useRolePermission } from "@/hooks/useRolePermission";
import { useTimetableControllerFindAll } from "@/app/api/endpoints";
import type {
  TimetableDay,
  TimetableRow,
  TimetableSelection,
  TimetableSlot,
} from "@/types/timetable";

export default function Timetable() {
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
  const { classSections } = useTimetableClassSections();
  const { canCreate, canEdit } = useRolePermission("timetable");
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
      const classSectionIds = classSections
        .filter((classSection) => classSection.classId === className)
        .map((classSection) => classSection.sectionId);
      const section = classSectionIds.includes(previous.section)
        ? previous.section
        : (classSectionIds[0] ?? "");
      const term = previous.term || termOptions[0]?.value || "";
      if (
        className === previous.class &&
        section === previous.section &&
        term === previous.term
      )
        return previous;
      return { ...previous, class: className, section, term };
    });
  }, [classOptions, classSections, termOptions]);

  const classLabel = classOptions.find(
    (option) => option.value === selection.class,
  )?.label;
  const sectionLabel = sectionOptions.find(
    (option) => option.value === selection.section,
  )?.label;
  const selectedClassSection = classSections.find(
    (classSection) =>
      classSection.classId === selection.class &&
      classSection.sectionId === selection.section,
  );
  const classSectionId = selectedClassSection?.id ?? "";
  const classSectionName =
    selectedClassSection?.name ??
    (classLabel && sectionLabel ? classLabel + " - " + sectionLabel : "");

  const {
    entries,
    isLoading: isEntriesLoading,
    isError: isEntriesError,
    refetch: refetchEntries,
  } = useTimetableAssignments({
    classSectionId,
    academicTermId: selection.term,
    teacherId: selection.teacherId,
    subjectId: selection.subject,
  });

  const hasEntryFilter = Boolean(selection.teacherId || selection.subject);
  const { data: allClassEntriesData } = useTimetableControllerFindAll(
    { classSectionId, academicTermId: selection.term },
    {
      query: {
        enabled: hasEntryFilter && !!classSectionId && !!selection.term,
      },
    },
  );
  const allClassEntries = allClassEntriesData?.data;

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
                setSelection((previous) => {
                  const classSectionIds = classSections
                    .filter((classSection) => classSection.classId === value)
                    .map((classSection) => classSection.sectionId);
                  const section = classSectionIds.includes(previous.section)
                    ? previous.section
                    : (classSectionIds[0] ?? "");
                  return { ...previous, class: value, section };
                });
              },
            };
          case "section":
            return {
              ...field,
              value: selection.section,
              options: sectionOptions.filter((option) =>
                classSections.some(
                  (classSection) =>
                    classSection.classId === selection.class &&
                    classSection.sectionId === option.value,
                ),
              ),
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
      classSections,
      sectionOptions,
      selection,
      subjectOptions,
      teacherOptions,
      termOptions,
    ],
  );

  const periodSlot = useCallback(
    (row: TimetableRow, day: TimetableDay): TimetableSlot | null => {
      return row.type === "period" && selectedClassSection
        ? {
            classSectionId: selectedClassSection.id,
            classSectionName: selectedClassSection.name,
            academicTermId: selection.term,
            periodId: row.id,
            day,
            label: row.label,
            time: row.time,
          }
        : null;
    },
    [selectedClassSection, selection.term],
  );

  const openPeriod = useCallback((nextSlot: TimetableSlot | null) => {
    if (!nextSlot) return;
    setSlot(nextSlot);
    setDialogOpen(true);
  }, []);

  const renderLesson = useCallback(
    (row: TimetableRow, day: TimetableDay) => {
      if (row.type !== "period") return null;
      const entry = entries.find(
        (item) => item.periodId === row.id && item.day === day.toUpperCase(),
      );
      if (entry) {
        const teacher = teacherOptions.find(
          (option) => option.value === entry.teacherId,
        );
        const subject = subjectOptions.find(
          (option) => option.value === entry.subjectId,
        );
        return (
          <LessonCard
            title={subject?.label || "Subject"}
            subtitle={teacher?.label || "Unassigned teacher"}
            onClick={canEdit ? () => openPeriod(periodSlot(row, day)) : undefined}
            ariaLabel={
              "Edit " + day + " " + row.label + " for " + classSectionName
            }
          />
        );
      }
      const currentSlot = periodSlot(row, day);
      if (currentSlot) {
        const isHiddenByFilter =
          hasEntryFilter &&
          allClassEntries?.some(
            (item) =>
              item.periodId === row.id && item.day === day.toUpperCase(),
          );
        if (isHiddenByFilter) {
          return (
            <div
              aria-label="Assigned period hidden by filter"
              className="flex min-h-20 items-center justify-center rounded-md text-sm text-gray"
            >
              —
            </div>
          );
        }
        return (
          <LessonCard
            title="Free"
            free
            onClick={
              canCreate ? () => openPeriod(currentSlot) : undefined
            }
            ariaLabel={
              "Assign " + day + " " + row.label + " for " + classSectionName
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
      allClassEntries,
      canCreate,
      canEdit,
      classSectionName,
      entries,
      hasEntryFilter,
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
      ) : isPeriodsError || isEntriesError ? (
        <div
          role="alert"
          className="flex items-center gap-3 rounded-md border border-danger bg-danger/10 px-4 py-3 text-sm text-danger"
        >
          <span>Unable to load timetable.</span>
          <Button
            variant="link"
            onClick={() => {
              void refetchPeriods();
              void refetchEntries();
            }}
          >
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
        <div className="flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-border bg-background p-10 text-center">
          <span className="flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <LuCalendarX2 className="size-8" aria-hidden="true" />
          </span>
          <h2 className="mt-5 text-lg font-bold text-dark">
            No working days configured
          </h2>
          <p className="mt-2 max-w-md text-sm text-gray">
            The timetable only shows the days saved in your school profile.
            Add at least one working day to start assigning periods.
          </p>
          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row">
            <Link
              href="/settings?tab=profile"
              className="flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-xs font-semibold text-dark transition-colors hover:bg-primary/10 hover:text-primary"
            >
              <LuSettings
                className="size-4 text-primary"
                aria-hidden="true"
              />
              Settings → School profile
            </Link>
            <Link
              href="/settings?tab=profile#workingDays"
              className="flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-xs font-semibold text-dark transition-colors hover:bg-primary/10 hover:text-primary"
            >
              <LuCalendarCheck2
                className="size-4 text-success"
                aria-hidden="true"
              />
              Select working days
            </Link>
          </div>
        </div>
      ) : (
        <>
          <TimetableGrid
            rows={periodRows}
            days={days}
            filterFields={fields}
            interactive
            loading={isEntriesLoading}
            renderLesson={renderLesson}
          />
          <p className="mt-4 shrink-0 text-xs text-gray">
            {!canCreate && !canEdit
              ? "Viewing the weekly timetable."
              : classSectionId
                ? "Select a period to assign, edit or clear it."
                : "Select a class and section to assign a free period."}
          </p>
        </>
      )}
      {slot && (
        <AssignPeriodDialog
          key={
            slot.classSectionId +
            slot.academicTermId +
            slot.day +
            slot.periodId
          }
          slot={slot}
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          afterClose={() => setSlot(null)}
        />
      )}
    </div>
  );
}
