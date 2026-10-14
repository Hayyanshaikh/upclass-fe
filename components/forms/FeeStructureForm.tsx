"use client";

import { Form } from "antd";
import { useRouter } from "next/navigation";
import { LuTrash2 } from "react-icons/lu";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import SectionCard from "@/components/ui/SectionCard";
import Select from "@/components/ui/Select";
import { academicYearOptions, classGradeOptions } from "@/constants/classes";
import { defaultFeeHeads } from "@/constants/fee-structure";
import { useFeeStructureStore } from "@/stores/fee-structures";
import type { FeeHead, FeeStructure, FeeStructureFormValues } from "@/types/fee-structure";

type FeeStructureFormProps = { structure?: FeeStructure };

const frequencyOptions = ["Monthly", "Quarterly", "Yearly"].map((value) => ({ label: value, value }));
const statusOptions = ["Active", "Inactive"].map((value) => ({ label: value, value }));
const graceOptions = ["None", "3 days", "5 days", "7 days"].map((value) => ({ label: value, value }));

function initialHeads(structure?: FeeStructure): FeeHead[] | typeof defaultFeeHeads {
  if (!structure) return defaultFeeHeads;
  return structure.feeHeads?.length ? structure.feeHeads : [
    { name: "Tuition fee", amount: structure.tuition },
    { name: "Exam fee", amount: structure.examFee },
    { name: "Lab fee", amount: structure.labFee },
    { name: "Sports fee", amount: structure.sportsFee },
  ];
}

