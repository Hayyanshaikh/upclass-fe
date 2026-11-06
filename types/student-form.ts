import type { Dayjs } from "dayjs";
import type {
  CreateStudentDtoGender,
  CreateStudentDtoStatus,
  StudentDto,
} from "@/app/api/schemas";

export type StudentFormValues = {
  firstName: string;
  lastName: string;
  dateOfBirth?: Dayjs | null;
  gender?: CreateStudentDtoGender;
  identityNumber?: string;
  bloodGroup?: string;
  classId: string;
  roll: string;
  admissionDate?: Dayjs | null;
  status: CreateStudentDtoStatus;
  guardian: string;
  relation: string;
  phone: string;
  email?: string;
  address?: string;
  photo?: File | string | null;
};

export type StudentFormProps = {
  student?: StudentDto;
};
