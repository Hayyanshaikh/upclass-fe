"use client";

import { useState } from "react";
import dayjs from "dayjs";
import { LuCheck, LuChevronRight, LuX } from "react-icons/lu";
import Button from "@/components/ui/Button";
import StatusBadge from "@/components/ui/StatusBadge";
import MobileFeedbackDialog from "@/components/mobile/dialogs/MobileFeedbackDialog";
import MobileStudentAttendanceForm from "@/components/mobile/forms/MobileStudentAttendanceForm";
import type { StudentAttendanceValues } from "@/components/mobile/forms/MobileStudentAttendanceForm";
import MobileList from "@/components/mobile/ui/MobileList";
import {
  attendancePeriodOptions,
  attendanceRows,
  attendanceStatusVariants,
} from "@/constants/attendance";
import { DISPLAY_DATE } from "@/constants/date-formats";
import { useSectionDropdown } from "@/hooks/useSectionDropdown";
import { useClassDropdown } from "@/hooks/useClassDropdown";
import { useRolePermission } from "@/hooks/useRolePermission";
import type { AttendanceRow, AttendanceStatus } from "@/types/attendance";

type AttendanceFilters = {
  classId?: string;
  sectionId?: string;
  period?: string;
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
  const [rows, setRows] = useState<AttendanceRow[]>(attendanceRows);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<Partial<AttendanceFilters>>({});
  const [editing, setEditing] = useState<AttendanceRow | null>(null);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  const { canCreate: canMark, canEdit: canEditStatus } =
    useRolePermission("student_attendance");
  const { options: classOptions } = useClassDropdown();
  const { options: sectionOptions } = useSectionDropdown();

  const searchKey = search.trim().toLowerCase();
  const visibleRows = searchKey
    ? rows.filter(
        (student) =>
          student.name.toLowerCase().includes(searchKey) ||
          student.roll.toLowerCase().includes(searchKey),
      )
    : rows;

  function handleMark(student: AttendanceRow, status: AttendanceStatus) {
    setRows((previous) =>
      previous.map((row) =>
        row.id === student.id ? { ...row, status, remarks: "" } : row,
      ),
    );
  }

  function applyDetails(values: StudentAttendanceValues) {
    if (!editing) return;

    setRows((previous) =>
      previous.map((row) =>
        row.id === editing.id ? { ...row, ...values } : row,
      ),
    );
    setEditing(null);
  }

  function handleSave() {
    setSavedMessage(`Attendance saved for ${rows.length} students.`);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-lg font-bold text-dark">Student attendance</h1>
        <span className="shrink-0 rounded-full bg-foreground px-2.5 py-1 text-xs font-semibold text-gray">
          {dayjs().format(DISPLAY_DATE)}
        </span>
      </div>

      <MobileList
        items={visibleRows}
        rowKey={(student) => student.id}
        renderItem={(student) => (
          <StudentCard
            student={student}
            canEdit={canEditStatus}
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
              placeholder: "All classes",
              options: classOptions,
            },
            {
              name: "sectionId",
              label: "Section",
              placeholder: "All sections",
              options: sectionOptions,
            },
            {
              name: "period",
              label: "Period",
              placeholder: "Full day",
              options: attendancePeriodOptions,
            },
          ],
          values: filters,
          onApply: setFilters,
        }}
        emptyText="No students found."
      />

      {canMark && (
        <Button
          fullWidth
          className="min-h-12! text-base! font-bold!"
          onClick={handleSave}
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
        open={savedMessage !== null}
        tone="success"
        message={savedMessage ?? ""}
        onClose={() => setSavedMessage(null)}
      />
    </div>
  );
}
