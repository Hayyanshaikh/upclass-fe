import type { LoginResponseUserDto } from "@/app/api/schemas";

export type UserStatus = "Active" | "Inactive";

export type UserApiItem = LoginResponseUserDto & { isSystem?: boolean };

export type UserAccount = {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: UserStatus;
  isSystem: boolean;
};

export type UserFormValues = {
  name: string;
  email: string;
  role: string;
  status: UserStatus;
  password?: string;
};

export type UserStore = {
  records: UserAccount[];
  saveUser: (user: UserAccount, originalId?: string) => void;
  deleteUser: (id: string) => void;
};

export type UserDetailsDialogProps = {
  user: UserAccount | null;
  onClose: () => void;
  onEdit: (user: UserAccount) => void;
};
