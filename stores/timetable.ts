"use client";

import { create } from "zustand";
import { initialTimetableAssignments } from "@/constants/timetable-assignments";
import { isSameSlot, teacherConflict } from "@/utils/timetable";
import type { TimetableStore } from "@/types/timetable";

export const useTimetableStore = create<TimetableStore>((set) => ({
  assignments: initialTimetableAssignments,
  savePeriod: (slot, values) => {
    let saved = false;
    set((state) => {
      if (!values.subject.trim() || !values.teacherId || !values.room.trim() ||
        teacherConflict(state.assignments, slot, values.teacherId)) return state;
      saved = true;
      return { assignments: [...state.assignments.filter((assignment) => !isSameSlot(assignment, slot)), {
        classId: slot.classId, term: slot.term, periodId: slot.periodId, day: slot.day,
        subject: values.subject.trim(), teacherId: values.teacherId, room: values.room.trim(),
      }] };
    });
    return saved;
  },
  clearPeriod: (slot) => set((state) => ({ assignments: state.assignments.filter((assignment) => !isSameSlot(assignment, slot)) })),
}));
