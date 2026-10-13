import type { ExamDetails } from "@/types/exam";

const gradingDefaults = {
  term: "term-1",
  academicYear: "2026-27",
  passingPercentage: 40,
  gradingScale: "letter",
  showRank: "yes",
  notifyParents: "yes",
};

// Sample details for the existing exam records until exam endpoints are available.
export const examDetails = {
  "EX-001": {
    ...gradingDefaults,
    startDate: "2026-10-20", endDate: "2026-10-30", selectedClasses: ["6", "7", "8", "9", "10"],
    dateSheet: [
      { subject: "Mathematics", date: "2026-10-20", startTime: "09:00", totalMarks: 100, passingMarks: 40 },
      { subject: "English", date: "2026-10-21", startTime: "09:00", totalMarks: 100, passingMarks: 40 },
      { subject: "Science", date: "2026-10-23", startTime: "09:00", totalMarks: 100, passingMarks: 40 },
      { subject: "Urdu", date: "2026-10-26", startTime: "09:00", totalMarks: 100, passingMarks: 40 },
      { subject: "Computer", date: "2026-10-27", startTime: "09:00", totalMarks: 100, passingMarks: 40 },
      { subject: "Islamiyat", date: "2026-10-29", startTime: "09:00", totalMarks: 100, passingMarks: 40 },
      { subject: "Physical Ed.", date: "2026-10-30", startTime: "09:00", totalMarks: 100, passingMarks: 40 },
    ],
  },
  "EX-002": {
    ...gradingDefaults,
    startDate: "2026-10-10", endDate: "2026-10-12", selectedClasses: ["8"],
    dateSheet: [
      { subject: "Mathematics", date: "2026-10-10", startTime: "08:00", totalMarks: 100, passingMarks: 40 },
      { subject: "English", date: "2026-10-11", startTime: "08:00", totalMarks: 100, passingMarks: 40 },
      { subject: "Science", date: "2026-10-12", startTime: "08:00", totalMarks: 100, passingMarks: 40 },
    ],
  },
  "EX-003": {
    ...gradingDefaults,
    startDate: "2026-10-07", endDate: "2026-10-07", selectedClasses: ["8"],
    dateSheet: [
      { subject: "Mathematics", date: "2026-10-07", startTime: "08:00", totalMarks: 20, passingMarks: 8 },
    ],
  },
  "EX-004": {
    ...gradingDefaults,
    startDate: "2026-10-08", endDate: "2026-10-09", selectedClasses: ["9"],
    dateSheet: [
      { subject: "Science", date: "2026-10-08", startTime: "10:00", totalMarks: 50, passingMarks: 20 },
      { subject: "Computer", date: "2026-10-09", startTime: "10:00", totalMarks: 50, passingMarks: 20 },
    ],
  },
  "EX-005": {
    ...gradingDefaults,
    startDate: "2026-09-15", endDate: "2026-09-17", selectedClasses: ["6", "7", "8", "9", "10"],
    dateSheet: [
      { subject: "Mathematics", date: "2026-09-15", startTime: "08:00", totalMarks: 100, passingMarks: 40 },
      { subject: "English", date: "2026-09-16", startTime: "08:00", totalMarks: 100, passingMarks: 40 },
      { subject: "Science", date: "2026-09-17", startTime: "08:00", totalMarks: 100, passingMarks: 40 },
      { subject: "Urdu", date: "2026-09-17", startTime: "10:00", totalMarks: 100, passingMarks: 40 },
    ],
  },
  "EX-006": {
    ...gradingDefaults,
    startDate: "2026-09-01", endDate: "2026-09-04", selectedClasses: ["6", "7", "8", "9", "10"],
    dateSheet: [
      { subject: "Mathematics", date: "2026-09-01", startTime: "08:00", totalMarks: 100, passingMarks: 40 },
      { subject: "English", date: "2026-09-02", startTime: "08:00", totalMarks: 100, passingMarks: 40 },
      { subject: "Science", date: "2026-09-03", startTime: "08:00", totalMarks: 100, passingMarks: 40 },
      { subject: "Urdu", date: "2026-09-04", startTime: "08:00", totalMarks: 100, passingMarks: 40 },
      { subject: "Islamiyat", date: "2026-09-04", startTime: "10:00", totalMarks: 100, passingMarks: 40 },
    ],
  },
} satisfies Record<string, ExamDetails>;
