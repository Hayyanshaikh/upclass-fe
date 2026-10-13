"use client";

import { Form, message } from "antd";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LuInfo } from "react-icons/lu";
import Button from "@/components/ui/Button";
import Checkbox from "@/components/ui/Checkbox";
import DatePicker from "@/components/ui/DatePicker";
import FileUpload from "@/components/ui/FileUpload";
import Input from "@/components/ui/Input";
import SectionCard from "@/components/ui/SectionCard";
import Select from "@/components/ui/Select";
import TextArea from "@/components/ui/TextArea";
import PageHeader from "@/components/shared/PageHeader";
import { leaveBalances, leaveTypeOptions, substituteOptions } from "@/constants/employee-leaves";
import type { ApplyLeaveFormValues } from "@/types/employee-leave";

const initialValues: ApplyLeaveFormValues = {
  leaveType: "Casual leave",
  totalDays: "1 day",
  halfDay: false,
  substitute: "None",
};

function formatDays(days: number) {
  return `${days} ${days === 1 || days === 0.5 ? "day" : "days"}`;
}

function formatBalance(days: number) {
  return `${Number.isInteger(days) ? days : days.toFixed(1)} ${days === 1 || days === 0.5 ? "day" : "days"}`;
}

export default function ApplyLeaveForm() {
  const router = useRouter();
  const [form] = Form.useForm<ApplyLeaveFormValues>();
  const [values, setValues] = useState<ApplyLeaveFormValues>(initialValues);
  const selectedBalance = leaveBalances.find((balance) => balance.type === values.leaveType) ?? leaveBalances[0];
  const fromDate = values.fromDate;
  const toDate = values.toDate;
  const requestDays = values.halfDay
    ? 0.5
    : fromDate && toDate
      ? Math.max(1, toDate.startOf("day").diff(fromDate.startOf("day"), "day") + 1)
      : 1;

  function handleValuesChange(_: Partial<ApplyLeaveFormValues>, allValues: ApplyLeaveFormValues) {
    const nextValues = { ...allValues };
    const nextDays = nextValues.halfDay
      ? 0.5
      : nextValues.fromDate && nextValues.toDate
        ? Math.max(1, nextValues.toDate.startOf("day").diff(nextValues.fromDate.startOf("day"), "day") + 1)
        : 1;
    nextValues.totalDays = formatDays(nextDays);
    setValues(nextValues);
    form.setFieldValue("totalDays", nextValues.totalDays);
  }

  function handleSubmit(submittedValues: ApplyLeaveFormValues) {
    if (submittedValues.fromDate && submittedValues.toDate && submittedValues.toDate.isBefore(submittedValues.fromDate, "day")) {
      form.setFields([{ name: "toDate", errors: ["To date must be on or after the from date"] }]);
      return;
    }
    if (submittedValues.halfDay && submittedValues.fromDate && submittedValues.toDate && !submittedValues.toDate.isSame(submittedValues.fromDate, "day")) {
      form.setFields([{ name: "toDate", errors: ["Half day leave must be for one date"] }]);
      return;
    }
    const balance = leaveBalances.find((item) => item.type === submittedValues.leaveType) ?? leaveBalances[0];
    const days = submittedValues.halfDay
      ? 0.5
      : submittedValues.fromDate && submittedValues.toDate
        ? Math.max(1, submittedValues.toDate.startOf("day").diff(submittedValues.fromDate.startOf("day"), "day") + 1)
        : 1;
    if (balance.type === "Medical leave" && days > 2 && !submittedValues.attachments?.length) {
      form.setFields([{ name: "attachments", errors: ["Attach a medical certificate for more than 2 days"] }]);
      return;
    }
    message.info("Leave request submission is not connected yet.");
  }

  return (
    <div className="min-h-full">
      <PageHeader
        title="Apply leave"
        subtitle="Submit a new leave request"
        breadcrumbs={[
          { title: "Leave Requests", href: "/teacher-leaves" },
          { title: "Apply" },
        ]}
      />

      <Form<ApplyLeaveFormValues>
        form={form}
        layout="vertical"
        initialValues={initialValues}
        onValuesChange={handleValuesChange}
        onFinish={handleSubmit}
        className="flex flex-col gap-5"
      >
        <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-3">
          <div className="flex min-w-0 flex-col gap-5 xl:col-span-2">
            <SectionCard title="Leave details" className="h-auto!">
              <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                <Select
                  name="leaveType"
                  label="Leave type"
                  options={leaveTypeOptions}
                  placeholder="Select"
                  showSearch={false}
                />
                <DatePicker name="fromDate" label="From date" isRequird />
                <DatePicker
                  name="toDate"
                  label="To date"
                  isRequird
                  minDate={fromDate}
                />
                <Input name="totalDays" label="Total days" disabled />
                <div className="sm:col-span-2">
                  <Checkbox name="halfDay" label="Half day" />
                </div>
                <div className="sm:col-span-2">
                  <TextArea name="reason" label="Reason" rows={4} />
                </div>
              </div>
            </SectionCard>

            <SectionCard title="Attachment and contact" className="h-auto!">
              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <FileUpload name="attachments" />
                  <p className="text-sm text-gray">
                    Medical certificate is required for medical leave of more than 2 days.
                  </p>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Input name="contact" label="Contact during leave" type="tel" placeholder="0300-0000000" />
                  <Select
                    name="substitute"
                    label="Suggested substitute"
                    options={substituteOptions}
                    showSearch={false}
                  />
                </div>
              </div>
            </SectionCard>
          </div>

          <SectionCard title="Balance" className="h-auto!">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="text-gray">{selectedBalance.type} balance</span>
                <span className="font-semibold text-dark">{formatBalance(selectedBalance.remaining)}</span>
              </div>
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="text-gray">This request</span>
                <span className="font-semibold text-dark">{formatBalance(requestDays)}</span>
              </div>
              <div className="flex items-center justify-between gap-4 border-t border-border pt-4 text-sm font-extrabold text-dark">
                <span>Balance after approval</span>
                <span>{formatBalance(Math.max(0, selectedBalance.remaining - requestDays))}</span>
              </div>
              <div className="flex gap-3 rounded-md bg-info/10 p-4 text-sm leading-relaxed text-info">
                <LuInfo className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
                <p>Your request goes to the principal. After approval, your attendance for these dates is set to Leave automatically.</p>
              </div>
            </div>
          </SectionCard>
        </div>

        <div className="flex flex-wrap justify-end gap-3 pb-4">
          <Button variant="secondary" onClick={() => router.push("/teacher-leaves")}>Cancel</Button>
          <Button type="submit">Submit request</Button>
        </div>
      </Form>
    </div>
  );
}
