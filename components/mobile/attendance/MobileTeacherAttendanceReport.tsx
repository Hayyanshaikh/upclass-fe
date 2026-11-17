"use client";

import { useState } from "react";
import dayjs from "dayjs";
import type { Dayjs } from "dayjs";
import {
  LuChevronLeft,
  LuChevronRight,
  LuSlidersHorizontal,
} from "react-icons/lu";
import StatusBadge from "@/components/ui/StatusBadge";
import MobileTeacherAttendanceReportSheet from "@/components/mobile/attendance/MobileTeacherAttendanceReportSheet";
import MobileIconButton from "@/components/mobile/ui/MobileIconButton";
import MobileList from "@/components/mobile/ui/MobileList";
import MobileListFilters from "@/components/mobile/ui/MobileListFilters";
import { teacherAttendanceReportVariants } from "@/constants/teacher-attendance-report";
import { teacherAttendanceReportRowManipulator } from "@/lib/api/teacher-attendance";
import { useTeacherAttendanceControllerReport } from "@/app/api/endpoints";
import { TeacherAttendanceControllerReportBand } from "@/app/api/schemas";
import type { TeacherAttendanceReportRow } from "@/types/teacher-attendance-report";

const bandOptions = [
  {
    label: "All teachers",
    value: TeacherAttendanceControllerReportBand.all,
  },
  {
    label: "Good (90% and above)",
    value: TeacherAttendanceControllerReportBand.good,
  },
  {
    label: "Watch (75–89%)",
    value: TeacherAttendanceControllerReportBand.watch,
  },
  {
    label: "Low (below 75%)",
    value: TeacherAttendanceControllerReportBand.low,
  },
  {
    label: "Perfect attendance",
    value: TeacherAttendanceControllerReportBand.perfect,
  },
];

type ReportCardProps = {
  row: TeacherAttendanceReportRow;
  onSelect: (row: TeacherAttendanceReportRow) => void;
};

function ReportCard({ row, onSelect }: ReportCardProps) {
  return (
    <button
      type="button"
      aria-label={`View ${row.teacher}'s attendance details`}
      onClick={() => onSelect(row)}
      className="flex w-full items-center gap-3 rounded-lg border border-border bg-background p-4 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:bg-foreground"
    >
      <span
        className="flex size-9 shrink-0 items-center justify-center rounded-full bg-success/10 font-bold text-primary"
        aria-hidden="true"
      >
        {row.teacher.charAt(0)}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-dark">
          {row.teacher}
        </p>
        <p className="truncate text-xs text-gray">
          {row.id} · {row.percent}% attendance
        </p>
      </div>
      <StatusBadge variant={teacherAttendanceReportVariants[row.status]}>
        {row.status}
      </StatusBadge>
      <LuChevronRight
        size={18}
        className="shrink-0 text-gray"
        aria-hidden="true"
      />
    </button>
  );
}

export default function MobileTeacherAttendanceReport() {
  const [month, setMonth] = useState<Dayjs>(() => dayjs().startOf("month"));
  const [band, setBand] = useState<TeacherAttendanceControllerReportBand>();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selected, setSelected] = useState<TeacherAttendanceReportRow | null>(
    null,
  );
  const [sheetOpen, setSheetOpen] = useState(false);

  const { data, isFetching, isError, refetch } =
    useTeacherAttendanceControllerReport({
      month: month.format("YYYY-MM"),
      band: band ?? TeacherAttendanceControllerReportBand.all,
    });
  const rows = teacherAttendanceReportRowManipulator(data?.data);

  function changeMonth(offset: number) {
    setMonth((current) => current.add(offset, "month"));
  }

  function openDetails(row: TeacherAttendanceReportRow) {
    setSelected(row);
    setSheetOpen(true);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <MobileIconButton
          variant="ghost"
          href="/attendance/teachers"
          label="Back to teacher attendance"
        >
          <LuChevronLeft size={22} aria-hidden="true" />
        </MobileIconButton>
        <h1 className="text-lg font-bold text-dark">
          Teacher attendance report
        </h1>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex h-11 min-w-0 flex-1 items-center justify-between gap-2 rounded-lg border border-border bg-background px-2">
          <MobileIconButton
            variant="ghost"
            label="Previous month"
            onClick={() => changeMonth(-1)}
          >
            <LuChevronLeft size={20} aria-hidden="true" />
          </MobileIconButton>
          <p className="text-sm font-semibold text-dark">
            {month.format("MMMM YYYY")}
          </p>
          <MobileIconButton
            variant="ghost"
            label="Next month"
            onClick={() => changeMonth(1)}
          >
            <LuChevronRight size={20} aria-hidden="true" />
          </MobileIconButton>
        </div>

        <MobileIconButton
          variant="secondary"
          label={band ? "Filters, 1 active" : "Filters"}
          onClick={() => setFiltersOpen(true)}
          className="relative"
        >
          <LuSlidersHorizontal size={20} aria-hidden="true" />
          {band && (
            <span className="absolute -top-1.5 -right-1.5 flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-background">
              1
            </span>
          )}
        </MobileIconButton>
      </div>

      <MobileList
        items={rows}
        rowKey={(row) => row.teacherId}
        renderItem={(row) => <ReportCard row={row} onSelect={openDetails} />}
        loading={isFetching && rows.length === 0 && !isError}
        error={isError && rows.length === 0}
        onRetry={() => void refetch()}
        emptyText={`No attendance records for ${month.format("MMMM YYYY")}.`}
      />

      <MobileListFilters
        open={filtersOpen}
        fields={[
          {
            name: "band",
            label: "Show",
            placeholder: "All teachers",
            options: bandOptions,
          },
        ]}
        values={{ band }}
        onApply={(values) => {
          const next = values.band as
            | TeacherAttendanceControllerReportBand
            | undefined;
          setBand(
            next === TeacherAttendanceControllerReportBand.all
              ? undefined
              : next,
          );
        }}
        onClose={() => setFiltersOpen(false)}
      />

      <MobileTeacherAttendanceReportSheet
        open={sheetOpen}
        row={selected}
        onClose={() => setSheetOpen(false)}
      />
    </div>
  );
}
