import type { Teacher } from "@/types/teacher";
import type { SchoolClass } from "@/types/classes";
import type { TimetableAssignment, TimetableFilters, TimetableSlot } from "@/types/timetable";
import { timetableSubjects } from "@/constants/timetable";

export function isSameSlot(assignment: TimetableAssignment, slot: TimetableSlot) {
  return assignment.classId === slot.classId && assignment.term === slot.term &&
    assignment.periodId === slot.periodId && assignment.day === slot.day;
}

export function teacherConflict(assignments: TimetableAssignment[], slot: TimetableSlot, teacherId: string) {
  return assignments.find((assignment) => assignment.teacherId === teacherId &&
    assignment.term === slot.term && assignment.periodId === slot.periodId &&
    assignment.day === slot.day && assignment.classId !== slot.classId);
}

export function availableTeachers(teachers: Teacher[], assignments: TimetableAssignment[], slot: TimetableSlot) {
  return teachers.filter((teacher) => teacher.status === "Active" && !teacherConflict(assignments, slot, teacher.id));
}

export function filterTimetableAssignments(assignments: TimetableAssignment[], filters: TimetableFilters) {
  return assignments.filter((assignment) => {
    const [grade, section] = assignment.classId.split("-");
    return assignment.term === filters.term && (!filters.grade || grade === filters.grade) &&
      (!filters.section || section === filters.section) &&
      (!filters.teacherId || assignment.teacherId === filters.teacherId) &&
      (!filters.subject || assignment.subject === filters.subject);
  });
}

export function timetableSubjectOptions(teachers: Teacher[], classes: SchoolClass[], assignments: TimetableAssignment[]) {
  return [...new Set([
    ...Object.values(timetableSubjects).map((subject) => subject.name),
    ...classes.flatMap((schoolClass) => schoolClass.subjects.map((subject) => subject.subject)),
    ...teachers.map((teacher) => teacher.subject),
    ...assignments.map((assignment) => assignment.subject),
  ])].sort().map((value) => ({ label: value, value }));
}
