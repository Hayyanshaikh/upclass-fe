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

export type ClassRecord = {
  id: string;
  name: string;
  section: string;
  label: string;
  room: string;
  capacity: number;
  academicYear: string;
  status: "Active" | "Inactive";
  teacherId: string;
  teacherName: string;
  assistantTeacherId: string | null;
  assistantTeacherName: string | null;
};

export type ClassDetailsDialogProps = {
  classId: string | null;
  teacherNames: Record<string, string>;
  onClose: () => void;
  onEdit: (record: ClassRecord) => void;
};
