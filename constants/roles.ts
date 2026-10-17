import type { RoleAction, SchoolRole } from "@/types/role";

export const ROLE_OPTIONS = [
  { label: "Super Admin", value: "SUPERADMIN" },
  { label: "Admin", value: "ADMIN" },
  { label: "Teacher", value: "TEACHER" },
  { label: "Student", value: "STUDENT" },
  { label: "Parent", value: "PARENT" },
];

export const roleActions = ["View", "Create", "Edit", "Delete"] as const;

export const permissionGroups = [
  { name: "People", modules: ["Students", "Teachers", "Classes"] },
  { name: "Attendance", modules: ["Student attendance", "Teacher attendance"] },
  { name: "Finance", modules: ["Fees"] },
  { name: "Academics", modules: ["Timetable", "Exams & Results"] },
  { name: "Communication", modules: ["Notices"] },
  { name: "System", modules: ["Leave Requests", "Users", "Roles", "Settings"] },
];

const allPermissions: Record<string, RoleAction[]> = Object.fromEntries(
  permissionGroups.flatMap((group) =>
    group.modules.map((module) => [module, [...roleActions]]),
  ),
);

export const schoolRoles: SchoolRole[] = [
  { id: "super-admin", name: "Super Admin", description: "Full access to every module", users: 1, type: "System role", assignedUsers: ["Imran Sheikh"], permissions: allPermissions },
  { id: "teacher", name: "Teacher", description: "Own classes, attendance, marks, leave", users: 64, type: "System role", assignedUsers: ["Sara Malik", "Omar Farooq", "Nadia Hussain", "Kamran Yousuf", "Rabia Anwar", "Faisal Qureshi"], permissions: { Students: ["View", "Create", "Edit", "Delete"], Teachers: ["View", "Create", "Edit", "Delete"], Classes: ["View"] } },
  { id: "student", name: "Student", description: "Own data, read-only", users: 1248, type: "System role", assignedUsers: ["Ayesha Khan (student)"], permissions: { Students: ["View"] } },
  { id: "parent", name: "Parent", description: "Linked children, read-only", users: 1180, type: "System role", assignedUsers: ["Ayesha Khan (parent)"], permissions: { Students: ["View"] } },
  { id: "staff", name: "Staff", description: "Front desk, limited modules", users: 3, type: "Custom", assignedUsers: ["Front Desk"], permissions: { Students: ["View"], Teachers: ["View"], Classes: ["View"] } },
  { id: "viewer", name: "Viewer", description: "Read-only reports, no edits", users: 1, type: "Custom", assignedUsers: ["Guest Auditor"], permissions: { Students: ["View"], Teachers: ["View"] } },
];

export const roleTypeOptions = [
  { label: "System role", value: "System role" },
  { label: "Custom", value: "Custom" },
];
