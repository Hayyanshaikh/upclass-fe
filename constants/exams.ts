import { classGradeOptions } from "@/constants/classes";
import { examDetails } from "@/constants/exam-details";
import type { Exam } from "@/types/exam";
import type { FilterField, TableAction } from "@/types/table-toolbar";

export const exams: Exam[] = [
  { id: "EX-001", details: examDetails["EX-001"], name: "Mid-term Exam", classes: "Classes 6–10", dates: "20 Oct – 30 Oct 2026", subjects: 7, type: "Mid-term", status: "Scheduled" },
  { id: "EX-002", details: examDetails["EX-002"], name: "Monthly Test (Oct)", classes: "Class 8", dates: "10 Oct – 12 Oct 2026", subjects: 3, type: "Monthly test", status: "Ongoing" },
  { id: "EX-003", details: examDetails["EX-003"], name: "Class 8-A Quiz", classes: "Class 8-A", dates: "07 Oct 2026", subjects: 1, type: "Quiz", status: "Marks pending" },
  { id: "EX-004", details: examDetails["EX-004"], name: "Class 9 Practical", classes: "Class 9", dates: "08 Oct – 09 Oct 2026", subjects: 2, type: "Practical", status: "Completed" },
  { id: "EX-005", details: examDetails["EX-005"], name: "Monthly Test (Sep)", classes: "Classes 6–10", dates: "15 Sep – 17 Sep 2026", subjects: 4, type: "Monthly test", status: "Results published" },
  { id: "EX-006", details: examDetails["EX-006"], name: "First Unit Test", classes: "Classes 6–10", dates: "01 Sep – 04 Sep 2026", subjects: 5, type: "Unit test", status: "Results published" },
];

export const examStatusVariants = {
  Scheduled: "info", Ongoing: "warning", "Marks pending": "warning",
  Completed: "neutral", "Results published": "success",
} as const;

export const examTypeOptions = [
  { label: "Mid-term", value: "Mid-term" },
  { label: "Monthly test", value: "Monthly test" },
  { label: "Quiz", value: "Quiz" },
  { label: "Practical", value: "Practical" },
  { label: "Unit test", value: "Unit test" },
];

export const examFilterFields: FilterField[] = [
  { name: "class", label: "Class", placeholder: "All classes", options: classGradeOptions },
  { name: "type", label: "Type", placeholder: "Any type", options: examTypeOptions },
  { name: "status", label: "Status", placeholder: "Any status", options: [
    { label: "Scheduled", value: "Scheduled" },
    { label: "Ongoing", value: "Ongoing" },
    { label: "Marks pending", value: "Marks pending" },
    { label: "Completed", value: "Completed" },
    { label: "Results published", value: "Results published" },
  ] },
];

export const examToolbarActions: TableAction[] = [
  { label: "Results", variant: "secondary" },
  { label: "Export CSV", variant: "secondary" },
  { label: "Create exam" },
];
