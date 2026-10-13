import type { Dayjs } from "dayjs";

export type EmployeeLeaveStatus = "Pending" | "Approved" | "Rejected";

export type EmployeeLeaveRequest = {
  id: string;
  leaveType: "Casual leave" | "Medical leave" | "Annual leave";
  dates: string;
  days: number;
  status: EmployeeLeaveStatus;
};

export type LeaveBalance = {
  type: EmployeeLeaveRequest["leaveType"];
  remaining: number;
  total: number;
  used: number;
};
export type ApplyLeaveFormValues = {
  leaveType: EmployeeLeaveRequest["leaveType"];
  fromDate?: Dayjs;
  toDate?: Dayjs;
  totalDays: string;
  halfDay: boolean;
  reason?: string;
  attachments?: { name: string }[];
  contact?: string;
  substitute?: string;
};
