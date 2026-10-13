"use client";

import type { TableColumnsType } from "antd";
import { LuCalendarDays } from "react-icons/lu";
import SectionTitle from "@/components/settings/SectionTitle";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import SectionCard from "@/components/ui/SectionCard";
import Select from "@/components/ui/Select";
import StatusBadge from "@/components/ui/StatusBadge";
import Table from "@/components/ui/Table";
import type { AcademicYear, AcademicYearTabProps } from "@/types/settings";

const columns: TableColumnsType<AcademicYear> = [
  { title: "Year", dataIndex: "year", render: (value: string) => <span className="font-semibold">[{value}]</span> },
  { title: "Duration", dataIndex: "duration" },
  { title: "Status", dataIndex: "status", render: (value: AcademicYear["status"]) => <StatusBadge variant={value === "Active" ? "success" : "neutral"}>{value}</StatusBadge> },
];

export default function AcademicYearTab({ years, onAdd }: AcademicYearTabProps) {
  return <SectionCard className="h-auto! min-h-full">
    <SectionTitle icon={LuCalendarDays}>Academic year</SectionTitle>
    <div className="grid gap-4 md:grid-cols-3">
      <Select name="academicYear" label="Current academic year" isRequird options={years.map((year) => ({ label: `[${year.year}]`, value: year.id }))} />
      <Input name="starts" label="Starts" type="text" placeholder="dd/mm/yyyy" />
      <Input name="ends" label="Ends" type="text" placeholder="dd/mm/yyyy" />
      <Select name="terms" label="Terms" options={[{ label: "2 terms", value: "2" }, { label: "3 terms", value: "3" }]} />
    </div>
    <div className="mt-5"><Table columns={columns} data={years} pagination={false} autoHeight /></div>
    <div className="mt-4"><Button variant="secondary" onClick={onAdd}>Add academic year</Button></div>
  </SectionCard>;
}
