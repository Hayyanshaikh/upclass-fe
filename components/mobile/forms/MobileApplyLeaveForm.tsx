"use client";

import { useEffect, useState } from "react";
import { Form } from "antd";
import type { Dayjs } from "dayjs";
import type { UploadFile } from "antd/es/upload/interface";
import { LuInfo } from "react-icons/lu";
import Button from "@/components/ui/Button";
import DatePicker from "@/components/ui/DatePicker";
import FileUpload from "@/components/ui/FileUpload";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Switch from "@/components/ui/Switch";
import TextArea from "@/components/ui/TextArea";
import MobileSheet from "@/components/mobile/ui/MobileSheet";
import { useTeacherDropdown } from "@/hooks/useTeacherDropdown";
import {
  useLeaveRequestsControllerCreate,
  useLeaveRequestsControllerMyBalance,
} from "@/app/api/endpoints";
import {
  getLeaveRequestErrorMessage,
  leaveRequestDaysLabel,
} from "@/lib/api/leave-requests";
import { handleImageUpload } from "@/utils/handle-image-upload";

type ApplyLeaveFormValues = {
  leavePolicyId: string;
  fromDate?: Dayjs;
  toDate?: Dayjs;
  halfDay?: boolean;
  reason: string;
  contact?: string;
  substituteTeacherId?: string;
  attachments?: UploadFile[];
};

type MobileApplyLeaveFormProps = {
  open: boolean;
  onClose: () => void;
  onSaved: (message: string) => void;
};

function requestDaysOf(
  halfDay: boolean | undefined,
  fromDate?: Dayjs,
  toDate?: Dayjs,
) {
  if (halfDay) return 0.5;
  if (!fromDate || !toDate) return 1;
  return Math.max(
    1,
    toDate.startOf("day").diff(fromDate.startOf("day"), "day") + 1,
  );
}

