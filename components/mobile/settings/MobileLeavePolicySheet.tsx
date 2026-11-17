"use client";

import { useState } from "react";
import { Form } from "antd";
import { LuChevronRight, LuPlus, LuTrash2 } from "react-icons/lu";
import MobileConfirmDialog from "@/components/mobile/dialogs/MobileConfirmDialog";
import IconButton from "@/components/mobile/ui/MobileIconButton";
import MobileSheet from "@/components/mobile/ui/MobileSheet";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Loader from "@/components/ui/Loader";
import Select from "@/components/ui/Select";
import { useLeavePolicySettings } from "@/hooks/useLeavePolicySettings";
import type { LeaveType } from "@/types/settings";

const yesNoOptions = [
  { label: "Yes", value: "Yes" },
  { label: "No", value: "No" },
];

type Feedback = {
  tone: "success" | "error";
  message: string;
};

type MobileLeavePolicySheetProps = {
  open: boolean;
  schoolId: string;
  onClose: () => void;
  onFeedback: (feedback: Feedback) => void;
};

function isValidationError(error: unknown) {
  return typeof error === "object" && error !== null && "errorFields" in error;
}

export default function MobileLeavePolicySheet({
  open,
  schoolId,
  onClose,
  onFeedback,
}: MobileLeavePolicySheetProps) {
  const [form] = Form.useForm();
  const [policyForm] = Form.useForm();
  const [policyFormOpen, setPolicyFormOpen] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState<LeaveType | null>(null);
  const [policyToDelete, setPolicyToDelete] = useState<LeaveType | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const {
    policies,
    isLoading,
    isSettingsLoading,
    isUpdating,
    validate,
    save,
    addLeavePolicy,
    updateLeavePolicy,
    removeLeavePolicy,
  } = useLeavePolicySettings({ form, schoolId });

  async function handleSave() {
    if (isSaving || isUpdating) return;

    setIsSaving(true);

    try {
      await validate();
      await save();
      onClose();
      onFeedback({
        tone: "success",
        message: "School settings updated successfully.",
      });
    } catch (error) {
      if (isValidationError(error)) return;

      onFeedback({
        tone: "error",
        message:
          error instanceof Error
            ? error.message
            : "Unable to update leave policy settings.",
      });
    } finally {
      setIsSaving(false);
    }
  }

  function openPolicyForm(policy?: LeaveType) {
    setEditingPolicy(policy ?? null);
    policyForm.resetFields();

    if (policy) {
      policyForm.setFieldsValue({ name: policy.name, days: policy.days });
    }

    setPolicyFormOpen(true);
  }

  async function submitPolicyForm() {
    try {
      const values = await policyForm.validateFields();

      if (editingPolicy) {
        await updateLeavePolicy(editingPolicy.id, values);
      } else {
        await addLeavePolicy(values);
      }

      setPolicyFormOpen(false);
      setEditingPolicy(null);
      onFeedback({
        tone: "success",
        message: editingPolicy
          ? "Leave policy updated successfully."
          : "Leave policy added successfully.",
      });
    } catch (error) {
      if (isValidationError(error)) return;

      onFeedback({
        tone: "error",
        message:
          error instanceof Error
            ? error.message
            : `Unable to ${editingPolicy ? "update" : "add"} leave policy.`,
      });
    }
  }

  async function handleDeletePolicy() {
    if (!policyToDelete) return;

    const deletedPolicy = policyToDelete;
    setPolicyToDelete(null);

    try {
      await removeLeavePolicy(deletedPolicy.id);
      onFeedback({
        tone: "success",
        message: "Leave policy deleted successfully.",
      });
    } catch (error) {
      onFeedback({
        tone: "error",
        message:
          error instanceof Error
            ? error.message
            : "Unable to delete leave policy.",
      });
    }
  }

  return (
    <>
      <MobileSheet
        open={open}
        onClose={onClose}
        title="Leave policy"
        closeLabel="Close leave policy"
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
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-sm font-semibold text-dark">
                    Leave types
                  </h3>
                  <Button onClick={() => openPolicyForm()}>
                    <LuPlus size={18} aria-hidden="true" />
                    Add leave policy
                  </Button>
                </div>

                {policies.length === 0 ? (
                  <p className="rounded-lg border border-border bg-background p-4 text-center text-xs text-gray">
                    No leave policies added yet.
                  </p>
                ) : (
                  <ul role="list" className="flex flex-col gap-2">
                    {policies.map((policy) => (
                      <li
                        key={policy.id}
                        className="flex items-center gap-2 rounded-lg border border-border bg-background p-4"
                      >
                        <button
                          type="button"
                          onClick={() => openPolicyForm(policy)}
                          aria-label={`Edit ${policy.name}`}
                          className="flex min-w-0 flex-1 items-center gap-2 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                        >
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-semibold text-dark">
                              {policy.name}
                            </span>
                            <span className="mt-0.5 block truncate text-xs text-gray">
                              {policy.days} days per year
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
                          label={`Delete ${policy.name}`}
                          onClick={() => setPolicyToDelete(policy)}
                        >
                          <LuTrash2 size={18} aria-hidden="true" />
                        </IconButton>
                      </li>
                    ))}
                  </ul>
                )}

                <div className="mt-2 flex flex-col gap-4">
                  <h3 className="text-sm font-semibold text-dark">
                    Leave settings
                  </h3>
                  <Select
                    name="approvalRequired"
                    label="Approval required"
                    showSearch={false}
                    options={yesNoOptions}
                  />
                  <Select
                    name="carryForward"
                    label="Carry forward unused days"
                    showSearch={false}
                    options={yesNoOptions}
                  />
                </div>
              </>
            )}
          </div>

          <div className="mt-3 flex shrink-0 items-center gap-2 border-t border-border pt-3">
            <Button
              fullWidth
              variant="secondary"
              disabled={isSaving || isUpdating}
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              fullWidth
              loading={isSaving}
              disabled={isSettingsLoading}
              onClick={() => void handleSave()}
            >
              Save
            </Button>
          </div>
        </Form>
      </MobileSheet>

      <MobileSheet
        open={policyFormOpen}
        onClose={() => setPolicyFormOpen(false)}
        title={editingPolicy ? "Edit leave policy" : "Add leave policy"}
        closeLabel="Close form"
      >
        <Form
          form={policyForm}
          layout="vertical"
          requiredMark={false}
          className="mt-6 flex min-h-0 flex-1 flex-col"
        >
          <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto pb-1 [&_.ant-form-item]:mb-0">
            <Input name="name" label="Leave type" isRequird />
            <Input name="days" label="Days per year" type="number" isRequird />
          </div>
          <div className="mt-3 flex shrink-0 items-center gap-2 border-t border-border pt-3">
            <Button
              fullWidth
              variant="secondary"
              disabled={isUpdating}
              onClick={() => setPolicyFormOpen(false)}
            >
              Cancel
            </Button>
            <Button
              fullWidth
              loading={isUpdating}
              onClick={() => void submitPolicyForm()}
            >
              {editingPolicy ? "Save" : "Add"}
            </Button>
          </div>
        </Form>
      </MobileSheet>

      <MobileConfirmDialog
        open={policyToDelete !== null}
        title="Delete leave policy?"
        description={
          policyToDelete
            ? `${policyToDelete.name} will be removed from the leave policy.`
            : "Delete this leave policy?"
        }
        confirmText="Delete"
        cancelText="Cancel"
        danger
        confirmLoading={isUpdating}
        onConfirm={() => void handleDeletePolicy()}
        onClose={() => setPolicyToDelete(null)}
      />
    </>
  );
}
