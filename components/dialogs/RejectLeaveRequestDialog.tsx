"use client";

import { Form } from "antd";
import { LuX } from "react-icons/lu";
import Dialog from "@/components/ui/Dialog";
import TextArea from "@/components/ui/TextArea";
import type { LeaveRequest } from "@/types/leave-request";

type RejectLeaveRequestDialogProps = {
  request: LeaveRequest;
  open: boolean;
  onClose: () => void;
  onReject: (reason: string) => void;
  afterClose: () => void;
};

export default function RejectLeaveRequestDialog({ request, open, onClose, onReject, afterClose }: RejectLeaveRequestDialogProps) {
  const [form] = Form.useForm<{ reason: string }>();

  return (
    <Dialog
      open={open}
      title={
        <div className="flex items-center gap-4">
          <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-danger/10 text-danger">
            <LuX className="size-6" aria-hidden="true" />
          </span>
          <span className="text-xl font-extrabold text-dark">Reject this request?</span>
        </div>
      }
      onClose={onClose}
      onConfirm={() => form.submit()}
      afterClose={() => { form.resetFields(); afterClose(); }}
      okText="Reject request"
      cancelText="Cancel"
      confirmDanger
      width={480}
    >
      <p className="mb-4 text-sm leading-relaxed text-gray">
        {request.teacherName} will be notified with your reason. The dates stay as normal working days in attendance.
      </p>
      <Form form={form} layout="vertical" onFinish={({ reason }) => onReject(reason)}>
        <TextArea
          name="reason"
          label="Reason (required)"
          rows={4}
          rules={[{ required: true, whitespace: true, message: "Enter a reason for rejecting this request" }]}
        />
      </Form>
    </Dialog>
  );
}
