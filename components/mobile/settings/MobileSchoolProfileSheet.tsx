"use client";

import { useEffect, useRef } from "react";
import { Form } from "antd";
import MobileSheet from "@/components/mobile/ui/MobileSheet";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Loader from "@/components/ui/Loader";
import MultiSelect from "@/components/ui/MultiSelect";
import PhotoUpload from "@/components/ui/PhotoUpload";
import Select from "@/components/ui/Select";
import TextArea from "@/components/ui/TextArea";
import {
  DATE_FORMAT_OPTIONS,
  DAYS_OPTIONS,
  EDUCATION_SYSTEM_OPTIONS,
} from "@/constants/settings";
import { useSchoolProfileSettings } from "@/hooks/useSchoolProfileSettings";

type Feedback = {
  tone: "success" | "error";
  message: string;
};

type MobileSchoolProfileSheetProps = {
  open: boolean;
  schoolId: string;
  focusWorkingDays?: boolean;
  onClose: () => void;
  onFeedback: (feedback: Feedback) => void;
};

function isValidationError(error: unknown) {
  return typeof error === "object" && error !== null && "errorFields" in error;
}

export default function MobileSchoolProfileSheet({
  open,
  schoolId,
  focusWorkingDays = false,
  onClose,
  onFeedback,
}: MobileSchoolProfileSheetProps) {
  const [form] = Form.useForm();
  const { isLoading, isFetching, isUpdating, validate, save } =
    useSchoolProfileSettings({ form, schoolId });

  const focusHandledRef = useRef(false);

  useEffect(() => {
    if (!open || !focusWorkingDays || isFetching || focusHandledRef.current)
      return;

    focusHandledRef.current = true;

    const timer = window.setTimeout(() => {
      const field = document.getElementById("workingDays");
      field?.focus();
      field?.scrollIntoView({ behavior: "smooth", block: "center" });
      window.history.replaceState(
        null,
        "",
        window.location.pathname + window.location.search,
      );
    }, 150);

    return () => window.clearTimeout(timer);
  }, [open, focusWorkingDays, isFetching]);

  async function handleSave() {
    if (isUpdating) return;

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
            : "Unable to update school settings.",
      });
    }
  }

  return (
    <MobileSheet
      open={open}
      onClose={onClose}
      title="School profile"
      closeLabel="Close profile"
    >
      {isLoading ? (
        <Loader fullscreen={false} />
      ) : (
        <Form
          form={form}
          layout="vertical"
          requiredMark={false}
          className="mt-6 flex min-h-0 flex-1 flex-col"
        >
          <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto pb-1 [&_.ant-form-item]:mb-0">
            <Form.Item
              name="logo"
              label="School logo"
              className="mb-0! [&>label]:font-semibold!"
            >
              <PhotoUpload maxSizeMB={1} alt="School Logo" />
            </Form.Item>

            <h3 className="mt-2 text-sm font-semibold text-dark">
              Basic information
            </h3>
            <Input
              name="schoolName"
              label="School name"
              isRequird
              placeholder="School name"
            />
            <Input name="shortCode" label="Short code" placeholder="SCH" />
            <Select
              name="schoolType"
              label="School type"
              showSearch={false}
              options={[
                { label: "Private", value: "PRIVATE" },
                { label: "Government", value: "GOVERNMENT" },
              ]}
            />
            <Select
              name="educationSystem"
              label="Education system"
              options={EDUCATION_SYSTEM_OPTIONS}
            />
            <Input
              name="email"
              label="Official email"
              type="email"
              placeholder="school@example.com"
            />
            <Input
              name="phone"
              label="Phone number"
              type="tel"
              placeholder="0300-0000000"
            />
            <Input
              name="establishedYear"
              label="Established year"
              type="number"
              placeholder="e.g. 2010"
            />
            <Input
              name="address"
              label="Address"
              placeholder="Enter school address"
            />
            <TextArea
              name="description"
              label="School description"
              rows={3}
              placeholder="About your school"
            />

            <h3 className="mt-2 text-sm font-semibold text-dark">
              Administration details
            </h3>
            <Input
              name="principalName"
              label="Principal name"
              placeholder="Principal name"
            />
            <Input
              name="vicePrincipalName"
              label="Vice principal name"
              placeholder="Vice principal name"
            />
            <Input
              name="adminContact"
              label="Admin contact"
              type="tel"
              placeholder="0300-0000000"
            />
            <Input name="ownerName" label="Owner name" placeholder="Owner name" />

            <h3 className="mt-2 text-sm font-semibold text-dark">
              School settings
            </h3>
            <Select
              name="dateFormat"
              label="Date format"
              showSearch={false}
              options={DATE_FORMAT_OPTIONS}
            />
            <Input
              name="feeDueDate"
              label="Fee due date"
              type="number"
              placeholder="e.g. 10"
            />
            <MultiSelect
              label="Working Days"
              name="workingDays"
              placeholder="Select working days"
              options={DAYS_OPTIONS}
            />
            <Input
              name="openingTime"
              label="School opening time"
              type="time"
            />
            <Input
              name="closingTime"
              label="School closing time"
              type="time"
            />
          </div>

          <div className="mt-3 flex shrink-0 items-center gap-2 border-t border-border pt-3">
            <Button
              fullWidth
              variant="secondary"
              disabled={isUpdating}
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              fullWidth
              loading={isUpdating}
              onClick={() => void handleSave()}
            >
              Save
            </Button>
          </div>
        </Form>
      )}
    </MobileSheet>
  );
}
