"use client";

import { create } from "zustand";
import { initialAttendance } from "@/constants/attendance";
import { attendanceDate, attendanceKey } from "@/utils/attendance";
import type { AttendanceStore } from "@/types/attendance";

export const useAttendanceStore = create<AttendanceStore>((set) => ({
  saved: { [attendanceKey("8-A", attendanceDate(), "full-day")]: initialAttendance },
  drafts: {},
  updateEntry: (key, studentId, patch) => set((state) => {
    const entries = state.drafts[key] ?? state.saved[key] ?? {};
    return { drafts: { ...state.drafts, [key]: {
      ...entries, [studentId]: { ...(entries[studentId] ?? { remarks: "" }), ...patch },
    } } };
  }),
  saveDraft: (key) => set((state) => {
    const drafts = { ...state.drafts };
    const entries = drafts[key] ?? state.saved[key] ?? {};
    delete drafts[key];
    return { saved: { ...state.saved, [key]: entries }, drafts };
  }),
}));
