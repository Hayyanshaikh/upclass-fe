import { isAxiosError } from "axios";
import type {
  TeacherAttendanceDto,
  TeacherAttendanceDtoSource,
  TeacherAttendanceDtoStatus,
  TeacherAttendanceReportRowDto,
} from "@/app/api/schemas";
import type {
  TeacherAttendanceReportRow,
  TeacherAttendanceRow,
  TeacherAttendanceStatus,
} from "@/types/teacher-attendance";

const statusLabels: Record<TeacherAttendanceDtoStatus, TeacherAttendanceStatus> = {
  PRESENT: "Present",
  ABSENT: "Absent",
  LATE: "Late",
  LEAVE: "Leave",
};

const sourceLabels: Record<TeacherAttendanceDtoSource, string> = {
  SELF_CHECK_IN: "Self check-in",
  LEAVE_REQUEST: "Leave request (approved)",
  ADMIN_EDIT: "Edited by admin",
  AUTO_ABSENT: "No check-in (auto)",
};

export function teacherAttendanceStatusLabel(
  status: TeacherAttendanceDtoStatus,
): TeacherAttendanceStatus {
  return statusLabels[status];
}

function workedHours(checkIn: string | null, checkOut: string | null) {
  if (!checkIn) return undefined;
  if (!checkOut) return "Working";

  const [inHours, inMinutes] = checkIn.split(":").map(Number);
  const [outHours, outMinutes] = checkOut.split(":").map(Number);
  const minutes = Math.max(
    0,
    outHours * 60 + outMinutes - (inHours * 60 + inMinutes),
  );

  return `${Math.floor(minutes / 60)}h ${String(minutes % 60).padStart(2, "0")}m`;
}

export function toTeacherAttendanceRow(
  record: TeacherAttendanceDto,
): TeacherAttendanceRow {
  const teacherName = record.teacher
    ? `${record.teacher.firstName} ${record.teacher.lastName ?? ""}`.trim()
    : "—";

  return {
    id: record.id,
    teacherId: record.teacherId,
    employeeId: record.teacher?.employeeId ?? "—",
    teacher: teacherName,
    status: statusLabels[record.status],
    lateMinutes: record.lateMinutes ?? undefined,
    checkIn: record.checkIn ?? undefined,
    checkOut: record.checkOut ?? undefined,
    hours: workedHours(record.checkIn, record.checkOut),
    source: sourceLabels[record.source],
    date: record.date.slice(0, 10),
    remarks: record.remarks ?? undefined,
  };
}

export function teacherAttendanceRowManipulator(
  records: TeacherAttendanceDto[] = [],
): TeacherAttendanceRow[] {
  return records.map(toTeacherAttendanceRow);
}

export function teacherAttendanceReportRowManipulator(
  rows: TeacherAttendanceReportRowDto[] = [],
): TeacherAttendanceReportRow[] {
  return rows.map((row) => ({
    teacherId: row.teacherId,
    id: row.employeeId ?? "—",
    teacher: row.teacherName,
    days: row.days,
    present: row.present,
    absent: row.absent,
    late: row.late,
    leave: row.leave,
    percent: row.percent,
    status: row.status,
  }));
}

export function getTeacherAttendanceErrorMessage(
  error: unknown,
  fallback: string,
) {
  if (isAxiosError(error)) {
    const body = error.response?.data as
      | { message?: string; data?: { errors?: string[] } }
      | undefined;

    return body?.data?.errors?.[0] ?? body?.message ?? fallback;
  }

  return error instanceof Error ? error.message : fallback;
}
