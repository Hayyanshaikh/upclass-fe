"use client";

import { useState } from "react";
import { Form } from "antd";
import dayjs from "dayjs";
import { LuPlus, LuTrash2 } from "react-icons/lu";
import MobileConfirmDialog from "@/components/mobile/dialogs/MobileConfirmDialog";
import IconButton from "@/components/mobile/ui/MobileIconButton";
import MobileSheet from "@/components/mobile/ui/MobileSheet";
import Button from "@/components/ui/Button";
import DatePicker from "@/components/ui/DatePicker";
import Input from "@/components/ui/Input";
import Loader from "@/components/ui/Loader";
import Select from "@/components/ui/Select";
import { useAcademicTermsSettings } from "@/hooks/useAcademicTermsSettings";
import type { AcademicTerm, AssignedAcademicTerm } from "@/types/settings";

type Feedback = {
  tone: "success" | "error";
  message: string;
};

type MobileAcademicTermsSheetProps = {
  open: boolean;
  schoolId: string;
  onClose: () => void;
  onFeedback: (feedback: Feedback) => void;
};

function isValidationError(error: unknown) {
  return typeof error === "object" && error !== null && "errorFields" in error;
}

export default function MobileAcademicTermsSheet({
  open,
  schoolId,
  onClose,
  onFeedback,
}: MobileAcademicTermsSheetProps) {
  const [form] = Form.useForm();
  const [termForm] = Form.useForm();
  const [termFormOpen, setTermFormOpen] = useState(false);
  const [termToDelete, setTermToDelete] = useState<AcademicTerm | null>(null);
  const [assignmentToRemove, setAssignmentToRemove] =
    useState<AssignedAcademicTerm | null>(null);
  const {
    data,
    terms,
    academicYears,
    isLoading,
    isUpdating,
    addTerm,
    deleteTerm,
    assignTerm,
    removeTerm,
  } = useAcademicTermsSettings({ form, schoolId });

  const selectedYearId = Form.useWatch("academicYear", form) as
    | string
    | undefined;
  const selectedYear = academicYears.find((year) => year.id === selectedYearId);
  const yearStarts = selectedYear?.startDate
    ? dayjs(selectedYear.startDate)
    : undefined;
  const yearEnds = selectedYear?.endDate
    ? dayjs(selectedYear.endDate)
    : undefined;

  async function handleAssignTerm() {
    try {
      const values = await form.validateFields();
      await assignTerm(values);
      form.resetFields(["term", "startDate", "endDate"]);
      onFeedback({
        tone: "success",
        message: "Academic term assigned successfully.",
      });
    } catch (error) {
      if (isValidationError(error)) return;

      onFeedback({
        tone: "error",
        message:
          error instanceof Error
            ? error.message
            : "Unable to assign academic term.",
      });
    }
  }

  async function submitTermForm() {
    try {
      const values = await termForm.validateFields();
      await addTerm(String(values.name));
      setTermFormOpen(false);
      onFeedback({
        tone: "success",
        message: "Academic term added successfully.",
      });
    } catch (error) {
      if (isValidationError(error)) return;

      onFeedback({
        tone: "error",
        message:
          error instanceof Error
            ? error.message
            : "Unable to add academic term.",
      });
    }
  }

  async function handleDeleteTerm() {
    if (!termToDelete) return;

    const deletedTerm = termToDelete;
    setTermToDelete(null);

    try {
      await deleteTerm(deletedTerm.id);
      onFeedback({
        tone: "success",
        message: "Academic term deleted successfully.",
      });
    } catch (error) {
      onFeedback({
        tone: "error",
        message:
          error instanceof Error
            ? error.message
            : "Unable to delete academic term.",
      });
    }
  }

  async function handleRemoveAssignment() {
    if (!assignmentToRemove) return;

    const removedAssignment = assignmentToRemove;
    setAssignmentToRemove(null);

    try {
      await removeTerm(removedAssignment.id);
      onFeedback({
        tone: "success",
        message: "Academic term assignment removed.",
      });
    } catch (error) {
      onFeedback({
        tone: "error",
        message:
          error instanceof Error
            ? error.message
            : "Unable to remove academic term assignment.",
      });
    }
  }

  return (
    <>
      <MobileSheet
        open={open}
        onClose={onClose}
        title="Academic terms"
        closeLabel="Close academic terms"
      >
        <Form
          form={form}
          layout="vertical"
          requiredMark={false}
          className="mt-6 flex min-h-0 flex-1 flex-col"
        >
          <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto pb-1 [&_.ant-form-item]:mb-0">
            {isLoading ? (
              <Loader fullscreen={false} />
            ) : (
              <>
                <div className="flex flex-col gap-4">
                  <h3 className="text-sm font-semibold text-dark">
                    Assign term
                  </h3>
                  <Select
                    name="academicYear"
                    label="Academic year"
                    isRequird
                    onChange={() => form.resetFields(["startDate", "endDate"])}
                    options={academicYears.map((year) => ({
                      label: year.year,
                      value: year.id,
                    }))}
                  />
                  <Select
                    name="term"
                    label="Term"
                    isRequird
                    options={terms.map((term) => ({
                      label: term.name,
                      value: term.id,
                    }))}
                  />
                  <DatePicker
                    name="startDate"
                    label="Start date"
                    isRequird
                    minDate={yearStarts}
                    maxDate={yearEnds}
                  />
                  <DatePicker
                    name="endDate"
                    label="End date"
                    isRequird
                    minDate={yearStarts}
                    maxDate={yearEnds}
                  />
                  <Button
                    loading={isUpdating}
                    disabled={isUpdating}
                    onClick={() => void handleAssignTerm()}
                  >
                    Assign term
                  </Button>
                </div>

                <div className="flex flex-col gap-3">
                  <h3 className="mt-2 text-sm font-semibold text-dark">
                    Assigned terms
                  </h3>
                  {data.length === 0 ? (
                    <p className="rounded-lg border border-border bg-background p-4 text-center text-xs text-gray">
                      No terms assigned yet.
                    </p>
                  ) : (
                    <ul role="list" className="flex flex-col gap-2">
                      {data.map((assignment) => (
                        <li
                          key={assignment.id}
                          className="flex items-center gap-2 rounded-lg border border-border bg-background p-4"
                        >
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-dark">
                              {assignment.term}
                              <span className="font-normal text-gray">
                                {" "}
                                · {assignment.academicYear}
                              </span>
                            </p>
                            <p className="mt-0.5 truncate text-xs text-gray">
                              {assignment.startDate} – {assignment.endDate}
                            </p>
                          </div>
                          <IconButton
                            variant="danger"
                            label={`Remove ${assignment.term} from ${assignment.academicYear}`}
                            onClick={() => setAssignmentToRemove(assignment)}
                          >
                            <LuTrash2 size={18} aria-hidden="true" />
                          </IconButton>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="mt-2 flex flex-col gap-3">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-sm font-semibold text-dark">Terms</h3>
                    <Button onClick={() => setTermFormOpen(true)}>
                      <LuPlus size={18} aria-hidden="true" />
                      Add term
                    </Button>
                  </div>
                  {terms.length === 0 ? (
                    <p className="rounded-lg border border-border bg-background p-4 text-center text-xs text-gray">
                      No terms added yet.
                    </p>
                  ) : (
                    <div className="flex flex-wrap items-center gap-2">
                      {terms.map((term) => (
                        <span
                          key={term.id}
                          className="inline-flex items-center gap-2 rounded-full border border-border bg-foreground px-3 py-1.5 text-xs font-medium text-dark"
                        >
                          {term.name}
                          <button
                            type="button"
                            aria-label={`Delete ${term.name}`}
                            className="cursor-pointer rounded-full p-0.5 text-danger transition-colors hover:bg-danger/10 disabled:cursor-not-allowed disabled:opacity-50"
                            disabled={isUpdating}
                            onClick={() => setTermToDelete(term)}
                          >
                            <LuTrash2 className="size-4" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </Form>
      </MobileSheet>

      <MobileSheet
        open={termFormOpen}
        onClose={() => setTermFormOpen(false)}
        title="Add term"
        closeLabel="Close form"
      >
        <Form
          form={termForm}
          layout="vertical"
          requiredMark={false}
          className="mt-6 flex min-h-0 flex-1 flex-col"
        >
          <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto pb-1 [&_.ant-form-item]:mb-0">
            <Input
              name="name"
              label="Term"
              isRequird
              placeholder="First Term"
            />
          </div>
          <div className="mt-3 flex shrink-0 items-center gap-2 border-t border-border pt-3">
            <Button
              fullWidth
              variant="secondary"
              disabled={isUpdating}
              onClick={() => setTermFormOpen(false)}
            >
              Cancel
            </Button>
            <Button
              fullWidth
              loading={isUpdating}
              onClick={() => void submitTermForm()}
            >
              Add
            </Button>
          </div>
        </Form>
      </MobileSheet>

      <MobileConfirmDialog
        open={termToDelete !== null}
        title="Delete term?"
        description={
          termToDelete
            ? `${termToDelete.name} will be permanently deleted. This cannot be undone.`
            : "Delete this term?"
        }
        confirmText="Delete"
        cancelText="Cancel"
        danger
        confirmLoading={isUpdating}
        onConfirm={() => void handleDeleteTerm()}
        onClose={() => setTermToDelete(null)}
      />

      <MobileConfirmDialog
        open={assignmentToRemove !== null}
        title="Remove term assignment?"
        description={
          assignmentToRemove
            ? `${assignmentToRemove.term} (${assignmentToRemove.academicYear}) will be unassigned from this academic year.`
            : "Remove this term assignment?"
        }
        confirmText="Remove"
        cancelText="Cancel"
        danger
        confirmLoading={isUpdating}
        onConfirm={() => void handleRemoveAssignment()}
        onClose={() => setAssignmentToRemove(null)}
      />
    </>
  );
}
