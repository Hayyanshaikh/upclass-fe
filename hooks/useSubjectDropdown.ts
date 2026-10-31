"use client";

import { useSubjectsControllerFindAll } from "@/app/api/endpoints";
import { useMemo } from "react";

export const useSubjectDropdown = () => {
  const { data, isLoading, isError } = useSubjectsControllerFindAll({ limit: 9999 });

  const options = useMemo(() => {
    return (data?.data ?? []).map((item) => ({
      label: `${item.name} (${item.code})`,
      value: item.id,
    }));
  }, [data]);

  return {
    options,
    isLoading,
    isError,
  };
};
