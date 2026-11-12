import type {
  ClassDto,
  ClassesControllerFindAllStatus,
} from "@/app/api/schemas";

export type ClassFilters = {
  teacher?: string;
  status?: ClassesControllerFindAllStatus;
};

export type ClassesListResponse = {
  statusCode: number;
  message: string;
  data: ClassDto[];
  total: number;
  warning?: string;
};

export type ClassSectionRecord = {
  id: string;
  sectionId: string;
  section: string;
  teacherId: string;
  teacherName: string;
  room: string | null;
  capacity: number | null;
};

export type ClassRecord = {
  id: string;
  name: string;
  label: string;
  academicYear: string;
  status: "Active" | "Inactive";
  sections: ClassSectionRecord[];
};

export type ClassDetailsDialogProps = {
  classId: string | null;
  teacherNames: Record<string, string>;
  onClose: () => void;
  onEdit: (record: ClassRecord) => void;
};
