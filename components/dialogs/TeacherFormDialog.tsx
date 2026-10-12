"use client";

import { useEffect } from "react";
import { Form } from "antd";
import Dialog from "@/components/ui/Dialog";
import TeacherForm from "@/components/forms/TeacherForm";
import type { TeacherFormDialogProps, TeacherFormValues } from "@/types/teacher";

export default function TeacherFormDialog({ open, teacher, onClose, onSave }: TeacherFormDialogProps) {
  const [form] = Form.useForm<TeacherFormValues>();

  useEffect(() => {
    if (!open) return;
    form.resetFields();
    form.setFieldsValue(teacher
      ? { ...teacher, classes: teacher.classes.join(", ") }
      : { employment: "Full-time", status: "Active" });
  }, [open, teacher, form]);

  return (
    <Dialog
      open={open}
      title={teacher ? "Edit teacher" : "Add teacher"}
      onClose={onClose}
      onConfirm={() => form.submit()}
      okText={teacher ? "Save changes" : "Add teacher"}
    >
      <TeacherForm form={form} onSave={onSave} />
    </Dialog>
  );
}
