"use client";

import { useEffect, useState } from "react";
import { Form, TimePicker } from "antd";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { LuClock } from "react-icons/lu";
import Dialog from "@/components/ui/Dialog";
import Select from "@/components/ui/Select";
import StatusBadge from "@/components/ui/StatusBadge";
import TextArea from "@/components/ui/TextArea";
import ErrorDialog from "@/components/shared/ErrorDialog";
import SuccessDialog from "@/components/shared/SuccessDialog";
import { useTeacherAttendanceControllerUpdate } from "@/app/api/endpoints";
import { UpdateTeacherAttendanceDtoStatus } from "@/app/api/schemas";
import {
  teacherAttendanceStatusOptions,
  teacherAttendanceStatusVariants,
} from "@/constants/teacher-attendance";
import {
  getTeacherAttendanceErrorMessage,
  teacherAttendanceStatusLabel,
  toTeacherAttendanceRow,
} from "@/lib/api/teacher-attendance";
import type {
  TeacherAttendanceRow,
  TeacherAttendanceStatus,
} from "@/types/teacher-attendance";

type EditTeacherAttendanceDialogProps = {
  record: TeacherAttendanceRow | null;
  onClose: () => void;
  onSaved: (record: TeacherAttendanceRow, reason: string) => void;
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

export default function EditTeacherAttendanceDialog({
  record,
  onClose,
  onSaved,
}: EditTeacherAttendanceDialogProps) {
  const [form] = Form.useForm<AttendanceValues>();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { mutateAsync: updateRecord, isPending: isUpdating } =
    useTeacherAttendanceControllerUpdate();

  const status = Form.useWatch("status", form) ?? undefined;
  const checkIn = Form.useWatch("checkIn", form) as Dayjs | undefined;
  const checkOut = Form.useWatch("checkOut", form) as Dayjs | undefined;
  const hasTimes =
    status === UpdateTeacherAttendanceDtoStatus.PRESENT ||
    status === UpdateTeacherAttendanceDtoStatus.LATE;
  const workedMinutes =
    checkIn && checkOut ? Math.max(0, minutes(checkOut) - minutes(checkIn)) : 0;
  const workedHours = checkIn && checkOut
    ? `${Math.floor(workedMinutes / 60)}h ${String(workedMinutes % 60).padStart(2, "0")}m`
    : checkIn
      ? "Working"
      : "No hours counted";

  useEffect(() => {
    if (!record) return;
    form.setFieldsValue({
      status: statusFromLabel[record.status],
      checkIn: timeValue(record.date, record.checkIn),
      checkOut: timeValue(record.date, record.checkOut),
      remarks: record.remarks ?? "",
    });
  }, [record, form]);

  async function save(values: AttendanceValues) {
    if (!record) return;

    const attending =
      values.status === UpdateTeacherAttendanceDtoStatus.PRESENT ||
      values.status === UpdateTeacherAttendanceDtoStatus.LATE;
    const remarks = values.remarks?.trim() ?? "";

    try {
      const response = await updateRecord({
        id: record.id,
        data: {
          status: values.status,
          checkIn: attending ? values.checkIn?.format("HH:mm") : undefined,
          checkOut: attending ? values.checkOut?.format("HH:mm") : undefined,
          remarks: remarks || undefined,
        },
      });
      onSaved(toTeacherAttendanceRow(response.data), remarks);
      setSuccessMessage(response.message);
    } catch (error) {
      setErrorMessage(
        getTeacherAttendanceErrorMessage(
          error,
          "Unable to update attendance.",
        ),
      );
    }
  }

  const statusLabel = status
    ? teacherAttendanceStatusLabel(status)
    : (record?.status ?? "Present");
  const date = record?.date.split("-");
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
    <>
      <Dialog
        open={record !== null}
        width={620}
        onClose={onClose}
        onConfirm={() => form.submit()}
        okText="Save changes"
        cancelText="Cancel"
        confirmLoading={isUpdating}
        title={
          record && (
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-bold text-dark">Edit attendance</h2>
                <StatusBadge
                  variant={teacherAttendanceStatusVariants[statusLabel]}
                >
                  {statusLabel}
                </StatusBadge>
              </div>
              <p className="mt-1 text-sm font-normal text-gray">
                {record.teacher} · {record.employeeId} · {date?.[2]}/
                {date?.[1]}/{date?.[0]}
              </p>
            </div>
          )
        }
      >
        <Form form={form} layout="vertical" onFinish={save}>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Select
              name="status"
              label="Status"
              showSearch={false}
              options={teacherAttendanceStatusOptions}
              allowClear={false}
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
          </div>

          <p className={`mt-4 rounded-md px-4 py-3 text-sm font-semibold ${tone}`}>
            {message}
          </p>
          <p className="mt-4 mb-4 text-sm leading-relaxed text-gray">
            {hasTimes
              ? "Present and Late are set from the check-in time using the school opening time and its grace period. Hours are calculated from check-in and check-out."
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
        </Form>
      </Dialog>
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
