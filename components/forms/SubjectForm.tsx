"use client";

import { Form } from "antd";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import SectionCard from "@/components/ui/SectionCard";
import Select from "@/components/ui/Select";
import { practicalComponentOptions, subjectFormDefaults, subjectStatusOptions, subjectTypeOptions } from "@/constants/subjects";
import type { Subject, SubjectFormValues } from "@/types/subject";

type SubjectFormProps = {
  subject?: Subject;
  onCancel: () => void;
  onSave: (values: SubjectFormValues) => void;
};

export default function SubjectForm({ subject, onCancel, onSave }: SubjectFormProps) {
  const initialValues: Partial<SubjectFormValues> = subject
    ? {
        name: subject.name,
        code: subject.code,
        type: subject.type,
        status: subject.status,
        hasPractical: subject.hasPractical ?? "No",
        totalMarks: subject.totalMarks ?? 100,
        passingMarks: subject.passingMarks ?? 40,
      }
    : subjectFormDefaults;

  return (
    <Form
      key={subject?.id ?? "new-subject"}
      layout="vertical"
      initialValues={initialValues}
      onFinish={onSave}
      className="flex flex-col gap-5"
    >
      <SectionCard title="Subject details" className="h-auto!">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Input name="name" label="Subject name" isRequird />
          <Input name="code" label="Subject code" isRequird placeholder="e.g. MATH" />
          <Select name="type" label="Type" options={subjectTypeOptions} isRequird placeholder="Select" showSearch={false} />
          <Select name="status" label="Status" options={subjectStatusOptions} isRequird showSearch={false} />
        </div>
      </SectionCard>

      <SectionCard title="Grading" className="h-auto!">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Select
            name="hasPractical"
            label="Has practical / lab component"
            options={practicalComponentOptions}
            showSearch={false}
          />
          <Input name="totalMarks" label="Default total marks" type="number" isRequird />
          <Input name="passingMarks" label="Default passing marks" type="number" isRequird />
        </div>
      </SectionCard>

      <div className="flex flex-wrap justify-end gap-3 pb-4">
        <Button variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit">{subject ? "Save changes" : "Save subject"}</Button>
      </div>
    </Form>
  );
}
