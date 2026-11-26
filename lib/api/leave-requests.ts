import { isAxiosError } from "axios";
import dayjs from "dayjs";
import type { LeaveRequestTeacherDto } from "@/app/api/schemas";
import { LeaveRequestDtoStatus } from "@/app/api/schemas";
import { DISPLAY_DATE } from "@/constants/date-formats";

export type LeaveRequestStatusLabel =
  | "Pending"
  | "Approved"
  | "Rejected"
  | "Cancelled";

export const leaveRequestStatusLabels: Record<
  LeaveRequestDtoStatus,
  LeaveRequestStatusLabel
> = {
  PENDING: "Pending",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  CANCELLED: "Cancelled",
};

export const leaveRequestStatusVariants = {
  PENDING: "warning",
  APPROVED: "success",
  REJECTED: "danger",
  CANCELLED: "neutral",
} as const;

export const leaveRequestStatusOptions = [
  { label: "Pending", value: LeaveRequestDtoStatus.PENDING },
  { label: "Approved", value: LeaveRequestDtoStatus.APPROVED },
  { label: "Rejected", value: LeaveRequestDtoStatus.REJECTED },
  { label: "Cancelled", value: LeaveRequestDtoStatus.CANCELLED },
];

export function formatTeacherName(teacher?: LeaveRequestTeacherDto | null) {
  if (!teacher) return "—";
  return `${teacher.firstName} ${teacher.lastName ?? ""}`.trim();
}

export function leaveRequestDaysLabel(totalDays: number) {
  return `${totalDays} ${totalDays === 1 || totalDays === 0.5 ? "day" : "days"}`;
}

export function formatLeaveRequestDates(fromDate: string, toDate: string) {
  const from = dayjs(fromDate);
  const to = dayjs(toDate);

  return from.isSame(to, "day")
    ? from.format(DISPLAY_DATE)
    : `${from.format("DD MMM")} - ${to.format(DISPLAY_DATE)}`;
}

export function getLeaveRequestErrorMessage(
  error: unknown,
  fallback: string,
) {
  if (isAxiosError(error)) {
    const body = error.response?.data as
      | { message?: string | string[]; data?: { errors?: string[] } }
      | undefined;
    const message = body?.data?.errors?.[0] ?? body?.message;

    if (Array.isArray(message)) return message[0] ?? fallback;
    return message ?? fallback;
  }

  return error instanceof Error ? error.message : fallback;
}
