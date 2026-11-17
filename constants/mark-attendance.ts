import type { WeeklyAttendance } from "@/types/mark-attendance";

export const weeklyStatusVariants: Record<
  WeeklyAttendance["status"],
  "success" | "danger" | "warning" | "neutral"
> = {
  Present: "success",
  Absent: "danger",
  Late: "warning",
  Leave: "neutral",
};
