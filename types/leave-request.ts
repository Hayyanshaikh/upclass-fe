export type LeaveRequestStatus = "Pending" | "Approved" | "Rejected" | "Cancelled";

export type LeaveRequest = {
  id: string;
  teacherName: string;
  teacherId: string;
  leaveType: "Casual leave" | "Annual leave" | "Medical leave";
  dates: string;
  days: number;
  status: LeaveRequestStatus;
  subject: string;
  balanceAfterApproval: string;
  reason: string;
  affectedClasses: string[];
  suggestedSubstitute: string;
  rejectionReason?: string;
};
