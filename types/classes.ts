export type ClassSubject = {
  subject: string;
  teacherId: string;
  periodsPerWeek: number;
};

export type SchoolClass = {
  id: string;
  grade: string;
  section: string;
  teacherId: string;
  assistantTeacherId?: string;
  students: number;
  room: string;
  capacity: number;
  academicYear: string;
  status: "Active" | "Inactive";
  subjects: ClassSubject[];
};

export type ClassFormValues = {
  grade: string;
  section: string;
  room: string;
  capacity: string | number;
  academicYear: string;
  status: SchoolClass["status"];
  teacherId: string;
  assistantTeacherId?: string;
  subjects?: {
    subject?: string;
    teacherId?: string;
    periodsPerWeek?: string | number;
  }[];
};

export type ClassFormProps = {
  schoolClass?: SchoolClass;
};

export type ClassFormError = {
  name: [keyof ClassFormValues] | ["subjects", number, "subject" | "teacherId" | "periodsPerWeek"];
  errors: string[];
};

export type ClassStore = {
  records: SchoolClass[];
  saveClass: (schoolClass: SchoolClass) => void;
  deleteClass: (id: string) => void;
};

export type ClassRouteParams = { id: string };

export type ClassDetailsDialogProps = {
  schoolClass: SchoolClass | null;
  onClose: () => void;
  onEdit: (schoolClass: SchoolClass) => void;
};
