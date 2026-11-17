"use client";

import { useEffect, useState } from "react";
import { Form, TimePicker } from "antd";
import dayjs from "dayjs";
import type { Dayjs } from "dayjs";
import { LuClock, LuTrash2 } from "react-icons/lu";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import StatusBadge from "@/components/ui/StatusBadge";
import TextArea from "@/components/ui/TextArea";
import MobileIconButton from "@/components/mobile/ui/MobileIconButton";
import MobileSheet from "@/components/mobile/ui/MobileSheet";
import { DISPLAY_DATE } from "@/constants/date-formats";
import {
  teacherAttendanceStatusOptions,
  teacherAttendanceStatusVariants,
} from "@/constants/teacher-attendance";
import {
  getTeacherAttendanceErrorMessage,
  teacherAttendanceStatusLabel,
} from "@/lib/api/teacher-attendance";
import { useTeacherAttendanceControllerUpdate } from "@/app/api/endpoints";
import {
  UpdateTeacherAttendanceDtoStatus,
  type UpdateTeacherAttendanceDto,
} from "@/app/api/schemas";
import type {
  TeacherAttendanceRow,
  TeacherAttendanceStatus,
} from "@/types/teacher-attendance";

type MobileTeacherAttendanceFormProps = {
  open: boolean;
  record: TeacherAttendanceRow | null;
  onClose: () => void;
  onSaved: (message: string) => void;
  onDelete?: () => void;
};

type AttendanceValues = {
  status: UpdateTeacherAttendanceDtoStatus;
  checkIn?: Dayjs;
  checkOut?: Dayjs;
  remarks: string;
};

const statusFromLabel: Record<
  TeacherAttendanceStatus,
  UpdateTeacherAttendanceDtoStatus
> = {
  Present: UpdateTeacherAttendanceDtoStatus.PRESENT,
  Absent: UpdateTeacherAttendanceDtoStatus.ABSENT,
  Late: UpdateTeacherAttendanceDtoStatus.LATE,
  Leave: UpdateTeacherAttendanceDtoStatus.LEAVE,
};

const minutes = (value: Dayjs) => value.hour() * 60 + value.minute();
const timeValue = (date: string, value?: string) =>
  value ? dayjs(`${date}T${value}:00`) : undefined;

