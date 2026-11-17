"use client";

import { useState } from "react";
import { Form } from "antd";
import dayjs from "dayjs";
import type { Dayjs } from "dayjs";
import { LuChevronRight, LuPlus, LuTrash2 } from "react-icons/lu";
import MobileConfirmDialog from "@/components/mobile/dialogs/MobileConfirmDialog";
import IconButton from "@/components/mobile/ui/MobileIconButton";
import MobileSheet from "@/components/mobile/ui/MobileSheet";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Loader from "@/components/ui/Loader";
import Select from "@/components/ui/Select";
import StatusBadge from "@/components/ui/StatusBadge";
import TimePicker from "@/components/ui/TimePicker";
import { PeriodDtoStatus, PeriodDtoType } from "@/app/api/schemas";
import type { PeriodDto } from "@/app/api/schemas";
import { periodStatusOptions, periodTypeOptions } from "@/constants/settings";
import { usePeriodConfigSettings } from "@/hooks/usePeriodConfigSettings";

type Feedback = {
  tone: "success" | "error";
  message: string;
};

type MobilePeriodConfigSheetProps = {
  open: boolean;
  schoolId: string;
  onClose: () => void;
  onFeedback: (feedback: Feedback) => void;
};

type PeriodFormValues = {
  name: string;
  startTime: Dayjs;
  endTime: Dayjs;
  type: PeriodDtoType;
  sortOrder: string;
  status: PeriodDtoStatus;
};

function isValidationError(error: unknown) {
  return typeof error === "object" && error !== null && "errorFields" in error;
}

function toTimeValue(time: string) {
  return dayjs(`2000-01-01T${time}`);
}

