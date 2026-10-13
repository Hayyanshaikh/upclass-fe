"use client";

import { Form } from "antd";
import type { TableColumnsType } from "antd";
import { notFound, useRouter, useSearchParams } from "next/navigation";
import PageHeader from "@/components/shared/PageHeader";
import Table from "@/components/ui/Table";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Checkbox from "@/components/ui/Checkbox";
import Button from "@/components/ui/Button";
import StatusBadge from "@/components/ui/StatusBadge";
import { classes } from "@/constants/classes";
import { exams } from "@/constants/exams";
import {
  marksEntryDefaultExamId,
  marksEntryGrades,
  marksEntryStudents,
  marksEntryTotalStudents,
} from "@/constants/marks-entry";
import type {
  MarksEntryCellProps,
  MarksEntryProps,
  MarksEntryStudent,
} from "@/types/marks-entry";

function StudentMarks({ student }: MarksEntryCellProps) {
  const absent =
    Form.useWatch(["students", student.id, "absent"]) ?? student.absent;
  return (
    <div className="max-w-28">
      <Input
        name={["students", student.id, "marks"]}
        type="number"
        placeholder="—"
        disabled={absent}
        ariaLabel={`Marks for ${student.name}`}
      />
    </div>
  );
}

function StudentGrade({ student, totalMarks }: MarksEntryCellProps) {
  const absent =
    Form.useWatch(["students", student.id, "absent"]) ?? student.absent;
  const watchedMarks = Form.useWatch(["students", student.id, "marks"]);
  const marks = watchedMarks === undefined ? student.marks : watchedMarks;
  if (absent) return <StatusBadge>Absent</StatusBadge>;
  if (
    marks === undefined ||
    marks === "" ||
    !Number.isFinite(Number(marks)) ||
    totalMarks <= 0
  ) {
    return <span className="text-gray">—</span>;
  }
  const percentage = (Number(marks) / totalMarks) * 100;
  const grade = marksEntryGrades.find((grade) => percentage >= grade.minimum);
  if (!grade || percentage > 100) return <span className="text-danger">—</span>;
  return <StatusBadge variant={grade.variant}>{grade.label}</StatusBadge>;
}

function MarksEntryForm({ exam }: MarksEntryProps) {
  const router = useRouter();
  const [form] = Form.useForm();
  const firstSubject = exam.details.dateSheet[0];
  const totalMarks = Number(
    Form.useWatch("totalMarks", form) ?? firstSubject.totalMarks,
  );
  const classOptions = classes
    .filter((schoolClass) =>
      exam.details.selectedClasses.includes(schoolClass.grade),
    )
    .map((schoolClass) => ({
      label: `Class ${schoolClass.id}`,
      value: schoolClass.id,
    }));
  const students = marksEntryStudents.map((student) => ({
    ...student,
    marks:
      student.marks === undefined
        ? undefined
        : Math.round((student.marks / 100) * firstSubject.totalMarks),
  }));
  const initialValues = {
    exam: exam.id,
    class: classOptions[0]?.value,
    subject: firstSubject.subject,
    totalMarks: firstSubject.totalMarks,
    students: Object.fromEntries(
      students.map((student) => [
        student.id,
        {
          marks: student.marks,
          absent: student.absent,
          remarks: student.remarks,
        },
      ]),
    ),
  };
  const columns: TableColumnsType<MarksEntryStudent> = [
    {
      title: "Roll",
      dataIndex: "roll",
      key: "roll",
      width: 80,
      render: (roll) => <span className="font-bold text-dark">{roll}</span>,
    },
    {
      title: "Student",
      key: "student",
      width: 230,
      render: (_, student) => (
        <div className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className="flex size-9 shrink-0 items-center justify-center rounded-full bg-success/10 font-bold text-primary"
          >
            {student.name.charAt(0)}
          </span>
          <span className="font-semibold text-dark">{student.name}</span>
        </div>
      ),
    },
    {
      title: `Marks (out of ${totalMarks})`,
      key: "marks",
      width: 185,
      render: (_, student) => (
        <StudentMarks student={student} totalMarks={totalMarks} />
      ),
    },
    {
      title: "Absent",
      key: "absent",
      width: 145,
      render: (_, student) => (
        <Checkbox
          name={["students", student.id, "absent"]}
          label="Absent"
          ariaLabel={`Mark ${student.name} absent`}
        />
      ),
    },
    {
      title: "Grade",
      key: "grade",
      width: 120,
      render: (_, student) => (
        <StudentGrade student={student} totalMarks={totalMarks} />
      ),
    },
    {
      title: "Remarks",
      key: "remarks",
      width: 260,
      render: (_, student) => (
        <Input
          name={["students", student.id, "remarks"]}
          placeholder="Remarks"
          ariaLabel={`Remarks for ${student.name}`}
        />
      ),
    },
  ];

  const saveActions = (
    <>
      <Button variant="secondary">Save draft</Button>
      <Button>Submit marks</Button>
    </>
  );

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <div className="shrink-0">
        <PageHeader
          title="Marks entry"
          breadcrumbs={[
            { title: "Exams", href: "/exams" },
            { title: "Marks entry" },
          ]}
          actions={<div className="flex flex-wrap gap-3">{saveActions}</div>}
        />
      </div>
      <Form form={form} component={false} initialValues={initialValues}>
        <Table
          columns={columns}
          data={students}
          total={marksEntryTotalStudents}
          current={1}
          pageSize={8}
          interactive={false}
          showSearch={false}
          beforeTable={
            <div className="grid shrink-0 grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <Select
                name="exam"
                label="Exam"
                options={exams.map((exam) => ({
                  label: exam.name,
                  value: exam.id,
                }))}
                onChange={(id) => {
                  if (id) router.push(`/exams/marks?exam=${id}`);
                }}
              />
              <Select name="class" label="Class" options={classOptions} />
              <Select
                name="subject"
                label="Subject"
                options={exam.details.dateSheet.map((entry) => ({
                  label: entry.subject,
                  value: entry.subject,
                }))}
                onChange={(subject) => {
                  const entry = exam.details.dateSheet.find(
                    (entry) => entry.subject === subject,
                  );
                  if (entry)
                    form.setFieldsValue({ totalMarks: entry.totalMarks });
                }}
              />
              <Input
                name="totalMarks"
                label="Total marks"
                type="number"
                readOnly
              />
            </div>
          }
        />
      </Form>
      {/* <div className="mt-5 flex shrink-0 flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-gray">
          Marks can be edited until results are published.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" onClick={() => router.push("/exams")}>
            Cancel
          </Button>
          {saveActions}
        </div>
      </div> */}
    </div>
  );
}

export default function MarksEntry() {
  const searchParams = useSearchParams();
  const id = searchParams.get("exam") ?? marksEntryDefaultExamId;
  const exam = exams.find((exam) => exam.id === id);
  if (!exam) notFound();
  return <MarksEntryForm key={exam.id} exam={exam} />;
}
