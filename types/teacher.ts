import type { Dayjs } from "dayjs";

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

export type TeacherFormValues = {
  firstName: string;
  lastName: string;
  dateOfBirth?: Dayjs;
  gender?: string;
  identityNumber?: string;
  maritalStatus?: string;
  employeeId: string;
  subject: string;
  assignedClasses?: Record<string, boolean>;
  qualification?: string;
  joiningDate?: Dayjs;
  phone: string;
  employment: Teacher["employment"];
  status: Teacher["status"];
  email?: string;
  address?: string;
  photo?: string;
};

export type TeacherFormProps = {
  teacher?: Teacher;
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
  teacher: Teacher | null;
  onClose: () => void;
  onEdit: (teacher: Teacher) => void;
};
