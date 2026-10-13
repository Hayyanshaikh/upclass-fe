import type { MarksEntryStudent } from "@/types/marks-entry";

export const marksEntryDefaultExamId = "EX-002";
export const marksEntryTotalStudents = 38;

// Sample marks for the UI preview until marks endpoints are available.
export const marksEntryStudents: MarksEntryStudent[] = [
  { id: "1012", roll: "1012", name: "Ayesha Khan", marks: 92, absent: false, remarks: "" },
  { id: "1013", roll: "1013", name: "Bilal Ahmed", marks: 45, absent: false, remarks: "" },
  { id: "1021", roll: "1021", name: "Hira Siddiqui", marks: 78, absent: false, remarks: "" },
  { id: "1034", roll: "1034", name: "Usman Raza", marks: 34, absent: false, remarks: "Needs support" },
  { id: "1040", roll: "1040", name: "Zainab Ali", marks: 88, absent: false, remarks: "" },
  { id: "1047", roll: "1047", name: "Hamza Sheikh", marks: 61, absent: false, remarks: "" },
  { id: "1052", roll: "1052", name: "Maryam Tariq", absent: true, remarks: "Absent with leave" },
  { id: "1058", roll: "1058", name: "Daniyal Shah", marks: 70, absent: false, remarks: "" },
];

export const marksEntryGrades = [
  { minimum: 90, label: "A+", variant: "success" },
  { minimum: 80, label: "A", variant: "success" },
  { minimum: 70, label: "B", variant: "success" },
  { minimum: 60, label: "C", variant: "success" },
  { minimum: 50, label: "D", variant: "warning" },
  { minimum: 40, label: "E", variant: "warning" },
  { minimum: 0, label: "F", variant: "danger" },
] as const;
