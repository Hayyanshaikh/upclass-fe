"use client";

import { useEffect, useState } from "react";
import { Form } from "antd";
import Dialog from "@/components/ui/Dialog";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import DeleteDialog from "@/components/shared/DeleteDialog";
import ErrorDialog from "@/components/shared/ErrorDialog";
import SuccessDialog from "@/components/shared/SuccessDialog";
import {
  useTimetableControllerCheckTeacherAvailability,
  useTimetableControllerFindAll,
} from "@/app/api/endpoints";
import type { CreateTimetableEntryDtoDay } from "@/app/api/schemas";
import { timetableDays } from "@/constants/timetable";
import { useSubjectDropdown } from "@/hooks/useSubjectDropdown";
import { useTeacherDropdown } from "@/hooks/useTeacherDropdown";
import { useTimetableAssignments } from "@/hooks/useTimetableAssignments";
import { useRolePermission } from "@/hooks/useRolePermission";
import type {
  AssignPeriodDialogProps,
  PeriodFormValues,
} from "@/types/timetable";

export default function AssignPeriodDialog({
  slot,
  open,
  onClose,
  afterClose,
}: AssignPeriodDialogProps) {
  const [form] = Form.useForm<PeriodFormValues>();
  const [confirmingClear, setConfirmingClear] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { options: teacherOptions } = useTeacherDropdown();
  const { options: subjectOptions } = useSubjectDropdown();
  const { canCreate, canEdit, canDelete } = useRolePermission("timetable");
  const { isUpdating, createAssignment, updateAssignment, removeAssignment } =
    useTimetableAssignments({
      classSectionId: slot.classSectionId,
      academicTermId: slot.academicTermId,
    });
  const { data: termData, refetch: refetchTermEntries } =
    useTimetableControllerFindAll(
      { academicTermId: slot.academicTermId },
      { query: { enabled: !!slot.academicTermId } },
    );
  const termEntries = termData?.data ?? [];
  const dayKey = slot.day.toUpperCase() as CreateTimetableEntryDtoDay;
  const existing = termEntries.find(
    (entry) =>
      entry.classSectionId === slot.classSectionId &&
      entry.periodId === slot.periodId &&
      entry.day === dayKey,
  );
  const values = Form.useWatch([], form) as
    | Partial<PeriodFormValues>
    | undefined;
  const selectedTeacher = teacherOptions.find(
    (option) => option.value === values?.teacherId,
  );
  const { data: teacherCheckData, isFetching: isCheckingTeacher } =
    useTimetableControllerCheckTeacherAvailability(
      {
        teacherId: values?.teacherId ?? "",
        academicTermId: slot.academicTermId,
        periodId: slot.periodId,
        day: dayKey,
        excludeClassSectionId: slot.classSectionId,
      },
      { query: { enabled: Boolean(values?.teacherId) } },
    );
  const checkResult = teacherCheckData?.data;
  const conflict = checkResult?.conflict === true;
  const isCurrentTeacher = Boolean(
    existing && values?.teacherId === existing.teacherId,
  );
  const available = teacherOptions.filter(
    (option) =>
      !termEntries.some(
        (entry) =>
          entry.teacherId === option.value &&
          entry.periodId === slot.periodId &&
          entry.day === dayKey &&
          entry.classSectionId !== slot.classSectionId,
      ),
  );
  const day = timetableDays.find((record) => record.key === slot.day)?.label;
  const canSave = existing ? canEdit : canCreate;
  const disabled =
    !values?.subjectId ||
    !values?.teacherId ||
    Boolean(conflict) ||
    !canSave ||
    isCheckingTeacher;

  useEffect(() => {
    if (!existing) return;
    form.setFieldsValue({
      subjectId: existing.subjectId,
      teacherId: existing.teacherId,
    });
  }, [existing, form]);

  async function submit(values: PeriodFormValues) {
    try {
      if (existing) {
        await updateAssignment(existing.id, {
          subjectId: values.subjectId,
          teacherId: values.teacherId,
        });
      } else {
        await createAssignment({
          classSectionId: slot.classSectionId,
          academicTermId: slot.academicTermId,
          periodId: slot.periodId,
          day: dayKey,
          subjectId: values.subjectId,
          teacherId: values.teacherId,
        });
      }
      await refetchTermEntries();
      setSuccessMessage(
        existing
          ? "Period updated successfully."
          : "Period assigned successfully.",
      );
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to save period.",
      );
    }
  }

  async function confirmClear() {
    if (!existing) return;

    try {
      await removeAssignment(existing.id);
      await refetchTermEntries();
      setConfirmingClear(false);
      setSuccessMessage("Period cleared successfully.");
    } catch (error) {
      setConfirmingClear(false);
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to clear period.",
      );
    }
  }

  return (
    <>
      <Dialog
        open={open}
        afterClose={afterClose}
        title={
          <div>
            <p className="text-xl font-extrabold text-dark">
              {conflict ? "Teacher conflict" : "Assign period"}
            </p>
            <p className="mt-1 text-sm font-normal text-gray">
              {slot.classSectionName} · {day} · {slot.label} ({slot.time})
            </p>
          </div>
        }
        onClose={onClose}
        onConfirm={() => form.submit()}
        footer={
          <div className="flex flex-wrap items-center justify-end gap-3">
            {canDelete && (
              <Button
                variant="secondary"
                danger
                className="mr-auto"
                disabled={!existing || isUpdating}
                onClick={() => setConfirmingClear(true)}
              >
                Clear period
              </Button>
            )}
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={() => form.submit()}
              disabled={disabled}
              loading={isUpdating}
            >
              Save period
            </Button>
          </div>
        }
      >
        <Form form={form} onFinish={submit} className="flex flex-col gap-4">
          <Select
            name="subjectId"
            label="Subject"
            isRequird
            options={subjectOptions}
            placeholder="Select subject"
          />
          <Select
            name="teacherId"
            label="Teacher"
            isRequird
            placeholder="Select teacher"
            options={teacherOptions}
          />
          {selectedTeacher &&
            !isCurrentTeacher &&
            !isCheckingTeacher &&
            checkResult &&
            (conflict ? (
              <div
                role="alert"
                className="rounded-md bg-danger/10 p-4 text-sm font-semibold text-danger"
              >
                {checkResult.message}
              </div>
            ) : (
              <p
                role="status"
                className="rounded-md bg-success/10 p-4 text-sm font-semibold text-success"
              >
                {checkResult.message}
              </p>
            ))}
          {conflict && (
            <div>
              <p className="mb-2 text-sm text-gray">Available teachers</p>
              <div className="flex flex-wrap gap-2">
                {available.map((option) => (
                  <Button
                    key={option.value}
                    variant="link"
                    className="rounded-full! bg-gray/10! px-3! py-1! text-xs!"
                    onClick={() =>
                      form.setFieldValue("teacherId", option.value)
                    }
                  >
                    {option.label}
                  </Button>
                ))}
                {!available.length && (
                  <p className="text-sm text-gray">
                    No teachers are free in this period. Choose another period.
                  </p>
                )}
              </div>
            </div>
          )}
        </Form>
      </Dialog>
      <DeleteDialog
        open={confirmingClear}
        title="Clear period?"
        okText="Clear"
        confirmLoading={isUpdating}
        message={
          "This period assignment will be removed from the timetable. This cannot be undone."
        }
        onClose={() => setConfirmingClear(false)}
        onConfirm={() => void confirmClear()}
      />
      <SuccessDialog
        open={successMessage !== null}
        message={successMessage ?? ""}
        onClose={() => {
          setSuccessMessage(null);
          onClose();
        }}
      />
      <ErrorDialog
        open={errorMessage !== null}
        message={errorMessage ?? ""}
        onClose={() => setErrorMessage(null)}
      />
    </>
  );
}
