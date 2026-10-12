import type { Dayjs } from "dayjs";

export type AttendanceStatus = "Present" | "Absent" | "Late" | "Leave";

export type AttendanceStudent = {
  id: string;
  roll: string;
  name: string;
  className: string;
};

export type AttendanceEntry = {
  status?: AttendanceStatus;
  remarks: string;
};

export type AttendanceEntries = Record<string, AttendanceEntry>;

export type AttendanceRow = {
  id: string;
  roll: string;
  name: string;
  status?: AttendanceStatus;
  remarks: string;
};

export type AttendanceFilters = {
  grade: string;
  section: string;
  date: Dayjs | null;
  period: string;
};

export type AttendanceStore = {
  saved: Record<string, AttendanceEntries>;
  drafts: Record<string, AttendanceEntries>;
  updateEntry: (
    key: string,
    studentId: string,
    patch: Partial<AttendanceEntry>,
  ) => void;
  saveDraft: (key: string) => void;
};

export type AttendanceReportProps = {
  open: boolean;
  title: string;
  period: string;
  rows: AttendanceRow[];
  unsaved: boolean;
  onClose: () => void;
};
