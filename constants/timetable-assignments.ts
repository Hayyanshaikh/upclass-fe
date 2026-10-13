import { teachers } from "@/constants/teachers";
import { timetableDays, timetableRows, timetableSubjects } from "@/constants/timetable";
import type { TimetableAssignment } from "@/types/timetable";

const mathematics = { term: "term-1", subject: "Mathematics", teacherId: "T-014" };

// Other classes share the same assignment data for filtering and conflict checks.
const otherClassAssignments: TimetableAssignment[] = [
  { ...mathematics, classId: "7-A", periodId: "period-1", day: "thursday", room: "Room 15" },
  { ...mathematics, classId: "8-B", periodId: "period-1", day: "saturday", room: "Room 13" },
  { ...mathematics, classId: "7-A", periodId: "period-2", day: "wednesday", room: "Room 15" },
  { ...mathematics, classId: "9-C", periodId: "period-2", day: "saturday", room: "Room 14" },
  { ...mathematics, classId: "7-A", periodId: "period-3", day: "tuesday", room: "Room 15" },
  { ...mathematics, classId: "9-C", periodId: "period-3", day: "friday", room: "Room 14" },
  { ...mathematics, classId: "7-A", periodId: "period-4", day: "monday", room: "Room 15" },
  { ...mathematics, classId: "9-C", periodId: "period-4", day: "thursday", room: "Room 14" },
  { ...mathematics, classId: "7-A", periodId: "period-4", day: "friday", room: "Room 15" },
  { ...mathematics, classId: "9-C", periodId: "period-5", day: "wednesday", room: "Room 14" },
  { ...mathematics, classId: "8-B", periodId: "period-5", day: "saturday", room: "Room 13" },
  { ...mathematics, classId: "8-B", periodId: "period-6", day: "monday", room: "Room 13" },
  { ...mathematics, classId: "9-C", periodId: "period-6", day: "tuesday", room: "Room 14" },
  { ...mathematics, classId: "8-B", periodId: "period-6", day: "friday", room: "Room 13" },
  { ...mathematics, classId: "9-C", periodId: "period-6", day: "saturday", room: "Room 14" },
  { ...mathematics, classId: "9-C", periodId: "period-7", day: "monday", room: "Room 14" },
  { ...mathematics, classId: "8-B", periodId: "period-7", day: "thursday", room: "Room 13" },
];

export const initialTimetableAssignments: TimetableAssignment[] = [
  ...timetableRows.flatMap((row) => row.type === "period" ? timetableDays.flatMap((day) => {
    const subject = timetableSubjects[row.subjects[day.key]];
    const teacher = teachers.find((record) => record.name === subject.teacher);
    return teacher ? [{ classId: "8-A", term: "term-1", periodId: row.id, day: day.key,
      subject: subject.name, teacherId: teacher.id, room: subject.room }] : [];
  }) : []),
  ...otherClassAssignments,
];
