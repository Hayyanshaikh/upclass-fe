import type { SchoolClass } from "@/types/classes";

export const classGradeOptions = Array.from({ length: 10 }, (_, index) => ({ label: `Class ${index + 1}`, value: String(index + 1) }));
export const academicYearOptions = ["2026-27", "2025-26", "2027-28"].map((value) => ({ label: value, value }));
export const classStatusOptions = ["Active", "Inactive"].map((value) => ({ label: value, value }));
export const classFormDefaults = {
  academicYear: "2026-27",
  status: "Active",
  assistantTeacherId: "",
  subjects: [{}, {}, {}],
};

// Sample records for the classes preview.
export const classes: SchoolClass[] = [
  { id: "8-A", grade: "8", section: "A", teacherId: "T-014", students: 38, room: "Room 12", capacity: 40, academicYear: "2026-27", status: "Active", subjects: [{ subject: "Mathematics", teacherId: "T-014", periodsPerWeek: 5 }, { subject: "English", teacherId: "T-021", periodsPerWeek: 4 }, { subject: "Science", teacherId: "T-027", periodsPerWeek: 4 }] },
  { id: "8-B", grade: "8", section: "B", teacherId: "T-038", students: 36, room: "Room 13", capacity: 40, academicYear: "2026-27", status: "Active", subjects: [{ subject: "Computer", teacherId: "T-038", periodsPerWeek: 3 }] },
  { id: "7-A", grade: "7", section: "A", teacherId: "T-032", students: 40, room: "Room 9", capacity: 45, academicYear: "2026-27", status: "Active", subjects: [{ subject: "Urdu", teacherId: "T-032", periodsPerWeek: 4 }] },
  { id: "7-B", grade: "7", section: "B", teacherId: "T-021", students: 37, room: "Room 10", capacity: 40, academicYear: "2026-27", status: "Active", subjects: [{ subject: "English", teacherId: "T-021", periodsPerWeek: 5 }] },
  { id: "6-A", grade: "6", section: "A", teacherId: "T-045", students: 35, room: "Room 4", capacity: 40, academicYear: "2026-27", status: "Active", subjects: [{ subject: "Islamiyat", teacherId: "T-045", periodsPerWeek: 3 }] },
  { id: "9-C", grade: "9", section: "C", teacherId: "T-027", students: 39, room: "Lab 2", capacity: 40, academicYear: "2026-27", status: "Active", subjects: [{ subject: "Science", teacherId: "T-027", periodsPerWeek: 5 }] },
  { id: "6-B", grade: "6", section: "B", teacherId: "T-048", students: 32, room: "Room 5", capacity: 40, academicYear: "2026-27", status: "Active", subjects: [] },
  { id: "9-A", grade: "9", section: "A", teacherId: "T-054", students: 34, room: "Room 14", capacity: 40, academicYear: "2026-27", status: "Active", subjects: [] },
  { id: "9-B", grade: "9", section: "B", teacherId: "T-051", students: 33, room: "Room 15", capacity: 40, academicYear: "2026-27", status: "Active", subjects: [] },
  { id: "10-A", grade: "10", section: "A", teacherId: "T-061", students: 30, room: "Room 16", capacity: 35, academicYear: "2026-27", status: "Active", subjects: [] },
  { id: "10-B", grade: "10", section: "B", teacherId: "T-064", students: 28, room: "Room 17", capacity: 35, academicYear: "2026-27", status: "Active", subjects: [] },
  { id: "5-A", grade: "5", section: "A", teacherId: "T-057", students: 0, room: "Room 3", capacity: 35, academicYear: "2026-27", status: "Inactive", subjects: [] },
];
