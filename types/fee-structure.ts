export type FeeStructure = {
  id: string;
  grade: number;
  academicYear: string;
  tuition: number;
  examFee: number;
  labFee: number;
  sportsFee: number;
  status: "Active" | "Inactive";
  frequency?: "Monthly" | "Quarterly" | "Yearly";
  dueDay?: number;
  lateFine?: number;
  siblingDiscount?: number;
  gracePeriod?: string;
  feeHeads?: FeeHead[];
};

export type FeeHead = {
  name: string;
  amount: number;
};

export type FeeStructureFormValues = {
  grade?: string;
  academicYear: string;
  frequency: "Monthly" | "Quarterly" | "Yearly";
  status: "Active" | "Inactive";
  feeHeads: FeeHead[];
  dueDay?: number;
  lateFine?: number;
  siblingDiscount?: number;
  gracePeriod: string;
};

export type FeeStructureStore = {
  records: FeeStructure[];
  saveStructure: (structure: FeeStructure) => void;
  deleteStructure: (id: string) => void;
};
