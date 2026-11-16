"use client";

import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { LuCalendarX2, LuClock } from "react-icons/lu";
import Button from "@/components/ui/Button";
import MobileFeedbackDialog from "@/components/mobile/dialogs/MobileFeedbackDialog";
import MobileAssignPeriodForm from "@/components/mobile/forms/MobileAssignPeriodForm";
import MobileListFilters from "@/components/mobile/ui/MobileListFilters";
import TimetableDayList from "@/components/mobile/timetable/TimetableDayList";
import {
  NoticeCard,
  SetupCard,
} from "@/components/mobile/timetable/TimetablePlaceholders";
import TimetableSkeleton, {
  DaySkeleton,
} from "@/components/mobile/timetable/TimetableSkeleton";
import TimetableToolbar from "@/components/mobile/timetable/TimetableToolbar";
import { useAcademicTermDropdown } from "@/hooks/useAcademicTermDropdown";
import { useClassDropdown } from "@/hooks/useClassDropdown";
import { useRolePermission } from "@/hooks/useRolePermission";
import { useSectionDropdown } from "@/hooks/useSectionDropdown";
import { useSubjectDropdown } from "@/hooks/useSubjectDropdown";
import { useTeacherDropdown } from "@/hooks/useTeacherDropdown";
import { useTimetableAssignments } from "@/hooks/useTimetableAssignments";
import { useTimetableClassSections } from "@/hooks/useTimetableClassSections";
import { useTimetablePeriods } from "@/hooks/useTimetablePeriods";
import { useWorkingDays } from "@/hooks/useWorkingDays";
import { useTimetableControllerFindAll } from "@/app/api/endpoints";
import type {
  TimetableDay,
  TimetablePeriod,
  TimetableSelection,
  TimetableSlot,
} from "@/types/timetable";

