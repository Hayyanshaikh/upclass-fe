import { teachers } from "@/constants/teachers";
import type { FilterField } from "@/types/table-toolbar";
import type { TeacherTimetableLesson, TeacherTimetableRow } from "@/types/timetable";

const class8A: TeacherTimetableLesson = { className: "Class 8-A", room: "Room 12" };
const class8B: TeacherTimetableLesson = { className: "Class 8-B", room: "Room 13" };
const class7A: TeacherTimetableLesson = { className: "Class 7-A", room: "Room 15" };
const class9C: TeacherTimetableLesson = { className: "Class 9-C", room: "Room 14" };

export const teacherTimetableFilterFields: FilterField[] = [
  { name: "teacher", label: "Teacher", options: teachers.map((teacher) => ({ label: teacher.name, value: teacher.id })), value: "T-014", allowClear: false },
  { name: "term", label: "Term", options: [
    { label: "Term 1 [2026–27]", value: "term-1" }, { label: "Term 2 [2026–27]", value: "term-2" },
  ], value: "term-1", allowClear: false },
  { name: "show", label: "Show", options: [
    { label: "All periods", value: "all" }, { label: "Assigned periods", value: "assigned" }, { label: "Free periods", value: "free" },
  ], value: "all", allowClear: false },
];

export const teacherTimetableRows: TeacherTimetableRow[] = [
  {
    id: "period-1", type: "period", label: "Period 1", time: "08:00–08:40",
    lessons: { monday: class8A, tuesday: null, wednesday: null, thursday: class7A, friday: null, saturday: class8B },
  },
  {
    id: "period-2", type: "period", label: "Period 2", time: "08:40–09:20",
    lessons: { monday: null, tuesday: null, wednesday: class7A, thursday: class8A, friday: null, saturday: class9C },
  },
  {
    id: "period-3", type: "period", label: "Period 3", time: "09:20–10:00",
    lessons: { monday: null, tuesday: class7A, wednesday: null, thursday: null, friday: class9C, saturday: null },
  },
  {
    id: "period-4", type: "period", label: "Period 4", time: "10:00–10:40",
    lessons: { monday: class7A, tuesday: null, wednesday: null, thursday: class9C, friday: class7A, saturday: null },
  },
  { id: "break", type: "break", time: "10:40–11:10" },
  {
    id: "period-5", type: "period", label: "Period 5", time: "11:10–11:50",
    lessons: { monday: null, tuesday: null, wednesday: class9C, thursday: null, friday: null, saturday: class8B },
  },
  {
    id: "period-6", type: "period", label: "Period 6", time: "11:50–12:30",
    lessons: { monday: class8B, tuesday: class9C, wednesday: null, thursday: null, friday: class8B, saturday: class9C },
  },
  {
    id: "period-7", type: "period", label: "Period 7", time: "12:30–13:10",
    lessons: { monday: class9C, tuesday: null, wednesday: null, thursday: class8B, friday: null, saturday: null },
  },
];
