export type FeeStatus = "Paid" | "Partial" | "Pending" | "Overdue";

export type FeeRecord = {
  id: string;
  student: string;
  roll: string;
  className: string;
  month: string;
  total: number;
  paid: number;
  status: FeeStatus;
};