export default function MobilePeriodConfigSheet({
  open,
  schoolId,
  onClose,
  onFeedback,
}: MobilePeriodConfigSheetProps) {
  const [periodForm] = Form.useForm<PeriodFormValues>();
  const [periodFormOpen, setPeriodFormOpen] = useState(false);
  const [editingPeriod, setEditingPeriod] = useState<PeriodDto | null>(null);
  const [periodToDelete, setPeriodToDelete] = useState<PeriodDto | null>(null);
  const {
    periods,
    isLoading,
    isUpdating,
    addPeriod,
    updatePeriodRecord,
    deletePeriod,
  } = usePeriodConfigSettings({ schoolId });

  function openPeriodForm(period?: PeriodDto) {
    setEditingPeriod(period ?? null);
    periodForm.resetFields();

    if (period) {
      periodForm.setFieldsValue({
        name: period.name,
        startTime: toTimeValue(period.startTime),
        endTime: toTimeValue(period.endTime),
        type: period.type,
        sortOrder: String(period.sortOrder),
        status: period.status,
      });
    } else {
      periodForm.setFieldsValue({
        type: PeriodDtoType.PERIOD,
        status: PeriodDtoStatus.ACTIVE,
      });
    }

    setPeriodFormOpen(true);
  }

  async function submitPeriodForm() {
    try {
      const values = await periodForm.validateFields();

      if (!values.endTime.isAfter(values.startTime)) {
        periodForm.setFields([
          { name: "endTime", errors: ["End time must be after start time."] },
        ]);
        return;
      }

      const name = String(values.name).trim();
      const duplicate = periods.some(
        (period) =>
          period.id !== editingPeriod?.id &&
          period.name.trim().toLowerCase() === name.toLowerCase(),
      );

      if (duplicate) {
        periodForm.setFields([
          { name: "name", errors: ["A period with this name already exists."] },
        ]);
        return;
      }

      const payload = {
        name,
        startTime: values.startTime.format("HH:mm"),
        endTime: values.endTime.format("HH:mm"),
        type: values.type,
        sortOrder: Number(values.sortOrder),
        status: values.status,
      };

      if (editingPeriod) {
        await updatePeriodRecord(editingPeriod.id, payload);
      } else {
        await addPeriod(payload);
      }

      setPeriodFormOpen(false);
      setEditingPeriod(null);
      onFeedback({
        tone: "success",
        message: editingPeriod
          ? "Period updated successfully."
          : "Period added successfully.",
      });
    } catch (error) {
      if (isValidationError(error)) return;

      onFeedback({
        tone: "error",
        message:
          error instanceof Error
            ? error.message
            : `Unable to ${editingPeriod ? "update" : "add"} period.`,
      });
    }
  }

  async function handleDeletePeriod() {
    if (!periodToDelete) return;

    const deletedPeriod = periodToDelete;
    setPeriodToDelete(null);

    try {
      await deletePeriod(deletedPeriod.id);
      onFeedback({
        tone: "success",
        message: "Period deleted successfully.",
      });
    } catch (error) {
      onFeedback({
        tone: "error",
        message:
          error instanceof Error
            ? error.message
            : "Unable to delete period.",
      });
    }
  }

  return (
    <>
      <MobileSheet
        open={open}
        onClose={onClose}
        title="Period configuration"
        closeLabel="Close period configuration"
      >
        <div className="mt-6 flex min-h-0 flex-1 flex-col gap-3">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-sm font-semibold text-dark">Periods</h3>
            <Button onClick={() => openPeriodForm()}>
              <LuPlus size={18} aria-hidden="true" />
              Add period
            </Button>
          </div>

          {isLoading ? (
            <Loader fullscreen={false} />
          ) : periods.length === 0 ? (
            <p className="rounded-lg border border-border bg-background p-4 text-center text-xs text-gray">
              No periods configured yet.
            </p>
          ) : (
            <ul role="list" className="flex flex-col gap-2">
              {periods.map((period) => (
                <li
                  key={period.id}
                  className="flex items-center gap-2 rounded-lg border border-border bg-background p-4"
                >
                  <button
                    type="button"
                    onClick={() => openPeriodForm(period)}
                    aria-label={`Edit ${period.name}`}
                    className="flex min-w-0 flex-1 items-center gap-2 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold text-dark">
                        {period.name}
                      </span>
                      <span className="mt-0.5 block truncate text-xs text-gray">
                        {period.startTime} – {period.endTime} · Order{" "}
                        {period.sortOrder}
                      </span>
                      <span className="mt-1.5 flex flex-wrap items-center gap-1.5">
                        <StatusBadge
                          variant={
                            period.type === PeriodDtoType.BREAK
                              ? "warning"
                              : "info"
                          }
                        >
                          {period.type === PeriodDtoType.BREAK
                            ? "Break"
                            : "Period"}
                        </StatusBadge>
                        <StatusBadge
                          variant={
                            period.status === PeriodDtoStatus.ACTIVE
                              ? "success"
                              : "neutral"
                          }
                        >
                          {period.status === PeriodDtoStatus.ACTIVE
                            ? "Active"
                            : "Inactive"}
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
                    label={`Delete ${period.name}`}
                    onClick={() => setPeriodToDelete(period)}
                  >
                    <LuTrash2 size={18} aria-hidden="true" />
                  </IconButton>
                </li>
              ))}
            </ul>
          )}
        </div>
      </MobileSheet>

      <MobileSheet
        open={periodFormOpen}
        onClose={() => setPeriodFormOpen(false)}
        title={editingPeriod ? "Edit period" : "Add period"}
        closeLabel="Close form"
      >
        <Form
          form={periodForm}
          layout="vertical"
          requiredMark={false}
          className="mt-6 flex min-h-0 flex-1 flex-col"
        >
          <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto pb-1 [&_.ant-form-item]:mb-0">
            <Input
              name="name"
              label="Name"
              isRequird
              placeholder="Period 1 or Break"
              rules={[{ whitespace: true, message: "Enter period name." }]}
            />
            <TimePicker name="startTime" label="Start time" isRequird />
            <TimePicker name="endTime" label="End time" isRequird />
            <Select
              name="type"
              label="Type"
              isRequird
              options={periodTypeOptions}
              showSearch={false}
            />
            <Input
              name="sortOrder"
              label="Sort order"
              type="number"
              isRequird
              placeholder="1"
              rules={[
                {
                  pattern: /^[1-9]\d*$/,
                  message: "Enter a positive whole number.",
                },
              ]}
            />
            <Select
              name="status"
              label="Status"
              isRequird
              options={periodStatusOptions}
              showSearch={false}
            />
          </div>
          <div className="mt-3 flex shrink-0 items-center gap-2 border-t border-border pt-3">
            <Button
              fullWidth
              variant="secondary"
              disabled={isUpdating}
              onClick={() => setPeriodFormOpen(false)}
            >
              Cancel
            </Button>
            <Button
              fullWidth
              loading={isUpdating}
              onClick={() => void submitPeriodForm()}
            >
              {editingPeriod ? "Save" : "Add"}
            </Button>
          </div>
        </Form>
      </MobileSheet>

      <MobileConfirmDialog
        open={periodToDelete !== null}
        title="Delete period?"
        description={
          periodToDelete
            ? `${periodToDelete.name} will be permanently deleted from the timetable configuration. This cannot be undone.`
            : "Delete this period?"
        }
        confirmText="Delete"
        cancelText="Cancel"
        danger
        confirmLoading={isUpdating}
        onConfirm={() => void handleDeletePeriod()}
        onClose={() => setPeriodToDelete(null)}
      />
    </>
  );
}
