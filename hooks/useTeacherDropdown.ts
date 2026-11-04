"use client";

import { useTeachersControllerLookup } from "@/app/api/endpoints";
import { useMemo } from "react";

export const useTeacherDropdown = () => {
  const { data, isLoading, isError } = useTeachersControllerLookup();

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
