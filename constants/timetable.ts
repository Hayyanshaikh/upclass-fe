import type { FilterField } from "@/types/table-toolbar";
import type {
  TimetableDayOption,
  TimetableSubject,
  TimetableSubjectKey,
} from "@/types/timetable";

export const timetableDays: TimetableDayOption[] = [
  { key: "monday", label: "Monday" },
  { key: "tuesday", label: "Tuesday" },
  { key: "wednesday", label: "Wednesday" },
  { key: "thursday", label: "Thursday" },
  { key: "friday", label: "Friday" },
  { key: "saturday", label: "Saturday" },
  { key: "sunday", label: "Sunday" },
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

