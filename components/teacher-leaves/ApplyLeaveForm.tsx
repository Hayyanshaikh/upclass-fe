"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Form } from "antd";
import type { Dayjs } from "dayjs";
import type { UploadFile } from "antd/es/upload/interface";
import { LuInfo } from "react-icons/lu";
import Button from "@/components/ui/Button";
import Checkbox from "@/components/ui/Checkbox";
import DatePicker from "@/components/ui/DatePicker";
import FileUpload from "@/components/ui/FileUpload";
import Input from "@/components/ui/Input";
import SectionCard from "@/components/ui/SectionCard";
import Select from "@/components/ui/Select";
import TextArea from "@/components/ui/TextArea";
import ErrorDialog from "@/components/shared/ErrorDialog";
import PageHeader from "@/components/shared/PageHeader";
import SuccessDialog from "@/components/shared/SuccessDialog";
import {
  useLeaveRequestsControllerCreate,
  useLeaveRequestsControllerMyBalance,
} from "@/app/api/endpoints";
import { useTeacherDropdown } from "@/hooks/useTeacherDropdown";
import {
  getLeaveRequestErrorMessage,
  leaveRequestDaysLabel,
} from "@/lib/api/leave-requests";
import { handleImageUpload } from "@/utils/handle-image-upload";

