import { classGradeOptions } from "@/constants/classes";
import { teacherSubjects } from "@/constants/teachers";

export const examClassOptions = classGradeOptions.filter((option) => Number(option.value) >= 6);
export const examSubjectOptions = teacherSubjects.map((value) => ({ label: value, value }));

export const examTermOptions = [
  { label: "Term 1 [2026–27]", value: "term-1" },
  { label: "Term 2 [2026–27]", value: "term-2" },
];

export const examGradingOptions = [
  { label: "A+ to F (default)", value: "letter" },
  { label: "Percentage only", value: "percentage" },
  { label: "Pass / Fail", value: "pass-fail" },
];

export const examYesNoOptions = [
  { label: "Yes", value: "yes" },
  { label: "No", value: "no" },
];

export const examDateSheetDefaults = { totalMarks: 100, passingMarks: 40 };

export const examFormDefaults = {
  term: "term-1",
  academicYear: "2026-27",
  classes: {},
  dateSheet: [{ ...examDateSheetDefaults }, { ...examDateSheetDefaults }, { ...examDateSheetDefaults }],
  passingPercentage: 40,
  gradingScale: "letter",
  showRank: "yes",
  notifyParents: "yes",
};
