import { isAxiosError } from "axios";

import {
  usePeriodsControllerCreate,
  usePeriodsControllerFindAll,
  usePeriodsControllerRemove,
  usePeriodsControllerUpdate,
} from "@/app/api/endpoints";
import type { CreatePeriodDto, UpdatePeriodDto } from "@/app/api/schemas";

type UsePeriodConfigSettingsParams = {
  schoolId: string;
};

export function usePeriodConfigSettings({
  schoolId,
}: UsePeriodConfigSettingsParams) {
  const periodsQuery = usePeriodsControllerFindAll(
    { limit: 100 },
    {
      query: {
        enabled: !!schoolId,
      },
    },
  );

  const { mutateAsync: createPeriod, isPending: isCreatingPeriod } =
    usePeriodsControllerCreate();
  const { mutateAsync: updatePeriod, isPending: isUpdatingPeriod } =
    usePeriodsControllerUpdate();
  const { mutateAsync: removePeriod, isPending: isRemovingPeriod } =
    usePeriodsControllerRemove();

  async function addPeriod(values: CreatePeriodDto) {
    try {
      await createPeriod({ data: values });
      await periodsQuery.refetch();
    } catch (error) {
      throw new Error(getErrorMessage(error, "Unable to add period."));
    }
  }

  async function updatePeriodRecord(id: string, values: UpdatePeriodDto) {
    try {
      await updatePeriod({ id, data: values });
      await periodsQuery.refetch();
    } catch (error) {
      throw new Error(getErrorMessage(error, "Unable to update period."));
    }
  }

  async function deletePeriod(id: string) {
    try {
      await removePeriod({ id });
      await periodsQuery.refetch();
    } catch (error) {
      throw new Error(getErrorMessage(error, "Unable to delete period."));
    }
  }

  return {
    periods: periodsQuery.data?.data ?? [],
    isLoading: periodsQuery.isFetching && !periodsQuery.data,
    isError: periodsQuery.isError,
    isUpdating: isCreatingPeriod || isUpdatingPeriod || isRemovingPeriod,
    addPeriod,
    updatePeriodRecord,
    deletePeriod,
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
