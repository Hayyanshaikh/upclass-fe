"use client";

import { useEffect, useState } from "react";
import { Form } from "antd";
import type { TableColumnsType } from "antd";
import dayjs from "dayjs";
import { LuCalendarDays, LuListChecks, LuTrash2 } from "react-icons/lu";
import SectionTitle from "@/components/settings/SectionTitle";
import Button from "@/components/ui/Button";
import DatePicker from "@/components/ui/DatePicker";
import Dialog from "@/components/ui/Dialog";
import Input from "@/components/ui/Input";
import SectionCard from "@/components/ui/SectionCard";
import Select from "@/components/ui/Select";
import Table from "@/components/ui/Table";
import ErrorDialog from "@/components/shared/ErrorDialog";
import DeleteDialog from "@/components/shared/DeleteDialog";
import SuccessDialog from "@/components/shared/SuccessDialog";
import { useAcademicTermsSettings } from "@/hooks/useAcademicTermsSettings";
import type {
  AcademicTerm,
  AssignedAcademicTerm,
  SettingsTabProps,
} from "@/types/settings";
import ActionButtons from "../shared/ActionButtons";

function isFormValidationError(error: unknown) {
  return typeof error === "object" && error !== null && "errorFields" in error;
}

export default function AcademicTermsTab({
  registerTab,
  schoolId,
}: SettingsTabProps) {
  const [form] = Form.useForm();
  const [termForm] = Form.useForm();
  const [termDialogOpen, setTermDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [termToRemove, setTermToRemove] =
    useState<AssignedAcademicTerm | null>(null);
  const [termToDelete, setTermToDelete] = useState<AcademicTerm | null>(null);
  const {
    data,
    terms,
    academicYears,
    isLoading,
    isUpdating,
    isError,
    addTerm,
    deleteTerm,
    assignTerm,
    removeTerm,
  } = useAcademicTermsSettings({
    form,
    registerTab,
    schoolId,
  });

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

  useEffect(() => {
    if (isError) {
      setErrorMessage("Unable to load academic terms.");
    }
  }, [isError]);

  function openTermDialog() {
    termForm.resetFields();
    setTermDialogOpen(true);
  }

  async function submitTermDialog() {
    try {
      const values = await termForm.validateFields();
      await addTerm(String(values.name));
      setTermDialogOpen(false);
      setSuccessMessage("Academic term added successfully.");
    } catch (error) {
      if (isFormValidationError(error)) return;
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to add academic term.",
      );
    }
  }

  async function handleAssignTerm() {
    try {
      const values = await form.validateFields();
      await assignTerm(values);
      form.resetFields(["term", "startDate", "endDate"]);
      setSuccessMessage("Academic term assigned successfully.");
    } catch (error) {
      if (isFormValidationError(error)) return;
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to assign academic term.",
      );
    }
  }

  async function handleDeleteTerm() {
    if (!termToDelete) return;

    try {
      await deleteTerm(termToDelete.id);
      setSuccessMessage("Academic term deleted successfully.");
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to delete academic term.",
      );
    } finally {
      setTermToDelete(null);
    }
  }

  async function handleRemoveTerm() {
    if (!termToRemove) return;

    try {
      await removeTerm(termToRemove.id);
      setSuccessMessage("Academic term assignment removed.");
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to remove academic term assignment.",
      );
    } finally {
      setTermToRemove(null);
    }
  }

  const assignmentColumns: TableColumnsType<AssignedAcademicTerm> = [
    { title: "Academic Year", dataIndex: "academicYear" },
    { title: "Term", dataIndex: "term" },
    { title: "Start Date", dataIndex: "startDate" },
    { title: "End Date", dataIndex: "endDate" },
    {
      title: "Actions",
      dataIndex: "id",
      render: (_: string, record: AssignedAcademicTerm) => (
        <ActionButtons
          showView={false}
          showEdit={false}
          showDelete={true}
          deleteDisabled={isUpdating}
          onDelete={() => setTermToRemove(record)}
        />
      ),
    },
  ];

  return (
    <>
      <Form form={form} layout="vertical">
        <SectionCard className="h-[75vh]! overflow-auto min-h-full">
          <SectionTitle icon={LuCalendarDays}>Manage terms</SectionTitle>
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="grid gap-4 md:grid-cols-4 flex-1">
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
            </div>
            <div className="mt-4">
              <Button
                variant="primary"
                disabled={isUpdating}
                onClick={handleAssignTerm}
              >
                Assign term
              </Button>
            </div>
          </div>
          <div className="mt-5">
            <Table
              columns={assignmentColumns}
              data={data}
              pagination={false}
              autoHeight
              loading={isLoading}
            />
          </div>

          <div className="mt-8">
            <SectionTitle
              icon={LuListChecks}
              action={
                <Button variant="primary" onClick={openTermDialog}>
                  Add term
                </Button>
              }
            >
              Terms
            </SectionTitle>
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
          </div>
        </SectionCard>
      </Form>
      <Dialog
        open={termDialogOpen}
        title="Add term"
        okText="Add"
        confirmLoading={isUpdating}
        onClose={() => setTermDialogOpen(false)}
        onConfirm={submitTermDialog}
      >
        <Form form={termForm} layout="vertical" className="space-y-4!">
          <Input name="name" label="Term" isRequird placeholder="First Term" />
        </Form>
      </Dialog>
      <DeleteDialog
        open={termToDelete !== null}
        title="Delete term?"
        okText="Delete"
        message={
          termToDelete
            ? `${termToDelete.name} will be permanently deleted. This cannot be undone.`
            : ""
        }
        confirmLoading={isUpdating}
        onClose={() => setTermToDelete(null)}
        onConfirm={handleDeleteTerm}
      />
      <DeleteDialog
        open={termToRemove !== null}
        title="Remove term assignment?"
        okText="Remove"
        message={
          termToRemove
            ? `${termToRemove.term} (${termToRemove.academicYear}) will be unassigned from this academic year.`
            : ""
        }
        confirmLoading={isUpdating}
        onClose={() => setTermToRemove(null)}
        onConfirm={handleRemoveTerm}
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
