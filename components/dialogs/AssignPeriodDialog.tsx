"use client";

import { Form } from "antd";
import Dialog from "@/components/ui/Dialog";
import Select from "@/components/ui/Select";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { timetableDays } from "@/constants/timetable";
import { useTeacherStore } from "@/stores/teachers";
import { useClassStore } from "@/stores/classes";
import { useTimetableStore } from "@/stores/timetable";
import {
  availableTeachers,
  isSameSlot,
  teacherConflict,
  timetableSubjectOptions,
} from "@/utils/timetable";
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
  const teachers = useTeacherStore((state) => state.records);
  const classes = useClassStore((state) => state.records);
  const assignments = useTimetableStore((state) => state.assignments);
  const savePeriod = useTimetableStore((state) => state.savePeriod);
  const clearPeriod = useTimetableStore((state) => state.clearPeriod);
  const existing = assignments.find((assignment) =>
    isSameSlot(assignment, slot),
  );
  const values = Form.useWatch([], form) as
    | Partial<PeriodFormValues>
    | undefined;
  const selectedTeacher = teachers.find(
    (teacher) => teacher.id === values?.teacherId,
  );
  const conflict = values?.teacherId
    ? teacherConflict(assignments, slot, values.teacherId)
    : undefined;
  const available = availableTeachers(teachers, assignments, slot);
  const subjects = timetableSubjectOptions(teachers, classes, assignments);
  const day = timetableDays.find((record) => record.key === slot.day)?.label;
  const disabled =
    !values?.subject ||
    !values.room?.trim() ||
    !selectedTeacher ||
    selectedTeacher.status !== "Active" ||
    Boolean(conflict);

  function submit(values: PeriodFormValues) {
    const currentTeacher = useTeacherStore
      .getState()
      .records.find((teacher) => teacher.id === values.teacherId);
    if (!currentTeacher || currentTeacher.status !== "Active") return;
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
                room: existing.room,
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
          options={subjects}
          placeholder="Select subject"
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Select
            name="teacherId"
            label="Teacher"
            isRequird
            placeholder="Select teacher"
            options={teachers.map((teacher) => ({
              value: teacher.id,
              label:
                teacher.name +
                (teacher.status !== "Active"
                  ? " (" + teacher.status + ")"
                  : ""),
              disabled: teacher.status !== "Active",
            }))}
          />
          <Input
            name="room"
            label="Room"
            isRequird
            placeholder="Room 12, Lab 2 or Ground"
            rules={[{ whitespace: true, message: "Enter a room" }]}
          />
        </div>
        {selectedTeacher &&
          (conflict ? (
            <div
              role="alert"
              className="rounded-md bg-danger/10 p-4 text-sm font-semibold text-danger"
            >
              {selectedTeacher.name} is already teaching Class{" "}
              {conflict.classId} in this period ({conflict.room}). Pick another
              teacher or another period.
            </div>
          ) : selectedTeacher.status !== "Active" ? (
            <div
              role="alert"
              className="rounded-md bg-warning/10 p-4 text-sm font-semibold text-warning"
            >
              {selectedTeacher.name} is {selectedTeacher.status.toLowerCase()}{" "}
              and unavailable for assignment.
            </div>
          ) : (
            <p
              role="status"
              className="rounded-md bg-success/10 p-4 text-sm font-semibold text-success"
            >
              {selectedTeacher.name} is free in this period.
            </p>
          ))}
        {(conflict ||
          (selectedTeacher && selectedTeacher.status !== "Active")) && (
          <div>
            <p className="mb-2 text-sm text-gray">Available teachers</p>
            <div className="flex flex-wrap gap-2">
              {available.map((teacher) => (
                <Button
                  key={teacher.id}
                  variant="link"
                  className="rounded-full! bg-gray/10! px-3! py-1! text-xs!"
                  onClick={() => form.setFieldValue("teacherId", teacher.id)}
                >
                  {teacher.name}
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
