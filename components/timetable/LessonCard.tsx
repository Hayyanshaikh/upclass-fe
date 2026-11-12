import { memo } from "react";
import type { LessonCardProps } from "@/types/timetable";

function LessonCard({
  title,
  subtitle,
  free = false,
  onClick,
  ariaLabel,
}: LessonCardProps) {
  const content = (
    <div
      className={`min-h-20 rounded-md p-2.5 ${
        free
          ? "flex items-center border border-dashed border-border bg-background"
          : "bg-success/10"
      }`}
    >
      <div>
        <p
          className={`text-sm leading-5 font-bold ${
            free ? "text-gray" : "text-dark"
          }`}
        >
          {title}
        </p>
        {subtitle && (
          <p className="mt-1 text-xs leading-4 text-gray">{subtitle}</p>
        )}
      </div>
    </div>
  );
  return onClick ? (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className="block w-full cursor-pointer rounded-md text-left transition hover:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
    >
      {content}
    </button>
  ) : (
    content
  );
}

export default memo(LessonCard);
