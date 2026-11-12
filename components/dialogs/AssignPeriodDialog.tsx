"use client";

import { Form } from "antd";
import Dialog from "@/components/ui/Dialog";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import { timetableDays } from "@/constants/timetable";
import { useSubjectDropdown } from "@/hooks/useSubjectDropdown";
import { useTeacherDropdown } from "@/hooks/useTeacherDropdown";
import { useTimetableStore } from "@/stores/timetable";
import { isSameSlot, teacherConflict } from "@/utils/timetable";
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
  const { options: teacherOptions } = useTeacherDropdown();
  const { options: subjectOptions } = useSubjectDropdown();
  const assignments = useTimetableStore((state) => state.assignments);
  const savePeriod = useTimetableStore((state) => state.savePeriod);
  const clearPeriod = useTimetableStore((state) => state.clearPeriod);
  const existing = assignments.find((assignment) =>
    isSameSlot(assignment, slot),
  );
  const values = Form.useWatch([], form) as
    | Partial<PeriodFormValues>
    | undefined;
  const selectedTeacher = teacherOptions.find(
    (option) => option.value === values?.teacherId,
  );
  const conflict = values?.teacherId
    ? teacherConflict(assignments, slot, values.teacherId)
    : undefined;
  const available = teacherOptions.filter(
    (option) => !teacherConflict(assignments, slot, option.value),
  );
  const day = timetableDays.find((record) => record.key === slot.day)?.label;
  const disabled =
    !values?.subject || !values?.teacherId || Boolean(conflict);

  function submit(values: PeriodFormValues) {
    if (savePeriod(slot, values)) onClose();
  }

  return (
    <Dialog
      open={open}
      afterClose={afterClose}
      title={
        <div>
          <p className="text-xl font-extrabold text-dark">
            {conflict ? "Teacher conflict" : "Assign period"}
          </p>
          <p className="mt-1 text-sm font-normal text-gray">
            Class {slot.classId} · {day} · {slot.label} ({slot.time})
          </p>
        </div>
      }
      onClose={onClose}
      onConfirm={() => form.submit()}
      footer={
        <div className="flex flex-wrap items-center justify-end gap-3">
          <Button
            variant="secondary"
            danger
            className="mr-auto"
            disabled={!existing}
            onClick={() => {
              clearPeriod(slot);
              onClose();
            }}
          >
            Clear period
          </Button>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={() => form.submit()} disabled={disabled}>
            Save period
          </Button>
        </div>
      }
    >
      <Form
        form={form}
        initialValues={
          existing
            ? {
                subject: existing.subject,
                teacherId: existing.teacherId,
              }
            : {}
        }
        onFinish={submit}
        className="flex flex-col gap-4"
      >
        <Select
          name="subject"
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
          (conflict ? (
            <div
              role="alert"
              className="rounded-md bg-danger/10 p-4 text-sm font-semibold text-danger"
            >
              {selectedTeacher.label} is already teaching Class{" "}
              {conflict.classId} in this period. Pick another teacher or
              another period.
            </div>
          ) : (
            <p
              role="status"
              className="rounded-md bg-success/10 p-4 text-sm font-semibold text-success"
            >
              {selectedTeacher.label} is free in this period.
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
                  onClick={() => form.setFieldValue("teacherId", option.value)}
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
  );
}
