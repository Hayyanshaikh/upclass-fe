"use client";

import { useLeavePoliciesControllerFindAll } from "@/app/api/endpoints";

export const useLeavePolicyDropdown = () => {
  const { data, isLoading, isError } = useLeavePoliciesControllerFindAll();

  const options = (data?.data ?? []).map((policy) => ({
    label: policy.name,
    value: policy.id,
  }));

  return {
    options,
    isLoading,
    isError,
  };
};
