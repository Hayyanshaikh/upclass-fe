"use client";

import { useTimetableControllerClassSections } from "@/app/api/endpoints";

export function useTimetableClassSections() {
  const { data, isLoading, isError } = useTimetableControllerClassSections();

  return {
    classSections: data?.data ?? [],
    isLoading,
    isError,
  };
}
