"use client";

import { useEffect, useState } from "react";
import dayjs from "dayjs";
import type { Dayjs } from "dayjs";
import {
  LuChevronLeft,
  LuChevronRight,
  LuSlidersHorizontal,
} from "react-icons/lu";
import StatusBadge from "@/components/ui/StatusBadge";
import MobileIconButton from "@/components/mobile/ui/MobileIconButton";
import MobileList from "@/components/mobile/ui/MobileList";
import MobileListFilters from "@/components/mobile/ui/MobileListFilters";
import MobileStudentAttendanceReportSheet from "@/components/mobile/attendance/MobileStudentAttendanceReportSheet";
import { attendanceReportVariants } from "@/constants/attendance-report";
import { useClassDropdown } from "@/hooks/useClassDropdown";
import { useClassSectionDropdown } from "@/hooks/useClassSectionDropdown";
import { useTable } from "@/hooks/useTable";
import { studentAttendanceReportRowManipulator } from "@/lib/api/student-attendance";
import { useStudentAttendanceControllerReport } from "@/app/api/endpoints";
import { StudentAttendanceControllerReportBand } from "@/app/api/schemas";
import type { AttendanceReportRow } from "@/types/attendance-report";

type ReportFilters = {
  classId?: string;
  classSectionId?: string;
  band?: StudentAttendanceControllerReportBand;
};

const bandOptions = [
  { label: "All students", value: StudentAttendanceControllerReportBand.all },
  { label: "Below 75%", value: StudentAttendanceControllerReportBand.low },
  {
    label: "Watch (75–89%)",
    value: StudentAttendanceControllerReportBand.watch,
  },
  {
    label: "Good (90% and above)",
    value: StudentAttendanceControllerReportBand.good,
  },
  {
    label: "Perfect attendance",
    value: StudentAttendanceControllerReportBand.perfect,
  },
];

function mergeRows(
  current: AttendanceReportRow[],
  incoming: AttendanceReportRow[],
) {
  const seen = new Set(current.map((row) => row.id));
  return [...current, ...incoming.filter((row) => !seen.has(row.id))];
}

