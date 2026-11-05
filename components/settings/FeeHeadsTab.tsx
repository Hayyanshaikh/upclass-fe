"use client";

import { useState } from "react";
import { Form, message } from "antd";
import type { TableColumnsType } from "antd";
import { LuCreditCard } from "react-icons/lu";
import SectionTitle from "@/components/settings/SectionTitle";
import Button from "@/components/ui/Button";
import Dialog from "@/components/ui/Dialog";
import Input from "@/components/ui/Input";
import SectionCard from "@/components/ui/SectionCard";
import Select from "@/components/ui/Select";
import StatusBadge from "@/components/ui/StatusBadge";
import Table from "@/components/ui/Table";
import { feeHeads } from "@/constants/settings";
import { useFeeHeadsSettings } from "@/hooks/useFeeHeadsSettings";
import type { FeeHead, SettingsTabProps } from "@/types/settings";

const columns: TableColumnsType<FeeHead> = [
  { title: "Fee head", dataIndex: "name", render: (value: string) => <span className="font-semibold">{value}</span> },
  { title: "Required", dataIndex: "required", render: (value: boolean) => <StatusBadge variant={value ? "success" : "neutral"}>{value ? "Required" : "Optional"}</StatusBadge> },
  { title: "Default amount", dataIndex: "amount", render: (value: number) => `Rs. ${value.toLocaleString()}` },
];

export default function FeeHeadsTab({ registerTab, schoolId }: SettingsTabProps) {
  const [form] = Form.useForm();
  const [dialogForm] = Form.useForm();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [fees, setFees] = useState(feeHeads);
  const { data } = useFeeHeadsSettings({
    form,
    registerTab,
    schoolId,
    data: fees,
    setData: setFees,
  });

  function openDialog() {
    dialogForm.resetFields();
    setDialogOpen(true);
  }

  function submitDialog() {
    dialogForm
      .validateFields()
      .then((values) => {
        setFees((current) => [
          ...current,
          {
            id: crypto.randomUUID(),
            name: String(values.name).trim(),
            required: values.required === "Yes",
            amount: Number(values.amount),
          },
        ]);
        setDialogOpen(false);
        message.info(
          "Change added locally. Use Save settings to keep it in this browser.",
        );
      })
      .catch(() => undefined);
  }

  return (
    <>
      <Form form={form} layout="vertical">
        <SectionCard className="h-auto! min-h-full">
          <SectionTitle icon={LuCreditCard}>Fee heads</SectionTitle>
          <p className="mb-5 text-sm text-gray">Default fee heads available when creating a fee structure. Managed in detail from the Fee Structure menu.</p>
          <Table columns={columns} data={data} pagination={false} autoHeight />
          <div className="mt-4"><Button variant="secondary" onClick={openDialog}>Add fee head</Button></div>
        </SectionCard>
      </Form>
      <Dialog
        open={dialogOpen}
        title="Add fee head"
        okText="Add"
        onClose={() => setDialogOpen(false)}
        onConfirm={submitDialog}
      >
        <Form form={dialogForm} layout="vertical" className="space-y-4">
          <Input name="name" label="Fee head" isRequird />
          <Input
            name="amount"
            label="Default amount (Rs.)"
            type="number"
            isRequird
          />
          <Select
            name="required"
            label="Required"
            isRequird
            options={[
              { label: "Yes", value: "Yes" },
              { label: "No", value: "No" },
            ]}
          />
        </Form>
      </Dialog>
    </>
  );
}
