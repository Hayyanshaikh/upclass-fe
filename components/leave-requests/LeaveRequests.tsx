"use client";

import { useState } from "react";
import type { TableColumnsType } from "antd";
import type { Dayjs } from "dayjs";
import { useQueryClient } from "@tanstack/react-query";
import { LuCheck, LuEye, LuX } from "react-icons/lu";
import ActionButtons from "@/components/shared/ActionButtons";
import ErrorDialog from "@/components/shared/ErrorDialog";
import PageHeader from "@/components/shared/PageHeader";
import SuccessDialog from "@/components/shared/SuccessDialog";
import CancelLeaveRequestDialog from "@/components/dialogs/CancelLeaveRequestDialog";
import RejectLeaveRequestDialog from "@/components/dialogs/RejectLeaveRequestDialog";
import ReviewLeaveRequestDialog from "@/components/dialogs/ReviewLeaveRequestDialog";
import Button from "@/components/ui/Button";
import StatusBadge from "@/components/ui/StatusBadge";
import Table from "@/components/ui/Table";
import {
  getLeaveRequestsControllerFindAllQueryKey,
  useLeaveRequestsControllerApprove,
  useLeaveRequestsControllerCancel,
  useLeaveRequestsControllerFindAll,
  useLeaveRequestsControllerFindOne,
  useLeaveRequestsControllerReject,
} from "@/app/api/endpoints";
import { LeaveRequestDtoStatus } from "@/app/api/schemas";
import type { LeaveRequestDto } from "@/app/api/schemas";
import { useLeavePolicyDropdown } from "@/hooks/useLeavePolicyDropdown";
import { pendingLeaveRequestsQuery } from "@/hooks/usePendingLeaveRequestCount";
import { useRolePermission } from "@/hooks/useRolePermission";
import { useTable } from "@/hooks/useTable";
import {
  formatLeaveRequestDates,
  formatTeacherName,
  getLeaveRequestErrorMessage,
  leaveRequestDaysLabel,
  leaveRequestStatusLabels,
  leaveRequestStatusOptions,
  leaveRequestStatusVariants,
} from "@/lib/api/leave-requests";
import type { FilterField, TableSearch } from "@/types/table-toolbar";

type LeaveRequestDialog = "review" | "reject" | "cancel" | null;

