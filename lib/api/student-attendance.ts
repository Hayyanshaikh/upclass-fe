import { isAxiosError } from "axios";
import type {
  StudentAttendanceRecordDtoStatus,
  StudentAttendanceReportRowDto,
  StudentAttendanceRowDto,
} from "@/app/api/schemas";
import type { AttendanceRow, AttendanceStatus } from "@/types/attendance";
import type { AttendanceReportRow } from "@/types/attendance-report";

const defaultAttendanceStatus: AttendanceStatus = "Present";

const statusLabels: Record<
  StudentAttendanceRecordDtoStatus,
  AttendanceStatus
> = {
  PRESENT: "Present",
  ABSENT: "Absent",
  LATE: "Late",
  LEAVE: "Leave",
};

const statusValues: Record<
  AttendanceStatus,
  StudentAttendanceRecordDtoStatus
> = {
  Present: "PRESENT",
  Absent: "ABSENT",
  Late: "LATE",
  Leave: "LEAVE",
};

export function studentAttendanceStatusValue(
  status: AttendanceStatus,
): StudentAttendanceRecordDtoStatus {
  return statusValues[status];
}

export function studentAttendanceRowManipulator(
  records: StudentAttendanceRowDto[] = [],
): AttendanceRow[] {
  return records.map((record) => ({
    id: record.studentId,
    roll: record.roll,
    name: record.name,
    status: record.status ? statusLabels[record.status] : defaultAttendanceStatus,
    remarks: record.remarks ?? "",
  }));
}

export function studentAttendanceReportRowManipulator(
  rows: StudentAttendanceReportRowDto[] = [],
): AttendanceReportRow[] {
  return rows.map((row) => ({
    id: row.studentId,
    roll: row.roll,
    name: row.name,
    days: row.days,
    present: row.present,
    absent: row.absent,
    late: row.late,
    percent: row.percent,
    status: row.status,
  }));
}

export function getStudentAttendanceErrorMessage(
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
