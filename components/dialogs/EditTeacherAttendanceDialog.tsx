"use client";

import { useEffect } from "react";
import { Form, TimePicker } from "antd";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { LuClock } from "react-icons/lu";
import Dialog from "@/components/ui/Dialog";
import Select from "@/components/ui/Select";
import StatusBadge from "@/components/ui/StatusBadge";
import TextArea from "@/components/ui/TextArea";
import { teacherAttendanceStatusOptions, teacherAttendanceStatusVariants } from "@/constants/teacher-attendance";
import type { TeacherAttendanceRow, TeacherAttendanceStatus } from "@/types/teacher-attendance";

type EditTeacherAttendanceDialogProps = {
  record: TeacherAttendanceRow | null;
  onClose: () => void;
  onSave: (record: TeacherAttendanceRow, reason: string) => void;
};

type AttendanceValues = {
  status: TeacherAttendanceStatus;
  checkIn?: Dayjs;
  checkOut?: Dayjs;
  absenceType?: string;
  leaveType?: string;
  reason: string;
};

const minutes = (value: Dayjs) => value.hour() * 60 + value.minute();
const timeValue = (date: string, value?: string) => value ? dayjs(`${date}T${value}:00`) : undefined;

export default function EditTeacherAttendanceDialog({ record, onClose, onSave }: EditTeacherAttendanceDialogProps) {
  const [form] = Form.useForm<AttendanceValues>();
  const status = Form.useWatch("status", form) ?? record?.status;
  const checkIn = Form.useWatch("checkIn", form) as Dayjs | undefined;
  const checkOut = Form.useWatch("checkOut", form) as Dayjs | undefined;
  const hasTimes = status === "Present" || status === "Late";
  const lateMinutes = checkIn ? Math.max(0, minutes(checkIn) - 490) : 0;
  const workedMinutes = checkIn && checkOut ? Math.max(0, minutes(checkOut) - minutes(checkIn)) : 0;
  const workedHours = checkIn && checkOut
    ? `${Math.floor(workedMinutes / 60)}h ${String(workedMinutes % 60).padStart(2, "0")}m`
    : checkIn ? "Working" : "No hours counted";

  useEffect(() => {
    if (!record) return;
    form.setFieldsValue({
      status: record.status,
      checkIn: timeValue(record.date, record.checkIn),
      checkOut: timeValue(record.date, record.checkOut),
      absenceType: record.absenceType ?? "Unexcused",
      leaveType: record.leaveType ?? "Medical leave",
      reason: "",
    });
  }, [record, form]);

  function save(values: AttendanceValues) {
    if (!record) return;
    const attending = values.status === "Present" || values.status === "Late";
    const inTime = attending ? values.checkIn?.format("HH:mm") : undefined;
    const outTime = attending ? values.checkOut?.format("HH:mm") : undefined;
    const finalStatus = attending && values.checkIn
      ? minutes(values.checkIn) > 490 ? "Late" : "Present"
      : values.status;
    onSave({
      ...record,
      status: finalStatus,
      checkIn: inTime,
      checkOut: outTime,
      hours: attending ? workedHours : undefined,
      lateMinutes: finalStatus === "Late" ? lateMinutes : undefined,
      absenceType: values.status === "Absent" ? values.absenceType : undefined,
      leaveType: values.status === "Leave" ? values.leaveType : undefined,
      source: "Edited by admin",
    }, values.reason.trim());
  }

  const date = record?.date.split("-");
  const message = status === "Present" ? `On time · ${workedHours} worked`
    : status === "Late" ? `Late by ${lateMinutes} min · ${workedHours} worked`
    : status === "Absent" ? "Absent · no hours counted"
    : "On leave · no hours counted";
  const tone = status === "Present" ? "bg-success/10 text-primary"
    : status === "Late" ? "bg-warning/10 text-warning"
    : status === "Absent" ? "bg-danger/10 text-danger"
    : "bg-gray/10 text-gray";

  return (
    <Dialog
      open={record !== null}
      width={620}
      onClose={onClose}
      onConfirm={() => form.submit()}
      okText="Save changes"
      cancelText="Cancel"
      title={record && <div>
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-bold text-dark">Edit attendance</h2>
          <StatusBadge variant={teacherAttendanceStatusVariants[status ?? record.status]}>{status ?? record.status}</StatusBadge>
        </div>
        <p className="mt-1 text-sm font-normal text-gray">{record.teacher} · {record.id} · {date?.[2]}/{date?.[1]}/{date?.[0]}</p>
      </div>}
    >
      <Form form={form} layout="vertical" onFinish={save}>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Select name="status" label="Status" showSearch={false} options={teacherAttendanceStatusOptions} allowClear={false} />
          <Form.Item name="checkIn" label={<span className="font-semibold">Check-in</span>}
            rules={hasTimes ? [{ required: true, message: "Check-in is required" }] : []}>
            <TimePicker className="w-full" format="hh:mm a" placeholder="--:--" disabled={!hasTimes} suffixIcon={<LuClock aria-hidden="true" />}
              onChange={(value) => {
                if (value && hasTimes) form.setFieldValue("status", minutes(value) > 490 ? "Late" : "Present");
              }} />
          </Form.Item>
          <Form.Item name="checkOut" label={<span className="font-semibold">Check-out</span>}>
            <TimePicker className="w-full" format="hh:mm a" placeholder="--:--" disabled={!hasTimes} suffixIcon={<LuClock aria-hidden="true" />} />
          </Form.Item>
        </div>

        {status === "Absent" && <div className="mt-3">
          <Select name="absenceType" label="Absence type" showSearch={false} allowClear={false} options={[
            { label: "Unexcused", value: "Unexcused" },
            { label: "Excused", value: "Excused" },
          ]} />
        </div>}
        {status === "Leave" && <div className="mt-3">
          <Select name="leaveType" label="Leave type" showSearch={false} allowClear={false} options={[
            { label: "Medical leave", value: "Medical leave" },
            { label: "Casual leave", value: "Casual leave" },
            { label: "Annual leave", value: "Annual leave" },
          ]} />
          {record?.status === "Leave" && <p className="mt-2 text-sm text-gray">Linked request: LR-[0000] · approved</p>}
        </div>}

        <p className={`mt-4 rounded-md px-4 py-3 text-sm font-semibold ${tone}`}>{message}</p>
        <p className="mt-4 mb-4 text-sm leading-relaxed text-gray">
          {hasTimes ? status === "Late"
            ? "Check-in after 08:10 is marked Late. Late minutes update when the check-in time changes."
            : "Check-in up to 08:10 counts as Present. Hours are calculated from check-in and check-out."
            : status === "Absent"
              ? "No check-in was recorded. Choose Present or Late to enter times."
              : "Leave was set from an approved request. Choose Present or Late if the teacher attended."}
        </p>
        <TextArea name="reason" label="Reason for change (required)" rows={2}
          placeholder="e.g. Biometric device was offline"
          rules={[{ required: true, whitespace: true, message: "Reason for change is required" }]} />
      </Form>
    </Dialog>
  );
}
