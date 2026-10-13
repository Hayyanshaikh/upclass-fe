"use client";

import { create } from "zustand";
import { subjects } from "@/constants/subjects";
import type { SubjectStore } from "@/types/subject";

// Keep preview changes available while navigating between the list and form routes.
export const useSubjectStore = create<SubjectStore>((set) => ({
  records: subjects,
  saveSubject: (subject) => set((state) => ({
    records: state.records.some((record) => record.id === subject.id)
      ? state.records.map((record) => record.id === subject.id ? subject : record)
      : [subject, ...state.records],
  })),
  deleteSubject: (id) => set((state) => ({
    records: state.records.filter((subject) => subject.id !== id),
  })),
}));