export default function MobileApplyLeaveForm({
  open,
  onClose,
  onSaved,
}: MobileApplyLeaveFormProps) {
  const [form] = Form.useForm<ApplyLeaveFormValues>();
  const [values, setValues] = useState<Partial<ApplyLeaveFormValues>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const balanceQuery = useLeaveRequestsControllerMyBalance();
  const balanceRows = balanceQuery.data?.data ?? [];
  const leaveTypeOptions = balanceRows.map((balance) => ({
    label: balance.leaveType,
    value: balance.leavePolicyId,
  }));

  const { options: teacherOptions } = useTeacherDropdown();
  const { mutateAsync: createRequest } = useLeaveRequestsControllerCreate();

  useEffect(() => {
    if (!open) return;

    setSubmitError(null);
    setValues({});
    form.resetFields();
  }, [open, form]);

  useEffect(() => {
    if (!open) return;

    const firstPolicy = balanceQuery.data?.data?.[0];
    if (!firstPolicy) return;
    if (form.getFieldValue("leavePolicyId")) return;

    form.setFieldValue("leavePolicyId", firstPolicy.leavePolicyId);
    setValues((current) => ({
      ...current,
      leavePolicyId: firstPolicy.leavePolicyId,
    }));
  }, [open, balanceQuery.data, form]);

  const selectedBalance = balanceRows.find(
    (balance) => balance.leavePolicyId === values.leavePolicyId,
  );
  const hasDates = Boolean(values.fromDate && values.toDate);
  const requestDays = requestDaysOf(
    values.halfDay,
    values.fromDate,
    values.toDate,
  );
  const requestLabel = !values.fromDate
    ? "—"
    : values.halfDay
      ? "Half day"
      : leaveRequestDaysLabel(requestDays);
  const insufficientBalance =
    hasDates &&
    selectedBalance !== undefined &&
    requestDays > selectedBalance.remainingDays;

  function syncHalfDayDates(nextValues: Partial<ApplyLeaveFormValues>) {
    if (!nextValues.halfDay || !nextValues.fromDate) return;

    if (
      !nextValues.toDate ||
      !nextValues.toDate.isSame(nextValues.fromDate, "day")
    ) {
      form.setFieldValue("toDate", nextValues.fromDate);
      nextValues.toDate = nextValues.fromDate;
    }
  }

  function handleValuesChange(
    _: Partial<ApplyLeaveFormValues>,
    allValues: ApplyLeaveFormValues,
  ) {
    setSubmitError(null);
    const nextValues = { ...allValues };
    syncHalfDayDates(nextValues);
    setValues(nextValues);
  }

  function handleHalfDayChange(checked: boolean) {
    setSubmitError(null);
    form.setFieldValue("halfDay", checked);

    const nextValues = { ...values, halfDay: checked };
    syncHalfDayDates(nextValues);
    setValues(nextValues);
  }

  async function handleSubmit(submitted: ApplyLeaveFormValues) {
    if (isSaving) return;
    if (!submitted.fromDate || !submitted.toDate) return;

    if (submitted.toDate.isBefore(submitted.fromDate, "day")) {
      form.setFields([
        {
          name: "toDate",
          errors: ["To date must be on or after the from date"],
        },
      ]);
      return;
    }
    if (
      submitted.halfDay &&
      !submitted.toDate.isSame(submitted.fromDate, "day")
    ) {
      form.setFields([
        { name: "toDate", errors: ["Half day leave must be for one date"] },
      ]);
      return;
    }

    const balance = balanceRows.find(
      (item) => item.leavePolicyId === submitted.leavePolicyId,
    );
    const days = requestDaysOf(
      submitted.halfDay,
      submitted.fromDate,
      submitted.toDate,
    );

    if (balance && balance.remainingDays <= 0) {
      setSubmitError(`No ${balance.leaveType} balance is left for this year.`);
      return;
    }

    if (balance && days > balance.remainingDays) {
      setSubmitError(
        `Insufficient ${balance.leaveType} balance: ${leaveRequestDaysLabel(
          balance.remainingDays,
        )} left, but this request needs ${leaveRequestDaysLabel(days)}.`,
      );
      return;
    }

    setSubmitError(null);
    setIsSaving(true);

    try {
      const file = submitted.attachments?.[0]?.originFileObj;
      const attachments: { name: string; url: string }[] = [];

      if (file instanceof File) {
        const uploaded = await handleImageUpload(file);
        if (uploaded.url)
          attachments.push({ name: file.name, url: uploaded.url });
      }

      await createRequest({
        data: {
          leavePolicyId: submitted.leavePolicyId,
          fromDate: submitted.fromDate.format("YYYY-MM-DD"),
          toDate: submitted.toDate.format("YYYY-MM-DD"),
          isHalfDay: Boolean(submitted.halfDay),
          reason: submitted.reason.trim(),
          contactDuringLeave: submitted.contact?.trim() || undefined,
          substituteTeacherId: submitted.substituteTeacherId || undefined,
          attachments,
        },
      });

      onSaved("Your leave request was submitted and is waiting for approval.");
    } catch (error) {
      setSubmitError(
        getLeaveRequestErrorMessage(
          error,
          "Unable to submit your leave request.",
        ),
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <MobileSheet
      open={open}
      onClose={onClose}
      title="Apply leave"
      closeLabel="Close"
      forceRender
    >
      <Form
        form={form}
        layout="vertical"
        onValuesChange={handleValuesChange}
        onFinish={handleSubmit}
        scrollToFirstError
        requiredMark={false}
        className="mt-4 flex min-h-0 flex-1 flex-col"
      >
        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto pb-1 [&_.ant-form-item]:mb-0">
          <h3 className="text-sm font-semibold text-dark">Leave details</h3>

          <Select
            name="leavePolicyId"
            label="Leave type"
            options={leaveTypeOptions}
            placeholder="Select"
            showSearch={false}
            isRequird
            loading={balanceQuery.isPending}
          />

          {values.halfDay ? (
            <DatePicker name="fromDate" label="Leave date" isRequird />
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <DatePicker name="fromDate" label="From date" isRequird />
              <DatePicker
                name="toDate"
                label="To date"
                isRequird
                minDate={values.fromDate}
              />
            </div>
          )}

          <div className="flex items-center justify-between gap-4 rounded-lg border border-border p-3">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-dark">Half day</p>
              <p className="mt-0.5 text-xs leading-5 text-gray">
                {values.halfDay
                  ? "Leave is for one date and counts as 0.5 day."
                  : "Turn on if only part of the day is off."}
              </p>
            </div>
            <Switch
              checked={Boolean(values.halfDay)}
              ariaLabel="Half day"
              onChange={handleHalfDayChange}
            />
          </div>

          <div className="flex items-center justify-between gap-3 rounded-lg border border-border px-3 py-2.5">
            <span className="text-sm text-gray">Total days</span>
            <span className="text-sm font-extrabold text-dark">
              {requestLabel}
            </span>
          </div>

          <TextArea
            name="reason"
            label="Reason"
            rows={3}
            placeholder="e.g. Medical appointment"
            rules={[
              {
                required: true,
                whitespace: true,
                message: "Enter a reason for this leave request",
              },
            ]}
          />

          <h3 className="mt-1 text-sm font-semibold text-dark">Balance</h3>
          <dl className="flex flex-col gap-3 rounded-lg border border-border p-3 text-sm">
            <div className="flex items-center justify-between gap-4">
              <dt className="text-gray">
                {selectedBalance?.leaveType ?? "Leave"} balance
              </dt>
              <dd className="font-semibold text-dark">
                {selectedBalance
                  ? leaveRequestDaysLabel(selectedBalance.remainingDays)
                  : "—"}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-gray">This request</dt>
              <dd className="font-semibold text-dark">{requestLabel}</dd>
            </div>
            <div className="flex items-center justify-between gap-4 border-t border-border pt-3 font-extrabold text-dark">
              <dt>Balance after approval</dt>
              <dd>
                {selectedBalance && hasDates
                  ? leaveRequestDaysLabel(
                      Math.max(0, selectedBalance.remainingDays - requestDays),
                    )
                  : "—"}
              </dd>
            </div>
          </dl>
          {insufficientBalance && (
            <p className="text-xs font-semibold text-danger">
              Not enough available balance for this request.
            </p>
          )}
          <p className="flex gap-2 rounded-md bg-info/10 p-3 text-xs leading-5 text-info">
            <LuInfo className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            After approval, your attendance for these dates is set to Leave
            automatically.
          </p>

          <h3 className="mt-1 text-sm font-semibold text-dark">
            Attachment and contact
          </h3>
          <FileUpload name="attachments" />
          <p className="text-xs leading-5 text-gray">
            Optional. Attach a medical certificate or other proof (PDF or
            image, up to 5 MB).
          </p>
          <Input
            name="contact"
            label="Contact during leave"
            type="tel"
            placeholder="0300-0000000"
          />
          <Select
            name="substituteTeacherId"
            label="Suggested substitute"
            options={teacherOptions}
            placeholder="Select"
            showSearch
            allowClear
          />

          {balanceQuery.isError && (
            <div className="flex items-center justify-between gap-3 rounded-md bg-danger/10 px-3 py-2 text-sm font-semibold text-danger">
              <span>Unable to load your leave balance.</span>
              <Button
                variant="link"
                onClick={() => void balanceQuery.refetch()}
              >
                Retry
              </Button>
            </div>
          )}

          {submitError && (
            <p
              role="alert"
              className="rounded-md bg-danger/10 px-3 py-2 text-sm font-semibold text-danger"
            >
              {submitError}
            </p>
          )}
        </div>

        <div className="mt-3 flex shrink-0 items-center gap-2 border-t border-border pt-3">
          <Button
            fullWidth
            variant="secondary"
            disabled={isSaving}
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button fullWidth type="submit" loading={isSaving}>
            Submit request
          </Button>
        </div>
      </Form>
    </MobileSheet>
  );
}
