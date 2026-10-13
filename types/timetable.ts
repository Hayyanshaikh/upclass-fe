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
  subject: TimetableSubject;
};
