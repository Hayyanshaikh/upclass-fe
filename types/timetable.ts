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
};
export type TeacherTimetableLesson = {
  className: string;
  room: string;
};

export type TeacherTimetablePeriod = {
  id: string;
  type: "period";
  label: string;
  time: string;
  lessons: Record<TimetableDay, TeacherTimetableLesson | null>;
};

export type TeacherTimetableRow = TeacherTimetablePeriod | TimetableBreak;

export type TimetableGridProps<T extends TimetableRow | TeacherTimetableRow> = {
  rows: T[];
  filterFields: FilterField[];
  beforeTable?: ReactNode;
  renderLesson: (row: T, day: TimetableDay) => ReactNode;
};
