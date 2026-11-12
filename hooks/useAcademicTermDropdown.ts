"use client";

import { useAcademicTermsControllerLookup } from "@/app/api/endpoints";
import { useMemo } from "react";

export const useAcademicTermDropdown = () => {
  const { data, isLoading, isError } = useAcademicTermsControllerLookup();

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
