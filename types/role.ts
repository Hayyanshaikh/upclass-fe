import type {
  PermissionDataDto,
  RoleDetailDataDto,
  RoleListItemDto,
} from "@/app/api/schemas";

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

export type RoleReassignmentValues = {
  targetRoleId: string;
};

export type RoleAssignedUsersSectionProps = {
  roleId: string;
  roleName: string;
  disabled: boolean;
  isMoving: boolean;
  onMoveUser: (userId: string, targetRoleId: string) => Promise<void>;
};

export type RolePermissionsSectionProps = {
  permissions: PermissionDataDto[];
  permissionKeys: string[];
  onPermissionKeysChange: (keys: string[]) => void;
  isLoading: boolean;
  error: unknown;
  onRetry: () => void;
  disabled: boolean;
};

export type RoleFormProps = {
  role?: RoleDetailDataDto;
  onSaved?: () => Promise<unknown>;
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
