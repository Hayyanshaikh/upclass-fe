"use client";

import { useTimetableControllerFindClassSections } from "@/app/api/endpoints";

export function useTimetableClassSections() {
  const { data, isLoading, isError } = useTimetableControllerFindClassSections();

  return {
    classSections: data?.data ?? [],
    isLoading,
    isError,
  };
}
