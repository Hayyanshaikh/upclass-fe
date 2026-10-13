export type SubjectType = "Core" | "Elective";
export type SubjectStatus = "Active" | "Inactive";
export type PracticalComponent = "Yes" | "No";

export type Subject = {
  id: string;
  name: string;
  code: string;
  type: SubjectType;
  classes: number;
  teachers: number;
  status: SubjectStatus;
  hasPractical?: PracticalComponent;
  totalMarks?: number;
  passingMarks?: number;
};

export type SubjectFormValues = {
  name: string;
  code: string;
  type: SubjectType;
  status: SubjectStatus;
  hasPractical: PracticalComponent;
  totalMarks: number;
  passingMarks: number;
};

export type SubjectStore = {
  records: Subject[];
  saveSubject: (subject: Subject) => void;
  deleteSubject: (id: string) => void;
};
