"use client";

import { useEffect } from "react";
import { Form } from "antd";
import Button from "@/components/ui/Button";
import TextArea from "@/components/ui/TextArea";
import MobileSheet from "@/components/mobile/ui/MobileSheet";
import type { LeaveRequestDto } from "@/app/api/schemas";
import {
  formatLeaveRequestDates,
  formatTeacherName,
} from "@/lib/api/leave-requests";

type MobileRejectLeaveRequestSheetProps = {
  open: boolean;
  request: LeaveRequestDto | null;
  isSubmitting: boolean;
  onClose: () => void;
  onReject: (reason: string) => void;
};

export default function MobileRejectLeaveRequestSheet({
  open,
  request,
  isSubmitting,
  onClose,
  onReject,
}: MobileRejectLeaveRequestSheetProps) {
  const [form] = Form.useForm<{ reason: string }>();

  useEffect(() => {
    if (!open) return;
    form.resetFields();
  }, [open, request, form]);

  return (
    <MobileSheet
      open={open}
      onClose={onClose}
      title="Reject this request?"
      closeLabel="Close"
    >
      {request && (
        <p className="mt-1 shrink-0 text-sm leading-5 text-gray">
          {formatTeacherName(request.teacher)}&apos;s{" "}
          {request.leavePolicy?.name ?? "leave"} request for{" "}
          {formatLeaveRequestDates(request.fromDate, request.toDate)} will be
          rejected. The dates stay as normal working days.
        </p>
      )}

      <Form
        form={form}
        layout="vertical"
        requiredMark={false}
        onFinish={({ reason }) => onReject(reason.trim())}
        scrollToFirstError
        className="mt-4! flex min-h-0 flex-1 flex-col"
      >
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto pb-1 [&_.ant-form-item]:mb-0">
          <TextArea
            name="reason"
            label="Reason (required)"
            rows={3}
            placeholder="e.g. Half of the team is already on leave"
            rules={[
              {
                required: true,
                whitespace: true,
                message: "Enter a reason for rejecting this request",
              },
            ]}
          />
        </div>

        <div className="mt-3 flex shrink-0 items-center gap-2 border-t border-border pt-3">
          <Button
            fullWidth
            variant="secondary"
            disabled={isSubmitting}
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            fullWidth
            danger
            type="submit"
            loading={isSubmitting}
          >
            Reject request
          </Button>
        </div>
      </Form>
    </MobileSheet>
  );
}