export default function MobileTimetable() {
  const {
    rows: periodRows,
    isLoading: isPeriodsLoading,
    isError: isPeriodsError,
    refetch: refetchPeriods,
  } = useTimetablePeriods();
  const {
    classSections,
    isLoading: isClassSectionsLoading,
    isError: isClassSectionsError,
    refetch: refetchClassSections,
  } = useTimetableClassSections();
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
  const [selectedDay, setSelectedDay] = useState<TimetableDay | undefined>();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [assignmentSlot, setAssignmentSlot] = useState<TimetableSlot | null>(
    null,
  );
  const [assignmentOpen, setAssignmentOpen] = useState(false);
  const [feedback, setFeedback] = useState<{
    tone: "success" | "error";
    message: string;
  } | null>(null);
  const { canCreate, canEdit } = useRolePermission("timetable");

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
      ) {
        return previous;
      }

      return { ...previous, class: className, section, term };
    });
  }, [classOptions, classSections, termOptions]);

  const selectedClassSection = classSections.find(
    (classSection) =>
      classSection.classId === selection.class &&
      classSection.sectionId === selection.section,
  );
  const classSectionId = selectedClassSection?.id ?? "";
  const hasPeriods = periodRows.some((row) => row.type === "period");
  const isBaseLoading =
    isPeriodsLoading || isClassSectionsLoading || isWorkingDaysLoading;

  const sectionOptionsForClass = sectionOptions.filter((option) =>
    classSections.some(
      (classSection) =>
        classSection.classId === selection.class &&
        classSection.sectionId === option.value,
    ),
  );

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
  const {
    data: allClassEntriesData,
    refetch: refetchAllClassEntries,
  } = useTimetableControllerFindAll(
    { classSectionId, academicTermId: selection.term },
    {
      query: {
        enabled: hasEntryFilter && Boolean(classSectionId && selection.term),
      },
    },
  );
  const allClassEntries = allClassEntriesData?.data ?? [];

  const todayKey = dayjs().format("dddd").toLowerCase() as TimetableDay;
  const activeDay: TimetableDay =
    days.find((day) => day.key === selectedDay)?.key ??
    days.find((day) => day.key === todayKey)?.key ??
    days[0]?.key ??
    "monday";
  const activeFilterCount = [selection.teacherId, selection.subject].filter(
    Boolean,
  ).length;
  const classLabel = classOptions.find(
    (option) => option.value === selection.class,
  )?.label;
  const sectionLabel = sectionOptions.find(
    (option) => option.value === selection.section,
  )?.label;
  const termLabel = termOptions.find(
    (option) => option.value === selection.term,
  )?.label;
  const contextTags = [classLabel, sectionLabel, termLabel].filter(
    (label): label is string => Boolean(label),
  );

  function handleFiltersApply(values: Record<string, unknown>) {
    const className = (values.class as string | undefined) || selection.class;
    const classSectionIds = classSections
      .filter((classSection) => classSection.classId === className)
      .map((classSection) => classSection.sectionId);
    const requestedSection = values.section as string | undefined;
    const section = classSectionIds.includes(requestedSection ?? "")
      ? (requestedSection as string)
      : (classSectionIds[0] ?? "");
    const term = (values.term as string | undefined) || selection.term;

    setSelection((previous) => ({
      ...previous,
      class: className,
      section,
      term,
      teacherId: values.teacherId as string | undefined,
      subjectId: values.subject as string | undefined,
    }));
  }

  function openAssignment(row: TimetablePeriod) {
    if (!selectedClassSection) return;

    setAssignmentSlot({
      classSectionId: selectedClassSection.id,
      classSectionName: selectedClassSection.name,
      academicTermId: selection.term,
      periodId: row.id,
      day: activeDay,
      label: row.label,
      time: row.time,
    });
    setAssignmentOpen(true);
  }

  function handleAssignmentSaved(message: string) {
    setAssignmentOpen(false);
    setFeedback({ tone: "success", message });
    void refetchEntries();
    if (hasEntryFilter) void refetchAllClassEntries();
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-lg font-bold text-dark">Timetable</h1>

      {isBaseLoading ? (
        <TimetableSkeleton />
      ) : isPeriodsError || isClassSectionsError ? (
        <div className="rounded-lg border border-danger/30 bg-danger/10 p-4 text-center">
          <p className="text-sm font-semibold text-danger">
            Unable to load timetable.
          </p>
          <Button
            variant="secondary"
            className="mt-3 h-10! font-semibold"
            onClick={() => {
              void refetchPeriods();
              void refetchClassSections();
              void refetchEntries();
            }}
          >
            Retry
          </Button>
        </div>
      ) : !hasPeriods ? (
        <SetupCard
          icon={<LuClock size={26} aria-hidden="true" />}
          title="No active periods configured"
          description="The timetable is built from active periods. Turn on periods in period configuration first."
          action={{
            href: "/settings?tab=periods",
            label: "Open period configuration",
          }}
        />
      ) : !days.length ? (
        <SetupCard
          icon={<LuCalendarX2 size={26} aria-hidden="true" />}
          title="No working days configured"
          description="Only the working days saved in your school profile appear here."
          action={{
            href: "/settings?tab=profile#workingDays",
            label: "Open school profile",
          }}
        />
      ) : (
        <>
          <TimetableToolbar
            contextTags={contextTags}
            activeFilterCount={activeFilterCount}
            days={days}
            activeDay={activeDay}
            showDays={Boolean(classSectionId)}
            onOpenFilters={() => setFiltersOpen(true)}
            onSelectDay={setSelectedDay}
          />

          {classSections.length === 0 ? (
            <NoticeCard>
              No class sections yet. Add sections to a class to build its
              timetable.
            </NoticeCard>
          ) : !selection.term ? (
            <NoticeCard>No academic terms are configured yet.</NoticeCard>
          ) : !classSectionId ? (
            <NoticeCard>
              This class has no sections yet. Pick another class.
            </NoticeCard>
          ) : isEntriesError ? (
            <div className="rounded-lg border border-danger/30 bg-danger/10 p-4 text-center">
              <p className="text-sm font-semibold text-danger">
                Unable to load this timetable.
              </p>
              <Button
                variant="secondary"
                className="mt-3 h-10! font-semibold"
                onClick={() => void refetchEntries()}
              >
                Retry
              </Button>
            </div>
          ) : isEntriesLoading ? (
            <DaySkeleton />
          ) : (
            <TimetableDayList
              rows={periodRows}
              day={activeDay}
              entries={entries}
              allEntries={allClassEntries}
              hasEntryFilter={hasEntryFilter}
              subjectOptions={subjectOptions}
              teacherOptions={teacherOptions}
              classSectionName={selectedClassSection?.name}
              canCreate={canCreate}
              canEdit={canEdit}
              onSelectPeriod={openAssignment}
            />
          )}
        </>
      )}

      <MobileListFilters
        open={filtersOpen}
        fields={[
          {
            name: "class",
            label: "Class",
            placeholder: "Select class",
            options: classOptions,
          },
          {
            name: "section",
            label: "Section",
            placeholder: "Select section",
            options: sectionOptionsForClass,
          },
          {
            name: "term",
            label: "Term",
            placeholder: "Select term",
            options: termOptions,
          },
          {
            name: "teacherId",
            label: "Teacher",
            placeholder: "All teachers",
            options: teacherOptions,
          },
          {
            name: "subject",
            label: "Subject",
            placeholder: "All subjects",
            options: subjectOptions,
          },
        ]}
        values={{
          class: selection.class,
          section: selection.section,
          term: selection.term,
          teacherId: selection.teacherId,
          subject: selection.subject,
        }}
        onApply={handleFiltersApply}
        onClose={() => setFiltersOpen(false)}
      />

      {assignmentSlot && (
        <MobileAssignPeriodForm
          key={`${assignmentSlot.classSectionId}-${assignmentSlot.academicTermId}-${assignmentSlot.day}-${assignmentSlot.periodId}`}
          open={assignmentOpen}
          slot={assignmentSlot}
          onClose={() => setAssignmentOpen(false)}
          onSaved={handleAssignmentSaved}
        />
      )}

      <MobileFeedbackDialog
        open={feedback !== null}
        tone={feedback?.tone ?? "success"}
        message={feedback?.message ?? ""}
        onClose={() => setFeedback(null)}
      />
    </div>
  );
}
