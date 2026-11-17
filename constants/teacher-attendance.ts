import { UpdateTeacherAttendanceDtoStatus } from "@/app/api/schemas";
import type { TeacherAttendanceStatus } from "@/types/teacher-attendance";

export const teacherAttendanceStatusOptions = [
  { label: "Present", value: UpdateTeacherAttendanceDtoStatus.PRESENT },
  { label: "Absent", value: UpdateTeacherAttendanceDtoStatus.ABSENT },
  { label: "Late", value: UpdateTeacherAttendanceDtoStatus.LATE },
  { label: "Leave", value: UpdateTeacherAttendanceDtoStatus.LEAVE },
];

export const teacherAttendanceStatusVariants: Record<
  TeacherAttendanceStatus,
  "success" | "danger" | "warning" | "neutral"
> = {
  Present: "success",
  Absent: "danger",
  Late: "warning",
  Leave: "neutral",
};
