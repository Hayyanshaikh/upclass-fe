"use client";

import { useState } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { LuCalendarPlus } from "react-icons/lu";
import Button from "@/components/ui/Button";
import StatusBadge from "@/components/ui/StatusBadge";
import MobileFeedbackDialog from "@/components/mobile/dialogs/MobileFeedbackDialog";
import MobileIconButton from "@/components/mobile/ui/MobileIconButton";
import MobileSection from "@/components/mobile/ui/MobileSection";
import { weeklyStatusVariants } from "@/constants/mark-attendance";
import {
  getTeacherAttendanceErrorMessage,
  teacherAttendanceStatusLabel,
} from "@/lib/api/teacher-attendance";
import { useRolePermission } from "@/hooks/useRolePermission";
import {
  useMarkAttendanceControllerCheckIn,
  useMarkAttendanceControllerCheckOut,
  useMarkAttendanceControllerFindToday,
  useMarkAttendanceControllerFindWeekly,
} from "@/app/api/endpoints";
import { TeacherAttendanceDtoStatus } from "@/app/api/schemas";
import type { TeacherAttendanceDto } from "@/app/api/schemas";
import type {
  AttendanceDay,
  MarkAttendanceState,
  WeeklyAttendance,
} from "@/types/mark-attendance";

dayjs.extend(utc);
dayjs.extend(timezone);

type Feedback = {
  tone: "success" | "error";
  message: string;
};

