import { useEffect, useRef, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { FormInstance } from "antd";

import { settingsUsers } from "@/constants/settings";
import type { RegisterSettingsTab, SettingsUser } from "@/types/settings";

type UseRolesUsersSettingsParams = {
  form: FormInstance;
  registerTab: RegisterSettingsTab;
  schoolId: string;
  data: SettingsUser[];
  setData: Dispatch<SetStateAction<SettingsUser[]>>;
};

export function useRolesUsersSettings({
  form,
  registerTab,
  data,
  setData,
}: UseRolesUsersSettingsParams) {
  const [isLoading] = useState(false);
  const [isFetching] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  async function validate() {
    await form.validateFields();
  }

  async function save() {
    setIsUpdating(true);
    try {
      // User data is managed locally until an API is available.
    } finally {
      setIsUpdating(false);
    }
  }

  function reset() {
    form.resetFields();
    setData(settingsUsers);
  }

  const actionsRef = useRef({ validate, save, reset });
  actionsRef.current = { validate, save, reset };

  useEffect(
    () =>
      registerTab("users", {
        validate: () => actionsRef.current.validate(),
        save: () => actionsRef.current.save(),
        reset: () => actionsRef.current.reset(),
      }),
    [registerTab],
  );

  return { data, isLoading, isFetching, isUpdating };
}
