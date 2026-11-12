"use client";

import { useState } from "react";
import { Form } from "antd";
import type { TableColumnsType } from "antd";
import dayjs from "dayjs";
import type { Dayjs } from "dayjs";
import { LuClock } from "react-icons/lu";
import SectionTitle from "@/components/settings/SectionTitle";
import ActionButtons from "@/components/shared/ActionButtons";
import DeleteDialog from "@/components/shared/DeleteDialog";
import ErrorDialog from "@/components/shared/ErrorDialog";
import SuccessDialog from "@/components/shared/SuccessDialog";
import Button from "@/components/ui/Button";
import Dialog from "@/components/ui/Dialog";
import Input from "@/components/ui/Input";
import SectionCard from "@/components/ui/SectionCard";
import Select from "@/components/ui/Select";
import StatusBadge from "@/components/ui/StatusBadge";
import Table from "@/components/ui/Table";
import TimePicker from "@/components/ui/TimePicker";
import { usePeriodConfigSettings } from "@/hooks/usePeriodConfigSettings";
import { PeriodDtoStatus, PeriodDtoType } from "@/app/api/schemas";
import type { PeriodDto } from "@/app/api/schemas";
import { periodStatusOptions, periodTypeOptions } from "@/constants/settings";

type PeriodFormValues = {
  name: string;
  startTime: Dayjs;
  endTime: Dayjs;
  type: PeriodDtoType;
  sortOrder: string;
  status: PeriodDtoStatus;
};

function isFormValidationError(error: unknown) {
  return typeof error === "object" && error !== null && "errorFields" in error;
}

function toTimeValue(time: string) {
  return dayjs(`2000-01-01T${time}`);
}

export default function PeriodConfigTab({ schoolId }: { schoolId: string }) {
  const [dialogForm] = Form.useForm<PeriodFormValues>();
  const {
    periods,
    isLoading,
    isUpdating,
    addPeriod,
    updatePeriodRecord,
    deletePeriod,
  } = usePeriodConfigSettings({ schoolId });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPeriod, setEditingPeriod] = useState<PeriodDto | null>(null);
  const [periodToDelete, setPeriodToDelete] = useState<PeriodDto | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function openDialog(period?: PeriodDto) {
    setEditingPeriod(period ?? null);
    dialogForm.resetFields();

    if (period) {
      dialogForm.setFieldsValue({
        name: period.name,
        startTime: toTimeValue(period.startTime),
        endTime: toTimeValue(period.endTime),
        type: period.type,
        sortOrder: String(period.sortOrder),
        status: period.status,
      });
    } else {
      dialogForm.setFieldsValue({
        type: PeriodDtoType.PERIOD,
        status: PeriodDtoStatus.ACTIVE,
      });
    }

    setDialogOpen(true);
  }

  async function submitDialog() {
    try {
      const values = await dialogForm.validateFields();
      const startTime = values.startTime.format("HH:mm");
      const endTime = values.endTime.format("HH:mm");

      if (!values.endTime.isAfter(values.startTime)) {
        dialogForm.setFields([
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
        dialogForm.setFields([
          { name: "name", errors: ["A period with this name already exists."] },
        ]);
        return;
      }

      const payload = {
        name,
        startTime,
        endTime,
        type: values.type,
        sortOrder: Number(values.sortOrder),
        status: values.status,
      };

      if (editingPeriod) {
        await updatePeriodRecord(editingPeriod.id, payload);
      } else {
        await addPeriod(payload);
      }

      setDialogOpen(false);
      setSuccessMessage(
        editingPeriod
          ? "Period updated successfully."
          : "Period added successfully.",
      );
    } catch (error) {
      if (isFormValidationError(error)) return;
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to save period.",
      );
    }
  }

  async function confirmDelete() {
    if (!periodToDelete) return;

    try {
      await deletePeriod(periodToDelete.id);
      setPeriodToDelete(null);
      setSuccessMessage("Period deleted successfully.");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to delete period.",
      );
    }
  }

  const columns: TableColumnsType<PeriodDto> = [
    {
      title: "Name",
      dataIndex: "name",
      render: (value: string) => <span className="font-semibold">{value}</span>,
    },
    {
      title: "Time",
      dataIndex: "startTime",
      render: (_: string, record: PeriodDto) =>
        `${record.startTime} – ${record.endTime}`,
    },
    {
      title: "Type",
      dataIndex: "type",
      render: (value: PeriodDtoType) => (
        <StatusBadge
          variant={value === PeriodDtoType.BREAK ? "warning" : "info"}
        >
          {value === PeriodDtoType.BREAK ? "Break" : "Period"}
        </StatusBadge>
      ),
    },
    { title: "Sort order", dataIndex: "sortOrder" },
    {
      title: "Status",
      dataIndex: "status",
      render: (value: PeriodDtoStatus) => (
        <StatusBadge
          variant={value === PeriodDtoStatus.ACTIVE ? "success" : "neutral"}
        >
          {value === PeriodDtoStatus.ACTIVE ? "Active" : "Inactive"}
        </StatusBadge>
      ),
    },
    {
      title: "Actions",
      dataIndex: "id",
      render: (_: string, record: PeriodDto) => (
        <ActionButtons
          name="period"
          showView={false}
          onEdit={() => openDialog(record)}
          onDelete={() => setPeriodToDelete(record)}
        />
      ),
    },
  ];

  return (
    <>
      <SectionCard className="h-[75vh]! overflow-auto min-h-full">
        <SectionTitle
          icon={LuClock}
          action={
            <Button variant="primary" onClick={() => openDialog()}>
              Add period
            </Button>
          }
        >
          Period configuration
        </SectionTitle>
        <Table
          columns={columns}
          data={periods}
          loading={isLoading}
          pagination={false}
          autoHeight
        />
      </SectionCard>
      <Dialog
        open={dialogOpen}
        title={editingPeriod ? "Edit period" : "Add period"}
        okText={editingPeriod ? "Update" : "Save"}
        confirmLoading={isUpdating}
        onClose={() => setDialogOpen(false)}
        onConfirm={submitDialog}
      >
        <Form form={dialogForm} layout="vertical" className="space-y-4!">
          <Input
            name="name"
            label="Name"
            isRequird
            placeholder="Period 1 or Break"
            rules={[{ whitespace: true, message: "Enter period name." }]}
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <TimePicker name="startTime" label="Start time" isRequird />
            <TimePicker name="endTime" label="End time" isRequird />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
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
        </Form>
      </Dialog>
      <DeleteDialog
        open={periodToDelete !== null}
        title="Delete period?"
        okText="Delete"
        confirmLoading={isUpdating}
        message={
          periodToDelete
            ? `${periodToDelete.name} will be permanently deleted from the timetable configuration. This cannot be undone.`
            : ""
        }
        onClose={() => setPeriodToDelete(null)}
        onConfirm={confirmDelete}
      />
      <SuccessDialog
        open={successMessage !== null}
        message={successMessage ?? ""}
        onClose={() => setSuccessMessage(null)}
      />
      <ErrorDialog
        open={errorMessage !== null}
        message={errorMessage ?? ""}
        onClose={() => setErrorMessage(null)}
      />
    </>
  );
}
