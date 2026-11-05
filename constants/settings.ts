import {
  UpdateSchoolDtoDateFormat,
  UpdateSchoolDtoEducationSystem,
} from "@/app/api/schemas";
import type {
  FeeHead,
  LeaveType,
  SettingsUser,
} from "@/types/settings";

export const leaveTypes: LeaveType[] = [
  { id: "casual", name: "Casual leave", days: 8 },
  { id: "medical", name: "Medical leave", days: 10 },
  { id: "annual", name: "Annual leave", days: 15 },
];

export const feeHeads: FeeHead[] = [
  { id: "tuition", name: "Tuition fee", required: true, amount: 10500 },
  { id: "exam", name: "Exam fee", required: true, amount: 1000 },
  { id: "lab", name: "Lab fee", required: false, amount: 500 },
  { id: "sports", name: "Sports fee", required: false, amount: 500 },
];

export const settingsUsers: SettingsUser[] = [
  {
    id: "imran",
    name: "Imran Sheikh",
    role: "Super admin",
    email: "imran@school.edu",
    status: "Active",
  },
  {
    id: "sara",
    name: "Sara Malik",
    role: "Teacher",
    email: "sara@school.edu",
    status: "Active",
  },
  {
    id: "desk",
    name: "Front Desk",
    role: "Staff",
    email: "frontdesk@school.edu",
    status: "Active",
  },
  {
    id: "guest",
    name: "Guest Auditor",
    role: "Viewer",
    email: "—",
    status: "Inactive",
  },
];

export const DAYS_OPTIONS = [
  { label: "Monday", value: "MONDAY" },
  { label: "Tuesday", value: "TUESDAY" },
  { label: "Wednesday", value: "WEDNESDAY" },
  { label: "Thursday", value: "THURSDAY" },
  { label: "Friday", value: "FRIDAY" },
  { label: "Saturday", value: "SATURDAY" },
  { label: "Sunday", value: "SUNDAY" },
];

export const DATE_FORMAT_OPTIONS = [
  { label: "DD/MM/YYYY", value: UpdateSchoolDtoDateFormat["DD/MM/YYYY"] },
  { label: "MM/DD/YYYY", value: UpdateSchoolDtoDateFormat["MM/DD/YYYY"] },
  { label: "YYYY-MM-DD", value: UpdateSchoolDtoDateFormat["YYYY-MM-DD"] },
];

export const EDUCATION_SYSTEM_OPTIONS = [
  { label: "Matric", value: UpdateSchoolDtoEducationSystem.MATRIC },
  { label: "Cambridge", value: UpdateSchoolDtoEducationSystem.CAMBRIDGE },
  { label: "Federal Board", value: UpdateSchoolDtoEducationSystem.FEDERAL },
  { label: "Other", value: UpdateSchoolDtoEducationSystem.OTHER },
];
