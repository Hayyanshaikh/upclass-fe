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
  details: ExamDetails;
};

export type ExamDateSheetEntry = {
  subject: string;
  date: string;
  startTime: string;
  totalMarks: number;
  passingMarks: number;
};

export type ExamDetails = {
  term: string;
  academicYear: string;
  startDate: string;
  endDate: string;
  selectedClasses: string[];
  dateSheet: ExamDateSheetEntry[];
  passingPercentage: number;
  gradingScale: string;
  showRank: string;
  notifyParents: string;
};

export type ExamFormProps = {
  exam?: Exam;
};

export type EditExamPageProps = {
  params: Promise<{ id: string }>;
};

export type ExamDetailsDialogProps = {
  exam: Exam;
  open: boolean;
  onClose: () => void;
  afterClose: () => void;
  onEdit: () => void;
};
