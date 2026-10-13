import type { EmployeeLeaveRequest, LeaveBalance } from "@/types/employee-leave";

export const leaveBalances: LeaveBalance[] = [
  { type: "Casual leave", remaining: 6, total: 8, used: 2 },
  { type: "Medical leave", remaining: 9, total: 10, used: 1 },
  { type: "Annual leave", remaining: 14, total: 15, used: 1 },
];

export const leaveTypeOptions = leaveBalances.map(({ type }) => ({ label: type, value: type }));

export const substituteOptions = [
  { label: "None", value: "None" },
  { label: "Rabia Anwar", value: "Rabia Anwar" },
  { label: "Faisal Qureshi", value: "Faisal Qureshi" },
];

export const employeeLeaveRequests: EmployeeLeaveRequest[] = [
  { id: "EL-001", leaveType: "Casual leave", dates: "20 Oct 2026", days: 1, status: "Pending" },
  { id: "EL-002", leaveType: "Medical leave", dates: "04 Sep 2026", days: 1, status: "Approved" },
  { id: "EL-003", leaveType: "Casual leave", dates: "18 Aug - 19 Aug 2026", days: 2, status: "Approved" },
  { id: "EL-004", leaveType: "Annual leave", dates: "10 Jul 2026", days: 1, status: "Approved" },
  { id: "EL-005", leaveType: "Casual leave", dates: "02 Jun 2026", days: 1, status: "Rejected" },
];
