"use client";

import type { TableColumnsType } from "antd";
import { notFound, useRouter, useSearchParams } from "next/navigation";
import PageHeader from "@/components/shared/PageHeader";
import Button from "@/components/ui/Button";
import SectionCard from "@/components/ui/SectionCard";
import Table, { TableSummary } from "@/components/ui/Table";
import StatusBadge from "@/components/ui/StatusBadge";
import { exams } from "@/constants/exams";
import { examResults, resultsDefaultExamId, resultsTotalStudents } from "@/constants/exam-results";
import { resultCardDefaultStudentId, resultCards, resultCardSchool, resultCardSignatures } from "@/constants/result-card";
import type { ResultCardSubject } from "@/types/result-card";

export default function ResultCard() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const examId = searchParams.get("exam") ?? resultsDefaultExamId;
  const studentId = searchParams.get("student") ?? resultCardDefaultStudentId;
  const exam = exams.find((exam) => exam.id === examId);
  const student = examResults.find((student) => student.id === studentId);
  const details = resultCards[studentId];
  if (!exam || !student || !details) notFound();

  const total = details.subjects.reduce((sum, subject) => sum + subject.total, 0);
  const obtained = details.subjects.reduce((sum, subject) => sum + subject.obtained, 0);
  const studentDetails = [
    { label: "Student", value: student.name },
    { label: "Class", value: `${details.className} · Roll ${student.roll}` },
    { label: "Guardian", value: details.guardian },
    { label: "Rank", value: `${student.rank} of ${resultsTotalStudents}` },
  ];
  const columns: TableColumnsType<ResultCardSubject> = [
    { title: "Subject", dataIndex: "subject", key: "subject", width: 230,
      render: (subject) => <span className="font-semibold text-dark">{subject}</span> },
    { title: "Total", dataIndex: "total", key: "total", width: 95, align: "center" },
    { title: "Passing", dataIndex: "passing", key: "passing", width: 100, align: "center" },
    { title: "Obtained", dataIndex: "obtained", key: "obtained", width: 110, align: "center",
      render: (marks) => <span className="font-bold text-dark">{marks}</span> },
    { title: "Grade", key: "grade", width: 95, align: "center",
      render: (_, subject) => <StatusBadge variant={subject.obtained < subject.passing ? "danger" : "success"}>{subject.grade}</StatusBadge> },
  ];

  return (
    <div>
      <PageHeader title="Result card"
        breadcrumbs={[{ title: "Exams", href: "/exams" }, { title: "Result card" }]}
        actions={<div className="flex flex-wrap gap-3">
          <Button variant="secondary" onClick={() => router.push(`/exams/results?exam=${exam.id}`)}>Back to results</Button>
          <Button variant="secondary">Download PDF</Button>
          <Button>Print</Button>
        </div>} />

      <SectionCard className="h-auto! max-w-4xl">
        <article aria-label={`Result card for ${student.name}`} className="space-y-6">
          <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
            <div>
              <h2 className="text-2xl font-extrabold text-dark">{resultCardSchool.name}</h2>
              <p className="mt-1 text-sm text-gray">{resultCardSchool.address} · {resultCardSchool.phone}</p>
            </div>
            <div className="sm:text-right">
              <h3 className="text-base font-bold text-dark">Result card</h3>
              <p className="mt-1 text-sm text-gray">{exam.name} · [{exam.details.academicYear}]</p>
            </div>
          </header>

          <dl className="grid grid-cols-1 gap-4 rounded-md bg-foreground p-4 text-sm sm:grid-cols-3">
            {studentDetails.map((detail) => (
              <div key={detail.label}>
                <dt className="text-gray">{detail.label}</dt>
                <dd className="mt-1 font-bold text-dark">{detail.value}</dd>
              </div>
            ))}
          </dl>

          <Table columns={columns} data={details.subjects} rowKey="subject" pagination={false} autoHeight showSearch={false}
            summary={() => <TableSummary>
              <TableSummary.Row className="font-bold text-dark">
                <TableSummary.Cell index={0}>Total</TableSummary.Cell>
                <TableSummary.Cell index={1} align="center">{total}</TableSummary.Cell>
                <TableSummary.Cell index={2} />
                <TableSummary.Cell index={3} align="center">{obtained}</TableSummary.Cell>
                <TableSummary.Cell index={4} />
              </TableSummary.Row>
            </TableSummary>} />

          <dl className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-border p-4">
              <dt className="text-sm text-gray">Percentage</dt>
              <dd className="mt-1 text-2xl font-extrabold text-dark">{(obtained / total * 100).toFixed(1)}%</dd>
            </div>
            <div className="rounded-lg border border-border p-4">
              <dt className="text-sm text-gray">Grade</dt>
              <dd className={`mt-1 text-2xl font-extrabold ${student.grade === "F" ? "text-danger" : "text-dark"}`}>{student.grade}</dd>
            </div>
            <div className="rounded-lg border border-border p-4">
              <dt className="text-sm text-gray">Result</dt>
              <dd className={`mt-1 text-2xl font-extrabold ${student.result === "Pass" ? "text-success" : "text-danger"}`}>{student.result}</dd>
            </div>
          </dl>

          <div>
            <p className="text-sm text-gray">Class teacher remarks</p>
            <p className="mt-1 font-semibold text-dark">{details.remarks}</p>
          </div>

          <div className="grid grid-cols-1 gap-8 pt-8 sm:grid-cols-3">
            {resultCardSignatures.map((label) => (
              <div key={label} className="max-w-40 border-t border-gray pt-2 text-sm text-gray">{label}</div>
            ))}
          </div>
        </article>
      </SectionCard>
    </div>
  );
}
