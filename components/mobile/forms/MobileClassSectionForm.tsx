"use client";

import { useEffect } from "react";
import { Form } from "antd";
import MobileSheet from "@/components/mobile/ui/MobileSheet";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { classSectionFormDefaults } from "@/constants/classes";
import { useSectionDropdown } from "@/hooks/useSectionDropdown";
import { useTeacherDropdown } from "@/hooks/useTeacherDropdown";
import type { ClassSectionFormValues } from "@/types/classes";

type MobileClassSectionFormProps = {
  open: boolean;
  onClose: () => void;
  onAdd: (values: ClassSectionFormValues) => void;
};

export default function MobileClassSectionForm({
  open,
  onClose,
  onAdd,
}: MobileClassSectionFormProps) {
  const [form] = Form.useForm<ClassSectionFormValues>();
  const { options: teacherOptions } = useTeacherDropdown();
  const { options: sectionOptions, isLoading: isSectionsLoading } =
    useSectionDropdown();

  useEffect(() => {
    if (!open) return;
    form.resetFields();
    form.setFieldsValue({ ...classSectionFormDefaults });
  }, [open, form]);

  function handleFinish(values: ClassSectionFormValues) {
    onAdd(values);
  }

  return (
    <MobileSheet open={open} onClose={onClose} title="Add section">
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        scrollToFirstError
        requiredMark={false}
        className="mt-4 flex min-h-0 flex-1 flex-col"
      >
        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto pb-1 [&_.ant-form-item]:mb-0">
          <Select
            name="sectionId"
            label="Section"
            placeholder="Select section"
            options={sectionOptions}
            loading={isSectionsLoading}
            isRequird
          />
          <Select
            name="teacherId"
            label="Class teacher"
            placeholder="Select class teacher"
            options={teacherOptions}
            isRequird
          />
          <Input
            name="room"
            label="Classroom"
            placeholder="Enter classroom, e.g. Room 12"
            rules={[{ whitespace: true, message: "Enter classroom." }]}
          />
          <Input
            name="capacity"
            label="Student capacity"
            type="number"
            placeholder="Enter student capacity"
            rules={[
              {
                pattern: /^[1-9]\d*$/,
                message: "Enter a positive whole number.",
              },
            ]}
          />
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
