export type ExamStatus = "Scheduled" | "Ongoing" | "Marks pending" | "Completed" | "Results published";

export type ExamType = "Mid-term" | "Monthly test" | "Quiz" | "Practical" | "Unit test";

export type Exam = {
  id: string;
  name: string;
  classes: string;
  dates: string;
  subjects: number;
  type: ExamType;
  status: ExamStatus;
};
