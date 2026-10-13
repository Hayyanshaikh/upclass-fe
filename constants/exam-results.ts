import { classes } from "@/constants/classes";
import { exams } from "@/constants/exams";
import type { ExamResult } from "@/types/exam-results";
import type { SelectFilterField, TableAction } from "@/types/table-toolbar";

export const resultsDefaultExamId = "EX-001";
export const resultsDefaultClassId = "8-A";
export const resultsTotalStudents = 38;

export const resultsPublishSummary = {
  className: resultsDefaultClassId,
  passed: 36,
  failed: 2,
};

// Sample result records for the UI preview until result endpoints are available.
export const examResults: ExamResult[] = [
  { id: "1012", rank: 1, name: "Ayesha Khan", roll: "1012", total: 534, maximum: 600, grade: "A", result: "Pass" },
  { id: "1052", rank: 2, name: "Maryam Tariq", roll: "1052", total: 502, maximum: 600, grade: "A", result: "Pass" },
  { id: "1058", rank: 3, name: "Daniyal Shah", roll: "1058", total: 468, maximum: 600, grade: "B", result: "Pass" },
  { id: "1066", rank: 4, name: "Iqra Nadeem", roll: "1066", total: 431, maximum: 600, grade: "B", result: "Pass" },
  { id: "1013", rank: 5, name: "Bilal Ahmed", roll: "1013", total: 372, maximum: 600, grade: "C", result: "Pass" },
  { id: "1071", rank: 6, name: "Saad Hussain", roll: "1071", total: 214, maximum: 600, grade: "F", result: "Fail" },
];

export const resultsFilterFields: SelectFilterField[] = [
  { name: "exam", label: "Exam", options: exams.map((exam) => ({ label: exam.name, value: exam.id })), value: resultsDefaultExamId, allowClear: false },
  { name: "class", label: "Class", options: classes.map((schoolClass) => ({ label: `Class ${schoolClass.id}`, value: schoolClass.id })), value: resultsDefaultClassId, allowClear: false },
  { name: "result", label: "Result", options: [
    { label: "Any", value: "any" },
    { label: "Pass", value: "Pass" },
    { label: "Fail", value: "Fail" },
  ], value: "any", allowClear: false },
  { name: "sort", label: "Sort by", options: [
    { label: "Rank", value: "rank" },
    { label: "Percentage", value: "percentage" },
    { label: "Student name", value: "name" },
  ], value: "rank", allowClear: false },
];

export const resultsHeaderActions: TableAction[] = [
  { label: "Export CSV", variant: "secondary" },
  { label: "Print all cards", variant: "secondary" },
  { label: "Publish results" },
];
