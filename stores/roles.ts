"use client";

import { create } from "zustand";
import { schoolRoles } from "@/constants/roles";
import type { RoleStore } from "@/types/role";

// Role changes stay in this frontend preview until the page is refreshed.
export const useRoleStore = create<RoleStore>((set) => ({
  records: schoolRoles,
  saveRole: (role, originalId) =>
    set((state) => ({
      records: originalId
        ? state.records.map((record) => record.id === originalId ? role : record)
        : [...state.records, role],
    })),
  deleteRole: (id) =>
    set((state) => ({ records: state.records.filter((record) => record.id !== id) })),
  duplicateRole: (id) =>
    set((state) => {
      const role = state.records.find((record) => record.id === id);
      if (!role) return state;
      const names = new Set(state.records.map((record) => record.name.toLowerCase()));
      let name = `${role.name} copy`;
      let number = 2;
      while (names.has(name.toLowerCase())) {
        name = `${role.name} copy ${number}`;
        number += 1;
      }
      return {
        records: [...state.records, {
          ...role,
          id: crypto.randomUUID(),
          name,
          users: 0,
          assignedUsers: [],
          permissions: Object.fromEntries(Object.entries(role.permissions).map(([module, actions]) => [module, [...actions]])),
          type: "Custom",
        }],
      };
    }),
}));
