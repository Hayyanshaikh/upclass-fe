"use client";

import { useState } from "react";
import { Form } from "antd";
import dayjs from "dayjs";
import { LuChevronRight, LuPlus, LuTrash2 } from "react-icons/lu";
import MobileConfirmDialog from "@/components/mobile/dialogs/MobileConfirmDialog";
import IconButton from "@/components/mobile/ui/MobileIconButton";
import MobileSheet from "@/components/mobile/ui/MobileSheet";
import Button from "@/components/ui/Button";
import DatePicker from "@/components/ui/DatePicker";
import Input from "@/components/ui/Input";
import Loader from "@/components/ui/Loader";
import Select from "@/components/ui/Select";
import StatusBadge from "@/components/ui/StatusBadge";
import { DISPLAY_DATE } from "@/constants/date-formats";
import { useAcademicYearSettings } from "@/hooks/useAcademicYearSettings";
import type { AcademicYear } from "@/types/settings";

const statusOptions = [
  { label: "Upcoming", value: "Upcoming" },
  { label: "Active", value: "Active" },
  { label: "Completed", value: "Completed" },
];

type Feedback = {
  tone: "success" | "error";
  message: string;
};

type MobileAcademicYearSheetProps = {
  open: boolean;
  schoolId: string;
  onClose: () => void;
  onFeedback: (feedback: Feedback) => void;
};

function isValidationError(error: unknown) {
  return typeof error === "object" && error !== null && "errorFields" in error;
}

function statusVariant(status: AcademicYear["status"]) {
  switch (status) {
    case "Active":
      return "info" as const;
    case "Upcoming":
      return "warning" as const;
    default:
      return "success" as const;
  }
}

