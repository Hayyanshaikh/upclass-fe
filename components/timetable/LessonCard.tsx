import type { LessonCardProps } from "@/types/timetable";

export default function LessonCard({ title, subtitle, room, colorClass = "", free = false, onClick, ariaLabel }: LessonCardProps) {
  const content = (
    <div className={`min-h-20 rounded-md p-2.5 ${free ? "flex items-center border border-dashed border-border bg-background" : colorClass}`}>
      <div>
        <p className={`text-sm leading-5 font-bold ${free ? "text-gray" : "text-dark"}`}>{title}</p>
        {subtitle && <p className="mt-1 text-xs leading-4 text-gray">{subtitle}</p>}
        {room && <p className="mt-0.5 text-xs leading-4 text-gray">{room}</p>}
      </div>
    </div>
  );
  return onClick ? <button type="button" onClick={onClick} aria-label={ariaLabel}
    className="block w-full cursor-pointer rounded-md text-left transition hover:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">{content}</button> : content;
}