export default function MobileStudentAttendanceReport() {
  const [month, setMonth] = useState<Dayjs>(() => dayjs().startOf("month"));
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selected, setSelected] = useState<AttendanceReportRow | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [rows, setRows] = useState<AttendanceReportRow[]>([]);

  const { filters, setFilters, page, pageSize, offset, setPage } =
    useTable<ReportFilters>({ pageSize: 10 });

  const { options: classOptions } = useClassDropdown();
  const { options: sectionOptions } = useClassSectionDropdown(filters.classId);

  useEffect(() => {
    if (filters.classId || classOptions.length === 0) return;
    setFilters({ classId: classOptions[0].value });
  }, [classOptions, filters.classId, setFilters]);

  const classId = filters.classId ?? "";

  const { data, isFetching, isError, refetch } =
    useStudentAttendanceControllerReport(
      {
        month: month.format("YYYY-MM"),
        classId,
        classSectionId: filters.classSectionId,
        band: filters.band,
        limit: pageSize,
        offset,
      },
      { query: { enabled: Boolean(classId) } },
    );

  const responseData = data?.data;
  const total = data?.total ?? 0;
  const lastPage = Math.max(1, Math.ceil(total / pageSize));

  useEffect(() => {
    if (!responseData) return;
    const incoming = studentAttendanceReportRowManipulator(responseData);
    setRows((previous) => (page === 1 ? incoming : mergeRows(previous, incoming)));
  }, [responseData, page]);

  const summary = data?.summary;

  function changeMonth(step: number) {
    setMonth((current) => current.add(step, "month"));
    setPage(1);
  }

  function applyFilters(next: Partial<ReportFilters>) {
    const band =
      next.band === StudentAttendanceControllerReportBand.all
        ? undefined
        : next.band;

    if (next.classId !== filters.classId) {
      setFilters({ ...next, band, classSectionId: undefined });
      return;
    }
    setFilters({ ...next, band });
  }

  function openDetails(row: AttendanceReportRow) {
    setSelected(row);
    setSheetOpen(true);
  }

  const summaryStats = [
    { label: "Average", value: `${summary?.averagePercent ?? 0}%` },
    { label: "Days", value: summary?.workingDays ?? 0 },
    { label: "Below 75%", value: summary?.below75Count ?? 0 },
    { label: "Perfect", value: summary?.perfectCount ?? 0 },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <MobileIconButton
          variant="ghost"
          href="/attendance/students"
          label="Back to student attendance"
        >
          <LuChevronLeft size={22} aria-hidden="true" />
        </MobileIconButton>
        <h1 className="text-lg font-bold text-dark">Attendance report</h1>
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
          label={
            filters.classSectionId || filters.band
              ? `Filters, ${Number(Boolean(filters.classSectionId)) + Number(Boolean(filters.band))} active`
              : "Filters"
          }
          onClick={() => setFiltersOpen(true)}
          className="relative"
        >
          <LuSlidersHorizontal size={20} aria-hidden="true" />
          {(filters.classSectionId || filters.band) && (
            <span className="absolute -top-1.5 -right-1.5 flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-background">
              {Number(Boolean(filters.classSectionId)) +
                Number(Boolean(filters.band))}
            </span>
          )}
        </MobileIconButton>
      </div>

      <dl className="grid grid-cols-4 divide-x divide-border rounded-lg border border-border bg-background text-center">
        {summaryStats.map((stat) => (
          <div key={stat.label} className="min-w-0 px-1 py-2.5">
            <dt className="truncate text-[11px] font-semibold text-gray">
              {stat.label}
            </dt>
            <dd className="mt-0.5 text-sm font-bold tabular-nums text-dark">
              {stat.value}
            </dd>
          </div>
        ))}
      </dl>

      <MobileList
        items={rows}
        rowKey={(row) => row.id}
        renderItem={(row) => (
          <button
            type="button"
            aria-label={`View ${row.name} attendance details`}
            onClick={() => openDetails(row)}
            className="flex w-full items-center gap-3 rounded-lg border border-border bg-background p-4 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:bg-foreground"
          >
            <span
              className="flex size-9 shrink-0 items-center justify-center rounded-full bg-success/10 font-bold text-primary"
              aria-hidden="true"
            >
              {row.name.charAt(0)}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-dark">
                {row.name}
              </p>
              <p className="truncate text-xs text-gray">
                Roll {row.roll} · {row.percent}% attendance
              </p>
            </div>
            <StatusBadge variant={attendanceReportVariants[row.status]}>
              {row.status}
            </StatusBadge>
            <LuChevronRight
              size={18}
              className="shrink-0 text-gray"
              aria-hidden="true"
            />
          </button>
        )}
        loading={isFetching && rows.length === 0 && !isError}
        error={isError && rows.length === 0}
        onRetry={() => void refetch()}
        hasMore={page < lastPage && rows.length > 0}
        onLoadMore={() => setPage(page + 1)}
        emptyText={`No attendance records for ${month.format("MMMM YYYY")}.`}
      />

      <MobileListFilters
        open={filtersOpen}
        fields={[
          {
            name: "classId",
            label: "Class",
            placeholder: "Select class",
            options: classOptions,
          },
          {
            name: "classSectionId",
            label: "Section",
            placeholder: "All sections",
            options: sectionOptions,
          },
          {
            name: "band",
            label: "Show",
            placeholder: "All students",
            options: bandOptions,
          },
        ]}
        values={filters}
        onApply={(values) => applyFilters(values as Partial<ReportFilters>)}
        onClose={() => setFiltersOpen(false)}
      />

      <MobileStudentAttendanceReportSheet
        open={sheetOpen}
        row={selected}
        onClose={() => setSheetOpen(false)}
      />
    </div>
  );
}
