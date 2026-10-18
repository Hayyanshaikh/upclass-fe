import type { SelectOption } from "@/types/select";
import type { UserAccount, UserStatus } from "@/types/user-management";
import { ROLE_OPTIONS } from "@/constants/roles";

export const initialUsers: UserAccount[] = [
  {
    id: "USR-001",
    name: "Imran Sheikh",
    email: "imran@school.edu",
    role: "Super Admin",
    isActive: "Active",
    isSystem: true,
  },
  {
    id: "USR-002",
    name: "Sara Malik",
    email: "sara@school.edu",
    role: "Teacher",
    isActive: "Active",
    isSystem: false,
  },
  {
    id: "USR-003",
    name: "Ayesha Khan (parent)",
    email: "imran.khan@mail.com",
    role: "Parent",
    isActive: "Active",
    isSystem: false,
  },
  {
    id: "USR-004",
    name: "Ayesha Khan (student)",
    email: "—",
    role: "Student",
    isActive: "Active",
    isSystem: false,
  },
  {
    id: "USR-005",
    name: "Front Desk",
    email: "frontdesk@school.edu",
    role: "Admin",
    isActive: "Active",
    isSystem: false,
  },
  {
    id: "USR-006",
    name: "Omar Farooq",
    email: "omar@school.edu",
    role: "Teacher",
    isActive: "Inactive",
    isSystem: false,
  },
  {
    id: "USR-007",
    name: "Guest Auditor",
    email: "auditor@ext.com",
    role: "Admin",
    isActive: "Active",
    isSystem: false,
  },
];

export const userRoleOptions: SelectOption[] = ROLE_OPTIONS.map((role) => ({
  label: role.label,
  value: role.label,
}));

export const userStatusOptions: SelectOption[] = (
  ["Active", "Inactive"] satisfies UserStatus[]
).map((status) => ({ label: status, value: status }));

export const userStatusVariants = {
  Active: "success",
  Inactive: "warning",
  Suspended: "danger",
} as const;
