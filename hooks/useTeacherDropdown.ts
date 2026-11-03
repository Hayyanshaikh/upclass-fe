"use client";

import { useTeachersControllerFindAll } from "@/app/api/endpoints";
import { useMemo } from "react";

export const useTeacherDropdown = () => {
  const { data, isLoading, isError } = useTeachersControllerFindAll({
    limit: 9999,
  });

  const options = useMemo(() => {
    return (data?.data ?? []).map((item) => ({
      label: [item.firstName, item.lastName].filter(Boolean).join(" "),
      value: item.id,
    }));
  }, [data]);

  return {
    options,
    isLoading,
    isError,
  };
};
