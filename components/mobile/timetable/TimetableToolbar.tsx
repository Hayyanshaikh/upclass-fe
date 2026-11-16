"use client";

import { LuSlidersHorizontal } from "react-icons/lu";
import Button from "@/components/ui/Button";
import TagList from "@/components/ui/TagList";
import MobileIconButton from "@/components/mobile/ui/MobileIconButton";
import type { TimetableDay, TimetableDayOption } from "@/types/timetable";

type TimetableToolbarProps = {
  contextTags: string[];
  activeFilterCount: number;
  days: TimetableDayOption[];
  activeDay: TimetableDay;
  showDays: boolean;
  onOpenFilters: () => void;
  onSelectDay: (day: TimetableDay) => void;
};

export default function TimetableToolbar({
  contextTags,
  activeFilterCount,
  days,
  activeDay,
  showDays,
  onOpenFilters,
  onSelectDay,
}: TimetableToolbarProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <div className="min-w-0 flex-1">
          {contextTags.length > 0 ? (
            <TagList tags={contextTags} />
          ) : (
            <p className="text-xs font-semibold text-gray">
              Select class, section and term
            </p>
          )}
        </div>

        <MobileIconButton
          variant="secondary"
          label={
            activeFilterCount > 0
              ? `Filters, ${activeFilterCount} active`
              : "Filters"
          }
          onClick={onOpenFilters}
          className="relative"
        >
          <LuSlidersHorizontal size={20} aria-hidden="true" />
          {activeFilterCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-background">
              {activeFilterCount}
            </span>
          )}
        </MobileIconButton>
      </div>

      {showDays && (
        <div className="-mx-1 flex min-w-0 gap-2 overflow-x-auto px-1 py-0.5">
          {days.map((day) => {
            const active = day.key === activeDay;

            return (
              <Button
                key={day.key}
                variant="secondary"
                ariaPressed={active}
                className={`h-10! shrink-0 rounded-full! px-4! text-xs! font-semibold! ${
                  active
                    ? "border-primary! bg-primary! text-background! hover:bg-primary! hover:text-background!"
                    : ""
                }`}
                onClick={() => onSelectDay(day.key)}
              >
                {day.label.slice(0, 3)}
              </Button>
            );
          })}
        </div>
      )}
    </div>
  );
}
