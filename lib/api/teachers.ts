import type { TeacherDto } from "@/app/api/schemas";
import type { TeacherAccount } from "@/types/teacher-management";

export const teacherManipulator = (
  teachers: TeacherDto[] = [],
): TeacherAccount[] =>
  teachers.map((teacher) => ({
    id: teacher.id,
    name: [teacher.firstName, teacher.lastName].filter(Boolean).join(" "),
    employeeId: teacher.employeeId ?? "—",
    email: teacher.email ?? "—",
    phone: teacher.phone ?? "—",
    employmentType: teacher.employmentType
      ? teacher.employmentType
          .replaceAll("_", "-")
          .toLowerCase()
          .replace(/^./, (letter) => letter.toUpperCase())
      : "—",
    isActive:
      teacher.isActive === null
        ? "Unknown"
        : teacher.isActive
          ? "Active"
          : "Inactive",
    isSystem: false,
  }));
