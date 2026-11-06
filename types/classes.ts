import type { ClassDto, CreateClassDtoStatus } from "@/app/api/schemas";

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
  name: string;
  section: string;
  room: string;
  capacity: string | number;
  academicYearId: string;
  status: CreateClassDtoStatus;
  teacherId: string;
  assistantTeacherId?: string;
  subjects?: {
    subjectId?: string;
    teacherId?: string;
    periodsPerWeek?: string | number;
  }[];
};

export type ClassFormProps = {
  schoolClass?: ClassDto;
  onSaved?: () => void;
};

export type ClassFormError = {
  name: [keyof ClassFormValues] | ["subjects", number, "subjectId" | "teacherId" | "periodsPerWeek"];
  errors: string[];
};

export type ClassStore = {
  records: SchoolClass[];
  saveClass: (schoolClass: SchoolClass) => void;
  deleteClass: (id: string) => void;
};

export type ClassRouteParams = { id: string };
