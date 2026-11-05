"use client";

import { useState } from "react";
import { Form, message } from "antd";
import type { TableColumnsType } from "antd";
import { LuCalendarDays } from "react-icons/lu";
import SectionTitle from "@/components/settings/SectionTitle";
import Button from "@/components/ui/Button";
import DatePicker from "@/components/ui/DatePicker";
import Dialog from "@/components/ui/Dialog";
import Input from "@/components/ui/Input";
import SectionCard from "@/components/ui/SectionCard";
import Select from "@/components/ui/Select";
import StatusBadge from "@/components/ui/StatusBadge";
import Table from "@/components/ui/Table";
import { academicYears } from "@/constants/settings";
import { useAcademicYearSettings } from "@/hooks/useAcademicYearSettings";
import type { AcademicYear, SettingsTabProps } from "@/types/settings";

type AcademicYearRow = AcademicYear & {
  startDate?: string;
  endDate?: string;
  terms?: string;
};

const termsOptions = [
  { label: "2 terms", value: "2" },
  { label: "3 terms", value: "3" },
];

const columns: TableColumnsType<AcademicYear> = [
  {
    title: "Academic Year",
    dataIndex: "year",
    render: (value: string) => <span className="font-semibold">{value}</span>,
  },
  {
    title: "Start Date",
    dataIndex: "startDate",
    render: (value?: string) => value ?? "—",
  },
  {
    title: "End Date",
    dataIndex: "endDate",
    render: (value?: string) => value ?? "—",
  },
  {
    title: "Terms",
    dataIndex: "terms",
    render: (value?: string) => (value ? `${value} terms` : "—"),
  },
  {
    title: "Status",
    dataIndex: "status",
    render: (value: AcademicYear["status"]) => (
      <StatusBadge variant={value === "Active" ? "success" : "danger"}>
        {value}
      </StatusBadge>
    ),
  },
];

export default function AcademicYearTab({
  registerTab,
  schoolId,
}: SettingsTabProps) {
  const [form] = Form.useForm();
  const [dialogForm] = Form.useForm();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [years, setYears] = useState<AcademicYearRow[]>(academicYears);
  const { data } = useAcademicYearSettings({
    form,
    registerTab,
    schoolId,
    data: years,
    setData: (next) => setYears(next),
  });

  function openDialog() {
    dialogForm.resetFields();
    setDialogOpen(true);
  }

  function submitDialog() {
    dialogForm
      .validateFields()
      .then((values) => {
        setYears((current) => [
          ...current,
          {
            id: crypto.randomUUID(),
            year: String(values.year).trim(),
            startDate: values.startDate?.format("DD/MM/YYYY") ?? "—",
            endDate: values.endDate?.format("DD/MM/YYYY") ?? "—",
            terms: values.terms,
            status: "Closed",
          } as AcademicYearRow,
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
        <SectionCard className="h-[75vh]! min-h-full">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <SectionTitle icon={LuCalendarDays}>Academic year</SectionTitle>

            <Button variant="primary" onClick={openDialog}>
              Add academic year
            </Button>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <Select
              name="academicYear"
              label="Current academic year"
              isRequird
              options={data.map((year) => ({
                label: `[${year.year}]`,
                value: year.id,
              }))}
            />
            <DatePicker name="starts" label="Starts" />
            <DatePicker name="ends" label="Ends" />
            <Select name="terms" label="Terms" options={termsOptions} />
          </div>
          <div className="mt-5">
            <Table
              columns={columns}
              data={data}
              pagination={false}
              autoHeight
            />
          </div>
        </SectionCard>
      </Form>
      <Dialog
        open={dialogOpen}
        title="Add academic year"
        okText="Add"
        onClose={() => setDialogOpen(false)}
        onConfirm={submitDialog}
      >
        <Form form={dialogForm} layout="vertical" className="space-y-4!">
          <Input
            name="year"
            label="Academic year"
            isRequird
            placeholder="2026-2027"
          />
          <DatePicker name="startDate" label="Start date" />
          <DatePicker name="endDate" label="End date" />
          <Select name="terms" label="Terms" options={termsOptions} />
        </Form>
      </Dialog>
    </>
  );
}
