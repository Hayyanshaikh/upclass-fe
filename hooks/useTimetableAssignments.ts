"use client";

import { isAxiosError } from "axios";

import {
  useTimetableControllerCreate,
  useTimetableControllerFindAll,
  useTimetableControllerRemove,
  useTimetableControllerUpdate,
} from "@/app/api/endpoints";
import type {
  CreateTimetableEntryDto,
  UpdateTimetableEntryDto,
} from "@/app/api/schemas";

type UseTimetableAssignmentsParams = {
  classSectionId: string;
  academicTermId: string;
  teacherId?: string;
  subjectId?: string;
};

export function useTimetableAssignments({
  classSectionId,
  academicTermId,
  teacherId,
  subjectId,
}: UseTimetableAssignmentsParams) {
  const entriesQuery = useTimetableControllerFindAll(
    { classSectionId, academicTermId, teacherId, subjectId },
    {
      query: {
        enabled: !!classSectionId && !!academicTermId,
      },
    },
  );

  const { mutateAsync: createEntry, isPending: isCreatingEntry } =
    useTimetableControllerCreate();
  const { mutateAsync: updateEntry, isPending: isUpdatingEntry } =
    useTimetableControllerUpdate();
  const { mutateAsync: removeEntry, isPending: isRemovingEntry } =
    useTimetableControllerRemove();

  async function createAssignment(values: CreateTimetableEntryDto) {
    try {
      await createEntry({ data: values });
      await entriesQuery.refetch();
    } catch (error) {
      throw new Error(getErrorMessage(error, "Unable to assign period."));
    }
  }

  async function updateAssignment(id: string, values: UpdateTimetableEntryDto) {
    try {
      await updateEntry({ id, data: values });
      await entriesQuery.refetch();
    } catch (error) {
      throw new Error(getErrorMessage(error, "Unable to update period."));
    }
  }

  async function removeAssignment(id: string) {
    try {
      await removeEntry({ id });
      await entriesQuery.refetch();
    } catch (error) {
      throw new Error(getErrorMessage(error, "Unable to clear period."));
    }
  }

  return {
    entries: entriesQuery.data?.data ?? [],
    isLoading: entriesQuery.isFetching && !entriesQuery.data,
    isError: entriesQuery.isError,
    refetch: entriesQuery.refetch,
    isUpdating: isCreatingEntry || isUpdatingEntry || isRemovingEntry,
    createAssignment,
    updateAssignment,
    removeAssignment,
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
