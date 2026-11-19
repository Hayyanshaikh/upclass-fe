"use client";

import { useClassesControllerFindClassSections } from "@/app/api/endpoints";

export const useClassSectionDropdown = (classId?: string) => {
  const { data, isLoading, isError } = useClassesControllerFindClassSections(
    { classId: classId ?? "" },
    { query: { enabled: Boolean(classId) } },
  );

  const options = (data?.data ?? []).map((item) => ({
    label: item.name,
    value: item.id,
  }));

  return {
    options,
    isLoading,
    isError,
  };
};
