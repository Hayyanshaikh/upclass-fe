"use client";

import { Form } from "antd";
import { LuCheck } from "react-icons/lu";
import Dialog from "@/components/ui/Dialog";
import Checkbox from "@/components/ui/Checkbox";
import { resultsPublishSummary } from "@/constants/exam-results";
import type { PublishResultsDialogProps } from "@/types/exam-results";

export default function PublishResultsDialog({
  exam,
  open,
  onClose,
  afterClose,
}: PublishResultsDialogProps) {
  return (
    <Dialog
      open={open}
      title={
        <div className="flex items-center gap-4">
          <span className="flex size-14 items-center justify-center rounded-full bg-success/10 text-success">
            <LuCheck className="size-6" aria-hidden="true" />
          </span>
          <span className="text-xl font-bold text-dark">Publish results?</span>
        </div>
      }
      onClose={onClose}
      afterClose={afterClose}
      onConfirm={onClose}
      okText="Publish results"
      cancelText="Cancel"
    >
      <p className="text-sm leading-relaxed text-gray">
        Class {resultsPublishSummary.className} · {exam.name}.{" "}
        {resultsPublishSummary.passed} students passed and{" "}
        {resultsPublishSummary.failed} failed. After publishing, marks are
        locked and only the super admin can edit them.
      </p>
      <Form
        className="mt-6!"
        initialValues={{ notifyParents: exam.details.notifyParents === "yes" }}
      >
        <Checkbox name="notifyParents" label="Notify parents" />
      </Form>
    </Dialog>
  );
}
