"use client";

import { useEffect } from "react";
import { Form } from "antd";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import MobileSheet from "@/components/mobile/ui/MobileSheet";
import type { MobileListFilterField } from "@/types/mobile-list";

type MobileListFiltersProps = {
  open: boolean;
  fields: MobileListFilterField[];
  values: Record<string, unknown>;
  onApply: (values: Record<string, unknown>) => void;
  onClose: () => void;
};

export default function MobileListFilters({
  open,
  fields,
  values,
  onApply,
  onClose,
}: MobileListFiltersProps) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (!open) return;
    form.setFieldsValue(values);
  }, [open, values, form]);

  function handleReset() {
    form.setFieldsValue(
      Object.fromEntries(fields.map((field) => [field.name, undefined])),
    );
  }

  function handleApply() {
    const draft = form.getFieldsValue();
    const applied: Record<string, unknown> = {};

    for (const field of fields) {
      applied[field.name] = draft[field.name];
    }

    onApply(applied);
    onClose();
  }

  return (
    <MobileSheet
      open={open}
      onClose={onClose}
      title="Filters"
      closeLabel="Close filters"
    >
      <Form
        form={form}
        layout="vertical"
        requiredMark={false}
        className="mt-2 flex flex-col gap-4 [&_.ant-form-item]:mb-0"
      >
        {fields.map((field) => (
          <Select
            key={field.name}
            name={field.name}
            label={field.label}
            placeholder={field.placeholder}
            options={field.options}
            allowClear
            showSearch={false}
          />
        ))}
      </Form>

      <div className="mt-5 flex gap-2">
        <Button fullWidth variant="secondary" onClick={handleReset}>
          Reset
        </Button>
        <Button fullWidth onClick={handleApply}>
          Apply
        </Button>
      </div>
    </MobileSheet>
  );
}
