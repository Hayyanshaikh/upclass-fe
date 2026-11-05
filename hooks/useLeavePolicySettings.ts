import { useEffect, useRef, useState } from "react";
import type { FormInstance } from "antd";

import type { RegisterSettingsTab } from "@/types/settings";

type UseLeavePolicySettingsParams = {
  form: FormInstance;
  registerTab: RegisterSettingsTab;
  schoolId: string;
};

export function useLeavePolicySettings({
  form,
  registerTab,
}: UseLeavePolicySettingsParams) {
  const [isLoading] = useState(false);
  const [isFetching] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  async function validate() {
    await form.validateFields();
  }

  async function save() {
    setIsUpdating(true);
    try {
      // Leave policy data is managed locally until an API is available.
    } finally {
      setIsUpdating(false);
    }
  }

  function reset() {
    form.resetFields();
  }

  const actionsRef = useRef({ validate, save, reset });
  actionsRef.current = { validate, save, reset };

  useEffect(
    () =>
      registerTab("leave", {
        validate: () => actionsRef.current.validate(),
        save: () => actionsRef.current.save(),
        reset: () => actionsRef.current.reset(),
      }),
    [registerTab],
  );

  return { data: null, isLoading, isFetching, isUpdating };
}
