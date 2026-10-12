import type { AttendanceRow } from "@/types/attendance";

export function attendanceDate() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Karachi", year: "numeric", month: "2-digit", day: "2-digit",
  }).format(new Date());
}

export function attendanceKey(className: string, date: string, period: string) {
  return JSON.stringify([className, date, period]);
}

export function attendanceSummary(rows: AttendanceRow[]) {
  const present = rows.filter((row) => row.status === "Present").length;
  const absent = rows.filter((row) => row.status === "Absent").length;
  const late = rows.filter((row) => row.status === "Late").length;
  const leave = rows.filter((row) => row.status === "Leave").length;
  return {
    total: rows.length, present, absent, late, leave,
    unmarked: rows.length - present - absent - late - leave,
  };
}