export default function MobileAcademicYearSheet({
  open,
  schoolId,
  onClose,
  onFeedback,
}: MobileAcademicYearSheetProps) {
  const [form] = Form.useForm();
  const [yearForm] = Form.useForm();
  const [yearFormOpen, setYearFormOpen] = useState(false);
  const [editingYear, setEditingYear] = useState<AcademicYear | null>(null);
  const [yearToDelete, setYearToDelete] = useState<AcademicYear | null>(null);
  const {
    data,
    isLoading,
    isUpdating,
    addAcademicYear,
    updateAcademicYear,
    removeAcademicYear,
  } = useAcademicYearSettings({ form, schoolId });

  function openYearForm(year?: AcademicYear) {
    setEditingYear(year ?? null);
    yearForm.resetFields();

    if (year) {
      yearForm.setFieldsValue({
        year: year.year,
        startDate: dayjs(year.startDate),
        endDate: dayjs(year.endDate),
        status: year.status,
      });
    }

    setYearFormOpen(true);
  }

  async function submitYearForm() {
    try {
      const values = await yearForm.validateFields();

      if (editingYear) {
        await updateAcademicYear(editingYear.id, values);
      } else {
        await addAcademicYear(values);
      }

      setYearFormOpen(false);
      setEditingYear(null);
      onFeedback({
        tone: "success",
        message: editingYear
          ? "Academic year updated successfully."
          : "Academic year added successfully.",
      });
    } catch (error) {
      if (isValidationError(error)) return;

      onFeedback({
        tone: "error",
        message:
          error instanceof Error
            ? error.message
            : `Unable to ${editingYear ? "update" : "add"} academic year.`,
      });
    }
  }

  async function handleDeleteYear() {
    if (!yearToDelete) return;

    const deletedYear = yearToDelete;
    setYearToDelete(null);

    try {
      await removeAcademicYear(deletedYear.id);
      onFeedback({
        tone: "success",
        message: "Academic year deleted successfully.",
      });
    } catch (error) {
      onFeedback({
        tone: "error",
        message:
          error instanceof Error
            ? error.message
            : "Unable to delete academic year.",
      });
    }
  }

  return (
    <>
      <MobileSheet
        open={open}
        onClose={onClose}
        title="Academic year"
        closeLabel="Close academic year"
      >
        <Form
          form={form}
          layout="vertical"
          requiredMark={false}
          className="mt-6 flex min-h-0 flex-1 flex-col"
        >
          <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto pb-1">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold text-dark">
                Academic years
              </h3>
              <Button onClick={() => openYearForm()}>
                <LuPlus size={18} aria-hidden="true" />
                Add year
              </Button>
            </div>

            {isLoading ? (
              <Loader fullscreen={false} />
            ) : data.length === 0 ? (
              <p className="rounded-lg border border-border bg-background p-4 text-center text-xs text-gray">
                No academic years added yet.
              </p>
            ) : (
              <ul role="list" className="flex flex-col gap-2">
                {data.map((year) => (
                  <li
                    key={year.id}
                    className="flex items-center gap-2 rounded-lg border border-border bg-background p-4"
                  >
                    <button
                      type="button"
                      onClick={() => openYearForm(year)}
                      aria-label={`Edit ${year.year}`}
                      className="flex min-w-0 flex-1 items-center gap-2 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                    >
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold text-dark">
                          {year.year}
                        </span>
                        <span className="mt-0.5 block truncate text-xs text-gray">
                          {year.startDate
                            ? dayjs(year.startDate).format(DISPLAY_DATE)
                            : "—"}
                          {" – "}
                          {year.endDate
                            ? dayjs(year.endDate).format(DISPLAY_DATE)
                            : "—"}
                        </span>
                        <span className="mt-1.5 block">
                          <StatusBadge variant={statusVariant(year.status)}>
                            {year.status}
                          </StatusBadge>
                        </span>
                      </span>
                      <LuChevronRight
                        size={18}
                        className="shrink-0 text-gray"
                        aria-hidden="true"
                      />
                    </button>
                    <IconButton
                      variant="danger"
                      label={`Delete ${year.year}`}
                      onClick={() => setYearToDelete(year)}
                    >
                      <LuTrash2 size={18} aria-hidden="true" />
                    </IconButton>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Form>
      </MobileSheet>

      <MobileSheet
        open={yearFormOpen}
        onClose={() => setYearFormOpen(false)}
        title={editingYear ? "Edit academic year" : "Add academic year"}
        closeLabel="Close form"
      >
        <Form
          form={yearForm}
          layout="vertical"
          requiredMark={false}
          className="mt-6 flex min-h-0 flex-1 flex-col"
        >
          <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto pb-1 [&_.ant-form-item]:mb-0">
            <Input
              name="year"
              label="Academic year"
              isRequird
              placeholder="2026-2027"
            />
            <DatePicker name="startDate" label="Start date" isRequird />
            <DatePicker name="endDate" label="End date" isRequird />
            <Select
              name="status"
              label="Status"
              isRequird
              showSearch={false}
              options={statusOptions}
            />
          </div>
          <div className="mt-3 flex shrink-0 items-center gap-2 border-t border-border pt-3">
            <Button
              fullWidth
              variant="secondary"
              disabled={isUpdating}
              onClick={() => setYearFormOpen(false)}
            >
              Cancel
            </Button>
            <Button
              fullWidth
              loading={isUpdating}
              onClick={() => void submitYearForm()}
            >
              {editingYear ? "Save" : "Add"}
            </Button>
          </div>
        </Form>
      </MobileSheet>

      <MobileConfirmDialog
        open={yearToDelete !== null}
        title="Delete academic year?"
        description={
          yearToDelete
            ? `${yearToDelete.year} will be permanently deleted. This cannot be undone.`
            : "Delete this academic year?"
        }
        confirmText="Delete"
        cancelText="Cancel"
        danger
        confirmLoading={isUpdating}
        onConfirm={() => void handleDeleteYear()}
        onClose={() => setYearToDelete(null)}
      />
    </>
  );
}
