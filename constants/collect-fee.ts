export type OutstandingFee = {
  month: string;
  total: number;
  balance: number;
  status: "Overdue" | "Due";
};

export const collectFeeStudent = {
  name: "Bilal Ahmed",
  className: "8-A",
  roll: "1013",
  guardian: "Naveed Ahmed",
};

export const outstandingFees: OutstandingFee[] = [
  { month: "Sep [2026]", total: 12500, balance: 4500, status: "Overdue" },
  { month: "Oct [2026]", total: 12500, balance: 12500, status: "Due" },
];

export const overdueFine = 500;
