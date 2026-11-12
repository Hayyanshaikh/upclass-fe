import type { FilterField } from "@/types/table-toolbar";
import type { TimetableDayOption } from "@/types/timetable";

export const timetableDays: TimetableDayOption[] = [
  { key: "monday", label: "Monday" },
  { key: "tuesday", label: "Tuesday" },
  { key: "wednesday", label: "Wednesday" },
  { key: "thursday", label: "Thursday" },
  { key: "friday", label: "Friday" },
  { key: "saturday", label: "Saturday" },
  { key: "sunday", label: "Sunday" },
];

export const timetableFilterFields: FilterField[] = [
  {
    name: "class",
    label: "Class",
    options: [],
    allowClear: false,
  },
  {
    name: "section",
    label: "Section",
    options: [],
    allowClear: false,
  },
  {
    name: "term",
    label: "Term",
    options: [],
    allowClear: false,
  },
  {
    name: "teacherId",
    label: "Teacher",
    placeholder: "All teachers",
    options: [],
    allowClear: true,
  },
  {
    name: "subject",
    label: "Subject",
    placeholder: "All subjects",
    options: [],
    allowClear: true,
  },
];

