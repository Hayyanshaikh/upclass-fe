"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type StorageValue = string | number | boolean | object | null;

interface StorageState {
  values: Record<string, StorageValue>;
  setValue: (key: string, value: StorageValue) => void;
  updateValue: (key: string, value: StorageValue) => void;
  getValue: (key: string) => StorageValue | undefined;
  deleteValue: (key: string) => void;
  clearStorage: () => void;
}

export const useStorageStore = create<StorageState>()(
  persist(
    (set, get) => ({
      values: {},

      setValue: (key, value) =>
        set((state) => ({
          values: { ...state.values, [key]: value },
        })),

      updateValue: (key, value) =>
        set((state) => ({
          values: { ...state.values, [key]: value },
        })),

      getValue: (key) => get().values[key],

      deleteValue: (key) =>
        set((state) => {
          const values = { ...state.values };
          delete values[key];
          return { values };
        }),

      clearStorage: () => set({ values: {} }),
    }),
    {
      name: "app-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
