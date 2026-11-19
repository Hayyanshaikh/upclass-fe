"use client";

import { useEffect, useState } from "react";
import dayjs from "dayjs";
import type { Dayjs } from "dayjs";
import { LuCheck, LuChevronLeft, LuChevronRight, LuX } from "react-icons/lu";
import Button from "@/components/ui/Button";
import StatusBadge from "@/components/ui/StatusBadge";
import MobileFeedbackDialog from "@/components/mobile/dialogs/MobileFeedbackDialog";
import MobileStudentAttendanceForm from "@/components/mobile/forms/MobileStudentAttendanceForm";
import type { StudentAttendanceValues } from "@/components/mobile/forms/MobileStudentAttendanceForm";
import MobileIconButton from "@/components/mobile/ui/MobileIconButton";
import MobileList from "@/components/mobile/ui/MobileList";
import { attendanceStatusVariants } from "@/constants/attendance";
import { DISPLAY_DATE } from "@/constants/date-formats";
import { useClassDropdown } from "@/hooks/useClassDropdown";
import { useClassSectionDropdown } from "@/hooks/useClassSectionDropdown";
import { useRolePermission } from "@/hooks/useRolePermission";
import { useTable } from "@/hooks/useTable";
import {
  getStudentAttendanceErrorMessage,
  studentAttendanceRowManipulator,
  studentAttendanceStatusValue,
} from "@/lib/api/student-attendance";
import {
  useStudentAttendanceControllerFindAll,
  useStudentAttendanceControllerSaveBulk,
} from "@/app/api/endpoints";
import type { AttendanceRow, AttendanceStatus } from "@/types/attendance";

// Backend pages the roster at 10 by default; load the whole class so one save covers every student.
const ROSTER_LIMIT = 200;

type AttendanceFilters = {
  classId?: string;
  classSectionId?: string;
};

type Feedback = {
  tone: "success" | "error";
  message: string;
};

type StudentCardProps = {
  student: AttendanceRow;
  canEdit: boolean;
  onMark: (student: AttendanceRow, status: AttendanceStatus) => void;
  onOpenDetails: (student: AttendanceRow) => void;
};

const quickActions = [
  {
    status: "Present",
    label: "Present",
    icon: LuCheck,
    selected: "border-primary bg-primary text-background",
  },
  {
    status: "Absent",
    label: "Absent",
    icon: LuX,
    selected: "border-danger bg-danger text-background",
  },
] as const;

