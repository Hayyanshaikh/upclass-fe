"use client";

import type { TableColumnsType } from "antd";
import { useState } from "react";
import { notFound, useRouter, useSearchParams } from "next/navigation";
import { LuEye, LuPrinter } from "react-icons/lu";
import PageHeader from "@/components/shared/PageHeader";
import ActionButtons from "@/components/shared/ActionButtons";
import Table from "@/components/ui/Table";
import Button from "@/components/ui/Button";
import StatusBadge from "@/components/ui/StatusBadge";
import PublishResultsDialog from "@/components/dialogs/PublishResultsDialog";
import { exams } from "@/constants/exams";
import {
  examResults,
  resultsDefaultExamId,
  resultsFilterFields,
  resultsHeaderActions,
  resultsTotalStudents,
} from "@/constants/exam-results";
import type { ExamResult } from "@/types/exam-results";
import type { Exam } from "@/types/exam";

export default function Results() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [examToPublish, setExamToPublish] = useState<Exam | null>(null);
  const [publishOpen, setPublishOpen] = useState(false);
  const examId = searchParams.get("exam") ?? resultsDefaultExamId;
  const exam = exams.find((exam) => exam.id === examId);
  if (!exam) notFound();

  const columns: TableColumnsType<ExamResult> = [
    {
      title: "Rank",
      dataIndex: "rank",
      key: "rank",
      width: 90,
      render: (rank) => <span className="font-bold text-dark">{rank}</span>,
    },
    {
      title: "Student",
      key: "student",
      width: 270,
      render: (_, student) => (
        <div className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className="flex size-9 shrink-0 items-center justify-center rounded-full bg-success/10 font-bold text-primary"
          >
            {student.name.charAt(0)}
          </span>
          <div>
            <p className="font-semibold text-dark">{student.name}</p>
            <p className="mt-0.5 text-xs text-gray">Roll {student.roll}</p>
          </div>
        </div>
      ),
    },
    {
      title: "Total",
      key: "total",
      width: 145,
      render: (_, student) => `${student.total} / ${student.maximum}`,
    },
    {
      title: "Percentage",
      key: "percentage",
      width: 155,
      render: (_, student) =>
        `${((student.total / student.maximum) * 100).toFixed(1)}%`,
    },
    {
      title: "Grade",
      key: "grade",
      width: 100,
      render: (_, student) => (
        <StatusBadge variant={student.grade === "F" ? "danger" : "success"}>
          {student.grade}
        </StatusBadge>
      ),
    },
    {
      title: "Result",
      key: "result",
      width: 120,
      render: (_, student) => (
        <StatusBadge variant={student.result === "Pass" ? "success" : "danger"}>
          {student.result}
        </StatusBadge>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 110,
      render: (_, student) => (
        <ActionButtons
          actions={[
            {
              label: "View result",
              icon: LuEye,
              onClick: () =>
                router.push(
                  `/exams/results/card?student=${student.id}&exam=${exam.id}`,
                ),
            },
            { label: "Print card", icon: LuPrinter },
          ]}
        />
      ),
    },
  ];

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="shrink-0">
        <PageHeader
          title="Results"
          breadcrumbs={[
            { title: "Exams", href: "/exams" },
            { title: "Results" },
          ]}
          actions={
            <div className="flex flex-wrap gap-3">
              {resultsHeaderActions.map((action) => (
                <Button
                  key={action.label}
                  variant={action.variant}
                  onClick={
                    action.label === "Publish results"
                      ? () => {
                          setExamToPublish(exam);
                          setPublishOpen(true);
                        }
                      : action.onClick
                  }
                >
                  {action.label}
                </Button>
              ))}
            </div>
          }
        />
      </div>
      <Table
        key={exam.id}
        columns={columns}
        data={examResults}
        total={resultsTotalStudents}
        current={1}
        pageSize={6}
        interactive={false}
        showSearch={false}
        filterFields={resultsFilterFields.map((field) =>
          field.name === "exam" ? { ...field, value: exam.id } : field,
        )}
      />
      {examToPublish && (
        <PublishResultsDialog
          exam={examToPublish}
          open={publishOpen}
          onClose={() => setPublishOpen(false)}
          afterClose={() => setExamToPublish(null)}
        />
      )}
    </div>
  );
}
