"use client";

import { useClassesControllerLookup } from "@/app/api/endpoints";
import { useMemo } from "react";

export const useClassDropdown = () => {
  const { data, isLoading, isError } = useClassesControllerLookup();

  const options = useMemo(() => {
    return (data?.data ?? []).map((item) => ({
      label: item.name,
      value: item.id,
    }));
  }, [data]);

  return {
    options,
    isLoading,
    isError,
  };
};
