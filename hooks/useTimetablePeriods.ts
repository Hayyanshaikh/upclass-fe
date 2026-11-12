import { useMemo } from "react";

import { usePeriodsControllerFindAll } from "@/app/api/endpoints";
import {
  PeriodDtoType,
  PeriodsControllerFindAllStatus,
} from "@/app/api/schemas";
import type { TimetableRow } from "@/types/timetable";

export function useTimetablePeriods() {
  const { data, isLoading, isError, refetch } = usePeriodsControllerFindAll({
    status: PeriodsControllerFindAllStatus.ACTIVE,
    limit: 100,
  });

  const rows = useMemo<TimetableRow[]>(
    () =>
      [...(data?.data ?? [])]
        .sort((first, second) => first.sortOrder - second.sortOrder)
        .map((period): TimetableRow => {
          const time = `${period.startTime}–${period.endTime}`;

          return period.type === PeriodDtoType.BREAK
            ? { id: period.id, type: "break", time }
            : { id: period.id, type: "period", label: period.name, time };
        }),
    [data],
  );

  return { rows, isLoading, isError, refetch };
}
