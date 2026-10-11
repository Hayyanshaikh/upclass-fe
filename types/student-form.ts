import type { Dayjs } from "dayjs";
import type { Student } from "@/types/student";

export type StudentFormValues = {
  firstName: string;
  lastName: string;
  dateOfBirth?: Dayjs;
  gender?: string;
  identityNumber?: string;
  bloodGroup?: string;
  className: string;
  section: string;
  roll: string;
  admissionDate?: Dayjs;
  status: string;
  guardian: string;
  relation: string;
  phone: string;
  email?: string;
  address?: string;
  photo?: string;
};

export type StudentFormProps = {
  initialValues?: StudentFormValues;
  student?: Student;
  onSave?: (values: StudentFormValues) => Promise<void> | void;
};
