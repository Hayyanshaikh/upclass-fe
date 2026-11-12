import { ClassDtoStatus } from "@/app/api/schemas";
import type { ClassDto } from "@/app/api/schemas";
import type { ClassRecord } from "@/types/class-management";

export const classManipulator = (
  classes: ClassDto[] = [],
  teacherNames: Record<string, string> = {},
): ClassRecord[] =>
  classes.map((schoolClass) => {
    const sections = schoolClass.sections.map((section) => ({
      id: section.id,
      sectionId: section.sectionId,
      section: section.section.name,
      teacherId: section.teacherId,
      teacherName: teacherNames[section.teacherId] ?? "Teacher unavailable",
      room: section.room,
      capacity: section.capacity,
    }));
    const sectionNames = sections
      .map((section) => section.section)
      .join(", ");

    return {
      id: schoolClass.id,
      name: schoolClass.name,
      label: sectionNames
        ? `${schoolClass.name}-${sectionNames}`
        : schoolClass.name,
      academicYear: schoolClass.academicYear.year,
      status:
        schoolClass.status === ClassDtoStatus.ACTIVE ? "Active" : "Inactive",
      sections,
    };
  });
