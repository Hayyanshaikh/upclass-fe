import type { Exam } from "@/types/exam";

export type ExamResult = {
  id: string;
  rank: number;
  name: string;
  roll: string;
  total: number;
  maximum: number;
  grade: "A+" | "A" | "B" | "C" | "D" | "E" | "F";
  result: "Pass" | "Fail";
};
export type PublishResultsDialogProps = {
  exam: Exam;
  open: boolean;
  onClose: () => void;
  afterClose: () => void;
};
