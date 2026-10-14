export type FeeStructure = {
  id: string;
  grade: number;
  academicYear: string;
  tuition: number;
  examFee: number;
  labFee: number;
  sportsFee: number;
  status: "Active" | "Inactive";
};
