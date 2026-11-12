"use client";

import { useSectionsControllerLookup } from "@/app/api/endpoints";
import { useMemo } from "react";

export const useSectionDropdown = () => {
  const { data, isLoading, isError } = useSectionsControllerLookup();

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
