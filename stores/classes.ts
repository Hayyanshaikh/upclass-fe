"use client";

import { create } from "zustand";
import { classes } from "@/constants/classes";
import type { ClassStore } from "@/types/classes";

export const useClassStore = create<ClassStore>((set) => ({
  records: classes,
  saveClass: (schoolClass) => set((state) => ({
    records: state.records.some((record) => record.id === schoolClass.id)
      ? state.records.map((record) => record.id === schoolClass.id ? schoolClass : record)
      : [schoolClass, ...state.records],
  })),
  deleteClass: (id) => set((state) => ({ records: state.records.filter((record) => record.id !== id) })),
}));
