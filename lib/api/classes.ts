import { ClassDtoStatus } from "@/app/api/schemas";
import type { ClassDto } from "@/app/api/schemas";
import type { ClassRecord } from "@/types/class-management";

export const classManipulator = (
  classes: ClassDto[] = [],
  teacherNames: Record<string, string> = {},
): ClassRecord[] =>
  classes.map((schoolClass) => ({
    id: schoolClass.id,
    name: schoolClass.name,
    section: schoolClass.section,
    label: `${schoolClass.name}-${schoolClass.section}`,
    room: schoolClass.room,
    capacity: schoolClass.capacity,
    academicYear: schoolClass.academicYear.year,
    status:
      schoolClass.status === ClassDtoStatus.ACTIVE ? "Active" : "Inactive",
    teacherId: schoolClass.teacherId,
    teacherName: teacherNames[schoolClass.teacherId] ?? "Teacher unavailable",
    assistantTeacherId: schoolClass.assistantTeacherId,
    assistantTeacherName: schoolClass.assistantTeacherId
      ? (teacherNames[schoolClass.assistantTeacherId] ?? "Teacher unavailable")
      : null,
    subjects: schoolClass.subjects.map((subject) => ({
      id: subject.id,
      subjectId: subject.subjectId,
      subjectName: subject.subject.name,
      teacherId: subject.teacherId,
      teacherName: teacherNames[subject.teacherId] ?? "Teacher unavailable",
      periodsPerWeek: subject.periodsPerWeek,
    })),
  }));
