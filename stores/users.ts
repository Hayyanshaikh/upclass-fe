"use client";

import { create } from "zustand";
import { initialUsers } from "@/constants/users";
import type { UserStore } from "@/types/user-management";

// UI preview data stays in memory until the user API is connected.
export const useUserStore = create<UserStore>((set) => ({
  records: initialUsers,
  saveUser: (user, originalId) =>
    set((state) => ({
      records: originalId
        ? state.records.map((record) =>
            record.id === originalId ? user : record,
          )
        : [user, ...state.records],
    })),
  deleteUser: (id) =>
    set((state) => ({
      records: state.records.filter((record) => record.id !== id),
    })),
}));
