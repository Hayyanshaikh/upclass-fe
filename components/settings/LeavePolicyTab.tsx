"use client";

import { Form } from "antd";
import { LuCalendarDays } from "react-icons/lu";
import ActionButtons from "@/components/shared/ActionButtons";
import SectionTitle from "@/components/settings/SectionTitle";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import SectionCard from "@/components/ui/SectionCard";
import Select from "@/components/ui/Select";

export default function LeavePolicyTab() {
  return <SectionCard className="h-auto! min-h-full">
    <SectionTitle icon={LuCalendarDays}>Leave policy</SectionTitle>
    <Form.List name="leaveTypes">{(fields, { add, remove }) => <div className="space-y-4">
      {fields.map((field) => <div key={field.key} className="grid items-end gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,0.6fr)_auto]">
        <Input name={[field.name, "name"]} label="Leave type" isRequird />
        <Input name={[field.name, "days"]} label="Days per year" type="number" isRequird />
        <ActionButtons name="leave type" onDelete={() => remove(field.name)} />
      </div>)}
      <Button variant="secondary" onClick={() => add({ id: crypto.randomUUID(), name: "", days: 0 })}>Add leave type</Button>
    </div>}</Form.List>
    <div className="mt-5 grid gap-4 md:grid-cols-2">
      <Select name="approvalRequired" label="Approval required" options={[{ label: "Yes", value: "Yes" }, { label: "No", value: "No" }]} />
      <Select name="carryForward" label="Carry forward unused days" options={[{ label: "No", value: "No" }, { label: "Yes", value: "Yes" }]} />
    </div>
  </SectionCard>;
}
