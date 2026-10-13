import type { ExamResult } from "@/types/exam-results";

export type ResultCardSubject = {
  subject: string;
  total: number;
  passing: number;
  obtained: number;
  grade: ExamResult["grade"];
};

export type ResultCardDetails = {
  guardian: string;
  className: string;
  remarks: string;
  subjects: ResultCardSubject[];
};
