export type TeacherStatus = "Active" | "Inactive" | "Unknown";

export type TeacherAccount = {
  id: string;
  name: string;
  employeeId: string;
  email: string;
  phone: string;
  employmentType: string;
  isActive: TeacherStatus;
  isSystem: boolean;
};
