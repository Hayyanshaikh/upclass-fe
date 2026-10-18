import type { AcademicYear, FeeHead, LeaveType, SettingsUser } from "@/types/settings";

export const academicYears: AcademicYear[] = [
  { id: "2026", year: "2026–27", duration: "Aug 2026 – Jun 2027", status: "Active" },
  { id: "2025", year: "2025–26", duration: "Aug 2025 – Jun 2026", status: "Closed" },
];

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
  { id: "imran", name: "Imran Sheikh", role: "Super admin", email: "imran@school.edu", status: "Active" },
  { id: "sara", name: "Sara Malik", role: "Teacher", email: "sara@school.edu", status: "Active" },
  { id: "desk", name: "Front Desk", role: "Staff", email: "frontdesk@school.edu", status: "Active" },
  { id: "guest", name: "Guest Auditor", role: "Viewer", email: "—", status: "Inactive" },
];
