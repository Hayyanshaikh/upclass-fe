"use client";

import type { TableColumnsType } from "antd";
import { LuCreditCard } from "react-icons/lu";
import SectionTitle from "@/components/settings/SectionTitle";
import Button from "@/components/ui/Button";
import SectionCard from "@/components/ui/SectionCard";
import StatusBadge from "@/components/ui/StatusBadge";
import Table from "@/components/ui/Table";
import type { FeeHead, FeeHeadsTabProps } from "@/types/settings";

const columns: TableColumnsType<FeeHead> = [
  { title: "Fee head", dataIndex: "name", render: (value: string) => <span className="font-semibold">{value}</span> },
  { title: "Required", dataIndex: "required", render: (value: boolean) => <StatusBadge variant={value ? "success" : "neutral"}>{value ? "Required" : "Optional"}</StatusBadge> },
  { title: "Default amount", dataIndex: "amount", render: (value: number) => `Rs. ${value.toLocaleString()}` },
];

export default function FeeHeadsTab({ fees, onAdd }: FeeHeadsTabProps) {
  return <SectionCard className="h-auto! min-h-full">
    <SectionTitle icon={LuCreditCard}>Fee heads</SectionTitle>
    <p className="mb-5 text-sm text-gray">Default fee heads available when creating a fee structure. Managed in detail from the Fee Structure menu.</p>
    <Table columns={columns} data={fees} pagination={false} autoHeight />
    <div className="mt-4"><Button variant="secondary" onClick={onAdd}>Add fee head</Button></div>
  </SectionCard>;
}
