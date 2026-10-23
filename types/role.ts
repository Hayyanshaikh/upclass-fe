import type { RoleDataDto, RoleListItemDto } from "@/app/api/schemas";

export type SchoolRole = {
  id: string;
  name: string;
  description: string;
  users: number;
  type: "System role" | "Custom";
  assignedUsers: string[];
  permissions: Record<string, RoleAction[]>;
};

export type RoleAction = "View" | "Create" | "Edit" | "Delete";

export type RoleFormValues = {
  name: string;
  description?: string;
};

export type RoleFormProps = {
  role?: RoleDataDto;
};

export type RoleDetailsDialogProps = {
  role: RoleListItemDto | null;
  onClose: () => void;
  onEdit: (role: RoleListItemDto) => void;
};

export type RoleStore = {
  records: SchoolRole[];
  saveRole: (role: SchoolRole, originalId?: string) => void;
  deleteRole: (id: string) => void;
  duplicateRole: (id: string) => void;
};