export default function FeeStructureForm({ structure }: FeeStructureFormProps) {
  const router = useRouter();
  const saveStructure = useFeeStructureStore((state) => state.saveStructure);
  const [form] = Form.useForm<FeeStructureFormValues>();
  const initialValues: FeeStructureFormValues = {
    grade: structure ? String(structure.grade) : undefined,
    academicYear: structure?.academicYear ?? "2026-27",
    frequency: structure?.frequency ?? "Monthly",
    status: structure?.status ?? "Active",
    feeHeads: initialHeads(structure) as FeeHead[],
    dueDay: structure?.dueDay ?? 10,
    lateFine: structure?.lateFine,
    siblingDiscount: structure?.siblingDiscount,
    gracePeriod: structure?.gracePeriod ?? "None",
  };
  const watchedHeads = Form.useWatch("feeHeads", form) as FeeHead[] | undefined;
  const frequency = Form.useWatch("frequency", form) as FeeStructureFormValues["frequency"] | undefined;
  const monthlyTotal = (watchedHeads ?? initialValues.feeHeads).reduce((sum, head) => sum + (Number(head?.amount) || 0), 0);

  function handleSubmit(values: FeeStructureFormValues) {
    if (!values.feeHeads?.length) {
      form.setFields([{ name: ["feeHeads"], errors: ["Add at least one fee head"] }]);
      return;
    }

    const grade = Number(values.grade);
    if (!Number.isInteger(grade) || grade < 1) return;
    if (useFeeStructureStore.getState().records.some((item) =>
      item.id !== structure?.id && item.grade === grade && item.academicYear === values.academicYear)) {
      form.setFields([{ name: ["grade"], errors: ["A fee structure already exists for this class and year"] }]);
      return;
    }

    const feeHeads = values.feeHeads.map((head) => ({ name: head.name.trim(), amount: Number(head.amount) }));
    const amountFor = (name: string) => feeHeads.find((head) => head.name.toLowerCase() === name)?.amount ?? 0;
    saveStructure({
      id: structure?.id ?? crypto.randomUUID(),
      grade,
      academicYear: values.academicYear,
      frequency: values.frequency,
      status: values.status,
      feeHeads,
      tuition: amountFor("tuition fee"),
      examFee: amountFor("exam fee"),
      labFee: amountFor("lab fee"),
      sportsFee: amountFor("sports fee"),
      dueDay: values.dueDay === undefined ? undefined : Number(values.dueDay),
      lateFine: values.lateFine === undefined ? undefined : Number(values.lateFine),
      siblingDiscount: values.siblingDiscount === undefined ? undefined : Number(values.siblingDiscount),
      gracePeriod: values.gracePeriod,
    });
    router.push("/fee-structure");
  }

  return <Form
    key={structure?.id ?? "add"}
    form={form}
    initialValues={initialValues}
    layout="vertical"
    onFinish={handleSubmit}
    scrollToFirstError
  >
    <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,2fr)_minmax(18rem,1fr)]">
      <div className="flex min-w-0 flex-col gap-5">
        <SectionCard title="Class and year" className="h-auto!">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Select name="grade" label="Class" placeholder="Select" options={classGradeOptions} isRequird />
            <Select name="academicYear" label="Academic year" options={academicYearOptions} isRequird showSearch={false} />
            <Select name="frequency" label="Frequency" options={frequencyOptions} isRequird showSearch={false} />
            <Select name="status" label="Status" options={statusOptions} isRequird showSearch={false} />
          </div>
        </SectionCard>

        <SectionCard title="Fee heads" className="h-auto!">
          <Form.List name="feeHeads" rules={[{ validator: async (_, heads) => {
            if (!heads?.length) throw new Error("Add at least one fee head");
          } }]}>
            {(fields, { add, remove }, { errors }) => <div className="flex flex-col gap-4">
              {fields.map((field, index) => <div key={field.key} className="flex items-end gap-3">
                <div className="grid min-w-0 flex-1 grid-cols-1 gap-3 sm:grid-cols-2">
                  <Input name={[field.name, "name"]} label="Fee head" placeholder="Fee head name" isRequird />
                  <Input name={[field.name, "amount"]} label="Amount (Rs.)" type="number" placeholder="0" isRequird
                    rules={[{ pattern: /^(?:0|[1-9]\d*)(?:\.\d{1,2})?$/, message: "Enter a valid amount" }]} />
                </div>
                <Button variant="text" danger className="shrink-0" onClick={() => remove(field.name)}>
                  <LuTrash2 aria-hidden="true" /><span className="sr-only">Remove fee head {index + 1}</span>
                </Button>
              </div>)}
              <div><Button variant="secondary" onClick={() => add({ name: "", amount: undefined })}>Add fee head</Button></div>
              <Form.ErrorList errors={errors} />
            </div>}
          </Form.List>
        </SectionCard>

        <SectionCard title="Due date and fine" className="h-auto!">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input name="dueDay" label="Due day of month" type="number" placeholder="10"
              rules={[{ pattern: /^(?:[1-9]|[12]\d|3[01])$/, message: "Enter a day from 1 to 31" }]} />
            <Input name="lateFine" label="Late fine per day (Rs.)" type="number" placeholder="0"
              rules={[{ pattern: /^\d+(?:\.\d{1,2})?$/, message: "Enter a valid amount" }]} />
            <Input name="siblingDiscount" label="Sibling discount (%)" type="number" placeholder="0"
              rules={[{ pattern: /^(?:100|\d{1,2})(?:\.\d{1,2})?$/, message: "Enter a percentage from 0 to 100" }]} />
            <Select name="gracePeriod" label="Grace period" options={graceOptions} showSearch={false} />
          </div>
        </SectionCard>
      </div>

      <div className="xl:sticky xl:top-5">
        <SectionCard title="Summary" className="h-auto!">
          <p className="text-sm text-gray">{frequency ?? "Monthly"} total for the selected class</p>
          <p className="mt-4 text-3xl font-extrabold text-dark">Rs. {monthlyTotal.toLocaleString("en-PK")}</p>
          <p className="mt-4 border-t border-border pt-4 text-sm text-gray">Fee heads are added together. Late fine applies after the due day plus grace period.</p>
        </SectionCard>
      </div>
    </div>

    <div className="mt-5 flex flex-wrap items-center justify-end gap-3 pb-4">
      <p className="mr-auto text-xs text-gray">Changes are kept until the page is refreshed.</p>
      <Button variant="secondary" onClick={() => router.push("/fee-structure")}>Cancel</Button>
      <Button type="submit">{structure ? "Update fee structure" : "Save fee structure"}</Button>
    </div>
  </Form>;
}
