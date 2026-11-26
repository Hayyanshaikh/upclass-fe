"use client";

import { Form } from "antd";
import { LuX } from "react-icons/lu";
import Dialog from "@/components/ui/Dialog";
import TextArea from "@/components/ui/TextArea";
import type { LeaveRequestDto } from "@/app/api/schemas";
import { formatTeacherName } from "@/lib/api/leave-requests";

type RejectLeaveRequestDialogProps = {
  request: LeaveRequestDto;
  open: boolean;
  isSubmitting: boolean;
  onClose: () => void;
  onReject: (reason: string) => void;
  afterClose?: () => void;
};

export default function RejectLeaveRequestDialog({
  request,
  open,
  isSubmitting,
  onClose,
  onReject,
  afterClose,
}: RejectLeaveRequestDialogProps) {
  const [form] = Form.useForm<{ reason: string }>();

  return (
    <Dialog
      open={open}
      title={
        <div className="flex items-center gap-4">
          <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-danger/10 text-danger">
            <LuX className="size-6" aria-hidden="true" />
          </span>
          <span className="text-xl font-extrabold text-dark">
            Reject this request?
          </span>
        </div>
      }
      onClose={onClose}
      onConfirm={() => form.submit()}
      afterClose={() => {
        form.resetFields();
        afterClose?.();
      }}
      okText="Reject request"
      cancelText="Cancel"
      confirmLoading={isSubmitting}
      confirmDanger
      width={480}
    >
      <p className="mb-4 text-sm leading-relaxed text-gray">
        {formatTeacherName(request.teacher)} will be notified with your reason.
        The dates stay as normal working days.
      </p>
      <Form
        form={form}
        layout="vertical"
        onFinish={({ reason }) => onReject(reason.trim())}
      >
        <TextArea
          name="reason"
          label="Reason (required)"
          rows={4}
          rules={[
            {
              required: true,
              whitespace: true,
              message: "Enter a reason for rejecting this request",
            },
          ]}
        />
      </Form>
    </Dialog>
  );
}
