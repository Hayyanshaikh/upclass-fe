import type { ClassDto, CreateClassDtoStatus } from "@/app/api/schemas";

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
};

export type ClassSectionFormValues = {
  sectionId: string;
  teacherId: string;
  room?: string;
  capacity?: string | number;
};

export type ClassFormValues = {
  name: string;
  academicYearId: string;
  status: CreateClassDtoStatus;
  sections: ClassSectionFormValues[];
};

export type ClassFormProps = {
  schoolClass?: ClassDto;
  onSaved?: () => void;
};

export type ClassFormError = {
  name: [keyof ClassFormValues];
  errors: string[];
};

export type ClassStore = {
  records: SchoolClass[];
  saveClass: (schoolClass: SchoolClass) => void;
  deleteClass: (id: string) => void;
};

export type ClassRouteParams = { id: string };
