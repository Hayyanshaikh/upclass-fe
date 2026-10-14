"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/shared/PageHeader";
import Button from "@/components/ui/Button";
import SectionCard from "@/components/ui/SectionCard";
import StatusBadge from "@/components/ui/StatusBadge";
import {
  attendanceStates,
  onTimeUntil,
  shiftEnd,
  shiftStart,
  weeklyAttendance,
} from "@/constants/mark-attendance";
import type {
  AttendanceDay,
  MarkAttendanceState,
  WeeklyAttendance,
} from "@/types/mark-attendance";

type MarkAttendanceProps = {
  initialState: MarkAttendanceState;
  today: string;
};

const weeklyStatusVariant = {
  Present: "success",
  Late: "warning",
  Leave: "neutral",
} as const;

function clockMinutes(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function currentTime() {
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Karachi",
  }).format(new Date());
}

function workedTime(day: AttendanceDay) {
  if (!day.checkIn || !day.checkOut) return "Running";
  const minutes = Math.max(
    0,
    clockMinutes(day.checkOut) - clockMinutes(day.checkIn),
  );
  return `${Math.floor(minutes / 60)}h ${String(minutes % 60).padStart(2, "0")}m`;
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
      return `On leave today · ${day.leaveType} (${day.leaveRequest})`;
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
      <StatusBadge variant={weeklyStatusVariant[status]}>{status}</StatusBadge>
    </li>
  );
}

export default function MarkAttendance({
  initialState,
  today,
}: MarkAttendanceProps) {
  const router = useRouter();
  const [day, setDay] = useState<AttendanceDay>(attendanceStates[initialState]);
  const canCheckIn = day.state === "unchecked";
  const canCheckOut = day.state === "checked-in" || day.state === "late";
  const tone =
    day.state === "late"
      ? "bg-warning/10 text-warning"
      : day.state === "unchecked" || day.state === "leave"
        ? "bg-gray/10 text-gray"
        : "bg-success/10 text-primary";

  function checkIn() {
    const time = currentTime();
    const lateMinutes = Math.max(0, clockMinutes(time) - onTimeUntil);
    setDay({
      state: lateMinutes ? "late" : "checked-in",
      checkIn: time,
      lateMinutes: lateMinutes || undefined,
    });
  }

  function checkOut() {
    if (!day.checkIn) return;
    setDay({ ...day, state: "completed", checkOut: currentTime() });
  }

  return (
    <div>
      <PageHeader
        title="Mark attendance"
        actions={
          <Button onClick={() => router.push("/teacher-leaves/apply")}>
            Request leave
          </Button>
        }
      />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <SectionCard className="h-auto!">
          <p className="text-sm font-semibold text-gray">Your attendance</p>
          <h2 className="mt-1 text-lg font-bold text-dark">Today · {today}</h2>
          <p className="text-sm text-gray">
            Shift {shiftStart} – {shiftEnd}
          </p>

          <p
            className={`mt-5 rounded-md px-4 py-4 text-sm font-semibold ${tone}`}
            role="status"
            aria-live="polite"
          >
            {attendanceMessage(day)}
          </p>

          <dl className="mt-5 grid grid-cols-3 gap-3">
            <div>
              <dt className="text-sm text-gray">Check-in</dt>
              <dd className="mt-1 font-bold text-dark">{day.checkIn ?? "–"}</dd>
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
            <Button fullWidth disabled={!canCheckIn} onClick={checkIn}>
              Check in
            </Button>
            <Button fullWidth disabled={!canCheckOut} onClick={checkOut}>
              Check out
            </Button>
          </div>
        </SectionCard>

        <SectionCard className="h-auto!">
          <h2 className="mb-1 text-lg font-bold text-dark">This week</h2>
          <ul>
            {weeklyAttendance.map((entry) => (
              <WeeklyRow key={entry.day} {...entry} />
            ))}
          </ul>
        </SectionCard>
      </div>
    </div>
  );
}
