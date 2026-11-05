import { useEffect, useMemo, useRef, useState } from "react";
import type { FormInstance } from "antd";
import { isAxiosError } from "axios";
import type { Dayjs } from "dayjs";

import {
  useAcademicYearsControllerCreate,
  useAcademicYearsControllerFindAll,
  useAcademicYearsControllerRemove,
  useAcademicYearsControllerUpdate,
} from "@/app/api/endpoints";
import { AcademicYearDtoStatus } from "@/app/api/schemas";
import type { AcademicYear, RegisterSettingsTab } from "@/types/settings";
import dayjs from "dayjs";

type UseAcademicYearSettingsParams = {
  form: FormInstance;
  registerTab: RegisterSettingsTab;
  schoolId: string;
};

type AcademicYearFormValues = {
  year: string;
  startDate?: Dayjs;
  endDate?: Dayjs;
  status?: AcademicYear["status"];
};

type AcademicYearEditValues = {
  year: string;
  startDate: Dayjs;
  endDate: Dayjs;
  status: AcademicYear["status"];
};

export function useAcademicYearSettings({
  form,
  registerTab,
  schoolId,
}: UseAcademicYearSettingsParams) {
  const {
    data: response,
    isFetching,
    isError,
    refetch,
  } = useAcademicYearsControllerFindAll({
    query: {
      enabled: !!schoolId,
    },
  });
  const { mutateAsync: createAcademicYear, isPending: isCreating } =
    useAcademicYearsControllerCreate();
  const { mutateAsync: updateYear, isPending: isUpdatingYear } =
    useAcademicYearsControllerUpdate();
  const { mutateAsync: removeYear, isPending: isRemovingYear } =
    useAcademicYearsControllerRemove();

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!response) return;

    const activeYear = response.data.find(
      (year) => year.status === AcademicYearDtoStatus.ACTIVE,
    );

    form.setFieldsValue({
      academicYear: activeYear?.id,
      starts: dayjs(activeYear?.startDate),
      ends: dayjs(activeYear?.endDate),
    });
  }, [response, form]);

  const data = useMemo<AcademicYear[]>(
    () =>
      (response?.data ?? []).map((year) => ({
        id: year.id,
        year: year.year,
        startDate: year.startDate,
        endDate: year.endDate,
        status:
          year.status === AcademicYearDtoStatus.UPCOMING
            ? "Upcoming"
            : year.status === AcademicYearDtoStatus.ACTIVE
              ? "Active"
              : "Completed",
      })),
    [response],
  );

  async function validate() {
    await form.validateFields();
  }

  async function save() {
    setIsSaving(true);
    try {
      await refetch();
    } finally {
      setIsSaving(false);
    }
  }

  async function reset() {
    form.resetFields();
    await refetch();
  }

  async function addAcademicYear(values: AcademicYearFormValues) {
    try {
      await createAcademicYear({
        data: {
          year: values.year.trim(),
          startDate: values.startDate?.format("YYYY-MM-DD") ?? "",
          endDate: values.endDate?.format("YYYY-MM-DD") ?? "",
          status:
            values.status === "Upcoming"
              ? AcademicYearDtoStatus.UPCOMING
              : values.status === "Completed"
                ? AcademicYearDtoStatus.COMPLETED
                : AcademicYearDtoStatus.ACTIVE,
        },
      });
      await refetch();
    } catch (error) {
      throw new Error(getErrorMessage(error, "Unable to add academic year."));
    }
  }

  async function updateAcademicYear(id: string, values: AcademicYearEditValues) {
    try {
      await updateYear({
        id,
        data: {
          year: values.year.trim(),
          startDate: values.startDate.format("YYYY-MM-DD"),
          endDate: values.endDate.format("YYYY-MM-DD"),
          status:
            values.status === "Upcoming"
              ? AcademicYearDtoStatus.UPCOMING
              : values.status === "Completed"
                ? AcademicYearDtoStatus.COMPLETED
                : AcademicYearDtoStatus.ACTIVE,
        },
      });
      await refetch();
    } catch (error) {
      throw new Error(getErrorMessage(error, "Unable to update academic year."));
    }
  }

  async function removeAcademicYear(id: string) {
    try {
      await removeYear({ id });
      await refetch();
    } catch (error) {
      throw new Error(getErrorMessage(error, "Unable to delete academic year."));
    }
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

  return {
    data,
    isLoading: isFetching && !response,
    isFetching,
    isUpdating: isCreating || isUpdatingYear || isRemovingYear || isSaving,
    isError,
    addAcademicYear,
    updateAcademicYear,
    removeAcademicYear,
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
