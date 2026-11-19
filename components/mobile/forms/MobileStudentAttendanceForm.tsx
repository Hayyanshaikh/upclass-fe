"use client";

import { useEffect } from "react";
import { Form } from "antd";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import StatusBadge from "@/components/ui/StatusBadge";
import TextArea from "@/components/ui/TextArea";
import MobileSheet from "@/components/mobile/ui/MobileSheet";
import { attendanceStatusVariants } from "@/constants/attendance";
import type { AttendanceRow, AttendanceStatus } from "@/types/attendance";

export type StudentAttendanceValues = {
  status: AttendanceStatus;
  remarks: string;
};

type MobileStudentAttendanceFormProps = {
  open: boolean;
  student: AttendanceRow | null;
  onClose: () => void;
  onApply: (values: StudentAttendanceValues) => void;
};

const statusOptions = [
  { label: "Present", value: "Present" },
  { label: "Absent", value: "Absent" },
  { label: "Late", value: "Late" },
  { label: "Leave", value: "Leave" },
];

export default function MobileStudentAttendanceForm({
  open,
  student,
  onClose,
  onApply,
}: MobileStudentAttendanceFormProps) {
  const [form] = Form.useForm<StudentAttendanceValues>();
  const status = Form.useWatch("status", form) ?? student?.status;

  useEffect(() => {
    if (!open || !student) return;

    form.setFieldsValue({
      status: student.status,
      remarks: student.remarks,
    });
  }, [open, student, form]);

  function handleApply(values: StudentAttendanceValues) {
    onApply({
      status: values.status,
      remarks: values.remarks?.trim() ?? "",
    });
  }

  return (
    <MobileSheet
      open={open}
      onClose={onClose}
      title="Attendance details"
      closeLabel="Close"
    >
      {student && (
        <div className="mt-3 flex shrink-0 items-center gap-3 border-b border-border pb-4">
          <span
            aria-hidden="true"
            className="flex size-10 shrink-0 items-center justify-center rounded-full bg-success/10 text-xs font-bold text-primary"
          >
            {student.roll}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-dark">
              {student.name}
            </p>
            <p className="mt-0.5 truncate text-xs text-gray">
              Roll {student.roll}
            </p>
          </div>
          {status && (
            <StatusBadge variant={attendanceStatusVariants[status]}>
              {status}
            </StatusBadge>
          )}
        </div>
      )}

      <Form
        form={form}
        layout="vertical"
        requiredMark={false}
        onFinish={handleApply}
        className="mt-4! flex min-h-0 flex-1 flex-col"
      >
        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto pb-1 [&_.ant-form-item]:mb-0">
          <Select
            name="status"
            label="Status"
            options={statusOptions}
            showSearch={false}
            isRequird
          />
          <TextArea
            name="remarks"
            label="Remarks"
            rows={2}
            placeholder="e.g. Sick"
          />
        </div>

        <div className="mt-3 flex shrink-0 items-center gap-2 border-t border-border pt-3">
          <Button fullWidth variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button fullWidth type="submit">
            Done
          </Button>
        </div>
      </Form>
    </MobileSheet>
  );
}
