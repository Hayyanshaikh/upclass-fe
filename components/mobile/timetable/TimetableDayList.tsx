"use client";

import PeriodCard from "@/components/mobile/timetable/PeriodCard";
import type { TimetableEntryDto } from "@/app/api/schemas";
import type { SelectOption } from "@/types/select";
import type {
  TimetableDay,
  TimetablePeriod,
  TimetableRow,
} from "@/types/timetable";

type TimetableDayListProps = {
  rows: TimetableRow[];
  day: TimetableDay;
  entries: TimetableEntryDto[];
  allEntries: TimetableEntryDto[];
  hasEntryFilter: boolean;
  subjectOptions: SelectOption[];
  teacherOptions: SelectOption[];
  classSectionName?: string;
  canCreate: boolean;
  canEdit: boolean;
  onSelectPeriod: (row: TimetablePeriod) => void;
};

export default function TimetableDayList({
  rows,
  day,
  entries,
  allEntries,
  hasEntryFilter,
  subjectOptions,
  teacherOptions,
  classSectionName,
  canCreate,
  canEdit,
  onSelectPeriod,
}: TimetableDayListProps) {
  const dayKey = day.toUpperCase();

  return (
    <div className="flex flex-col gap-3">
      {rows.map((row) => {
        if (row.type === "break") {
          return (
            <div
              key={row.id}
              className="flex items-center gap-3 px-1 text-[11px] font-semibold text-gray"
            >
              <span className="h-px flex-1 bg-border" />
              Break · {row.time}
              <span className="h-px flex-1 bg-border" />
            </div>
          );
        }

        const entry = entries.find(
          (item) => item.periodId === row.id && item.day === dayKey,
        );

        if (entry) {
          const subject = subjectOptions.find(
            (option) => option.value === entry.subjectId,
          );
          const teacher = teacherOptions.find(
            (option) => option.value === entry.teacherId,
          );

          return (
            <PeriodCard
              key={row.id}
              row={row}
              subject={subject?.label}
              teacher={teacher?.label}
              onClick={canEdit ? () => onSelectPeriod(row) : undefined}
              ariaLabel={`Edit ${day} ${row.label} for ${classSectionName}`}
            />
          );
        }

        const hiddenEntry = hasEntryFilter
          ? allEntries.find(
              (item) => item.periodId === row.id && item.day === dayKey,
            )
          : undefined;

        if (hiddenEntry) {
          const subject = subjectOptions.find(
            (option) => option.value === hiddenEntry.subjectId,
          );
          const teacher = teacherOptions.find(
            (option) => option.value === hiddenEntry.teacherId,
          );

          return (
            <PeriodCard
              key={row.id}
              row={row}
              subject={subject?.label}
              teacher={teacher?.label}
              disabled
            />
          );
        }

        return (
          <PeriodCard
            key={row.id}
            row={row}
            free
            onClick={canCreate ? () => onSelectPeriod(row) : undefined}
            ariaLabel={`Assign ${day} ${row.label} for ${classSectionName}`}
          />
        );
      })}

      <p className="text-center text-[11px] text-gray">
        {!canCreate && !canEdit
          ? "Viewing the weekly timetable."
          : "Select a period to assign, edit or clear it."}
      </p>
    </div>
  );
}
