"use client";

import { useEffect, useState } from "react";
import { Form } from "antd";
import { LuTrash2 } from "react-icons/lu";
import MobileConfirmDialog from "@/components/mobile/dialogs/MobileConfirmDialog";
import MobileFeedbackDialog from "@/components/mobile/dialogs/MobileFeedbackDialog";
import MobileIconButton from "@/components/mobile/ui/MobileIconButton";
import MobileSheet from "@/components/mobile/ui/MobileSheet";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import { timetableDays } from "@/constants/timetable";
import { useRolePermission } from "@/hooks/useRolePermission";
import { useSubjectDropdown } from "@/hooks/useSubjectDropdown";
import { useTeacherDropdown } from "@/hooks/useTeacherDropdown";
import { useTimetableAssignments } from "@/hooks/useTimetableAssignments";
import {
  useTimetableControllerCheckTeacherAvailability,
  useTimetableControllerFindAll,
} from "@/app/api/endpoints";
import type { PeriodFormValues, TimetableSlot } from "@/types/timetable";
import type { CreateTimetableEntryDtoDay } from "@/app/api/schemas";

type MobileAssignPeriodFormProps = {
  open: boolean;
  slot: TimetableSlot;
  onClose: () => void;
  onSaved: (message: string) => void;
};

type Feedback = {
  tone: "success" | "error";
  message: string;
};

export default function MobileAssignPeriodForm({
  open,
  slot,
  onClose,
  onSaved,
}: MobileAssignPeriodFormProps) {
  const [form] = Form.useForm<PeriodFormValues>();
  const [clearing, setClearing] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
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
      { query: { enabled: open } },
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
    if (!open) return;

    if (existing) {
      form.setFieldsValue({
        subjectId: existing.subjectId,
        teacherId: existing.teacherId,
      });
      return;
    }

    form.resetFields();
  }, [open, existing, form]);

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
      onSaved(
        existing
          ? "Period updated successfully."
          : "Period assigned successfully.",
      );
    } catch (error) {
      setFeedback({
        tone: "error",
        message:
          error instanceof Error ? error.message : "Unable to save period.",
      });
    }
  }

  async function confirmClear() {
    if (!existing) return;

    try {
      await removeAssignment(existing.id);
      await refetchTermEntries();
      setClearing(false);
      onSaved("Period cleared successfully.");
    } catch (error) {
      setClearing(false);
      setFeedback({
        tone: "error",
        message:
          error instanceof Error ? error.message : "Unable to clear period.",
      });
    }
  }

  return (
    <>
      <MobileSheet
        open={open}
        onClose={onClose}
        title={existing ? "Edit period" : "Assign period"}
        closeLabel="Close"
      >
        <p className="mt-1 text-xs leading-5 text-gray">
          <span className="font-semibold text-dark">
            {slot.classSectionName}
          </span>
          {" · "}
          {day} · {slot.label} · {slot.time}
        </p>

        <Form
          form={form}
          layout="vertical"
          onFinish={(formValues) => void submit(formValues)}
          scrollToFirstError
          requiredMark={false}
          className="mt-4 flex min-h-0 flex-1 flex-col"
        >
          <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto pb-1 [&_.ant-form-item]:mb-0">
            <Select
              name="subjectId"
              label="Subject"
              placeholder="Select subject"
              options={subjectOptions}
              isRequird
            />
            <Select
              name="teacherId"
              label="Teacher"
              placeholder="Select teacher"
              options={teacherOptions}
              isRequird
            />

            {selectedTeacher &&
              !isCurrentTeacher &&
              !isCheckingTeacher &&
              checkResult &&
              (conflict ? (
                <div
                  role="alert"
                  className="rounded-md bg-danger/10 p-3 text-sm font-semibold text-danger"
                >
                  {checkResult.message}
                </div>
              ) : (
                <p
                  role="status"
                  className="rounded-md bg-success/10 p-3 text-sm font-semibold text-success"
                >
                  {checkResult.message}
                </p>
              ))}

            {conflict && (
              <div>
                <p className="mb-2 text-xs font-semibold text-gray">
                  Available teachers
                </p>
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
                    <p className="text-xs text-gray">
                      No teachers are free in this period. Choose another
                      period.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="mt-3 flex shrink-0 items-center gap-2 border-t border-border pt-3">
            {canDelete && existing && (
              <MobileIconButton
                variant="danger"
                label="Clear period"
                onClick={() => setClearing(true)}
              >
                <LuTrash2 size={18} aria-hidden="true" />
              </MobileIconButton>
            )}
            <Button fullWidth variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button
              fullWidth
              type="submit"
              loading={isUpdating}
              disabled={disabled}
            >
              Save
            </Button>
          </div>
        </Form>
      </MobileSheet>

      <MobileConfirmDialog
        open={clearing}
        title="Clear period?"
        description="This period assignment will be removed from the timetable. This cannot be undone."
        confirmText="Clear"
        cancelText="Cancel"
        danger
        confirmLoading={isUpdating}
        onConfirm={() => void confirmClear()}
        onClose={() => setClearing(false)}
      />

      <MobileFeedbackDialog
        open={feedback !== null}
        tone={feedback?.tone ?? "success"}
        message={feedback?.message ?? ""}
        onClose={() => setFeedback(null)}
      />
    </>
  );
}
