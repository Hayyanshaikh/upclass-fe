export type Student = {
  id: string;
  name: string;
  roll: string;
  className: string;
  guardian: string;
  phone: string;
  fees: "Paid" | "Pending" | "Overdue";
  dateOfBirth?: string;
  gender?: string;
  admissionDate?: string;
  firstName?: string;
  lastName?: string;
  identityNumber?: string;
  bloodGroup?: string;
  status?: string;
  relation?: string;
  email?: string;
  address?: string;
  photo?: string;
};

export type StudentRouteParams = {
  id: string;
};

export type StudentDetailsDialogProps = {
  student: Student | null;
  onClose: () => void;
  onEdit?: (student: Student) => void;
};

