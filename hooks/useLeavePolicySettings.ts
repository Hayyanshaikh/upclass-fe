import { useEffect, useMemo, useRef } from "react";
import type { FormInstance } from "antd";
import { isAxiosError } from "axios";

import {
  useLeavePoliciesControllerCreate,
  useLeavePoliciesControllerFindAll,
  useLeavePoliciesControllerRemove,
  useLeavePoliciesControllerUpdate,
  useLeavePolicySettingsControllerCreate,
  useLeavePolicySettingsControllerFindOne,
  useLeavePolicySettingsControllerUpdate,
} from "@/app/api/endpoints";
import type { LeavePolicySettingDto } from "@/app/api/schemas";
import type { LeaveType, RegisterSettingsTab } from "@/types/settings";

type UseLeavePolicySettingsParams = {
  form: FormInstance;
  registerTab: RegisterSettingsTab;
  schoolId: string;
};

type LeavePolicyValues = {
  name: string;
  days: number;
};

export function useLeavePolicySettings({
  form,
  registerTab,
  schoolId,
}: UseLeavePolicySettingsParams) {
  const policiesQuery = useLeavePoliciesControllerFindAll({
    query: {
      enabled: !!schoolId,
    },
  });
  const settingsQuery = useLeavePolicySettingsControllerFindOne({
    query: {
      enabled: !!schoolId,
      retry: false,
    },
  });

  const { mutateAsync: createPolicy, isPending: isCreatingPolicy } =
    useLeavePoliciesControllerCreate();
  const { mutateAsync: updatePolicy, isPending: isUpdatingPolicy } =
    useLeavePoliciesControllerUpdate();
  const { mutateAsync: removePolicy, isPending: isRemovingPolicy } =
    useLeavePoliciesControllerRemove();
  const { mutateAsync: createSettings, isPending: isCreatingSettings } =
    useLeavePolicySettingsControllerCreate();
  const { mutateAsync: updateSettings, isPending: isUpdatingSettings } =
    useLeavePolicySettingsControllerUpdate();

  const settings = settingsQuery.data?.data;

  const policies = useMemo<LeaveType[]>(
    () =>
      (policiesQuery.data?.data ?? []).map((policy) => ({
        id: policy.id,
        name: policy.name,
        days: policy.daysPerYear,
      })),
    [policiesQuery.data],
  );

  function populate(settingsData?: LeavePolicySettingDto) {
    form.setFieldsValue({
      approvalRequired: settingsData
        ? settingsData.approvalRequired
          ? "Yes"
          : "No"
        : "Yes",
      carryForward: settingsData
        ? settingsData.carryForward
          ? "Yes"
          : "No"
        : "No",
    });
  }

  useEffect(() => {
    populate(settings);
    // populate is derived from the current settings and form instance.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings, form]);

  async function validate() {
    await form.validateFields();
  }

  async function save() {
    const values = form.getFieldsValue(true);
    const payload = {
      approvalRequired: values.approvalRequired === "Yes",
      carryForward: values.carryForward === "Yes",
    };

    try {
      if (settings) {
        await updateSettings({ data: payload });
      } else {
        await createSettings({ data: payload });
      }

      await settingsQuery.refetch();
    } catch (error) {
      throw new Error(
        getErrorMessage(error, "Unable to update leave policy settings."),
      );
    }
  }

  function reset() {
    form.resetFields();
    populate(settings);
    policiesQuery.refetch();
  }

  async function addLeavePolicy(values: LeavePolicyValues) {
    try {
      await createPolicy({
        data: {
          name: values.name.trim(),
          daysPerYear: Number(values.days),
        },
      });
      await policiesQuery.refetch();
    } catch (error) {
      throw new Error(getErrorMessage(error, "Unable to add leave policy."));
    }
  }

  async function updateLeavePolicy(id: string, values: LeavePolicyValues) {
    try {
      await updatePolicy({
        id,
        data: {
          name: values.name.trim(),
          daysPerYear: Number(values.days),
        },
      });
      await policiesQuery.refetch();
    } catch (error) {
      throw new Error(getErrorMessage(error, "Unable to update leave policy."));
    }
  }

  async function removeLeavePolicy(id: string) {
    try {
      await removePolicy({ id });
      await policiesQuery.refetch();
    } catch (error) {
      throw new Error(getErrorMessage(error, "Unable to delete leave policy."));
    }
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

  return {
    policies,
    isLoading: policiesQuery.isFetching && !policiesQuery.data,
    isFetching: policiesQuery.isFetching || settingsQuery.isFetching,
    isSettingsLoading: settingsQuery.isLoading,
    isUpdating:
      isCreatingPolicy ||
      isUpdatingPolicy ||
      isRemovingPolicy ||
      isCreatingSettings ||
      isUpdatingSettings,
    isError: policiesQuery.isError,
    addLeavePolicy,
    updateLeavePolicy,
    removeLeavePolicy,
  };
}
function getErrorMessage(error: unknown, fallback: string) {
  if (isAxiosError(error)) {
    const body = error.response?.data as
      | { message?: string; data?: { errors?: string[] } }
      | undefined;

    return body?.data?.errors?.[0] ?? body?.message ?? fallback;
  }

  return error instanceof Error ? error.message : fallback;
}
