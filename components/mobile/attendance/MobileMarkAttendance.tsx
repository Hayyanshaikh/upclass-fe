"use client";

import { useState } from "react";
import { LuCalendarPlus } from "react-icons/lu";
import Button from "@/components/ui/Button";
import StatusBadge from "@/components/ui/StatusBadge";
import MobileIconButton from "@/components/mobile/ui/MobileIconButton";
import MobileSection from "@/components/mobile/ui/MobileSection";
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

type MobileMarkAttendanceProps = {
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
    <li className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
      <span className="w-10 shrink-0 text-sm font-bold text-dark">{day}</span>
      <span className="min-w-0 flex-1 truncate text-xs text-gray">
        {checkIn ? `Check-in ${checkIn}` : "No check-in"}
      </span>
      <StatusBadge variant={weeklyStatusVariant[status]}>{status}</StatusBadge>
    </li>
  );
}

export default function MobileMarkAttendance({
  initialState,
  today,
}: MobileMarkAttendanceProps) {
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
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-lg font-bold text-dark">Mark attendance</h1>
        <MobileIconButton
          variant="secondary"
          href="/teacher-leaves/apply"
          label="Request leave"
        >
          <LuCalendarPlus size={20} aria-hidden="true" />
        </MobileIconButton>
      </div>

      <section className="rounded-lg border border-border bg-background p-4">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-semibold text-gray">Today</p>
          <span className="shrink-0 rounded-full bg-foreground px-2.5 py-1 text-xs font-semibold text-gray">
            Shift {shiftStart} – {shiftEnd}
          </span>
        </div>
        <h2 className="mt-0.5 text-lg font-bold text-dark">{today}</h2>

        <p
          className={`mt-4 rounded-md px-3 py-3 text-sm font-semibold ${tone}`}
          role="status"
          aria-live="polite"
        >
          {attendanceMessage(day)}
        </p>

        {canCheckIn && (
          <Button
            fullWidth
            className="mt-3 h-12! text-base! font-bold!"
            onClick={checkIn}
          >
            Check in
          </Button>
        )}
        {canCheckOut && (
          <Button
            fullWidth
            className="mt-3 h-12! text-base! font-bold!"
            onClick={checkOut}
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

      <MobileSection title="This week">
        <ul role="list" className="divide-y divide-border">
          {weeklyAttendance.map((entry) => (
            <WeeklyRow key={entry.day} {...entry} />
          ))}
        </ul>
      </MobileSection>
    </div>
  );
}
