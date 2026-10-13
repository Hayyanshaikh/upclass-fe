import { classGradeOptions } from "@/constants/classes";
import type { FilterField } from "@/types/table-toolbar";
import type {
  TimetableDay,
  TimetableRow,
  TimetableSubject,
  TimetableSubjectKey,
} from "@/types/timetable";

export const timetableDays: { key: TimetableDay; label: string }[] = [
  { key: "monday", label: "Monday" },
  { key: "tuesday", label: "Tuesday" },
  { key: "wednesday", label: "Wednesday" },
  { key: "thursday", label: "Thursday" },
  { key: "friday", label: "Friday" },
  { key: "saturday", label: "Saturday" },
];

export const timetableSubjects: Record<TimetableSubjectKey, TimetableSubject> =
  {
    mathematics: {
      name: "Mathematics",
      teacher: "Sara Malik",
      room: "Room 12",
      colorClass: "bg-subject-mathematics",
    },
    english: {
      name: "English",
      teacher: "Omar Farooq",
      room: "Room 12",
      colorClass: "bg-subject-english",
    },
    science: {
      name: "Science",
      teacher: "Nadia Hussain",
      room: "Lab 2",
      colorClass: "bg-subject-science",
    },
    urdu: {
      name: "Urdu",
      teacher: "Kamran Yousuf",
      room: "Room 12",
      colorClass: "bg-subject-urdu",
    },
    computer: {
      name: "Computer",
      teacher: "Rabia Anwar",
      room: "Lab 1",
      colorClass: "bg-subject-computer",
    },
    islamiyat: {
      name: "Islamiyat",
      teacher: "Faisal Qureshi",
      room: "Room 12",
      colorClass: "bg-subject-islamiyat",
    },
    physical: {
      name: "Physical Ed.",
      teacher: "Adnan Javed",
      room: "Ground",
      colorClass: "bg-subject-physical",
    },
  };

export const timetableFilterFields: FilterField[] = [
  {
    name: "grade",
    label: "Class",
    options: classGradeOptions,
    value: "8",
    allowClear: false,
  },
  {
    name: "section",
    label: "Section",
    options: [
      { label: "A", value: "A" },
      { label: "B", value: "B" },
      { label: "C", value: "C" },
    ],
    value: "A",
    allowClear: false,
  },
  {
    name: "term",
    label: "Term",
    options: [
      { label: "Term 1 [2026–27]", value: "term-1" },
      { label: "Term 2 [2026–27]", value: "term-2" },
    ],
    value: "term-1",
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

export const timetableRows: TimetableRow[] = [
  {
    id: "period-1",
    type: "period",
    label: "Period 1",
    time: "08:00–08:40",
    subjects: {
      monday: "mathematics",
      tuesday: "science",
      wednesday: "computer",
      thursday: "physical",
      friday: "english",
      saturday: "urdu",
    },
  },
  {
    id: "period-2",
    type: "period",
    label: "Period 2",
    time: "08:40–09:20",
    subjects: {
      monday: "english",
      tuesday: "urdu",
      wednesday: "islamiyat",
      thursday: "mathematics",
      friday: "science",
      saturday: "computer",
    },
  },
  {
    id: "period-3",
    type: "period",
    label: "Period 3",
    time: "09:20–10:00",
    subjects: {
      monday: "science",
      tuesday: "computer",
      wednesday: "physical",
      thursday: "english",
      friday: "urdu",
      saturday: "islamiyat",
    },
  },
  {
    id: "period-4",
    type: "period",
    label: "Period 4",
    time: "10:00–10:40",
    subjects: {
      monday: "urdu",
      tuesday: "islamiyat",
      wednesday: "mathematics",
      thursday: "science",
      friday: "computer",
      saturday: "physical",
    },
  },
  { id: "break", type: "break", time: "10:40–11:10" },
  {
    id: "period-5",
    type: "period",
    label: "Period 5",
    time: "11:10–11:50",
    subjects: {
      monday: "computer",
      tuesday: "physical",
      wednesday: "english",
      thursday: "urdu",
      friday: "islamiyat",
      saturday: "mathematics",
    },
  },
  {
    id: "period-6",
    type: "period",
    label: "Period 6",
    time: "11:50–12:30",
    subjects: {
      monday: "islamiyat",
      tuesday: "mathematics",
      wednesday: "science",
      thursday: "computer",
      friday: "physical",
      saturday: "english",
    },
  },
  {
    id: "period-7",
    type: "period",
    label: "Period 7",
    time: "12:30–13:10",
    subjects: {
      monday: "physical",
      tuesday: "english",
      wednesday: "urdu",
      thursday: "islamiyat",
      friday: "mathematics",
      saturday: "science",
    },
  },
];
