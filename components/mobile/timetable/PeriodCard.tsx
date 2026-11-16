"use client";

import { LuChevronRight } from "react-icons/lu";
import type { TimetablePeriod } from "@/types/timetable";

function splitTime(time: string) {
  const [start, end] = time.split("–");
  return { start, end };
}

type PeriodCardProps = {
  row: TimetablePeriod;
  subject?: string;
  teacher?: string;
  free?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  ariaLabel?: string;
};

export default function PeriodCard({
  row,
  subject,
  teacher,
  free = false,
  disabled = false,
  onClick,
  ariaLabel,
}: PeriodCardProps) {
  const { start, end } = splitTime(row.time);

  const content = (
    <>
      <div className="w-14 shrink-0 border-r border-border pr-2 text-right">
        <p className="text-xs font-bold text-dark">{start}</p>
        {end && <p className="mt-0.5 text-[10px] text-gray">{end}</p>}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-semibold tracking-wide text-gray uppercase">
          {row.label}
        </p>
        <p
          className={`mt-0.5 truncate text-sm font-bold ${
            free ? "text-gray" : "text-dark"
          }`}
        >
          {free ? "Free period" : (subject ?? "Assigned")}
        </p>
        <p className="mt-0.5 truncate text-xs text-gray">
          {free ? "No subject assigned" : (teacher ?? "Unassigned teacher")}
        </p>
      </div>

      {onClick && (
        <LuChevronRight
          size={16}
          aria-hidden="true"
          className="mt-1 shrink-0 text-gray"
        />
      )}
    </>
  );

  const className = `flex items-start gap-3 rounded-lg border bg-background p-3 ${
    free ? "border-dashed border-border" : "border-border"
  } ${disabled ? "select-none opacity-60" : ""}`;

  if (onClick && !disabled) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label={ariaLabel}
        className={`${className} w-full text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:opacity-80`}
      >
        {content}
      </button>
    );
  }

  return (
    <div aria-disabled={disabled || undefined} className={className}>
      {content}
    </div>
  );
}
