import { useEffect, useRef, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { FormInstance } from "antd";

import { academicYears } from "@/constants/settings";
import type {
  AcademicYear,
  RegisterSettingsTab,
} from "@/types/settings";

type UseAcademicYearSettingsParams = {
  form: FormInstance;
  registerTab: RegisterSettingsTab;
  schoolId: string;
  data: AcademicYear[];
  setData: Dispatch<SetStateAction<AcademicYear[]>>;
};

export function useAcademicYearSettings({
  form,
  registerTab,
  data,
  setData,
}: UseAcademicYearSettingsParams) {
  const [isLoading] = useState(false);
  const [isFetching] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  async function validate() {
    await form.validateFields();
  }

  async function save() {
    setIsUpdating(true);
    try {
      // Academic year data is managed locally until an API is available.
    } finally {
      setIsUpdating(false);
    }
  }

  function reset() {
    form.resetFields();
    setData(academicYears);
  }

  const actionsRef = useRef({ validate, save, reset });
  actionsRef.current = { validate, save, reset };

  useEffect(
    () =>
      registerTab("academic", {
        validate: () => actionsRef.current.validate(),
        save: () => actionsRef.current.save(),
        reset: () => actionsRef.current.reset(),
      }),
    [registerTab],
  );

  return { data, isLoading, isFetching, isUpdating };
}
