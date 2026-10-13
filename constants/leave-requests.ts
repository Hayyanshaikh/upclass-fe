import type { LeaveRequest } from "@/types/leave-request";
import type { SelectOption } from "@/types/select";

export const leaveRequests: LeaveRequest[] = [
  { id: "LR-001", teacherName: "Sara Malik", teacherId: "T-014", leaveType: "Casual leave", dates: "20 Oct 2026", days: 1, status: "Pending", subject: "Mathematics", balanceAfterApproval: "14 of 15 days", reason: "Family commitment", affectedClasses: ["8-A", "9-C"], suggestedSubstitute: "Rabia Anwar" },
  { id: "LR-002", teacherName: "Omar Farooq", teacherId: "T-021", leaveType: "Annual leave", dates: "25 Oct - 29 Oct 2026", days: 5, status: "Pending", subject: "English", balanceAfterApproval: "9 of 15 days", reason: "[Reason written by the teacher]", affectedClasses: ["7-A", "7-B", "6-B"], suggestedSubstitute: "Faisal Qureshi" },
  { id: "LR-003", teacherName: "Kamran Yousuf", teacherId: "T-032", leaveType: "Casual leave", dates: "14 Oct 2026", days: 1, status: "Pending", subject: "Urdu", balanceAfterApproval: "11 of 15 days", reason: "Personal work", affectedClasses: ["7-A", "7-B"], suggestedSubstitute: "Omar Farooq" },
  { id: "LR-004", teacherName: "Rabia Anwar", teacherId: "T-038", leaveType: "Casual leave", dates: "15 Oct 2026", days: 1, status: "Pending", subject: "Computer", balanceAfterApproval: "12 of 15 days", reason: "Appointment", affectedClasses: ["8-A", "8-B"], suggestedSubstitute: "Faisal Qureshi" },
  { id: "LR-005", teacherName: "Adnan Javed", teacherId: "T-056", leaveType: "Medical leave", dates: "19 Oct - 20 Oct 2026", days: 2, status: "Pending", subject: "Physical Ed.", balanceAfterApproval: "8 of 10 days", reason: "Medical appointment", affectedClasses: ["6-A", "6-B"], suggestedSubstitute: "Kamran Yousuf" },
  { id: "LR-006", teacherName: "Nadia Hussain", teacherId: "T-027", leaveType: "Medical leave", dates: "10 Oct - 12 Oct 2026", days: 3, status: "Approved", subject: "Science", balanceAfterApproval: "7 of 10 days", reason: "Medical leave", affectedClasses: ["9-C", "10-A"], suggestedSubstitute: "Sara Malik" },
  { id: "LR-007", teacherName: "Mehwish Iqbal", teacherId: "T-051", leaveType: "Casual leave", dates: "09 Oct 2026", days: 1, status: "Rejected", subject: "Islamiyat", balanceAfterApproval: "15 of 15 days", reason: "Personal work", affectedClasses: ["8-B"], suggestedSubstitute: "None" },
];

export const leaveRequestsTotal = 19;

export const leaveRequestFilterFields = [
  {
    name: "leaveType",
    label: "Leave type",
    placeholder: "Any",
    options: [
      { label: "Casual leave", value: "casual" },
      { label: "Annual leave", value: "annual" },
      { label: "Medical leave", value: "medical" },
    ] satisfies SelectOption[],
  },
  {
    name: "month",
    label: "Month",
    placeholder: "October [2026]",
    options: [
      { label: "October [2026]", value: "2026-10" },
      { label: "September [2026]", value: "2026-09" },
      { label: "August [2026]", value: "2026-08" },
    ] satisfies SelectOption[],
  },
  {
    name: "status",
    label: "Status",
    placeholder: "Any",
    options: [
      { label: "Pending", value: "Pending" },
      { label: "Approved", value: "Approved" },
      { label: "Rejected", value: "Rejected" },
    ] satisfies SelectOption[],
  },
];
