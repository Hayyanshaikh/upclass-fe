import { useEffect, useRef, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { FormInstance } from "antd";

import { feeHeads } from "@/constants/settings";
import type { FeeHead, RegisterSettingsTab } from "@/types/settings";

type UseFeeHeadsSettingsParams = {
  form: FormInstance;
  registerTab: RegisterSettingsTab;
  schoolId: string;
  data: FeeHead[];
  setData: Dispatch<SetStateAction<FeeHead[]>>;
};

export function useFeeHeadsSettings({
  form,
  registerTab,
  data,
  setData,
}: UseFeeHeadsSettingsParams) {
  const [isLoading] = useState(false);
  const [isFetching] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  async function validate() {
    await form.validateFields();
  }

  async function save() {
    setIsUpdating(true);
    try {
      // Fee head data is managed locally until an API is available.
    } finally {
      setIsUpdating(false);
    }
  }

  function reset() {
    form.resetFields();
    setData(feeHeads);
  }

  const actionsRef = useRef({ validate, save, reset });
  actionsRef.current = { validate, save, reset };

  useEffect(
    () =>
      registerTab("fees", {
        validate: () => actionsRef.current.validate(),
        save: () => actionsRef.current.save(),
        reset: () => actionsRef.current.reset(),
      }),
    [registerTab],
  );

  return { data, isLoading, isFetching, isUpdating };
}
