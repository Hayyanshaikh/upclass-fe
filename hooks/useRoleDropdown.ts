"use client";

import { useRolesControllerFindAll } from "@/app/api/endpoints";
import { useMemo } from "react";

export const useRoleDropdown = () => {
  const { data, isLoading, isError } = useRolesControllerFindAll();

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
