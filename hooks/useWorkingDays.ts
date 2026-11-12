"use client";

import { useSchoolsControllerFindOne } from "@/app/api/endpoints";
import { timetableDays } from "@/constants/timetable";
import { useStorageStore } from "@/stores/storage";
import type { User } from "@/stores/storage";

export function useWorkingDays() {
  const schoolId = useStorageStore((state) => {
    const user = state.values.user as User | undefined;

    return user?.school?.id ?? "";
  });
  const { data, isLoading } = useSchoolsControllerFindOne(schoolId, {
    query: { enabled: !!schoolId },
  });

  const workingDays = data?.data?.workingDays ?? [];
  const days = timetableDays.filter((day) =>
    workingDays.some(
      (workingDay) => workingDay.toUpperCase() === day.key.toUpperCase(),
    ),
  );

  return { days, isLoading };
}