export default function MobileTeacherAttendanceForm({
  open,
  record,
  onClose,
  onSaved,
  onDelete,
}: MobileTeacherAttendanceFormProps) {
  const [form] = Form.useForm<AttendanceValues>();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { mutateAsync: updateRecord, isPending: isUpdating } =
    useTeacherAttendanceControllerUpdate();

  const status = Form.useWatch("status", form);
  const checkIn = Form.useWatch("checkIn", form) as Dayjs | undefined;
  const checkOut = Form.useWatch("checkOut", form) as Dayjs | undefined;
  const hasTimes =
    status === UpdateTeacherAttendanceDtoStatus.PRESENT ||
    status === UpdateTeacherAttendanceDtoStatus.LATE;
  const workedMinutes =
    checkIn && checkOut ? Math.max(0, minutes(checkOut) - minutes(checkIn)) : 0;
  const workedHours =
    checkIn && checkOut
      ? `${Math.floor(workedMinutes / 60)}h ${String(workedMinutes % 60).padStart(2, "0")}m`
      : checkIn
        ? "Working"
        : "No hours counted";

  useEffect(() => {
    if (!open || !record) return;

    setSubmitError(null);
    form.setFieldsValue({
      status: statusFromLabel[record.status],
      checkIn: timeValue(record.date, record.checkIn),
      checkOut: timeValue(record.date, record.checkOut),
      remarks: record.remarks ?? "",
    });
  }, [open, record, form]);

  async function handleSubmit(values: AttendanceValues) {
    if (!record) return;

    const attending =
      values.status === UpdateTeacherAttendanceDtoStatus.PRESENT ||
      values.status === UpdateTeacherAttendanceDtoStatus.LATE;
    const remarks = values.remarks?.trim() ?? "";
    const data: UpdateTeacherAttendanceDto = {
      status: values.status,
      checkIn: attending ? values.checkIn?.format("HH:mm") : undefined,
      checkOut: attending ? values.checkOut?.format("HH:mm") : undefined,
      remarks: remarks || undefined,
    };

    try {
      const response = await updateRecord({ id: record.id, data });
      onSaved(response.message);
    } catch (error) {
      setSubmitError(
        getTeacherAttendanceErrorMessage(error, "Unable to update attendance."),
      );
    }
  }

  const statusLabel = status
    ? teacherAttendanceStatusLabel(status)
    : (record?.status ?? "Present");
  const message =
    statusLabel === "Present" || statusLabel === "Late"
      ? `${statusLabel} · ${workedHours}`
      : statusLabel === "Absent"
        ? "Absent · no hours counted"
        : "On leave · no hours counted";
  const tone =
    statusLabel === "Present"
      ? "bg-success/10 text-primary"
      : statusLabel === "Late"
        ? "bg-warning/10 text-warning"
        : statusLabel === "Absent"
          ? "bg-danger/10 text-danger"
          : "bg-gray/10 text-gray";

  return (
    <MobileSheet
      open={open}
      onClose={onClose}
      title="Edit attendance"
      closeLabel="Close"
    >
      {record && (
        <div className="mt-3 flex shrink-0 items-center gap-3 border-b border-border pb-4">
          <span
            aria-hidden="true"
            className="flex size-10 shrink-0 items-center justify-center rounded-full bg-success/10 font-bold text-primary"
          >
            {record.teacher.charAt(0)}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-dark">
              {record.teacher}
            </p>
            <p className="mt-0.5 truncate text-xs text-gray">
              {record.employeeId} · {dayjs(record.date).format(DISPLAY_DATE)}
            </p>
          </div>
          <StatusBadge variant={teacherAttendanceStatusVariants[statusLabel]}>
            {statusLabel}
          </StatusBadge>
        </div>
      )}

      <Form
        form={form}
        layout="vertical"
        requiredMark={false}
        onFinish={(values) => void handleSubmit(values)}
        onValuesChange={() => setSubmitError(null)}
        scrollToFirstError
        className="mt-4! flex min-h-0 flex-1 flex-col"
      >
        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto pb-1 [&_.ant-form-item]:mb-0">
          <Select
            name="status"
            label="Status"
            options={teacherAttendanceStatusOptions}
            showSearch={false}
            isRequird
          />
          <Form.Item
            name="checkIn"
            label={<span className="font-semibold">Check-in</span>}
            rules={
              hasTimes
                ? [{ required: true, message: "Check-in is required" }]
                : []
            }
          >
            <TimePicker
              className="w-full"
              format="hh:mm a"
              placeholder="--:--"
              disabled={!hasTimes}
              suffixIcon={<LuClock aria-hidden="true" />}
            />
          </Form.Item>
          <Form.Item
            name="checkOut"
            label={<span className="font-semibold">Check-out</span>}
          >
            <TimePicker
              className="w-full"
              format="hh:mm a"
              placeholder="--:--"
              disabled={!hasTimes}
              suffixIcon={<LuClock aria-hidden="true" />}
            />
          </Form.Item>

          <p className={`rounded-md px-3 py-2 text-sm font-semibold ${tone}`}>
            {message}
          </p>
          <p className="text-xs leading-5 text-gray">
            {hasTimes
              ? "Present and Late are set from the check-in time using the school opening time and its grace period."
              : statusLabel === "Absent"
                ? "No check-in was recorded. Choose Present or Late to enter times."
                : "Leave was set from an approved request. Choose Present or Late if the teacher attended."}
          </p>

          <TextArea
            name="remarks"
            label="Reason for change (required)"
            rows={2}
            placeholder="e.g. Biometric device was offline"
            rules={[
              {
                required: true,
                whitespace: true,
                message: "Reason for change is required",
              },
            ]}
          />

          {submitError && (
            <p
              role="alert"
              className="rounded-md bg-danger/10 px-3 py-2 text-sm font-semibold text-danger"
            >
              {submitError}
            </p>
          )}
        </div>

        <div className="mt-3 flex shrink-0 items-center gap-2 border-t border-border pt-3">
          {record && onDelete && (
            <MobileIconButton
              variant="danger"
              label="Delete attendance"
              onClick={onDelete}
            >
              <LuTrash2 size={18} aria-hidden="true" />
            </MobileIconButton>
          )}
          <Button
            fullWidth
            variant="secondary"
            disabled={isUpdating}
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button fullWidth type="submit" loading={isUpdating}>
            Save
          </Button>
        </div>
      </Form>
    </MobileSheet>
  );
}
