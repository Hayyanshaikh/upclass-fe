import type { FormInstance } from "antd";

export type Teacher = {
  id: string;
  name: string;
  subject: string;
  classes: string[];
  phone: string;
  employment: "Full-time" | "Part-time" | "Contract";
  status: "Active" | "On leave" | "Inactive";
};

export type TeacherFormValues = {
  name: string;
  subject: string;
  classes: string;
  phone: string;
  employment: Teacher["employment"];
  status: Teacher["status"];
};

export type TeacherFormProps = {
  form: FormInstance<TeacherFormValues>;
  onSave: (values: TeacherFormValues) => void;
};

export type TeacherFormDialogProps = {
  open: boolean;
  teacher: Teacher | null;
  onClose: () => void;
  onSave: (values: TeacherFormValues) => void;
};

export type TeacherDetailsDialogProps = {
  teacher: Teacher | null;
  onClose: () => void;
  onEdit: (teacher: Teacher) => void;
};
