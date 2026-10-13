"use client";

import { Form } from "antd";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { LuTrash2 } from "react-icons/lu";
import SectionCard from "@/components/ui/SectionCard";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import DatePicker from "@/components/ui/DatePicker";
import TimePicker from "@/components/ui/TimePicker";
import Checkbox from "@/components/ui/Checkbox";
import Button from "@/components/ui/Button";
import { academicYearOptions } from "@/constants/classes";
import { examTypeOptions } from "@/constants/exams";
import {
  examClassOptions,
  examDateSheetDefaults,
  examFormDefaults,
  examGradingOptions,
  examSubjectOptions,
  examTermOptions,
  examYesNoOptions,
} from "@/constants/exam-form";
import type { ExamFormProps } from "@/types/exam";

export default function ExamForm({ exam }: ExamFormProps) {
  const router = useRouter();
  const initialValues = exam
    ? {
        ...exam.details,
        name: exam.name,
        type: exam.type,
        classes: Object.fromEntries(
          exam.details.selectedClasses.map((grade) => [grade, true]),
        ),
        startDate: dayjs(exam.details.startDate),
        endDate: dayjs(exam.details.endDate),
        dateSheet: exam.details.dateSheet.map((entry) => ({
          ...entry,
          date: dayjs(entry.date),
          startTime: dayjs(`2000-01-01T${entry.startTime}`),
        })),
      }
    : examFormDefaults;

  return (
    <Form
      key={exam?.id ?? "create"}
      initialValues={initialValues}
      className="flex flex-col gap-5"
    >
      <SectionCard title="Exam details" className="h-auto!">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Input name="name" label="Exam name" placeholder="Enter exam name" />
          <Select
            name="type"
            label="Type"
            options={examTypeOptions}
            placeholder="Select exam type"
          />
          <Select
            name="term"
            label="Term"
            options={examTermOptions}
            placeholder="Select term"
            showSearch={false}
          />
          <Select
            name="academicYear"
            label="Academic year"
            options={academicYearOptions}
            placeholder="Select academic year"
            showSearch={false}
          />
          <DatePicker name="startDate" label="Start date" />
          <DatePicker name="endDate" label="End date" />
        </div>
      </SectionCard>

      <SectionCard title="Classes" className="h-auto!">
        <fieldset>
          <legend className="sr-only">Classes included in this exam</legend>
          <div className="flex flex-wrap gap-3">
            {examClassOptions.map((option) => (
              <div
                key={option.value}
                className="rounded-sm border border-border px-4 py-3"
              >
                <Checkbox
                  name={["classes", option.value]}
                  label={option.label}
                />
              </div>
            ))}
          </div>
        </fieldset>
      </SectionCard>

      <SectionCard title="Date sheet" className="h-auto!">
        <Form.List name="dateSheet">
          {(fields, { add, remove }) => (
            <div className="space-y-4">
              {fields.map((field, index) => (
                <fieldset key={field.key} className="flex items-end gap-3">
                  <legend className="sr-only">Subject row {index + 1}</legend>
                  <div className="grid min-w-0 flex-1 grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
                    <Select
                      name={[field.name, "subject"]}
                      label="Subject"
                      options={examSubjectOptions}
                      placeholder="Select subject"
                    />
                    <DatePicker name={[field.name, "date"]} label="Date" />
                    <TimePicker
                      name={[field.name, "startTime"]}
                      label="Start time"
                    />
                    <Input
                      name={[field.name, "totalMarks"]}
                      label="Total marks"
                      type="number"
                      placeholder="100"
                    />
                    <Input
                      name={[field.name, "passingMarks"]}
                      label="Passing marks"
                      type="number"
                      placeholder="40"
                    />
                  </div>
                  <Button
                    variant="text"
                    danger
                    className="shrink-0"
                    onClick={() => remove(field.name)}
                  >
                    <LuTrash2 aria-hidden="true" />
                    <span className="sr-only">
                      Remove subject row {index + 1}
                    </span>
                  </Button>
                </fieldset>
              ))}
              <Button
                variant="secondary"
                onClick={() => add({ ...examDateSheetDefaults })}
              >
                Add subject
              </Button>
            </div>
          )}
        </Form.List>
      </SectionCard>

      <SectionCard title="Grading" className="h-auto!">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Input
            name="passingPercentage"
            label="Passing percentage (%)"
            type="number"
            placeholder="40"
          />
          <Select
            name="gradingScale"
            label="Grading scale"
            options={examGradingOptions}
            placeholder="Select grading scale"
            showSearch={false}
          />
          <Select
            name="showRank"
            label="Show rank on result card"
            options={examYesNoOptions}
            showSearch={false}
          />
          <Select
            name="notifyParents"
            label="Notify parents on publish"
            options={examYesNoOptions}
            showSearch={false}
          />
        </div>
      </SectionCard>

      <div className="flex flex-wrap justify-end gap-3 pb-4">
        <Button variant="secondary" onClick={() => router.push("/exams")}>
          Cancel
        </Button>
        <Button>{exam ? "Update exam" : "Save exam"}</Button>
      </div>
    </Form>
  );
}
