"use client";

import { useEffect } from "react";
import { Drawer, Form } from "antd";
import { LuX } from "react-icons/lu";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import MobileIconButton from "@/components/mobile/ui/MobileIconButton";
import { useSwipeToDismiss } from "@/hooks/useSwipeToDismiss";
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
  const { triggerRef, triggerProps } = useSwipeToDismiss({
    onDismiss: onClose,
  });

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
    <Drawer
      open={open}
      onClose={onClose}
      placement="bottom"
      size="auto"
      closable={false}
      mask={{ closable: true }}
      classNames={{
        section: "rounded-t-2xl!  shadow-xl! bg-background!",
        body: " px-4! pt-0! pb-[calc(1rem+env(safe-area-inset-bottom))]!",
        wrapper: "shadow-none!",
      }}
    >
      <div
        ref={triggerRef}
        aria-hidden="true"
        className="mx-auto flex w-full touch-none justify-center py-3 select-none"
        {...triggerProps}
      >
        <span className="h-1 w-10 rounded-full bg-border" />
      </div>

      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-dark">Filters</h2>
        <MobileIconButton variant="ghost" label="Close filters" onClick={onClose}>
          <LuX size={20} aria-hidden="true" />
        </MobileIconButton>
      </div>

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
    </Drawer>
  );
}
