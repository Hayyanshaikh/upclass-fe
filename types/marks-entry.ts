import type { Exam } from "@/types/exam";

export type MarksEntryStudent = {
  id: string;
  roll: string;
  name: string;
  marks?: number;
  absent: boolean;
  remarks: string;
};

export type MarksEntryProps = {
  exam: Exam;
};

export type MarksEntryCellProps = {
  student: MarksEntryStudent;
  totalMarks: number;
};

