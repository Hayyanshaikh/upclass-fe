import type { ReactNode } from "react";
import type { FilterField } from "@/types/table-toolbar";

export type TimetableDay = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";

export type TimetableDayOption = {
  key: TimetableDay;
  label: string;
};

export type TimetablePeriod = {
  id: string;
  type: "period";
  label: string;
  time: string;
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
  free?: boolean;
  onClick?: () => void;
  ariaLabel?: string;
};
export type TimetableGridProps = {
  rows: TimetableRow[];
  days: TimetableDayOption[];
  filterFields: FilterField[];
  beforeTable?: ReactNode;
  renderLesson: (row: TimetableRow, day: TimetableDay) => ReactNode;
  interactive?: boolean;
  loading?: boolean;
};

export type TimetableSelection = {
  class: string;
  section: string;
  term: string;
  teacherId?: string;
  subject?: string;
};

export type TimetableSlot = {
  classSectionId: string;
  classSectionName: string;
  academicTermId: string;
  periodId: string;
  day: TimetableDay;
  label: string;
  time: string;
};

export type PeriodFormValues = {
  subjectId: string;
  teacherId: string;
};

export type AssignPeriodDialogProps = {
  slot: TimetableSlot;
  open: boolean;
  onClose: () => void;
  afterClose: () => void;
};
