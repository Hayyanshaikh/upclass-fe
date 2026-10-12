import type { BarChartItem } from "@/types/bar-chart";
import type { DashboardNotice, TimetableEntry } from "@/types/dashboard";

// Preview data until the dashboard endpoints are available.
export const academicTerm = "Academic year [2026–27] · Term 1";

export const feeCollection = {
  percent: 72,
  paid: 1162,
  pending: 86,
};

export const weeklyAttendance: BarChartItem[] = [
  { label: "Mon", value: 100 },
  { label: "Tue", value: 90 },
  { label: "Wed", value: 93 },
  { label: "Thu", value: 77, variant: "secondary" },
  { label: "Fri", value: 91 },
  { label: "Sat", value: 400 },
];

export const todayTimetable: TimetableEntry[] = [
  { id: "math", time: "08:00", subject: "Mathematics", className: "8-A", room: "Room 12", status: "Done" },
  { id: "english", time: "09:00", subject: "English", className: "6-B", room: "Room 4", status: "Ongoing" },
  { id: "science", time: "10:30", subject: "Science Lab", className: "9-C", room: "Lab 2", status: "Next" },
  { id: "urdu", time: "11:30", subject: "Urdu", className: "7-A", room: "Room 9", status: "Next" },
];

export const recentNotices: DashboardNotice[] = [
  {
    id: "exams",
    title: "Mid-term exam schedule published",
    category: "Exams",
    date: "[date]",
    body: "The mid-term examination schedule is ready for review. Students should confirm their subjects and exam timings with their class teacher.",
  },
  {
    id: "meeting",
    title: "Parent-teacher meeting",
    category: "Events",
    date: "[date]",
    body: "Parents are invited to meet class teachers to discuss student progress, attendance and learning goals. Meeting timings will be shared by the school office.",
  },
  {
    id: "fees",
    title: "Fee deadline reminder",
    category: "Accounts",
    date: "[date]",
    body: "Please clear outstanding term fees by the due date on your fee voucher. Contact the accounts office for payment queries.",
  },
  {
    id: "sports",
    title: "Sports day registration open",
    category: "Activities",
    date: "[date]",
    body: "Students can register for sports day through their class teacher. Event details and participation requirements are available from the activities coordinator.",
  },
];
