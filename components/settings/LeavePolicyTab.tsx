"use client";

import { useEffect, useState } from "react";
import { Form } from "antd";
import type { TableColumnsType } from "antd";
import { LuCalendarDays } from "react-icons/lu";
import ActionButtons from "@/components/shared/ActionButtons";
import DeleteDialog from "@/components/shared/DeleteDialog";
import ErrorDialog from "@/components/shared/ErrorDialog";
import SuccessDialog from "@/components/shared/SuccessDialog";
import SectionTitle from "@/components/settings/SectionTitle";
import Button from "@/components/ui/Button";
import Dialog from "@/components/ui/Dialog";
import Input from "@/components/ui/Input";
import SectionCard from "@/components/ui/SectionCard";
import Select from "@/components/ui/Select";
import Table from "@/components/ui/Table";
import { useLeavePolicySettings } from "@/hooks/useLeavePolicySettings";
import type { LeaveType, SettingsTabProps } from "@/types/settings";

function isFormValidationError(error: unknown) {
  return typeof error === "object" && error !== null && "errorFields" in error;
}

export default function LeavePolicyTab({
  registerTab,
  schoolId,
  onSave,
  isSaving,
}: SettingsTabProps) {
  const [form] = Form.useForm();
  const [dialogForm] = Form.useForm();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingLeave, setEditingLeave] = useState<LeaveType | null>(null);
  const [leaveToDelete, setLeaveToDelete] = useState<LeaveType | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const {
    policies,
    isLoading,
    isSettingsLoading,
    isUpdating,
    isError,
    addLeavePolicy,
    updateLeavePolicy,
    removeLeavePolicy,
  } = useLeavePolicySettings({ form, registerTab, schoolId });

  useEffect(() => {
    if (isError) {
      setErrorMessage("Unable to load leave policies.");
    }
  }, [isError]);

  function openDialog(record?: LeaveType) {
    dialogForm.resetFields();
    setEditingLeave(record ?? null);
    if (record) {
      dialogForm.setFieldsValue({ name: record.name, days: record.days });
    }
    setDialogOpen(true);
  }

  async function submitDialog() {
    try {
      const values = await dialogForm.validateFields();

      if (editingLeave) {
        await updateLeavePolicy(editingLeave.id, values);
      } else {
        await addLeavePolicy(values);
      }

      setDialogOpen(false);
      setSuccessMessage(
        editingLeave
          ? "Leave policy updated successfully."
          : "Leave policy added successfully.",
      );
    } catch (error) {
      if (isFormValidationError(error)) return;
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to save leave policy.",
      );
    }
  }

  async function handleDelete() {
    if (!leaveToDelete) return;

    try {
      await removeLeavePolicy(leaveToDelete.id);
      setSuccessMessage("Leave policy deleted successfully.");
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to delete leave policy.",
      );
    } finally {
      setLeaveToDelete(null);
    }
  }

  const columns: TableColumnsType<LeaveType> = [
    {
      title: "Leave type",
      dataIndex: "name",
      render: (value: string) => <span className="font-semibold">{value}</span>,
    },
    { title: "Days per year", dataIndex: "days" },
    {
      title: "Actions",
      dataIndex: "id",
      render: (_: string, record: LeaveType) => (
        <ActionButtons
          name="leave type"
          showView={false}
          deleteDisabled={isUpdating}
          onEdit={() => openDialog(record)}
          onDelete={() => setLeaveToDelete(record)}
        />
      ),
    },
  ];

  return (
    <>
      <Form form={form} layout="vertical">
        <SectionCard className="h-auto! min-h-full">
          <SectionTitle
            icon={LuCalendarDays}
            action={
              <Button variant="primary" onClick={() => openDialog()}>
                Add leave policy
              </Button>
            }
          >
            Leave policy
          </SectionTitle>
          <Table
            columns={columns}
            data={policies}
            pagination={false}
            autoHeight
            loading={isLoading}
          />
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <Select
              name="approvalRequired"
              label="Approval required"
              options={[
                { label: "Yes", value: "Yes" },
                { label: "No", value: "No" },
              ]}
            />
            <Select
              name="carryForward"
              label="Carry forward unused days"
              options={[
                { label: "No", value: "No" },
                { label: "Yes", value: "Yes" },
              ]}
            />
          </div>
          <div className="mt-6 flex justify-end">
            <Button
              variant="primary"
              loading={isSaving}
              disabled={isSettingsLoading}
              onClick={onSave}
            >
              Save
            </Button>
          </div>
        </SectionCard>
      </Form>
      <Dialog
        open={dialogOpen}
        title={editingLeave ? "Edit leave policy" : "Add leave policy"}
        okText={editingLeave ? "Save" : "Add"}
        confirmLoading={isUpdating}
        onClose={() => setDialogOpen(false)}
        onConfirm={submitDialog}
      >
        <Form form={dialogForm} layout="vertical" className="space-y-4!">
          <Input name="name" label="Leave type" isRequird />
          <Input name="days" label="Days per year" type="number" isRequird />
        </Form>
      </Dialog>
      <DeleteDialog
        open={leaveToDelete !== null}
        title="Delete leave policy?"
        okText="Delete"
        message={
          leaveToDelete
            ? `${leaveToDelete.name} will be removed from the leave policy.`
            : ""
        }
        confirmLoading={isUpdating}
        onClose={() => setLeaveToDelete(null)}
        onConfirm={handleDelete}
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
