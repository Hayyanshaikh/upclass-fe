import type { LessonCardProps } from "@/types/timetable";

export default function LessonCard({ subject }: LessonCardProps) {
  return (
    <div className={`min-h-20 rounded-md p-2.5 ${subject.colorClass}`}>
      <p className="text-sm leading-5 font-bold text-dark">{subject.name}</p>
      <p className="mt-1 text-xs leading-4 text-gray">{subject.teacher}</p>
      <p className="mt-0.5 text-xs leading-4 text-gray">{subject.room}</p>
    </div>
  );
}
