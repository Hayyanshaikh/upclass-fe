import { useEffect, useMemo, useRef, useState } from "react";
import type { FormInstance } from "antd";
import { isAxiosError } from "axios";
import dayjs from "dayjs";
import type { Dayjs } from "dayjs";

import {
  useAcademicTermsControllerCreate,
  useAcademicTermsControllerFindAll,
  useAcademicTermsControllerRemove,
  useAcademicYearTermsControllerCreate,
  useAcademicYearTermsControllerFindAll,
  useAcademicYearTermsControllerRemove,
  useAcademicYearsControllerFindAll,
} from "@/app/api/endpoints";
import { AcademicYearDtoStatus } from "@/app/api/schemas";
import type {
  AcademicTerm,
  AcademicYear,
  AssignedAcademicTerm,
  RegisterSettingsTab,
} from "@/types/settings";
import { DISPLAY_DATE } from "@/constants/date-formats";

type UseAcademicTermsSettingsParams = {
  form: FormInstance;
  registerTab: RegisterSettingsTab;
  schoolId: string;
};

type AssignTermValues = {
  academicYear: string;
  term: string;
  startDate: Dayjs;
  endDate: Dayjs;
};

export function useAcademicTermsSettings({
  form,
  registerTab,
  schoolId,
}: UseAcademicTermsSettingsParams) {
  const termsQuery = useAcademicTermsControllerFindAll({
    query: {
      enabled: !!schoolId,
    },
  });
  const assignmentsQuery = useAcademicYearTermsControllerFindAll(undefined, {
    query: {
      enabled: !!schoolId,
    },
  });
  const yearsQuery = useAcademicYearsControllerFindAll({
    query: {
      enabled: !!schoolId,
    },
  });

  const { mutateAsync: createTerm, isPending: isCreatingTerm } =
    useAcademicTermsControllerCreate();
  const { mutateAsync: removeTermRecord, isPending: isDeletingTerm } =
    useAcademicTermsControllerRemove();
  const { mutateAsync: createAssignment, isPending: isAssigning } =
    useAcademicYearTermsControllerCreate();
  const { mutateAsync: removeAssignment, isPending: isRemoving } =
    useAcademicYearTermsControllerRemove();

  const [isSaving, setIsSaving] = useState(false);

  const terms = useMemo<AcademicTerm[]>(
    () =>
      (termsQuery.data?.data ?? []).map((term) => ({
        id: term.id,
        name: term.name,
      })),
    [termsQuery.data],
  );

  const academicYears = useMemo<AcademicYear[]>(
    () =>
      (yearsQuery.data?.data ?? []).map((year) => ({
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
    [yearsQuery.data],
  );

  const data = useMemo<AssignedAcademicTerm[]>(
    () =>
      (assignmentsQuery.data?.data ?? []).map((assignment) => ({
        id: assignment.id,
        academicYear: assignment.academicYear.year,
        term: assignment.academicTerm.name,
        startDate: dayjs(assignment.startDate).format(DISPLAY_DATE),
        endDate: dayjs(assignment.endDate).format(DISPLAY_DATE),
      })),
    [assignmentsQuery.data],
  );

  async function validate() {
    await form.validateFields();
  }

  async function save() {
    setIsSaving(true);
    try {
      await Promise.all([
        termsQuery.refetch(),
        assignmentsQuery.refetch(),
        yearsQuery.refetch(),
      ]);
    } finally {
      setIsSaving(false);
    }
  }

  async function reset() {
    form.resetFields();
    await Promise.all([
      termsQuery.refetch(),
      assignmentsQuery.refetch(),
      yearsQuery.refetch(),
    ]);
  }

  async function addTerm(name: string) {
    try {
      await createTerm({ data: { name: name.trim() } });
      await termsQuery.refetch();
    } catch (error) {
      throw new Error(getErrorMessage(error, "Unable to add academic term."));
    }
  }

  async function deleteTerm(id: string) {
    try {
      await removeTermRecord({ id });
      await termsQuery.refetch();
    } catch (error) {
      throw new Error(
        getErrorMessage(error, "Unable to delete academic term."),
      );
    }
  }

  async function assignTerm(values: AssignTermValues) {
    try {
      await createAssignment({
        data: {
          academicYearId: values.academicYear,
          academicTermId: values.term,
          startDate: values.startDate.format("YYYY-MM-DD"),
          endDate: values.endDate.format("YYYY-MM-DD"),
        },
      });
      await assignmentsQuery.refetch();
    } catch (error) {
      throw new Error(
        getErrorMessage(error, "Unable to assign academic term."),
      );
    }
  }

  async function removeTerm(id: string) {
    try {
      await removeAssignment({ id });
      await assignmentsQuery.refetch();
    } catch (error) {
      throw new Error(
        getErrorMessage(error, "Unable to remove academic term assignment."),
      );
    }
  }

  const actionsRef = useRef({ validate, save, reset });
  actionsRef.current = { validate, save, reset };

  useEffect(
    () =>
      registerTab("terms", {
        validate: () => actionsRef.current.validate(),
        save: () => actionsRef.current.save(),
        reset: () => actionsRef.current.reset(),
      }),
    [registerTab],
  );

  const isFetching =
    termsQuery.isFetching ||
    assignmentsQuery.isFetching ||
    yearsQuery.isFetching;
  const hasLoaded =
    !!termsQuery.data && !!assignmentsQuery.data && !!yearsQuery.data;

  return {
    data,
    terms,
    academicYears,
    isLoading: isFetching && !hasLoaded,
    isFetching,
    isUpdating:
      isCreatingTerm || isDeletingTerm || isAssigning || isRemoving || isSaving,
    isError:
      termsQuery.isError || assignmentsQuery.isError || yearsQuery.isError,
    addTerm,
    deleteTerm,
    assignTerm,
    removeTerm,
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