type ApplyLeaveFormValues = {
  leavePolicyId: string;
  fromDate?: Dayjs;
  toDate?: Dayjs;
  totalDays?: string;
  halfDay?: boolean;
  reason: string;
  contact?: string;
  substituteTeacherId?: string;
  attachments?: UploadFile[];
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

export default function ApplyLeaveForm() {
  const router = useRouter();
  const [form] = Form.useForm<ApplyLeaveFormValues>();
  const [values, setValues] = useState<Partial<ApplyLeaveFormValues>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    data: balanceData,
    isFetching: isBalanceLoading,
    error: balanceError,
    refetch: refetchBalance,
  } = useLeaveRequestsControllerMyBalance();
  const balanceRows = balanceData?.data ?? [];
  const leaveTypeOptions = balanceRows.map((balance) => ({
    label: balance.leaveType,
    value: balance.leavePolicyId,
  }));

  const { options: teacherOptions } = useTeacherDropdown();
  const { mutateAsync: createRequest } = useLeaveRequestsControllerCreate();

  useEffect(() => {
    const firstPolicy = balanceData?.data?.[0];
    if (!firstPolicy) return;
    if (form.getFieldValue("leavePolicyId")) return;

    form.setFieldValue("leavePolicyId", firstPolicy.leavePolicyId);
    setValues((current) => ({
      ...current,
      leavePolicyId: firstPolicy.leavePolicyId,
    }));
  }, [balanceData, form]);

  const selectedBalance = balanceRows.find(
    (balance) => balance.leavePolicyId === values.leavePolicyId,
  );
  const requestDays = requestDaysOf(
    values.halfDay,
    values.fromDate,
    values.toDate,
  );
  const insufficientBalance =
    selectedBalance !== undefined && requestDays > selectedBalance.remainingDays;

  function handleValuesChange(
    _: Partial<ApplyLeaveFormValues>,
    allValues: ApplyLeaveFormValues,
  ) {
    const nextValues = { ...allValues };
    nextValues.totalDays = leaveRequestDaysLabel(
      requestDaysOf(nextValues.halfDay, nextValues.fromDate, nextValues.toDate),
    );
    setValues(nextValues);
    form.setFieldValue("totalDays", nextValues.totalDays);
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
      setErrorMessage(`No ${balance.leaveType} balance is left for this year.`);
      return;
    }

    if (balance && days > balance.remainingDays) {
      setErrorMessage(
        `Insufficient ${balance.leaveType} balance: ${leaveRequestDaysLabel(
          balance.remainingDays,
        )} left, but this request needs ${leaveRequestDaysLabel(days)}.`,
      );
      return;
    }

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

      setSuccessMessage(
        "Your leave request was submitted and is waiting for approval.",
      );
    } catch (error) {
      setErrorMessage(
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
    <div className="min-h-full">
      <PageHeader
        title="Apply leave"
        breadcrumbs={[
          { title: "Leave Requests", href: "/teacher-leaves" },
          { title: "Apply" },
        ]}
        actions={
          <div className="flex flex-wrap justify-end gap-3">
            <Button
              variant="secondary"
              onClick={() => router.push("/teacher-leaves")}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={isSaving}
              onClick={() => form?.submit()}
            >
              Submit request
            </Button>
          </div>
        }
      />

      {Boolean(balanceError) && (
        <div
          role="alert"
          className="mb-5 flex items-center gap-3 rounded-md border border-danger bg-danger/10 px-4 py-3 text-sm text-danger"
        >
          <span>Unable to load your leave balance.</span>
          <Button variant="link" onClick={() => void refetchBalance()}>
            Retry
          </Button>
        </div>
      )}

      <Form<ApplyLeaveFormValues>
        form={form}
        layout="vertical"
        initialValues={{ totalDays: "1 day" }}
        onValuesChange={handleValuesChange}
        onFinish={handleSubmit}
        className="flex flex-col gap-5"
      >
        <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-3">
          <div className="flex min-w-0 flex-col gap-5 xl:col-span-2">
            <SectionCard title="Leave details" className="h-auto!">
              <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                <Select
                  name="leavePolicyId"
                  label="Leave type"
                  options={leaveTypeOptions}
                  placeholder="Select"
                  showSearch={false}
                  isRequird
                  loading={isBalanceLoading}
                />
                <DatePicker name="fromDate" label="From date" isRequird />
                <DatePicker
                  name="toDate"
                  label="To date"
                  isRequird
                  minDate={values.fromDate}
                />
                <Input name="totalDays" label="Total days" disabled />
                <div className="sm:col-span-2">
                  <Checkbox name="halfDay" label="Half day" />
                </div>
                <div className="sm:col-span-2">
                  <TextArea
                    name="reason"
                    label="Reason"
                    rows={4}
                    rules={[
                      {
                        required: true,
                        whitespace: true,
                        message: "Enter a reason for this leave request",
                      },
                    ]}
                  />
                </div>
              </div>
            </SectionCard>

            <SectionCard title="Attachment and contact" className="h-auto!">
              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <FileUpload name="attachments" />
                  <p className="text-sm text-gray">
                    Optional. Attach a medical certificate or other proof (PDF
                    or image, up to 5 MB).
                  </p>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                </div>
              </div>
            </SectionCard>
          </div>

          <SectionCard title="Balance" className="h-auto!">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="text-gray">
                  {selectedBalance?.leaveType ?? "Leave"} balance
                </span>
                <span className="font-semibold text-dark">
                  {selectedBalance
                    ? leaveRequestDaysLabel(selectedBalance.remainingDays)
                    : "—"}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="text-gray">This request</span>
                <span className="font-semibold text-dark">
                  {leaveRequestDaysLabel(requestDays)}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4 border-t border-border pt-4 text-sm font-extrabold text-dark">
                <span>Balance after approval</span>
                <span>
                  {selectedBalance
                    ? leaveRequestDaysLabel(
                        Math.max(
                          0,
                          selectedBalance.remainingDays - requestDays,
                        ),
                      )
                    : "—"}
                </span>
              </div>
              {insufficientBalance && (
                <p className="text-xs font-semibold text-danger">
                  Not enough available balance for this request.
                </p>
              )}
              <div className="flex gap-3 rounded-md bg-info/10 p-4 text-sm leading-relaxed text-info">
                <LuInfo className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
                <p>
                  Your request goes to the school admin. After approval, your
                  attendance for these dates is set to Leave automatically.
                </p>
              </div>
            </div>
          </SectionCard>
        </div>
      </Form>

      <SuccessDialog
        open={successMessage !== null}
        title="Leave request submitted"
        message={successMessage ?? ""}
        onClose={() => setSuccessMessage(null)}
        afterClose={() => router.push("/teacher-leaves")}
      />
      <ErrorDialog
        open={errorMessage !== null}
        title="Unable to submit leave request"
        message={errorMessage ?? ""}
        onClose={() => setErrorMessage(null)}
      />
    </div>
  );
}
