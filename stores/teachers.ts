"use client";

import { create } from "zustand";
import { teachers } from "@/constants/teachers";
import type { TeacherStore } from "@/types/teacher";

// Keep preview changes available while navigating between list and form routes.
export const useTeacherStore = create<TeacherStore>((set) => ({
  records: teachers,
  saveTeacher: (teacher, originalId) => set((state) => ({
    records: originalId
      ? state.records.map((record) => record.id === originalId ? teacher : record)
      : [teacher, ...state.records],
  })),
  deleteTeacher: (id) => set((state) => ({
    records: state.records.filter((teacher) => teacher.id !== id),
  })),
}));
