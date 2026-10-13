import type { ReactNode } from "react";
import type { FilterField } from "@/types/table-toolbar";

export type TimetableDay = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday";

export type TimetableSubjectKey = "mathematics" | "english" | "science" | "urdu" | "computer" | "islamiyat" | "physical";

export type TimetableSubject = {
  name: string;
  teacher: string;
  room: string;
  colorClass: string;
};

export type TimetablePeriod = {
  id: string;
  type: "period";
  label: string;
  time: string;
  subjects: Record<TimetableDay, TimetableSubjectKey>;
};

export type TimetableBreak = {
  id: string;
  type: "break";
  time: string;
};

export type TimetableRow = TimetablePeriod | TimetableBreak;

export type LessonCardProps = {
  title: string;
  subtitle?: string;
  room?: string;
  colorClass?: string;
  free?: boolean;
  onClick?: () => void;
  ariaLabel?: string;
};
export type TimetableGridProps = {
  rows: TimetableRow[];
  filterFields: FilterField[];
  beforeTable?: ReactNode;
  renderLesson: (row: TimetableRow, day: TimetableDay) => ReactNode;
  interactive?: boolean;
};

export type TimetableFilters = {
  grade: string;
  section: string;
  term: string;
  teacherId?: string;
  subject?: string;
};

export type TimetableAssignment = {
  classId: string;
  term: string;
  periodId: string;
  day: TimetableDay;
  subject: string;
  teacherId: string;
  room: string;
};

export type TimetableSlot = {
  classId: string;
  term: string;
  periodId: string;
  day: TimetableDay;
  label: string;
  time: string;
};

export type PeriodFormValues = {
  subject: string;
  teacherId: string;
  room: string;
};

export type AssignPeriodDialogProps = {
  slot: TimetableSlot;
  open: boolean;
  onClose: () => void;
  afterClose: () => void;
};

export type TimetableStore = {
  assignments: TimetableAssignment[];
  savePeriod: (slot: TimetableSlot, values: PeriodFormValues) => boolean;
  clearPeriod: (slot: TimetableSlot) => void;
};
