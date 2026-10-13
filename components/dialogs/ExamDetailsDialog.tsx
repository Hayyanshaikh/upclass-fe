"use client";

import dayjs from "dayjs";
import Dialog from "@/components/ui/Dialog";
import StatusBadge from "@/components/ui/StatusBadge";
import { examStatusVariants } from "@/constants/exams";
import { examGradingOptions, examTermOptions, examYesNoOptions } from "@/constants/exam-form";
import type { ExamDetailsDialogProps } from "@/types/exam";

export default function ExamDetailsDialog({ exam, open, onClose, afterClose, onEdit }: ExamDetailsDialogProps) {
  const details = exam.details;
  const summary = [
    { label: "Type", value: exam.type },
    { label: "Classes", value: exam.classes },
    { label: "Term", value: examTermOptions.find((option) => option.value === details.term)?.label },
    { label: "Academic year", value: details.academicYear },
    { label: "Start date", value: dayjs(details.startDate).format("DD MMM YYYY") },
    { label: "End date", value: dayjs(details.endDate).format("DD MMM YYYY") },
  ];
  const grading = [
    { label: "Passing percentage", value: `${details.passingPercentage}%` },
    { label: "Grading scale", value: examGradingOptions.find((option) => option.value === details.gradingScale)?.label },
    { label: "Show rank on result card", value: examYesNoOptions.find((option) => option.value === details.showRank)?.label },
    { label: "Notify parents on publish", value: examYesNoOptions.find((option) => option.value === details.notifyParents)?.label },
  ];

  return (
    <Dialog open={open} title={
      <div>
        <p className="text-lg font-bold text-dark">{exam.name}</p>
        <p className="mt-1 text-sm font-normal text-gray">{exam.id}</p>
      </div>
    } onClose={onClose} afterClose={afterClose} onConfirm={onEdit} okText="Edit exam" cancelText="Close">
      <div className="max-h-96 space-y-5 overflow-y-auto pr-1">
        <StatusBadge variant={examStatusVariants[exam.status]}>{exam.status}</StatusBadge>
        <dl className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
          {summary.map((item) => (
            <div key={item.label}>
              <dt className="text-gray">{item.label}</dt>
              <dd className="mt-1 font-semibold text-dark">{item.value}</dd>
            </div>
          ))}
        </dl>

        <section aria-labelledby="exam-date-sheet">
          <h2 id="exam-date-sheet" className="mb-3 font-bold text-dark">Date sheet · {details.dateSheet.length} subjects</h2>
          <ul className="divide-y divide-border rounded-sm border border-border">
            {details.dateSheet.map((entry, index) => (
              <li key={`${entry.subject}-${index}`} className="flex flex-wrap justify-between gap-2 p-3 text-sm">
                <div>
                  <p className="font-semibold text-dark">{entry.subject}</p>
                  <p className="mt-1 text-gray">{dayjs(entry.date).format("DD MMM YYYY")} · {entry.startTime}</p>
                </div>
                <div className="text-gray sm:text-right">
                  <p>Total marks: <span className="font-semibold text-dark">{entry.totalMarks}</span></p>
                  <p className="mt-1">Passing marks: {entry.passingMarks}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="exam-grading">
          <h2 id="exam-grading" className="mb-3 font-bold text-dark">Grading</h2>
          <dl className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
            {grading.map((item) => (
              <div key={item.label}>
                <dt className="text-gray">{item.label}</dt>
                <dd className="mt-1 font-semibold text-dark">{item.value}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>
    </Dialog>
  );
}