function StudentCard({
  student,
  canEdit,
  onMark,
  onOpenDetails,
}: StudentCardProps) {
  const header = (
    <>
      <span
        aria-hidden="true"
        className="flex size-9 shrink-0 items-center justify-center rounded-full bg-success/10 text-xs font-bold text-primary"
      >
        {student.roll}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-dark">
          {student.name}
        </p>
        <p className="mt-0.5 truncate text-xs text-gray">
          Roll {student.roll}
          {student.remarks ? ` · ${student.remarks}` : ""}
        </p>
      </div>
      <StatusBadge variant={attendanceStatusVariants[student.status]}>
        {student.status}
      </StatusBadge>
    </>
  );

  return (
    <div className="rounded-lg border border-border bg-background p-4">
      {canEdit ? (
        <button
          type="button"
          aria-label={`Open details for ${student.name}`}
          onClick={() => onOpenDetails(student)}
          className="flex w-full items-center gap-3 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          {header}
          <LuChevronRight
            size={18}
            className="shrink-0 text-gray"
            aria-hidden="true"
          />
        </button>
      ) : (
        <div className="flex items-center gap-3">{header}</div>
      )}

      {canEdit && (
        <div className="mt-3 grid grid-cols-2 gap-2">
          {quickActions.map((action) => {
            const Icon = action.icon;
            const isSelected = student.status === action.status;

            return (
              <button
                key={action.status}
                type="button"
                aria-label={`Mark ${action.label.toLowerCase()}: ${student.name}`}
                aria-pressed={isSelected}
                onClick={() => onMark(student, action.status)}
                className={`flex h-9 items-center justify-center gap-1.5 rounded-md border text-xs font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:opacity-80 ${
                  isSelected
                    ? action.selected
                    : "border-border bg-background text-gray"
                }`}
              >
                <Icon size={16} aria-hidden="true" />
                {action.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function MobileStudentAttendance() {
  const [date, setDate] = useState<Dayjs>(() => dayjs());
  const [statuses, setStatuses] = useState<Record<string, AttendanceStatus>>({});
  const [remarks, setRemarks] = useState<Record<string, string>>({});
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<AttendanceRow | null>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  const { canCreate: canMark } = useRolePermission("student_attendance");

  const { filters, setFilters } = useTable<AttendanceFilters>({});

  const { options: classOptions } = useClassDropdown();
  const { options: sectionOptions } = useClassSectionDropdown(filters.classId);

  useEffect(() => {
    if (filters.classId || classOptions.length === 0) return;
    setFilters({ classId: classOptions[0].value });
  }, [classOptions, filters.classId, setFilters]);

  const classId = filters.classId ?? "";
  const dateValue = date.format("YYYY-MM-DD");
  const isToday = date.isSame(dayjs(), "day");

  const { data, isFetching, isError, refetch } =
    useStudentAttendanceControllerFindAll(
      {
        classId,
        classSectionId: filters.classSectionId,
        date: dateValue,
        limit: ROSTER_LIMIT,
      },
      { query: { enabled: Boolean(classId && dateValue) } },
    );

  useEffect(() => {
    if (!data) return;

    const nextStatuses: Record<string, AttendanceStatus> = {};
    const nextRemarks: Record<string, string> = {};

    for (const row of studentAttendanceRowManipulator(data.data)) {
      nextStatuses[row.id] = row.status;
      nextRemarks[row.id] = row.remarks;
    }

    setStatuses(nextStatuses);
    setRemarks(nextRemarks);
  }, [data]);

  const { mutateAsync: saveAttendance, isPending: isSaving } =
    useStudentAttendanceControllerSaveBulk();

  const rows = studentAttendanceRowManipulator(data?.data).map((row) => ({
    ...row,
    status: statuses[row.id] ?? row.status,
    remarks: remarks[row.id] ?? row.remarks,
  }));

  const searchKey = search.trim().toLowerCase();
  const visibleRows = searchKey
    ? rows.filter(
        (student) =>
          student.name.toLowerCase().includes(searchKey) ||
          student.roll.toLowerCase().includes(searchKey),
      )
    : rows;

  function applyFilters(next: Partial<AttendanceFilters>) {
    if (next.classId !== filters.classId) {
      setFilters({ ...next, classSectionId: undefined });
      return;
    }
    setFilters(next);
  }

  function handleMark(student: AttendanceRow, status: AttendanceStatus) {
    setStatuses((previous) => ({ ...previous, [student.id]: status }));
    setRemarks((previous) => ({ ...previous, [student.id]: "" }));
  }

  function applyDetails(values: StudentAttendanceValues) {
    if (!editing) return;

    setStatuses((previous) => ({ ...previous, [editing.id]: values.status }));
    setRemarks((previous) => ({ ...previous, [editing.id]: values.remarks }));
    setEditing(null);
  }

  async function handleSave() {
    if (!classId || !dateValue || isSaving) return;

    try {
      const result = await saveAttendance({
        data: {
          classId,
          date: dateValue,
          records: rows.map((row) => ({
            studentId: row.id,
            status: studentAttendanceStatusValue(row.status),
            remarks: row.remarks || undefined,
          })),
        },
      });

      setFeedback({
        tone: "success",
        message: result.message || `${rows.length} students' attendance saved.`,
      });
      void refetch();
    } catch (error) {
      setFeedback({
        tone: "error",
        message: getStudentAttendanceErrorMessage(
          error,
          "Unable to save attendance. Please try again.",
        ),
      });
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-lg font-bold text-dark">Student attendance</h1>

      <div className="flex h-11 items-center justify-between gap-2 rounded-lg border border-border bg-background px-2">
        <MobileIconButton
          variant="ghost"
          label="Previous day"
          onClick={() => setDate((current) => current.subtract(1, "day"))}
        >
          <LuChevronLeft size={20} aria-hidden="true" />
        </MobileIconButton>
        <p className="text-sm font-semibold text-dark">
          {date.format(DISPLAY_DATE)}
        </p>
        {isToday ? (
          <span className="size-9" aria-hidden="true" />
        ) : (
          <MobileIconButton
            variant="ghost"
            label="Next day"
            onClick={() => setDate((current) => current.add(1, "day"))}
          >
            <LuChevronRight size={20} aria-hidden="true" />
          </MobileIconButton>
        )}
      </div>

      <MobileList
        items={visibleRows}
        rowKey={(student) => student.id}
        renderItem={(student) => (
          <StudentCard
            student={student}
            canEdit={canMark}
            onMark={handleMark}
            onOpenDetails={setEditing}
          />
        )}
        search={{
          placeholder: "Search by student name or roll",
          onChange: setSearch,
        }}
        filters={{
          fields: [
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
          ],
          values: filters,
          onApply: applyFilters,
        }}
        loading={isFetching && rows.length === 0 && !isError}
        error={isError && rows.length === 0}
        onRetry={() => void refetch()}
        emptyText="No students found."
      />

      {canMark && (
        <Button
          fullWidth
          className="min-h-12! text-base! font-bold!"
          loading={isSaving}
          disabled={!classId || !dateValue || rows.length === 0}
          onClick={() => void handleSave()}
        >
          Save attendance
        </Button>
      )}

      <MobileStudentAttendanceForm
        open={editing !== null}
        student={editing}
        onClose={() => setEditing(null)}
        onApply={applyDetails}
      />

      <MobileFeedbackDialog
        open={feedback !== null}
        tone={feedback?.tone ?? "success"}
        message={feedback?.message ?? ""}
        onClose={() => setFeedback(null)}
      />
    </div>
  );
}
