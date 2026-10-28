import type { Dayjs } from "dayjs";
import type {
  CreateTeacherDtoEmploymentType,
  CreateTeacherDtoGender,
  CreateTeacherDtoMaritalStatus,
  TeacherDto,
  TeachersControllerFindAllStatus,
} from "@/app/api/schemas";
import type { TeacherAccount } from "@/types/teacher-management";
import { UploadFile } from "antd";

export type Teacher = {
  id: string;
  name: string;
  subject: string;
  classes: string[];
  phone: string;
  employment: "Full-time" | "Part-time" | "Contract";
  status: "Active" | "On leave" | "Inactive";
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  gender?: string;
  identityNumber?: string;
  maritalStatus?: string;
  qualification?: string;
  joiningDate?: string;
  email?: string;
  address?: string;
  photo?: string;
};

export type TeacherDocumentFormValue = {
  documentName: string;

  documentUrl?: string;
  file?: UploadFile[];
};

export type TeacherFormValues = {
  firstName: string;
  lastName?: string;
  image?: File | string | null;
  dateOfBirth?: Dayjs | null;
  gender?: CreateTeacherDtoGender;
  cnicNo?: string;
  maritalStatus?: CreateTeacherDtoMaritalStatus;
  employeeId?: string;
  qualification?: string;
  joiningDate?: Dayjs | null;
  employmentType?: CreateTeacherDtoEmploymentType;
  status?: TeachersControllerFindAllStatus;
  phone?: string;
  email: string;
  address?: string;
  bankName?: string;
  accountNumber?: string;
  documents: TeacherDocumentFormValue[];
};

export type TeacherFormProps = {
  teacher?: TeacherDto;
  onSaved?: () => Promise<unknown>;
};

export type TeacherStore = {
  records: Teacher[];
  saveTeacher: (teacher: Teacher, originalId?: string) => void;
  deleteTeacher: (id: string) => void;
};

export type TeacherRouteParams = {
  id: string;
};

export type TeacherDetailsDialogProps = {
  teacher: TeacherAccount | null;
  onClose: () => void;
  onEdit: (teacher: TeacherAccount) => void;
};
