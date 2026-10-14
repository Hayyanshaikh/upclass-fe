"use client";

import { create } from "zustand";
import { feeStructures } from "@/constants/fee-structure";
import type { FeeStructureStore } from "@/types/fee-structure";

export const useFeeStructureStore = create<FeeStructureStore>((set) => ({
  records: feeStructures,
  saveStructure: (structure) => set((state) => ({
    records: state.records.some((record) => record.id === structure.id)
      ? state.records.map((record) => record.id === structure.id ? structure : record)
      : [structure, ...state.records],
  })),
  deleteStructure: (id) => set((state) => ({ records: state.records.filter((record) => record.id !== id) })),
}));
