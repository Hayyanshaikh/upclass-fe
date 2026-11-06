"use client";

import { useAcademicYearsControllerLookup } from "@/app/api/endpoints";
import { FormInstance } from "antd";
import { useEffect, useMemo } from "react";

export const useAcademicYearDropdown = (form: FormInstance) => {
  const { data, isLoading, isError } = useAcademicYearsControllerLookup();

  const options = useMemo(() => {
    return (data?.data ?? []).map((item) => ({
      label: item.name,
      value: item.id,
    }));
  }, [data]);

  const selectedValue = useMemo(() => {
    return data?.data?.find((item) => item.status === "ACTIVE")?.id ?? null;
  }, [data]);

  useEffect(() => {
    if (selectedValue) {
      form.setFieldsValue({ academicYearId: selectedValue });
    }
  }, [selectedValue]);

  return {
    options,
    selectedValue,
    isLoading,
    isError,
  };
};