function clockMinutes(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function workedTime(day: AttendanceDay) {
  if (!day.checkIn || !day.checkOut) return "Running";
  const minutes = Math.max(
    0,
    clockMinutes(day.checkOut) - clockMinutes(day.checkIn),
  );
  return `${Math.floor(minutes / 60)}h ${String(minutes % 60).padStart(2, "0")}m`;
}

function attendanceState(
  record: TeacherAttendanceDto | null,
): MarkAttendanceState {
  if (!record) return "unchecked";
  if (record.status === TeacherAttendanceDtoStatus.LEAVE) return "leave";
  if (record.checkOut) return "completed";
  if (record.checkIn) {
    return record.status === TeacherAttendanceDtoStatus.LATE
      ? "late"
      : "checked-in";
  }
  if (record.status === TeacherAttendanceDtoStatus.ABSENT) return "absent";
  return "unchecked";
}

function attendanceMessage(day: AttendanceDay) {
  switch (day.state) {
    case "unchecked":
      return "Not checked in yet";
    case "checked-in":
      return `Checked in at ${day.checkIn} · On time`;
    case "late":
      return `Late by ${day.lateMinutes ?? 0} min · checked in at ${day.checkIn}`;
    case "leave":
      return "On leave today · approved leave";
    case "absent":
      return "Marked absent · no check-in recorded";
    case "completed":
      return `${day.lateMinutes ? "Late" : "Present"} · ${workedTime(day)} worked`;
  }
}

export default function MobileMarkAttendance() {
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const { canCreate: canMarkAttendance } = useRolePermission("mark_attendance");
  const { canCreate: canRequestLeave } = useRolePermission("teacher_leaves");

  const todayQuery = useMarkAttendanceControllerFindToday();
  const weeklyQuery = useMarkAttendanceControllerFindWeekly();
  const { mutateAsync: checkIn, isPending: isCheckingIn } =
    useMarkAttendanceControllerCheckIn();
  const { mutateAsync: checkOut, isPending: isCheckingOut } =
    useMarkAttendanceControllerCheckOut();

  const record = todayQuery.data?.data ?? null;
  const shift = todayQuery.data?.shift;
  const day: AttendanceDay = {
    state: attendanceState(record),
    checkIn: record?.checkIn ?? undefined,
    checkOut: record?.checkOut ?? undefined,
    lateMinutes: record?.lateMinutes ?? undefined,
  };
  const weekly: WeeklyAttendance[] = (weeklyQuery.data?.data ?? []).map(
    (entry) => ({
      date: entry.date,
      day: dayjs(entry.date.slice(0, 10)).format("ddd"),
      checkIn: entry.checkIn ?? undefined,
      status: teacherAttendanceStatusLabel(entry.status),
    }),
  );
  const nowTime = dayjs().tz("Asia/Karachi").format("HH:mm");
  const checkInNotice =
    !shift?.openingTime || !shift?.closingTime
      ? "School timings are not set · check-in unavailable"
      : nowTime < shift.openingTime
        ? `Check-in opens at ${shift.openingTime}`
        : nowTime > shift.closingTime
          ? "Check-in closed · school hours are over"
          : null;
  const canCheckIn =
    canMarkAttendance &&
    checkInNotice === null &&
    (day.state === "unchecked" || day.state === "absent");
  const canCheckOut =
    canMarkAttendance && (day.state === "checked-in" || day.state === "late");
  const tone =
    day.state === "late"
      ? "bg-warning/10 text-warning"
      : day.state === "absent"
        ? "bg-danger/10 text-danger"
        : day.state === "unchecked" || day.state === "leave"
          ? "bg-gray/10 text-gray"
          : "bg-success/10 text-primary";
  const todayLabel = dayjs().tz("Asia/Karachi").format("DD MMM YYYY");

  async function handleCheckIn() {
    try {
      const response = await checkIn();
      setFeedback({ tone: "success", message: response.message });
      await Promise.all([todayQuery.refetch(), weeklyQuery.refetch()]);
    } catch (error) {
      setFeedback({
        tone: "error",
        message: getTeacherAttendanceErrorMessage(
          error,
          "Unable to check in.",
        ),
      });
    }
  }

  async function handleCheckOut() {
    try {
      const response = await checkOut();
      setFeedback({ tone: "success", message: response.message });
      await Promise.all([todayQuery.refetch(), weeklyQuery.refetch()]);
    } catch (error) {
      setFeedback({
        tone: "error",
        message: getTeacherAttendanceErrorMessage(
          error,
          "Unable to check out.",
        ),
      });
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-lg font-bold text-dark">Mark attendance</h1>
        {canRequestLeave && (
          <MobileIconButton
            variant="secondary"
            href="/teacher-leaves/apply"
            label="Request leave"
          >
            <LuCalendarPlus size={20} aria-hidden="true" />
          </MobileIconButton>
        )}
      </div>

      {todayQuery.isError ? (
        <div className="rounded-lg border border-danger/30 bg-danger/10 p-4 text-center">
          <p className="text-sm font-semibold text-danger">
            Unable to load your attendance.
          </p>
          <Button
            variant="secondary"
            className="mt-3 h-10! font-semibold"
            onClick={() => void todayQuery.refetch()}
          >
            Retry
          </Button>
        </div>
      ) : todayQuery.isPending ? (
        <div
          className="rounded-lg border border-border bg-background p-4"
          aria-hidden="true"
        >
          <div className="h-3 w-16 animate-pulse rounded bg-foreground" />
          <div className="mt-3 h-5 w-32 animate-pulse rounded bg-foreground" />
          <div className="mt-4 h-11 animate-pulse rounded-md bg-foreground" />
          <div className="mt-4 h-12 animate-pulse rounded-md bg-foreground" />
        </div>
      ) : (
        <section className="rounded-lg border border-border bg-background p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-semibold text-gray">Today</p>
            <span className="shrink-0 rounded-full bg-foreground px-2.5 py-1 text-xs font-semibold text-gray">
              Shift {shift?.openingTime ?? "—"} – {shift?.closingTime ?? "—"}
            </span>
          </div>
          <h2 className="mt-0.5 text-lg font-bold text-dark">{todayLabel}</h2>

          <p
            className={`mt-4 rounded-md px-3 py-3 text-sm font-semibold ${tone}`}
            role="status"
            aria-live="polite"
          >
            {(day.state === "unchecked" || day.state === "absent") &&
            checkInNotice
              ? checkInNotice
              : attendanceMessage(day)}
          </p>

          {canCheckIn && (
            <Button
              fullWidth
              className="mt-3 h-12! text-base! font-bold!"
              loading={isCheckingIn}
              disabled={isCheckingOut}
              onClick={() => void handleCheckIn()}
            >
              Check in
            </Button>
          )}
          {canCheckOut && (
            <Button
              fullWidth
              className="mt-3 h-12! text-base! font-bold!"
              loading={isCheckingOut}
              disabled={isCheckingIn}
              onClick={() => void handleCheckOut()}
            >
              Check out
            </Button>
          )}

          <dl className="mt-4 grid grid-cols-3 gap-3 border-t border-border pt-3">
            <div className="min-w-0">
              <dt className="text-xs font-semibold text-gray">Check-in</dt>
              <dd className="mt-0.5 truncate text-sm font-bold tabular-nums text-dark">
                {day.checkIn ?? "–"}
              </dd>
            </div>
            <div className="min-w-0">
              <dt className="text-xs font-semibold text-gray">Check-out</dt>
              <dd className="mt-0.5 truncate text-sm font-bold tabular-nums text-dark">
                {day.checkOut ?? "–"}
              </dd>
            </div>
            <div className="min-w-0">
              <dt className="text-xs font-semibold text-gray">Worked</dt>
              <dd className="mt-0.5 truncate text-sm font-bold tabular-nums text-dark">
                {day.checkIn ? workedTime(day) : "–"}
              </dd>
            </div>
          </dl>
        </section>
      )}

      <MobileSection title="This week">
        {weeklyQuery.isPending ? (
          <div className="flex flex-col gap-3" aria-hidden="true">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="h-9 animate-pulse rounded-md bg-foreground"
              />
            ))}
          </div>
        ) : weeklyQuery.isError ? (
          <div className="text-center">
            <p className="text-sm text-gray">Unable to load this week.</p>
            <Button
              variant="secondary"
              className="mt-3 h-10! font-semibold"
              onClick={() => void weeklyQuery.refetch()}
            >
              Retry
            </Button>
          </div>
        ) : weekly.length === 0 ? (
          <p className="text-sm text-gray">
            No attendance recorded this week yet.
          </p>
        ) : (
          <ul role="list" className="divide-y divide-border">
            {weekly.map((entry) => (
              <li
                key={entry.date}
                className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
              >
                <span className="w-10 shrink-0 text-sm font-bold text-dark">
                  {entry.day}
                </span>
                <span className="min-w-0 flex-1 truncate text-xs text-gray">
                  {entry.checkIn
                    ? `Check-in ${entry.checkIn}`
                    : "No check-in"}
                </span>
                <StatusBadge variant={weeklyStatusVariants[entry.status]}>
                  {entry.status}
                </StatusBadge>
              </li>
            ))}
          </ul>
        )}
      </MobileSection>

      <MobileFeedbackDialog
        open={feedback !== null}
        tone={feedback?.tone ?? "success"}
        message={feedback?.message ?? ""}
        onClose={() => setFeedback(null)}
      />
    </div>
  );
}
