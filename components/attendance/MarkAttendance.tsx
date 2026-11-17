"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import PageHeader from "@/components/shared/PageHeader";
import Button from "@/components/ui/Button";
import ErrorDialog from "@/components/shared/ErrorDialog";
import Loader from "@/components/ui/Loader";
import SectionCard from "@/components/ui/SectionCard";
import StatusBadge from "@/components/ui/StatusBadge";
import SuccessDialog from "@/components/shared/SuccessDialog";
import {
  useMarkAttendanceControllerCheckIn,
  useMarkAttendanceControllerCheckOut,
  useMarkAttendanceControllerFindToday,
  useMarkAttendanceControllerFindWeekly,
} from "@/app/api/endpoints";
import { TeacherAttendanceDtoStatus } from "@/app/api/schemas";
import type { TeacherAttendanceDto } from "@/app/api/schemas";
import { weeklyStatusVariants } from "@/constants/mark-attendance";
import {
  getTeacherAttendanceErrorMessage,
  teacherAttendanceStatusLabel,
} from "@/lib/api/teacher-attendance";
import { useRolePermission } from "@/hooks/useRolePermission";
import type {
  AttendanceDay,
  MarkAttendanceState,
  WeeklyAttendance,
} from "@/types/mark-attendance";

dayjs.extend(utc);
dayjs.extend(timezone);

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

function WeeklyRow({ day, checkIn, status }: WeeklyAttendance) {
  return (
    <li className="flex items-center gap-3 border-t border-border py-3">
      <span className="w-10 shrink-0 font-bold text-dark">{day}</span>
      <span className="min-w-0 flex-1 text-sm text-gray">
        Check-in {checkIn ?? "–"}
      </span>
      <StatusBadge variant={weeklyStatusVariants[status]}>{status}</StatusBadge>
    </li>
  );
}

export default function MarkAttendance() {
  const router = useRouter();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
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
  const isLoading = todayQuery.isLoading || weeklyQuery.isLoading;
  const isError = todayQuery.isError || weeklyQuery.isError;

  async function handleCheckIn() {
    try {
      const response = await checkIn();
      setSuccessMessage(response.message);
      await Promise.all([todayQuery.refetch(), weeklyQuery.refetch()]);
    } catch (error) {
      setErrorMessage(
        getTeacherAttendanceErrorMessage(error, "Unable to check in."),
      );
    }
  }

  async function handleCheckOut() {
    try {
      const response = await checkOut();
      setSuccessMessage(response.message);
      await Promise.all([todayQuery.refetch(), weeklyQuery.refetch()]);
    } catch (error) {
      setErrorMessage(
        getTeacherAttendanceErrorMessage(error, "Unable to check out."),
      );
    }
  }

  return (
    <div>
      <PageHeader
        title="Mark attendance"
        actions={
          canRequestLeave ? (
            <Button onClick={() => router.push("/teacher-leaves/apply")}>
              Request leave
            </Button>
          ) : undefined
        }
      />
      {isLoading ? (
        <Loader fullscreen={false} tip="Loading attendance..." />
      ) : isError ? (
        <div
          role="alert"
          className="flex items-center gap-3 rounded-md border border-danger bg-danger/10 px-4 py-3 text-sm text-danger"
        >
          <span>Unable to load your attendance.</span>
          <Button
            variant="link"
            onClick={() => {
              void todayQuery.refetch();
              void weeklyQuery.refetch();
            }}
          >
            Retry
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <SectionCard className="h-auto!">
            <p className="text-sm font-semibold text-gray">Your attendance</p>
            <h2 className="mt-1 text-lg font-bold text-dark">
              Today · {todayLabel}
            </h2>
            <p className="text-sm text-gray">
              Shift {shift?.openingTime ?? "—"} – {shift?.closingTime ?? "—"}
            </p>

            <p
              className={`mt-5 rounded-md px-4 py-4 text-sm font-semibold ${tone}`}
              role="status"
              aria-live="polite"
            >
              {(day.state === "unchecked" || day.state === "absent") &&
              checkInNotice
                ? checkInNotice
                : attendanceMessage(day)}
            </p>

            <dl className="mt-5 grid grid-cols-3 gap-3">
              <div>
                <dt className="text-sm text-gray">Check-in</dt>
                <dd className="mt-1 font-bold text-dark">
                  {day.checkIn ?? "–"}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-gray">Check-out</dt>
                <dd className="mt-1 font-bold text-dark">
                  {day.checkOut ?? "–"}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-gray">Worked</dt>
                <dd className="mt-1 font-bold text-dark">
                  {day.checkIn ? workedTime(day) : "–"}
                </dd>
              </div>
            </dl>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <Button
                fullWidth
                disabled={!canCheckIn || isCheckingIn}
                loading={isCheckingIn}
                onClick={() => void handleCheckIn()}
              >
                Check in
              </Button>
              <Button
                fullWidth
                disabled={!canCheckOut || isCheckingOut}
                loading={isCheckingOut}
                onClick={() => void handleCheckOut()}
              >
                Check out
              </Button>
            </div>
          </SectionCard>

          <SectionCard className="h-auto!">
            <h2 className="mb-1 text-lg font-bold text-dark">This week</h2>
            <ul>
              {weekly.length ? (
                weekly.map((entry) => (
                  <WeeklyRow key={entry.date} {...entry} />
                ))
              ) : (
                <li className="py-3 text-sm text-gray">
                  No attendance recorded this week.
                </li>
              )}
            </ul>
          </SectionCard>
        </div>
      )}
      <SuccessDialog
        open={successMessage !== null}
        message={successMessage ?? ""}
        onClose={() => setSuccessMessage(null)}
      />
      <ErrorDialog
        open={errorMessage !== null}
        message={errorMessage ?? ""}
        onClose={() => setErrorMessage(null)}
      />
    </div>
  );
}
