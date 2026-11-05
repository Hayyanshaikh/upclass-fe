"use client";

import { useEffect, useState } from "react";
import { Form } from "antd";
import type { TableColumnsType } from "antd";
import dayjs from "dayjs";
import { LuCalendarDays } from "react-icons/lu";
import SectionTitle from "@/components/settings/SectionTitle";
import Button from "@/components/ui/Button";
import DatePicker from "@/components/ui/DatePicker";
import Dialog from "@/components/ui/Dialog";
import Input from "@/components/ui/Input";
import SectionCard from "@/components/ui/SectionCard";
import Select from "@/components/ui/Select";
import StatusBadge from "@/components/ui/StatusBadge";
import Table from "@/components/ui/Table";
import ActionButtons from "@/components/shared/ActionButtons";
import DeleteDialog from "@/components/shared/DeleteDialog";
import ErrorDialog from "@/components/shared/ErrorDialog";
import SuccessDialog from "@/components/shared/SuccessDialog";
import { useAcademicYearSettings } from "@/hooks/useAcademicYearSettings";
import type { AcademicYear, SettingsTabProps } from "@/types/settings";
import { DISPLAY_DATE } from "@/constants/date-formats";

const statusOptions = [
  { label: "Upcoming", value: "Upcoming" },
  { label: "Active", value: "Active" },
  { label: "Completed", value: "Completed" },
];

function isFormValidationError(error: unknown) {
  return typeof error === "object" && error !== null && "errorFields" in error;
}

export default function AcademicYearTab({
  registerTab,
  schoolId,
}: SettingsTabProps) {
  const [form] = Form.useForm();
  const [dialogForm] = Form.useForm();
  const [editForm] = Form.useForm();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingYear, setEditingYear] = useState<AcademicYear | null>(null);
  const [yearToDelete, setYearToDelete] = useState<AcademicYear | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const {
    data,
    isLoading,
    isUpdating,
    isError,
    addAcademicYear,
    updateAcademicYear,
    removeAcademicYear,
  } = useAcademicYearSettings({
    form,
    registerTab,
    schoolId,
  });

  const columns: TableColumnsType<AcademicYear> = [
    {
      title: "Academic Year",
      dataIndex: "year",
      render: (value: string) => <span className="font-semibold">{value}</span>,
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
      render: (value?: string) =>
        value ? dayjs(value).format(DISPLAY_DATE) : "—",
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      render: (value?: string) =>
        value ? dayjs(value).format(DISPLAY_DATE) : "—",
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (value: AcademicYear["status"]) => (
        <StatusBadge
          variant={
            value === "Active"
              ? "info"
              : value === "Upcoming"
                ? "warning"
                : "success"
          }
        >
          {value}
        </StatusBadge>
      ),
    },
    {
      title: "Actions",
      dataIndex: "id",
      render: (_: string, record: AcademicYear) => (
        <ActionButtons
          showView={false}
          deleteDisabled={isUpdating}
          onEdit={() => openEditDialog(record)}
          onDelete={() => setYearToDelete(record)}
        />
      ),
    },
  ];

  useEffect(() => {
    if (isError) {
      setErrorMessage("Unable to load academic years.");
    }
  }, [isError]);

  function openDialog() {
    dialogForm.resetFields();
    setDialogOpen(true);
  }

  async function submitDialog() {
    try {
      const values = await dialogForm.validateFields();
      await addAcademicYear(values);
      setDialogOpen(false);
      setSuccessMessage("Academic year added successfully.");
    } catch (error) {
      if (isFormValidationError(error)) return;
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to add academic year.",
      );
    }
  }

  function openEditDialog(record: AcademicYear) {
    setEditingYear(record);
    setEditDialogOpen(true);
  }

  async function submitEditDialog() {
    try {
      const values = await editForm.validateFields();
      if (!editingYear) return;
      await updateAcademicYear(editingYear.id, values);
      setEditDialogOpen(false);
      setEditingYear(null);
      setSuccessMessage("Academic year updated successfully.");
    } catch (error) {
      if (isFormValidationError(error)) return;
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to update academic year.",
      );
    }
  }

  async function handleRemoveYear() {
    if (!yearToDelete) return;

    try {
      await removeAcademicYear(yearToDelete.id);
      setSuccessMessage("Academic year deleted successfully.");
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to delete academic year.",
      );
    } finally {
      setYearToDelete(null);
    }
  }

  return (
    <>
      <Form form={form} layout="vertical">
        <SectionCard className="h-[75vh]! overflow-auto min-h-full">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <SectionTitle icon={LuCalendarDays}>Academic year</SectionTitle>

            <Button variant="primary" onClick={openDialog}>
              Add academic year
            </Button>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <Select
              name="academicYear"
              label="Current academic year"
              isRequird
              options={data.map((year) => ({
                label: year.year,
                value: year.id,
              }))}
            />
            <DatePicker name="starts" label="Starts" />
            <DatePicker name="ends" label="Ends" />
          </div>
          <div className="mt-5">
            <Table
              columns={columns}
              data={data}
              pagination={false}
              autoHeight
              loading={isLoading}
            />
          </div>
        </SectionCard>
      </Form>
      <Dialog
        open={dialogOpen}
        title="Add academic year"
        okText="Add"
        confirmLoading={isUpdating}
        onClose={() => setDialogOpen(false)}
        onConfirm={submitDialog}
      >
        <Form form={dialogForm} layout="vertical" className="space-y-4!">
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
            options={statusOptions}
          />
        </Form>
      </Dialog>
      <Dialog
        open={editDialogOpen}
        title="Edit academic year"
        okText="Save"
        confirmLoading={isUpdating}
        onClose={() => setEditDialogOpen(false)}
        onConfirm={submitEditDialog}
      >
        <Form
          form={editForm}
          layout="vertical"
          className="space-y-4!"
          initialValues={{
            year: editingYear?.year,
            startDate: editingYear ? dayjs(editingYear.startDate) : undefined,
            endDate: editingYear ? dayjs(editingYear.endDate) : undefined,
            status: editingYear?.status,
          }}
        >
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
            options={statusOptions}
          />
        </Form>
      </Dialog>
      <DeleteDialog
        open={yearToDelete !== null}
        title="Delete academic year?"
        okText="Delete"
        message={
          yearToDelete
            ? `${yearToDelete.year} will be permanently deleted. This cannot be undone.`
            : ""
        }
        confirmLoading={isUpdating}
        onClose={() => setYearToDelete(null)}
        onConfirm={handleRemoveYear}
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
