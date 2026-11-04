"use client";

import { useSubjectsControllerLookup } from "@/app/api/endpoints";
import { useMemo } from "react";

export const useSubjectDropdown = () => {
  const { data, isLoading, isError } = useSubjectsControllerLookup();

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