export default function LeaveRequests() {
  const { canView, canEdit } = useRolePermission("leave_requests");
  const [selected, setSelected] = useState<LeaveRequestDto | null>(null);
  const [dialog, setDialog] = useState<LeaveRequestDialog>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    page,
    pageSize,
    offset,
    search,
    filters,
    setPage,
    setSearch,
    setFilters,
  } = useTable<{
    leavePolicyId?: string;
    status?: LeaveRequestDtoStatus;
    month?: Dayjs | null;
  }>({ pageSize: 10 });

  const { options: policyOptions } = useLeavePolicyDropdown();

  const { data, isFetching, error, refetch } =
    useLeaveRequestsControllerFindAll({
      limit: pageSize,
      offset,
      searchKey: search || undefined,
      leavePolicyId: filters.leavePolicyId,
      status: filters.status,
      month: filters.month?.format("YYYY-MM"),
    });

  const { data: detail } = useLeaveRequestsControllerFindOne(
    selected?.id ?? "",
    { query: { enabled: selected !== null } },
  );

  const { mutateAsync: approveRequest, isPending: isApproving } =
    useLeaveRequestsControllerApprove();
  const { mutateAsync: rejectRequest, isPending: isRejecting } =
    useLeaveRequestsControllerReject();
  const { mutateAsync: cancelRequest, isPending: isCancelling } =
    useLeaveRequestsControllerCancel();

  const isSubmitting = isApproving || isRejecting || isCancelling;

  const queryClient = useQueryClient();

  function refreshPendingCount() {
    void queryClient.invalidateQueries({
      queryKey: getLeaveRequestsControllerFindAllQueryKey(
        pendingLeaveRequestsQuery,
      ),
    });
  }

  function openDialog(request: LeaveRequestDto, next: LeaveRequestDialog) {
    setSelected(request);
    setDialog(next);
  }

  function finishDialogClose() {
    if (dialog === null) setSelected(null);
  }

  async function handleApprove(comment?: string) {
    if (!selected || isApproving) return;
    const teacher = formatTeacherName(selected.teacher);

    try {
      await approveRequest({
        id: selected.id,
        data: { comment: comment?.trim() || undefined },
      });
      await refetch();
      refreshPendingCount();
      setDialog(null);
      setSelected(null);
      setSuccessMessage(
        `${teacher}'s leave request was approved and attendance is marked as leave.`,
      );
    } catch (error) {
      setErrorMessage(
        getLeaveRequestErrorMessage(
          error,
          "Unable to approve this leave request.",
        ),
      );
    }
  }

  async function handleReject(reason: string) {
    if (!selected || isRejecting) return;
    const teacher = formatTeacherName(selected.teacher);

    try {
      await rejectRequest({ id: selected.id, data: { reason } });
      await refetch();
      refreshPendingCount();
      setDialog(null);
      setSelected(null);
      setSuccessMessage(`${teacher}'s leave request was rejected.`);
    } catch (error) {
      setErrorMessage(
        getLeaveRequestErrorMessage(
          error,
          "Unable to reject this leave request.",
        ),
      );
    }
  }

  async function handleCancel() {
    if (!selected || isCancelling) return;
    const teacher = formatTeacherName(selected.teacher);

    try {
      await cancelRequest({ id: selected.id });
      await refetch();
      refreshPendingCount();
      setDialog(null);
      setSelected(null);
      setSuccessMessage(`${teacher}'s leave request was cancelled.`);
    } catch (error) {
      setErrorMessage(
        getLeaveRequestErrorMessage(
          error,
          "Unable to cancel this leave request.",
        ),
      );
    }
  }

  const filterFields: FilterField[] = [
    {
      name: "leavePolicyId",
      label: "Leave type",
      placeholder: "Any type",
      options: policyOptions,
    },
    {
      name: "status",
      label: "Status",
      placeholder: "Any status",
      options: leaveRequestStatusOptions,
    },
    {
      type: "month",
      name: "month",
      label: "Month",
    },
  ];

  const columns: TableColumnsType<LeaveRequestDto> = [
    {
      title: "Teacher",
      key: "teacher",
      width: 250,
      render: (_, request) => {
        const teacher = formatTeacherName(request.teacher);

        return (
          <div className="flex items-center gap-3">
            <span
              className="flex size-10 shrink-0 items-center justify-center rounded-full bg-success/10 font-bold text-primary"
              aria-hidden="true"
            >
              {teacher.charAt(0)}
            </span>
            <span className="flex min-w-0 flex-col">
              <span className="font-bold text-dark">{teacher}</span>
              <span className="text-sm text-gray">
                {request.teacher?.employeeId ?? "—"}
              </span>
            </span>
          </div>
        );
      },
    },
    {
      title: "Type",
      key: "type",
      width: 170,
      render: (_, request) => request.leavePolicy?.name ?? "—",
    },
    {
      title: "Dates",
      key: "dates",
      width: 230,
      render: (_, request) =>
        formatLeaveRequestDates(request.fromDate, request.toDate),
    },
    {
      title: "Days",
      key: "days",
      width: 110,
      render: (_, request) =>
        request.isHalfDay
          ? "Half day"
          : leaveRequestDaysLabel(request.totalDays),
    },
    {
      title: "Status",
      key: "status",
      width: 130,
      render: (_, request) => (
        <StatusBadge variant={leaveRequestStatusVariants[request.status]}>
          {leaveRequestStatusLabels[request.status]}
        </StatusBadge>
      ),
    },
  ];

  if (canView || canEdit) {
    columns.push({
      title: "Actions",
      key: "actions",
      width: 130,
      render: (_, request) => {
        const pending = request.status === LeaveRequestDtoStatus.PENDING;

        return (
          <ActionButtons
            actions={[
              ...(canView
                ? [
                    {
                      label: "View leave request",
                      icon: LuEye,
                      onClick: () => openDialog(request, "review"),
                    },
                  ]
                : []),
              ...(canEdit
                ? [
                    {
                      label: "Approve leave request",
                      icon: LuCheck,
                      success: true,
                      disabled: !pending,
                      onClick: () => openDialog(request, "review"),
                    },
                    {
                      label: "Reject leave request",
                      icon: LuX,
                      danger: true,
                      disabled: !pending,
                      onClick: () => openDialog(request, "reject"),
                    },
                  ]
                : []),
            ]}
          />
        );
      },
    });
  }

  const tableSearch: TableSearch = {
    placeholder: "Teacher name or employee ID",
    onChange: setSearch,
  };

  const beforeTable = error ? (
    <div
      role="alert"
      className="flex items-center gap-3 rounded-md border border-danger bg-danger/10 px-4 py-3 text-sm text-danger"
    >
      <span>Unable to load leave requests.</span>
      <Button variant="link" onClick={() => void refetch()}>
        Retry
      </Button>
    </div>
  ) : undefined;

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="shrink-0">
        <PageHeader title="Leave requests" />
      </div>
      <Table
        columns={columns}
        data={data?.data ?? []}
        rowKey="id"
        total={data?.total ?? 0}
        loading={isFetching}
        beforeTable={beforeTable}
        pageSize={pageSize}
        current={page}
        onPageChange={setPage}
        search={tableSearch}
        filterFields={filterFields}
        filterValues={filters}
        onFilterValuesChange={setFilters}
        scrollX={1020}
      />

      {selected && (
        <>
          <ReviewLeaveRequestDialog
            request={selected}
            balanceAfterApproval={detail?.balanceAfterApproval}
            open={dialog === "review"}
            canEdit={canEdit}
            isSubmitting={isSubmitting}
            onClose={() => setDialog(null)}
            onApprove={(comment) => void handleApprove(comment)}
            onReject={() => setDialog("reject")}
            onCancelRequest={() => setDialog("cancel")}
            afterClose={finishDialogClose}
          />
          <RejectLeaveRequestDialog
            request={selected}
            open={dialog === "reject"}
            isSubmitting={isSubmitting}
            onClose={() => setDialog(null)}
            onReject={(reason) => void handleReject(reason)}
            afterClose={finishDialogClose}
          />
          <CancelLeaveRequestDialog
            request={selected}
            open={dialog === "cancel"}
            isSubmitting={isSubmitting}
            onClose={() => setDialog(null)}
            onConfirm={() => void handleCancel()}
            afterClose={finishDialogClose}
          />
        </>
      )}

      <SuccessDialog
        open={successMessage !== null}
        title="Leave request updated"
        message={successMessage ?? ""}
        onClose={() => setSuccessMessage(null)}
      />
      <ErrorDialog
        open={errorMessage !== null}
        title="Unable to update leave request"
        message={errorMessage ?? ""}
        onClose={() => setErrorMessage(null)}
      />
    </div>
  );
}
