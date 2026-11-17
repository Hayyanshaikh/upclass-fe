"use client";

import { useEffect } from "react";
import { Form } from "antd";
import MobileSheet from "@/components/mobile/ui/MobileSheet";
import Button from "@/components/ui/Button";
import FileUpload from "@/components/ui/FileUpload";
import Input from "@/components/ui/Input";
import type { TeacherDocumentFormValue } from "@/types/teacher";

type MobileTeacherDocumentFormProps = {
  open: boolean;
  onClose: () => void;
  onAdd: (values: TeacherDocumentFormValue) => void;
};

export default function MobileTeacherDocumentForm({
  open,
  onClose,
  onAdd,
}: MobileTeacherDocumentFormProps) {
  const [form] = Form.useForm<TeacherDocumentFormValue>();

  useEffect(() => {
    if (!open) return;
    form.resetFields();
  }, [open, form]);

  return (
    <MobileSheet
      open={open}
      onClose={onClose}
      title="Add document"
      closeLabel="Close"
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onAdd}
        scrollToFirstError
        requiredMark={false}
        className="mt-4 flex min-h-0 flex-1 flex-col"
      >
        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto pb-1 [&_.ant-form-item]:mb-0">
          <Input
            name="documentName"
            label="Document name"
            placeholder="e.g. CNIC, Degree"
            isRequird
            rules={[{ whitespace: true, message: "Enter document name." }]}
          />
          <FileUpload name="file" label="Document file" maxSizeMB={5} />
        </div>

        <div className="mt-3 flex shrink-0 items-center gap-2 border-t border-border pt-3">
          <Button fullWidth variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button fullWidth type="submit">
            Add
          </Button>
        </div>
      </Form>
    </MobileSheet>
  );
}
